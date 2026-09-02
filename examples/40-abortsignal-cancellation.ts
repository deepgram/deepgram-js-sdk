/**
 * Example: Canceling a Live Connection with AbortSignal
 *
 * Demonstrates how to cancel a real-time connection using an AbortSignal.
 * Aborting stops the pending or active transport and disables automatic
 * reconnection. It does not remove callbacks registered with connection.on(),
 * and waitForOpen() must be made abort-aware separately.
 *
 * The same abortSignal option works for listen.v2, agent.v1, speak.v1,
 * and speak.v2 connections.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

function waitForOpenOrAbort(connection: { waitForOpen(): Promise<unknown> }, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const cleanup = () => signal.removeEventListener("abort", onAbort);
        const onAbort = () => {
            cleanup();
            reject(signal.reason ?? new Error("Connection aborted"));
        };

        if (signal.aborted) {
            onAbort();
            return;
        }

        signal.addEventListener("abort", onAbort, { once: true });
        connection.waitForOpen().then(
            () => {
                cleanup();
                resolve();
            },
            (error) => {
                cleanup();
                reject(error);
            },
        );
    });
}

async function abortSignalCancellation() {
    // Create an AbortController; its signal cancels the connection on demand
    const controller = new AbortController();
    let audioStream: ReturnType<typeof createReadStream> | undefined;
    let abortTimer: ReturnType<typeof setTimeout> | undefined;

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

        deepgramConnection.on(
            "message",
            (data: { type?: string; channel?: { alternatives?: Array<{ transcript?: string }> } }) => {
                if (data.type === "Results") {
                    const transcript = data.channel?.alternatives?.[0]?.transcript;
                    if (transcript) {
                        console.log("Transcript:", transcript);
                    }
                }
            },
        );

        deepgramConnection.on("error", (error: unknown) => {
            console.error("Error:", error);
        });

        const connectionClosed = new Promise<void>((resolve) => {
            deepgramConnection.on("close", () => {
                console.log("Connection closed");
                resolve();
            });
        });

        // Schedule cancellation before opening so the same path also handles a
        // slow connection that is still opening after three seconds.
        abortTimer = setTimeout(() => {
            console.log("Stopping session, aborting connection...");
            controller.abort();
        }, 3000);

        deepgramConnection.connect();
        await waitForOpenOrAbort(deepgramConnection, controller.signal);

        // Stream some audio from a file
        audioStream = createReadStream("./examples/spacewalk.wav");
        audioStream.on("data", (chunk: Buffer) => {
            deepgramConnection.sendMedia(chunk);
        });

        await connectionClosed;
        console.log("Connection aborted; no reconnect will occur.");
    } catch (error) {
        if (controller.signal.aborted) {
            console.log("Connection attempt aborted; no reconnect will occur.");
        } else {
            console.error("Error setting up connection:", error);
            process.exitCode = 1;
        }
    } finally {
        clearTimeout(abortTimer);
        audioStream?.destroy();
    }
}

abortSignalCancellation();
