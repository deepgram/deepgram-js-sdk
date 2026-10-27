/**
 * Example: Voice Agent Think Live
 *
 * Starts a bounded, text-only Think Live session. It enables Think Live in
 * Settings, replaces its provider configuration, then requests a queued dynamic
 * filler line. This example does not send microphone audio.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const client = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });
const timeoutMs = 8000;

async function run() {
    const connection = await client.agent.v1.createConnection();
    let finished = false;

    const finish = (exitCode = 0) => {
        if (finished) return;
        finished = true;
        connection.close();
        process.exitCode = exitCode;
    };

    const timer = setTimeout(() => {
        console.log("Think Live example finished.");
        finish();
    }, timeoutMs);

    connection.on("message", (data) => {
        if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) return;

        switch (data.type) {
            case "SettingsApplied":
                connection.sendUpdateThinkLive({
                    type: "UpdateThink_Live",
                    think_live: {
                        provider: {
                            type: "deepgram",
                            version: "v1",
                            agent_backchannel_sensitivity: 0.5,
                            frustration_max_count: 2,
                        },
                    },
                });
                break;
            case "ThinkLiveUpdated":
                connection.sendInjectDynamicAgentMessage({
                    type: "InjectAgentMessage",
                    is_dynamic: true,
                    behavior: "queue",
                });
                break;
            case "ConversationText":
                console.log(`${data.role} (${data.conversational_behavior ?? "default"}): ${data.content}`);
                break;
            case "FrustrationDetected":
                console.log(`Frustration detected: count=${data.count}, escalated=${data.escalated}`);
                break;
            case "Warning":
                console.warn(`Warning ${data.code}: ${data.description}`);
                break;
            case "Error":
                console.error(`Agent error ${data.code}: ${data.description}`);
                clearTimeout(timer);
                finish(1);
                break;
        }
    });

    connection.on("error", (error) => {
        console.error(`Connection error: ${error.message}`);
        clearTimeout(timer);
        finish(1);
    });

    connection.connect();
    await connection.waitForOpen();
    connection.sendSettings({
        type: "Settings",
        experimental: true,
        audio: {
            input: { encoding: "linear16", sample_rate: 24000 },
            output: { encoding: "linear16", sample_rate: 16000, container: "wav" },
        },
        agent: {
            language: "en",
            listen: { provider: { type: "deepgram", model: "nova-3" } },
            think: { provider: { type: "open_ai", model: "gpt-4o-mini" }, prompt: "Be concise." },
            think_live: { provider: { type: "deepgram", version: "v1" } },
            speak: { provider: { type: "deepgram", model: "aura-2-thalia-en" } },
        },
    });
}

run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
