/**
 * Example: Text-to-Speech Streaming with Flux (WebSocket, /v2/speak)
 *
 * Connect to Deepgram's v2 streaming TTS websocket (Flux voices) and send text
 * to synthesize speech. Flux uses the v2 message set: Speak / Flush / Close, and
 * emits Connected, SpeechStarted, SpeechMetadata, Flushed and SessionMetadata
 * control messages alongside binary audio frames.
 *
 * Note: Flux models use the `flux-{voice}-{language}` naming (e.g. flux-alexis-en).
 * Aura voices are not valid on /v2/speak — use speak.v1 for Aura.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
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

        let flushed = false;

        deepgramConnection.on("message", (data) => {
            // Binary audio frames arrive as ArrayBuffer/Blob (or string in some runtimes)
            if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) {
                console.log(
                    "Audio received (length):",
                    data instanceof ArrayBuffer ? data.byteLength : data instanceof Blob ? data.size : data.length,
                );
                // Process audio data here
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
                case "Flushed":
                    console.log("Flushed:", data.speech_id);
                    flushed = true;
                    // Wait a moment for any remaining audio, then close
                    setTimeout(() => {
                        deepgramConnection.close();
                    }, 1000);
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

            const text = "Hello, this is a test of Deepgram's Flux streaming text-to-speech API.";

            // Send text for synthesis (type: "Speak"), then Flush to finish the turn
            deepgramConnection.sendSpeak({ type: "Speak", text });
            deepgramConnection.sendFlush({ type: "Flush" });

            // Fallback close in case Flushed never comes
            setTimeout(() => {
                if (!flushed) {
                    console.log("Timeout waiting for Flushed message, closing connection");
                    deepgramConnection.close();
                }
            }, 10000);

            // Kill websocket after 1 minute, so we can run these in CI
            setTimeout(() => {
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

textToSpeechStreamingFlux();
