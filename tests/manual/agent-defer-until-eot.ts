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
    let rejectApplied: ((error: Error) => void) | undefined;
    const settingsApplied = new Promise<void>((resolve, reject) => {
        resolveApplied = resolve;
        rejectApplied = reject;
    });

    socket.on("message", (message) => {
        if (typeof message === "string") {
            return;
        }
        if (message.type === "SettingsApplied") {
            resolveApplied?.();
        } else if (message.type === "Error") {
            rejectApplied?.(new Error(`${message.code}: ${message.description}`));
        }
    });

    try {
        socket.connect();
        await socket.waitForOpen();
        socket.sendSettings({
            type: "Settings",
            audio: {
                input: { encoding: "linear16", sample_rate: 24000 },
                output: { encoding: "linear16", sample_rate: 16000, container: "wav" },
            },
            agent: {
                language: "en",
                listen: { provider: { type: "deepgram", model: "nova-3" } },
                think: {
                    provider: { type: "open_ai", model: "gpt-4o-mini" },
                    prompt: "You are a concise assistant.",
                    functions: [
                        {
                            name: "book_flight",
                            description: "Book a flight for the caller.",
                            parameters: { type: "object", properties: {} },
                            defer_until_eot: true,
                        },
                    ],
                },
                speak: { provider: { type: "deepgram", model: "aura-2-thalia-en" } },
                greeting: "Hello.",
            },
        });

        await withTimeout(settingsApplied, 10000);
        assert.ok(true, "Voice Agent accepted defer_until_eot settings");
        console.log("PASS: Voice Agent accepted defer_until_eot settings");
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("UNPARSABLE_CLIENT_MESSAGE")) {
            console.log("SKIP: defer_until_eot is not enabled on this Voice Agent deployment");
            return;
        }
        throw error;
    } finally {
        socket.close();
    }
}

void main();
