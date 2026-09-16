/**
 * Manual live verification that Flux's no-status close after CloseStream is terminal.
 *
 * Requires DEEPGRAM_API_KEY. Run with:
 *
 *     pnpm tsx tests/manual/flux-terminal-close.ts
 */

import assert from "node:assert/strict";
import { DeepgramClient } from "../../src";

const closeTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> =>
    Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timed out waiting for close")), timeoutMs),
        ),
    ]);

async function main(): Promise<void> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.log("SKIP: DEEPGRAM_API_KEY not set");
        return;
    }

    let opens = 0;
    let resolveClose: ((code: number) => void) | undefined;
    const closed = new Promise<number>((resolve) => {
        resolveClose = resolve;
    });
    const client = new DeepgramClient({ apiKey });
    const socket = await client.listen.v2.createConnection({
        model: "flux-general-en",
    });

    socket.on("open", () => {
        opens++;
    });
    socket.on("close", (event) => {
        resolveClose?.(event.code);
    });

    try {
        socket.connect();
        await socket.waitForOpen();
        socket.sendCloseStream({ type: "CloseStream" });

        const code = await closeTimeout(closed, 10000);
        await new Promise((resolve) => setTimeout(resolve, 500));

        assert.equal(code, 1005, "Flux should close with the no-status sentinel after CloseStream");
        assert.equal(opens, 1, "a terminal Flux close must not reconnect");
        console.log("PASS: Flux CloseStream closed with 1005 and did not reconnect");
    } finally {
        socket.close();
    }
}

void main();
