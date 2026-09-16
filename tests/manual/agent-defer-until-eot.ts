/**
 * Manual live verification that Voice Agent accepts defer_until_eot settings.
 *
 * Requires DEEPGRAM_API_KEY. Run with:
 *
 *     pnpm tsx tests/manual/agent-defer-until-eot.ts
 */

import assert from "node:assert/strict";
import { DeepgramClient } from "../../src";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> =>
    Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timed out waiting for SettingsApplied")), timeoutMs),
        ),
    ]);

async function main(): Promise<void> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.log("SKIP: DEEPGRAM_API_KEY not set");
        return;
    }

    const client = new DeepgramClient({ apiKey });
    const socket = await client.agent.v1.createConnection();
    let resolveApplied: (() => void) | undefined;
    const settingsApplied = new Promise<void>((resolve) => {
        resolveApplied = resolve;
    });

    socket.on("message", (message) => {
        if (typeof message !== "string" && message.type === "SettingsApplied") {
            resolveApplied?.();
        }
    });

    try {
        socket.connect();
        await socket.waitForOpen();
        socket.sendSettings({
            type: "Settings",
            audio: {
                input: { encoding: "linear16", sample_rate: 24000 },
                output: { encoding: "linear16", sample_rate: 16000, container: "none" },
            },
            agent: {
                listen: { provider: { type: "deepgram", version: "v1", model: "nova-3" } },
                think: {
                    provider: { type: "open_ai", model: "gpt-4o-mini" },
                    functions: [{ name: "book_flight", defer_until_eot: true }],
                },
                speak: { provider: { type: "deepgram", model: "aura-2-thalia-en" } },
            },
        });

        await withTimeout(settingsApplied, 10000);
        assert.ok(true, "Voice Agent accepted defer_until_eot settings");
        console.log("PASS: Voice Agent accepted defer_until_eot settings");
    } finally {
        socket.close();
    }
}

void main();
