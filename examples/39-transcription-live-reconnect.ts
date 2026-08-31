/**
 * Example: Production-Grade Reconnection for Live Transcription
 *
 * Real-world streaming connections drop: networks blip, servers restart, and
 * idle streams time out (Deepgram closes a connection that receives no audio
 * for 10 seconds with a NET-0001 error). A production integration must survive
 * all of that without losing audio. This example demonstrates the full recovery
 * pattern on Deepgram's /v1/listen websocket:
 *
 *   1. Exponential backoff with full jitter and a retry cap
 *   2. Distinguishing reconnect-worthy close codes from a normal closure
 *   3. Buffering audio produced while disconnected and resuming after reconnect
 *   4. Re-applying the original connection options on every new connection
 *   5. Realigning transcript timestamps (each new connection restarts at 0s)
 *   6. KeepAlive messages and a clean CloseStream shutdown
 *
 * The SDK's socket has its own transport-level retry; here we disable it
 * (reconnectAttempts: 0) and own the reconnect policy at the application level,
 * where we can also buffer audio and classify close codes.
 *
 * Note: we stream raw linear16 audio and declare encoding/sample_rate/channels
 * up front. Container formats (WAV/MP3) only carry their headers in the first
 * bytes, so audio resumed mid-stream on a fresh connection would be
 * undecodable. Raw audio with explicit encoding parameters is decodable from
 * any byte offset, which is what makes seamless resume possible.
 *
 * By default this example forcibly drops the connection once, mid-stream, to
 * demonstrate the recovery path. Set SIMULATE_DROP=0 to stream without it.
 *
 * Docs:
 * - https://developers.deepgram.com/docs/recovering-from-connection-errors-and-timeouts-when-live-streaming-audio
 * - https://developers.deepgram.com/docs/audio-keep-alive
 * - https://developers.deepgram.com/docs/stt-troubleshooting-websocket-data-and-net-errors
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { readFileSync } = require("fs");
const { join } = require("path");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// The original transcription options. Query parameters are pinned to the
// connection URL, so they must be re-applied on every reconnect — a fresh
// connection with different options would transcribe differently mid-stream.
const TRANSCRIPTION_OPTIONS = {
    model: "nova-3",
    language: "en",
    smart_format: "true",
    encoding: "linear16",
    sample_rate: 44100,
    channels: 1,
};

const SAMPLE_RATE = 44100;
const BYTES_PER_SECOND = SAMPLE_RATE * 2; // linear16 mono = 2 bytes per sample

// Reconnect policy: full-jitter exponential backoff with a hard cap on
// attempts. Jitter prevents a fleet of clients from reconnecting in lockstep
// ("thundering herd") after a shared outage.
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 10000;

// Cap the audio buffered while disconnected. Deepgram transcribes at ~1.25x
// realtime, so an unbounded buffer after a long outage would put transcripts
// permanently behind live audio. When the cap is hit we drop the oldest audio.
const MAX_BUFFERED_BYTES = BYTES_PER_SECOND * 30; // 30 seconds

// Send KeepAlive every 5 seconds. Deepgram closes connections that receive no
// data for 10 seconds (NET-0001); KeepAlive keeps quiet connections open.
const KEEP_ALIVE_INTERVAL_MS = 5000;

// Simulated live audio source: paced chunks of raw PCM, like a microphone.
const CHUNK_INTERVAL_MS = 250;
const CHUNK_SIZE = (BYTES_PER_SECOND * CHUNK_INTERVAL_MS) / 1000;

// Force one mid-stream disconnect after this much audio, to demonstrate
// recovery. Application-defined close codes (4000-4999) stand in for a real
// network drop (which typically surfaces as 1006 or 1011).
const SIMULATE_DROP = process.env.SIMULATE_DROP !== "0";
const DROP_AFTER_SECONDS = 8;

// ReconnectingWebSocket ready state: 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
const READY_STATE_OPEN = 1;

// ---------------------------------------------------------------------------
// Close-code classification
// ---------------------------------------------------------------------------

/**
 * Decide whether a close event warrants reconnecting.
 *
 * - 1000 is a normal closure: the server acknowledged our CloseStream, or we
 *   closed deliberately. Reconnecting would start an unwanted session.
 * - 1002/1003/1007 are protocol/data errors and 1008 is a policy violation
 *   (e.g. Deepgram's DATA-0000 for undecodable audio). Retrying with the same
 *   audio and options will fail the same way, so treat these as fatal.
 * - Everything else — 1006 (abnormal closure, the usual network drop),
 *   1011 (server error, including Deepgram's NET-0000/NET-0001 timeouts),
 *   1012/1013 (restart/overload), 4000-4999 (application-defined) — is worth
 *   a reconnect.
 */
function isReconnectWorthy(closeCode) {
    const fatalCodes = [1000, 1002, 1003, 1007, 1008];
    return !fatalCodes.includes(closeCode);
}

