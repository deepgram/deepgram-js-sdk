/**
 * Live Flux TTS Controls smoke test.
 *
 * Requires DEEPGRAM_API_KEY. DEEPGRAM_BASE_URL is optional; when omitted, this
 * runs against production. Run with:
 *
 *     pnpm tsx tests/manual/flux-tts-controls.ts
 */

import assert from "node:assert/strict";
import { DeepgramClient, DeepgramError } from "../../src";

const pronunciation = '\\{"word":"Deepgram","pronounce":"ˈdiːp.ɡræm"\\}';

function clientOptions(apiKey: string) {
    const baseUrl = process.env.DEEPGRAM_BASE_URL;
    if (!baseUrl) {
        return { apiKey };
    }

    const websocketUrl = baseUrl.replace(/^http/, "ws");
    return {
        apiKey,
        environment: {
            base: baseUrl,
            production: websocketUrl,
            agent: websocketUrl,
            agentRest: baseUrl,
        },
    };
}

async function main(): Promise<void> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.log("SKIP: DEEPGRAM_API_KEY not set");
        return;
    }

    console.log(
        process.env.DEEPGRAM_BASE_URL ? "Using DEEPGRAM_BASE_URL" : "Using production API (DEEPGRAM_BASE_URL unset)",
    );
    const client = new DeepgramClient(clientOptions(apiKey));

    await client.speak.v2.audio.generate({
        model: "flux-alexis-en",
        text: "Batch pause.\\{pause:500ms\\} Complete.",
    });
    console.log("PASS: batch pause control");

    await client.speak.v2.audio.generate({
        model: "flux-alexis-en",
        text: `Batch pronunciation ${pronunciation}.`,
    });
    console.log("PASS: batch pronunciation control");

    await assert.rejects(
        () =>
            client.speak.v2.audio.generate({
                model: "flux-alexis-en",
                speed: 1.1,
                text: `Invalid combination ${pronunciation}.`,
            }),
        (error: unknown) => error instanceof DeepgramError && error.statusCode === 400,
    );
    console.log("PASS: batch speed plus pronunciation rejected");

    const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en", reconnectAttempts: 0 });
    try {
        socket.connect();
        await socket.waitForOpen();
        const metadata = new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("timed out waiting for SpeechMetadata")), 15_000);
            socket.on("message", (message) => {
                if (message.type === "Error") {
                    clearTimeout(timeout);
                    reject(new Error(`${message.code}: ${message.description}`));
                }
                if (message.type === "SpeechMetadata") {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });
        socket.sendSpeak({ type: "Speak", text: `Streaming pronunciation ${pronunciation}.` });
        socket.sendFlush({ type: "Flush" });
        await metadata;
        console.log("PASS: streaming pronunciation control");
    } finally {
        socket.close();
    }
}

void main().catch((error: unknown) => {
    console.error("FAIL:", error);
    process.exitCode = 1;
});
