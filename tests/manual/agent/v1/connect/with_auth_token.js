const { DeepgramClient } = require("../../../../../dist/cjs/index.js");

(async () => {
    try {
        // Using access token instead of API key
        const authClient = new DeepgramClient({
            apiKey: process.env.DEEPGRAM_API_KEY,
        });

        console.log("Request sent");
        const authResponse = await authClient.auth.v1.tokens.grant();
        console.log("Response received");

        const client = new DeepgramClient({
            apiKey: authResponse.accessToken,
            headers: {
                Authorization: `Bearer ${authResponse.accessToken}`,
            },
        });

        const agent = await client.agent.v1.connect();

        // Send minimal settings to configure the agent per the latest spec
        const settings = {
            audio: {
                input: {
                    encoding: "linear16",
                    sample_rate: 44100,
                },
            },
            agent: {
                listen: {
                    provider: {
                        type: "deepgram",
                        model: "nova-3",
                        smart_format: true,
                    },
                },
                think: {
                    provider: {
                        type: "open_ai",
                        model: "gpt-4o-mini",
                        temperature: 0.7,
                    },
                    prompt: 'Reply only and explicitly with "OK".',
                },
                speak: {
                    provider: {
                        type: "deepgram",
                        model: "aura-2-asteria-en",
                    },
                },
            },
        };

        console.log("Send SettingsConfiguration message");
        agent.sendSettings(settings);

        agent.on("open", () => {
            console.log("Connection opened");
        });

        agent.on("message", (message) => {
            if (message instanceof Buffer || message instanceof ArrayBuffer) {
                console.log("Received audio event");
            } else {
                const msgType = message?.type || "Unknown";
                console.log(`Received ${msgType} event`);
            }
        });

        agent.on("close", () => {
            console.log("Connection closed");
        });

        agent.on("error", (error) => {
            console.log(`Caught: ${error.message || error}`);
        });

        // EXAMPLE ONLY: Wait briefly to see some events before exiting
        // In production, you would typically keep the connection alive and send audio data
        // or integrate into your application's event loop
        setTimeout(() => {
            agent.close();
        }, 3000); // EXAMPLE ONLY: Wait 3 seconds before closing
    } catch (e) {
        console.log(`Caught: ${e.message || e}`);
    }
})();
