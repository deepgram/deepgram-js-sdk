/**
 * Example: Canceling a Live Connection with AbortSignal
 *
 * Demonstrates how to safely cancel a real-time connection using an
 * AbortSignal. Aborting closes the WebSocket, disables automatic
 * reconnection, and removes the SDK's internal event listeners, so no
 * stray open/close/error handlers fire afterwards and no reconnect loop
 * is left behind. It is also the only safe way to cancel a connection
 * that is still opening.
 *
 * The same abortSignal option works for agent.v1.connect() and
 * speak.v1.connect() as well.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

async function abortSignalCancellation() {
    // Create an AbortController; its signal cancels the connection on demand
    const controller = new AbortController();

    try {
        // Pass the signal when creating the connection
        const deepgramConnection = await deepgramClient.listen.v1.createConnection({
            model: "nova-3",
            language: "en",
            interim_results: "true",
            abortSignal: controller.signal,
        });

        deepgramConnection.on("open", () => {
            console.log("Connection opened");
        });

        deepgramConnection.on("message", (data) => {
            if (data.type === "Results") {
                const transcript = data.channel?.alternatives?.[0]?.transcript;
                if (transcript) {
                    console.log("Transcript:", transcript);
                }
            }
        });

        deepgramConnection.on("error", (error) => {
            console.error("Error:", error);
        });

        deepgramConnection.on("close", () => {
            console.log("Connection closed");
        });

        // Open the websocket
        deepgramConnection.connect();
        await deepgramConnection.waitForOpen();

        // Stream some audio from a file
        const audioStream = createReadStream("./examples/spacewalk.wav");
        audioStream.on("data", (chunk) => {
            deepgramConnection.sendMedia(chunk);
        });

        // Simulate the user stopping the session after a short delay.
        // Aborting tears the connection down for good: the socket closes,
        // reconnection is disabled, and internal listeners are removed.
        setTimeout(() => {
            console.log("Stopping session, aborting connection...");
            controller.abort();
            console.log("Connection aborted; no reconnect will occur.");
            process.exit(0);
        }, 3000);
    } catch (error) {
        console.error("Error setting up connection:", error);
        process.exit(1);
    }
}

abortSignalCancellation();
