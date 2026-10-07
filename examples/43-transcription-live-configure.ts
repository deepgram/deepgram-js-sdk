/**
 * Example: Live Transcription Configure Messages
 *
 * Updates a Nova-3 stream after it opens. Configure replaces the complete
 * keyterm list; send an empty list to remove every active keyterm.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

async function liveTranscriptionConfigure() {
    try {
        const connection = await deepgramClient.listen.v1.createConnection({
            model: "nova-3",
            language: "en",
            punctuate: "true",
            interim_results: "true",
        });

        let timeout: ReturnType<typeof setTimeout> | undefined;
        const cleanup = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        };

        connection.on("open", () => {
            console.log("Connection opened");
        });

        connection.on("message", (data) => {
            if (data.type === "Results") {
                console.log("Transcript:", data);
                if (data.is_final) {
                    setTimeout(() => connection.close(), 1000);
                }
            } else if (data.type === "Error") {
                console.error(
                    `Configure error (${data.variant}${data.code ? `/${data.code}` : ""}): ${data.description}`,
                );
            } else if (data.type === "Metadata") {
                console.log("Metadata:", data);
            } else {
                console.log("Message:", data);
            }
        });

        connection.on("error", (error) => {
            console.error("Connection error:", error);
        });

        connection.on("close", () => {
            cleanup();
            console.log("Connection closed");
        });

        connection.connect();

        try {
            await connection.waitForOpen();

            // This replaces keyterms supplied in the connection URL, if any.
            connection.sendConfigure({
                type: "Configure",
                keyterms: ["Deepgram", "Nova-3"],
                features: { numerals: true },
            });

            // Configure is state replacement, not an append. Send this later to
            // clear all keyterms after the audio above has used them:
            // connection.sendConfigure({ type: "Configure", keyterms: [] });

            const audioStream = createReadStream("./examples/spacewalk.wav");
            audioStream.on("data", (chunk) => {
                connection.sendMedia(chunk);
            });
            audioStream.on("end", () => {
                connection.sendFinalize({ type: "Finalize" });
            });
            audioStream.on("error", (error) => {
                console.error("Audio stream error:", error);
                connection.close();
            });

            // Keep the example bounded if no final response arrives.
            timeout = setTimeout(() => {
                console.log("Timed out; closing connection");
                connection.close();
            }, 60000);
        } catch (error) {
            cleanup();
            console.error("Error waiting for connection:", error);
            connection.close();
        }
    } catch (error) {
        console.error("Error setting up connection:", error);
    }
}

liveTranscriptionConfigure();