/** Full-jitter exponential backoff: random delay in [0, min(cap, base * 2^attempt)). */
function backoffDelayMs(attempt) {
    const exponentialCap = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt);
    return Math.round(Math.random() * exponentialCap);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Reconnecting transcriber
// ---------------------------------------------------------------------------

async function main() {
    // Strip the 44-byte WAV header to get raw linear16 PCM (see note above on
    // why reconnectable streams should send raw audio).
    const audio = readFileSync(join(__dirname, "spacewalk.wav")).subarray(44);

    let connection = null; // the active SDK socket, or null while disconnected
    let shuttingDown = false; // a deliberate shutdown is in progress
    let reconnecting = false; // a reconnect loop is in flight
    let audioExhausted = false; // the audio source has produced its last chunk
    let simulatedDrop = false; // the one forced disconnect has fired

    const audioBuffer = []; // chunks produced while disconnected
    let bufferedBytes = 0;
    let deliveredBytes = 0; // total bytes handed to any connection
    let timestampOffsetSec = 0; // audio seconds delivered before the current connection

    let keepAliveTimer = null;
    let pumpTimer = null;
    let shutdownWatchdog = null;
    let audioCursor = 0;

    function log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    /** Queue a chunk while disconnected, dropping the oldest audio at the cap. */
    function bufferChunk(chunk) {
        audioBuffer.push(chunk);
        bufferedBytes += chunk.length;
        while (bufferedBytes > MAX_BUFFERED_BYTES && audioBuffer.length > 0) {
            const dropped = audioBuffer.shift();
            bufferedBytes -= dropped.length;
            log(`Buffer cap reached — dropped ${dropped.length} bytes of oldest audio`);
        }
    }

    /** Send any buffered audio, then a CloseStream if the source already ended. */
    function flushBuffer() {
        if (audioBuffer.length > 0) {
            log(
                `Flushing ${audioBuffer.length} buffered chunks (${(bufferedBytes / BYTES_PER_SECOND).toFixed(2)}s of audio)`,
            );
        }
        // Stop if the connection drops mid-flush; whatever remains buffered is
        // flushed after the next reconnect.
        while (audioBuffer.length > 0 && connection && connection.readyState === READY_STATE_OPEN) {
            const chunk = audioBuffer.shift();
            bufferedBytes -= chunk.length;
            connection.sendMedia(chunk);
            deliveredBytes += chunk.length;
        }
        if (audioExhausted && audioBuffer.length === 0) {
            beginShutdown();
        }
    }

    function startKeepAlive() {
        keepAliveTimer = setInterval(() => {
            if (connection && connection.readyState === READY_STATE_OPEN) {
                connection.sendKeepAlive({ type: "KeepAlive" });
            }
        }, KEEP_ALIVE_INTERVAL_MS);
    }

    function stopKeepAlive() {
        if (keepAliveTimer) {
            clearInterval(keepAliveTimer);
            keepAliveTimer = null;
        }
    }

    function handleMessage(data) {
        if (data.type === "Results") {
            const transcript = data.channel.alternatives[0]?.transcript;
            if (data.is_final && transcript) {
                // Each connection's timestamps restart at 0, so add the offset
                // accumulated across previous connections to keep a continuous
                // timeline for the whole stream.
                const start = (timestampOffsetSec + data.start).toFixed(2);
                const end = (timestampOffsetSec + data.start + data.duration).toFixed(2);
                log(`Transcript [${start}s - ${end}s]: ${transcript}`);
            }
        } else if (data.type === "Metadata") {
            // Sent by the server after it acknowledges CloseStream and finishes
            // processing; a normal closure (code 1000) follows.
            log(`Metadata received (request_id: ${data.request_id})`);
        }
    }

    /**
     * Open one connection with the original options, wire up handlers, and
     * resolve once it is open. Rejects if the connection attempt fails.
     */
    async function openConnection() {
        const newConnection = await deepgramClient.listen.v1.createConnection({
            ...TRANSCRIPTION_OPTIONS,
            // Disable the SDK socket's transport-level retry: this example owns
            // reconnection at the application level so it can buffer audio,
            // apply its own backoff, and classify close codes.
            reconnectAttempts: 0,
            connectionTimeoutInSeconds: 10,
        });

        // The SDK surfaces some transport errors as a close event with a
        // normal-looking code. Remember that this connection errored so the
        // close handler still treats it as reconnect-worthy.
        let sawTransportError = false;

        newConnection.on("open", () => {
            log("Connection open");
        });

        newConnection.on("message", handleMessage);

        newConnection.on("error", (error) => {
            sawTransportError = true;
            log(`Connection error: ${error.message || error}`);
        });

        newConnection.on("close", (event) => {
            // Ignore events from connections we have already abandoned.
            if (connection !== newConnection) {
                return;
            }
            connection = null;
            stopKeepAlive();

            const code = event?.code;
            log(`Connection closed (code: ${code ?? "unknown"})`);

            if (shuttingDown) {
                finish(0);
                return;
            }

            if (isReconnectWorthy(code) || sawTransportError) {
                void reconnect();
            } else {
                log("Close is not reconnect-worthy — check your audio and options. Exiting.");
                finish(1);
            }
        });

        newConnection.connect();
        await newConnection.waitForOpen();
        return newConnection;
    }

    /** Reconnect with capped, jittered exponential backoff. */
    async function reconnect() {
        if (reconnecting || shuttingDown) {
            return;
        }
        reconnecting = true;
        log("Disconnected mid-stream — buffering audio and reconnecting");

        for (let attempt = 0; attempt < MAX_RECONNECT_ATTEMPTS; attempt++) {
            const delay = backoffDelayMs(attempt);
            log(`Reconnect attempt ${attempt + 1}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);
            await sleep(delay);
            if (shuttingDown) {
                return;
            }

            try {
                const newConnection = await openConnection();
                if (shuttingDown) {
                    newConnection.close();
                    return;
                }
                // Timestamps on the new connection restart at 0; everything
                // delivered so far pushes the offset forward.
                timestampOffsetSec = deliveredBytes / BYTES_PER_SECOND;
                connection = newConnection;
                reconnecting = false;
                log(`Reconnected — resuming stream (timestamp offset: ${timestampOffsetSec.toFixed(2)}s)`);
                startKeepAlive();
                flushBuffer();
                return;
            } catch (error) {
                log(`Reconnect attempt ${attempt + 1} failed: ${error.message || error}`);
            }
        }

        log(`Gave up after ${MAX_RECONNECT_ATTEMPTS} reconnect attempts`);
        finish(1);
    }

    /** Ask the server to finalize: it responds with Metadata, then closes with 1000. */
    function beginShutdown() {
        if (shuttingDown) {
            return;
        }
        shuttingDown = true;
        log("Audio complete — sending CloseStream for a clean shutdown");
        if (connection && connection.readyState === READY_STATE_OPEN) {
            connection.sendCloseStream({ type: "CloseStream" });
            // The server replies with a final Metadata message and then closes
            // with code 1000. Don't wait forever if that close never arrives.
            shutdownWatchdog = setTimeout(() => {
                log("Timed out waiting for the server to close — forcing shutdown");
                finish(0);
            }, 10000);
        } else {
            finish(0);
        }
    }

    /** Stop timers and release the socket so the process can exit cleanly. */
    let finished = false;
    function finish(exitCode) {
        if (finished) {
            return;
        }
        finished = true;
        stopKeepAlive();
        if (pumpTimer) {
            clearInterval(pumpTimer);
            pumpTimer = null;
        }
        if (shutdownWatchdog) {
            clearTimeout(shutdownWatchdog);
            shutdownWatchdog = null;
        }
        // Null out the reference first: close() fires a synchronous close event,
        // and the stale-connection guard in the close handler ignores it.
        const activeConnection = connection;
        connection = null;
        if (activeConnection) {
            activeConnection.close();
        }
        log(`Done (exit code: ${exitCode})`);
        process.exitCode = exitCode;
    }

    // Graceful Ctrl+C: drain what we have and close the stream properly.
    process.on("SIGINT", () => {
        log("SIGINT — shutting down");
        audioExhausted = true;
        beginShutdown();
        setTimeout(() => finish(0), 3000).unref();
    });

    // -----------------------------------------------------------------------
    // Start streaming
    // -----------------------------------------------------------------------

    try {
        connection = await openConnection();
        startKeepAlive();
    } catch (error) {
        log(`Initial connection failed: ${error.message || error}`);
        void reconnect();
    }

    // Pace the file like a live microphone: one chunk every CHUNK_INTERVAL_MS.
    // While connected, chunks go straight to Deepgram; while disconnected,
    // they land in the buffer and are flushed after the reconnect.
    pumpTimer = setInterval(() => {
        if (shuttingDown) {
            return;
        }

        const chunk = audio.subarray(audioCursor, audioCursor + CHUNK_SIZE);
        audioCursor += chunk.length;

        if (chunk.length > 0) {
            if (connection && connection.readyState === READY_STATE_OPEN) {
                connection.sendMedia(chunk);
                deliveredBytes += chunk.length;
            } else {
                bufferChunk(chunk);
            }
        }

        if (audioCursor >= audio.length && !audioExhausted) {
            audioExhausted = true;
            clearInterval(pumpTimer);
            pumpTimer = null;
            // Only shut down if nothing is buffered; otherwise the reconnect
            // path flushes the buffer first and then shuts down.
            if (connection && connection.readyState === READY_STATE_OPEN) {
                beginShutdown();
            }
            return;
        }

        // Demo only: force one mid-stream disconnect so the recovery path runs.
        if (SIMULATE_DROP && !simulatedDrop && deliveredBytes >= DROP_AFTER_SECONDS * BYTES_PER_SECOND && connection) {
            simulatedDrop = true;
            log("Simulating a mid-stream network drop (close code 4000)");
            connection.socket.close(4000, "simulated network drop");
        }
    }, CHUNK_INTERVAL_MS);
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exitCode = 1;
});
