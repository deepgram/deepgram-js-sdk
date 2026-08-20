/**
 * Example: Live Transcription (V2 / Flux) with Force-End-Turn
 *
 * Normally Flux decides when a turn is over, using end-of-turn confidence. Two options
 * let the application take that decision instead:
 *
 *   - eot_threshold: 1.0  fully suppresses natural end-of-turn detection, so a turn
 *                         never ends on its own
 *   - ForceEndTurn        a control message that ends the current turn immediately,
 *                         whatever the confidence
 *
 * Together they hand turn boundaries to the caller — useful when something outside the
 * audio tells you the speaker is done, such as a push-to-talk button being released.
 *
 * The resulting EndOfTurn reports `trigger: "manual"`. The trigger field distinguishes
 * "manual" (a ForceEndTurn ended it) from "model" (Flux's own detection) and "timeout"
 * (eot_timeout_ms elapsed). It is an open enum — tolerate values you do not recognize.
 *
 * The connection stays open after a forced end: the turn index advances and transcription
 * continues into the next turn.
 *
 * Note: ForceEndTurn requires server-side enablement and is not yet available on every
 * deployment. Where it is not enabled the server replies UNPARSABLE_CLIENT_MESSAGE and
 * closes the connection; this example reports that and exits rather than failing.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { readFileSync } = require("fs");

const SAMPLE_RATE = 44100;
const WAV_HEADER_BYTES = 44;
const CHUNK_BYTES = (SAMPLE_RATE / 10) * 2; // 100ms of 16-bit mono PCM

// ForceEndTurn is not enabled on every deployment. Set DEEPGRAM_BASE_URL to target one
// that has it. The v2 socket URL comes from environment.production, a wss:// origin, so
// the host is applied there rather than through baseUrl.
const host = (process.env.DEEPGRAM_BASE_URL || "https://api.deepgram.com").replace(/^https?:\/\//, "");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
    environment: {
        base: `https://${host}`,
        production: `wss://${host}`,
        agent: `wss://${host}`,
        agentRest: `https://${host}`,
    },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function liveTranscriptionForceEndTurn() {
    try {
        const deepgramConnection = await deepgramClient.listen.v2.createConnection({
            model: "flux-general-en",
            encoding: "linear16",
            sample_rate: SAMPLE_RATE,
            // Never end a turn on Flux's own judgement — we will end it ourselves.
            eot_threshold: 1.0,
        });

        let turnStarted = false;
        let featureDisabled = false;
        let closed = false;

        deepgramConnection.on("open", () => {
            console.log("Connection opened (Flux with eot_threshold=1.0)");
        });

        deepgramConnection.on("message", (data) => {
            switch (data.type) {
                case "Connected":
                    console.log("Connected: request_id=" + data.request_id);
                    break;
                case "TurnInfo":
                    if (data.event === "StartOfTurn") {
                        turnStarted = true;
                        console.log(`[StartOfTurn] turn=${data.turn_index}`);
                    } else if (data.event === "EndOfTurn") {
                        console.log(
                            `[EndOfTurn]   turn=${data.turn_index} ` +
                                `trigger=${data.trigger ?? "<not sent by this deployment>"} ` +
                                `end_of_turn_confidence=${data.end_of_turn_confidence}`,
                        );
                        console.log(`              transcript: "${data.transcript}"`);
                    }
                    break;
                default:
                    if (data.code === "UNPARSABLE_CLIENT_MESSAGE") {
                        featureDisabled = true;
                    }
                    if (data.code) {
                        console.error(`Server error: ${data.code} - ${data.description}`);
                    }
                    break;
            }
        });

        deepgramConnection.on("error", (error) => {
            console.error("Error:", error.message);
        });

        deepgramConnection.on("close", () => {
            // close() re-enters this handler after the socket's own close event, so only
            // the first one is worth reporting.
            if (closed) return;
            closed = true;
            console.log("Connection closed");
        });

        deepgramConnection.connect();
        await deepgramConnection.waitForOpen();

        const pcm = readFileSync("./examples/spacewalk.wav");
        let offset = WAV_HEADER_BYTES;
        let forced = false;

        console.log("Streaming audio...");
        for (let i = 0; i < 60 && offset < pcm.length && !closed; i++) {
            const end = Math.min(offset + CHUNK_BYTES, pcm.length);
            deepgramConnection.sendMedia(pcm.subarray(offset, end));
            offset = end;
            await sleep(100);

            // Wait until a turn is actually underway — forcing before StartOfTurn would
            // have no open turn to end.
            if (!forced && turnStarted && i >= 20) {
                console.log("Sending ForceEndTurn mid-sentence...");
                deepgramConnection.sendForceEndTurn({ type: "ForceEndTurn" });
                forced = true;
            }
        }

        await sleep(2000);

        if (featureDisabled) {
            console.log("\nForceEndTurn is not enabled on this deployment.");
            console.log("With eot_threshold=1.0 and no ForceEndTurn, turns never end on their own.");
        } else if (!closed) {
            deepgramConnection.sendCloseStream({ type: "CloseStream" });
            await sleep(1000);
        }

        deepgramConnection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error setting up connection:", error);
        process.exit(0);
    }
}

liveTranscriptionForceEndTurn();
