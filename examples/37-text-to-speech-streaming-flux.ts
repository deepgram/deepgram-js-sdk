/**
 * Example: Text-to-Speech Streaming with Flux (WebSocket, /v2/speak)
 *
 * Connect to Deepgram's v2 streaming TTS websocket (Flux voices) and send text
 * to synthesize speech. Flux uses the v2 message set: Speak / Flush / Interrupt /
 * Configure / Close, and emits Connected, SpeechStarted, SpeechMetadata,
 * SpeechInterrupted, Flushed, ConfigureSuccess / ConfigureFailure and
 * SessionMetadata control messages alongside binary audio frames.
 *
 * This example also demonstrates two Flux-only capabilities:
 *   - Mid-stream `Configure` to change the speaking rate (`sendConfigure`), and
 *   - Barge-in via `Interrupt` (`sendInterrupt`): the client reports how much
 *     audio it had played (`playback_offset`) so the server can split the turn
 *     and return `text_spoken` / `text_remaining` on `SpeechInterrupted`.
 *
 * Note: Flux models use the `flux-{voice}-{language}` naming (e.g. flux-alexis-en).
 * Aura voices are not valid on /v2/speak — use speak.v1 for Aura.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

// linear16 @ 24 kHz mono = 2 bytes/sample * 24000 samples/sec = 48 bytes per ms.
// Used to estimate how much audio we have "played" so the barge-in Interrupt can
// report a realistic playback_offset.
const BYTES_PER_MS = 48;

// TEST ONLY: target a non-prod host (e.g. staging) by setting DEEPGRAM_BASE_URL
// (wss://... or https://...). Defaults to production when unset.
const baseUrl = process.env.DEEPGRAM_BASE_URL;
const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
    ...(baseUrl
        ? {
              environment: {
                  base: baseUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://"),
                  production: baseUrl,
                  agent: baseUrl,
              },
          }
        : {}),
});

async function textToSpeechStreamingFlux() {
    try {
        // Create a connection object with Flux TTS options (not yet connected)
        const deepgramConnection = await deepgramClient.speak.v2.createConnection({
            model: "flux-alexis-en",
            encoding: "linear16",
            sample_rate: "24000",
        });

        // Set up event handlers before connecting
        deepgramConnection.on("open", () => {
            console.log("Connection opened");
        });

        let audioBytes = 0;
        let interruptSent = false;
        let done = false;

        const finish = () => {
            if (done) {
                return;
            }
            done = true;
            deepgramConnection.close();
        };

        deepgramConnection.on("message", (data) => {
            // Binary audio frames arrive as ArrayBuffer/Blob (or string in some runtimes)
            if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) {
                const length =
                    data instanceof ArrayBuffer ? data.byteLength : data instanceof Blob ? data.size : data.length;
                audioBytes += length;
                console.log("Audio received (length):", length);
                // Process audio data here.

                // Barge-in: once we've "played" ~1s of audio, interrupt the turn and
                // tell the server where we were (playback_offset) so it can report
                // what was and wasn't heard. The offset is cumulative from the start
                // of the session; each Interrupt must advance past the previous one.
                if (!interruptSent && audioBytes / BYTES_PER_MS >= 1000) {
                    interruptSent = true;
                    const playedMs = Math.floor(audioBytes / BYTES_PER_MS);
                    console.log(`Barging in at ~${playedMs}ms of played audio`);
                    deepgramConnection.sendInterrupt({
                        type: "Interrupt",
                        playback_offset: { type: "time_ms", value: playedMs },
                    });
                }
                return;
            }

            switch (data.type) {
                case "Connected":
                    console.log("Connected:", data.request_id, data.model_name);
                    break;
                case "SpeechStarted":
                    console.log("Speech started:", data.speech_id);
                    break;
                case "SpeechMetadata":
                    console.log("Speech metadata:", data);
                    break;
                case "ConfigureSuccess":
                    // Mid-stream Configure was accepted; `applied` echoes the live config.
                    console.log("Configure applied:", data.applied);
                    break;
                case "ConfigureFailure":
                    // e.g. SPEED_OUT_OF_RANGE / SPEED_INCREMENT_INVALID / SPEED_NOT_SUPPORTED.
                    // Rejections are reported here rather than thrown client-side.
                    console.warn("Configure rejected:", data.code, data.field, data.value, "-", data.description);
                    break;
                case "SpeechInterrupted":
                    // Barge-in acknowledged. text_spoken / text_remaining are present only
                    // because we sent a playback_offset on the Interrupt.
                    console.log("Speech interrupted at (ms):", data.audio_played_ms);
                    console.log("  text spoken:   ", data.text_spoken);
                    console.log("  text remaining:", data.text_remaining);
                    // Give any trailing audio a moment to arrive, then close.
                    setTimeout(finish, 1000);
                    break;
                case "Flushed":
                    console.log("Flushed:", data.speech_id);
                    // Wait a moment for any remaining audio, then close
                    setTimeout(finish, 1000);
                    break;
                case "SessionMetadata":
                    console.log("Session metadata:", data);
                    break;
                case "Warning":
                    console.warn("Warning:", data.code, data.description);
                    break;
                case "Error":
                    console.error("Error:", data.code, data.description);
                    break;
                default:
                    console.log("Unknown message type:", data);
            }
        });

        deepgramConnection.on("error", (error) => {
            console.error("Error:", error);
        });

        deepgramConnection.on("close", () => {
            console.log("Connection closed");
        });

        // Connect to the websocket
        deepgramConnection.connect();

        // Wait for connection to open before sending data
        try {
            await deepgramConnection.waitForOpen();

            // Set the speaking rate mid-stream before we start speaking. Accepted
            // multipliers are 0.85–1.15 in 0.05 steps; anything else comes back as a
            // ConfigureFailure (handled above) rather than throwing here.
            deepgramConnection.sendConfigure({ type: "Configure", speed: 1.05 });

            // A longer passage so there is enough audio in flight to barge in on.
            const text =
                "Hello, this is a test of Deepgram's Flux streaming text-to-speech API. " +
                "This sentence is intentionally long so that we can demonstrate barging in " +
                "partway through playback and receiving the portion of text that was spoken " +
                "along with the portion that still remained.";

            // Send text for synthesis (type: "Speak"), then Flush to finish the turn
            deepgramConnection.sendSpeak({ type: "Speak", text });
            deepgramConnection.sendFlush({ type: "Flush" });

            // Fallback close in case neither Flushed nor SpeechInterrupted comes
            setTimeout(() => {
                if (!done) {
                    console.log("Timeout waiting for a terminal message, closing connection");
                    finish();
                }
            }, 10000);

            // Kill websocket after 1 minute, so we can run these in CI
            setTimeout(() => {
                finish();
                process.exit(0);
            }, 60000);
        } catch (error) {
            console.error("Error waiting for connection:", error);
            finish();
        }
    } catch (error) {
        console.error("Error setting up connection:", error);
    }
}

textToSpeechStreamingFlux();
