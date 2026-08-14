/**
 * Example: Live Transcription (V2 / Flux) with End-of-Turn tuning
 *
 * Flux exposes end-of-turn (EOT) controls on the /v2/listen websocket that let
 * you tune how eagerly a turn is finalized:
 *
 *   - eot_threshold:       EOT confidence required to finish a turn (0.5 - 0.9, default 0.7)
 *   - eager_eot_threshold: EOT confidence to fire an *eager* end-of-turn event, enabling
 *                          EagerEndOfTurn / TurnResumed events (0.3 - 0.9)
 *   - eot_timeout_ms:      a turn is finished this many ms after speech regardless of
 *                          EOT confidence (default 5000)
 *
 * These are sent as query parameters on the connection.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

async function liveTranscriptionFluxEot() {
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
                    console.log("Turn Info:", data);
                    break;
                case "EagerEndOfTurn":
                    console.log("Eager end-of-turn:", data);
                    break;
                case "TurnResumed":
                    console.log("Turn resumed:", data);
                    break;
                case "FatalError":
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
                setTimeout(() => {
                    deepgramConnection.sendCloseStream({ type: "CloseStream" });
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
