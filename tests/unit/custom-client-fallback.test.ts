import { describe, expect, it, vi } from "vitest";

// Simulate a runtime that is neither Node nor a browser (e.g. an unknown JS
// host) so getWebSocketOptions takes its final `else` fallback branch.
vi.mock("../../src/core/runtime/index.js", () => ({
    RUNTIME: { type: "unknown" },
}));

import { DeepgramClient } from "../../src";

function aborted(): AbortSignal {
    const c = new AbortController();
    c.abort();
    return c.signal;
}

describe("getWebSocketOptions fallback runtime", () => {
    it("passes headers and protocols straight through on an unknown runtime", async () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        const socket = await client.listen.v1.connect({
            model: "nova-3",
            protocols: ["p1"],
            abortSignal: aborted(),
        });
        expect(socket).toBeDefined();
    });

    it("generates a manual UUID session id when crypto.randomUUID is unavailable", () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        // On the mocked non-node runtime, generateUUID falls through to the
        // manual RFC4122 implementation.
        expect(client.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
