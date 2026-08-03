/**
 * Example: Live Transcription (V2 / Flux) with End-of-Turn tuning
 *
 * Flux exposes end-of-turn (EOT) controls on the /v2/listen websocket that let
 * you tune how eagerly a turn is finalized:
 *
 *   - eot_threshold:       EOT confidence required to finish a turn (0.5 - 1.0, default 0.7).
 *                          Set to 1.0 to fully suppress Flux's natural EOT detection and
 *                          drive turn endings yourself with ForceEndTurn (below).
 *   - eager_eot_threshold: EOT confidence to fire an *eager* end-of-turn event, enabling
 *                          EagerEndOfTurn / TurnResumed events (0.3 - 0.9)
 *   - eot_timeout_ms:      a turn is finished this many ms after speech regardless of
 *                          EOT confidence (500 - 60000, default 5000)
 *
 * These are sent as query parameters on the connection.
 *
 * You can also end a turn on demand by sending a ForceEndTurn message — useful for
 * push-to-talk UIs, or whenever your app (not the model) decides the user is done.
 * Every EndOfTurn event reports why the turn ended via `trigger`:
 *
 *   - "model"   - Flux's native end-of-turn detection
 *   - "manual"  - a ForceEndTurn message was sent
 *   - "timeout" - eot_timeout_ms elapsed
 *
 * `trigger` is an open enum: tolerate values you do not recognize.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

async function liveTranscriptionFluxEot() {
    let connectionClosed = false;

    try {
        const deepgramConnection = await deepgramClient.listen.v2.createConnection({
            model: "flux-general-en",
            // End-of-turn tuning for Flux
            eot_threshold: 0.8,
            eager_eot_threshold: 0.5,
            eot_timeout_ms: 4000,
        });

        deepgramConnection.on("open", () => {
            console.log("Connection opened (Flux with EOT tuning)");
        });

        deepgramConnection.on("message", (data) => {
            switch (data.type) {
                case "Connected":
                    console.log("Connected:", data);
                    break;
                case "TurnInfo":
                    // The turn lifecycle is reported through `event` on TurnInfo, not as
                    // separate top-level message types.
                    switch (data.event) {
                        case "StartOfTurn":
                            console.log("Start of turn:", data.turn_index);
                            break;
                        case "EagerEndOfTurn":
                            console.log("Eager end-of-turn (start preparing a reply):", data.transcript);
                            break;
                        case "TurnResumed":
                            console.log("Turn resumed (speech continued after all):", data.turn_index);
                            break;
                        case "EndOfTurn":
                            // `trigger` tells you what ended the turn: "model", "manual"
                            // (a ForceEndTurn we sent), or "timeout".
                            console.log(`End of turn (trigger: ${data.trigger ?? "unknown"}):`, data.transcript);
                            break;
                        default:
                            console.log("Turn update:", data.transcript);
                    }
                    break;
                case "ConfigureSuccess":
                    console.log("Configure applied:", data);
                    break;
                case "ConfigureFailure":
                    console.error("Configure failed:", data);
                    break;
                case "Error":
                    console.error("Fatal Error:", data);
                    deepgramConnection.close();
                    break;
                default:
                    console.log("Message:", data);
            }
        });

        deepgramConnection.on("error", (error) => {
            console.error("Error:", error);
        });

        deepgramConnection.on("close", () => {
            connectionClosed = true;
            console.log("Connection closed");
        });

        deepgramConnection.connect();

        try {
            await deepgramConnection.waitForOpen();

            const audioStream = createReadStream("./examples/spacewalk.wav");

            audioStream.on("data", (chunk) => {
                deepgramConnection.sendMedia(chunk);
            });

            audioStream.on("end", () => {
                console.log("Audio stream ended");

                // No more audio is coming, so finalize the in-flight turn immediately
                // instead of waiting for Flux's EOT detection or for eot_timeout_ms to
                // elapse. The resulting EndOfTurn arrives with trigger: "manual". In a
                // push-to-talk UI you would send this when the user releases the button;
                // pair it with eot_threshold: 1.0 to take over turn-ending entirely.
                console.log("Forcing end of turn");
                deepgramConnection.sendForceEndTurn({ type: "ForceEndTurn" });

                setTimeout(() => {
                    // sendCloseStream throws on a closed socket, and the connection may
                    // already be gone (for example a FatalError closed it).
                    if (!connectionClosed) {
                        deepgramConnection.sendCloseStream({ type: "CloseStream" });
                    }
                }, 3000);
            });

            // Kill websocket after 60 seconds so this can run in CI
            setTimeout(() => {
                console.log("Timeout reached, closing connection");
                deepgramConnection.close();
                process.exit(0);
            }, 60000);
        } catch (error) {
            console.error("Error waiting for connection:", error);
            deepgramConnection.close();
        }
    } catch (error) {
        console.error("Error setting up connection:", error);
    }
}

liveTranscriptionFluxEot();
