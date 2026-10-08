/**
 * Example: Voice Agent Custom Think Provider Messages
 *
 * Experimental: requires a custom `wss://` think endpoint.
 *
 * Sends application-defined data to a think provider and handles a custom
 * response. Your think provider decides the shape and meaning of `content`.
 *
 * Requires CUSTOM_THINK_ENDPOINT to point to your custom `wss://` think
 * endpoint. Deepgram forwards custom messages to that endpoint unchanged.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});
const customThinkEndpoint = process.env.CUSTOM_THINK_ENDPOINT;

async function agentCustomThinkProviderMessages() {
    if (!customThinkEndpoint) {
        console.error("Set CUSTOM_THINK_ENDPOINT to your custom wss:// think endpoint before running this example.");
        process.exitCode = 1;
        return;
    }

    try {
        const connection = await deepgramClient.agent.v1.createConnection();
        let keepAliveInterval: ReturnType<typeof setInterval> | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
                keepAliveInterval = undefined;
            }
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        };

        connection.on("open", () => {
            console.log("Connection opened");
        });

        connection.on("message", (data) => {
            if (data.type === "SettingsApplied") {
                console.log("Settings applied; sending custom think-provider message");

                connection.sendCustomToThinkProvider({
                    type: "__customToThinkProvider",
                    content: {
                        event: "customer_context",
                        customerId: "example-customer",
                        plan: "pro",
                    },
                });
            } else if (data.type === "__customFromThinkProvider") {
                // `content` is application-defined by your custom think provider.
                console.log("Custom think-provider response:", data.content);
            } else if (data.type === "ConversationText") {
                const role = data.role === "assistant" ? "Agent" : "User";
                console.log(`${role}: ${data.content}`);
            } else if (data instanceof Blob) {
                console.log("Audio data received");
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

            connection.sendSettings({
                type: "Settings",
                audio: {
                    input: {
                        encoding: "linear16",
                        sample_rate: 24000,
                    },
                    output: {
                        encoding: "linear16",
                        sample_rate: 16000,
                        container: "wav",
                    },
                },
                agent: {
                    language: "en",
                    listen: {
                        provider: {
                            type: "deepgram",
                            model: "nova-3",
                        },
                    },
                    think: {
                        provider: {
                            type: "open_ai",
                            model: "gpt-4o-mini",
                        },
                        endpoint: {
                            url: customThinkEndpoint,
                            headers: {},
                        },
                        prompt: "You are a friendly AI assistant.",
                    },
                    speak: {
                        provider: {
                            type: "deepgram",
                            model: "aura-2-thalia-en",
                        },
                    },
                },
            });

            keepAliveInterval = setInterval(() => {
                if (connection.socket.readyState === 1) {
                    connection.sendKeepAlive({ type: "KeepAlive" });
                } else {
                    cleanup();
                }
            }, 5000);

            const audioStream = createReadStream("./examples/spacewalk.wav");
            audioStream.on("data", (chunk) => {
                connection.sendMedia(chunk);
            });
            audioStream.on("end", () => {
                console.log("Finished sending audio");
            });
            audioStream.on("error", (error) => {
                console.error("Audio stream error:", error);
                connection.close();
            });

            // Keep the example bounded when run from the command line or CI.
            timeout = setTimeout(() => {
                console.log("Timed out; closing connection");
                connection.close();
            }, 30000);
        } catch (error) {
            cleanup();
            console.error("Error waiting for connection:", error);
            connection.close();
        }
    } catch (error) {
        console.error("Error setting up connection:", error);
    }
}

agentCustomThinkProviderMessages();
