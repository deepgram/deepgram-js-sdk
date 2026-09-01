import { describe, it, expect } from "vitest";
import { DeepgramClient } from "../../src";
import type { DeepgramTransport } from "../../src";

/**
 * Regression: every generated `Socket.close()` synchronously re-fires the
 * registered `close` handler via handleClose(). A `close` handler that itself
 * calls close() — an idiomatic cleanup pattern — used to recurse infinitely and
 * throw `RangeError: Maximum call stack size exceeded` (surfaced as an unhandled
 * promise rejection Node's tracker could not format). The fix is an idempotency
 * guard on the WrappedSocket close() in CustomClient.ts (no generated files
 * frozen). These tests exercise the public createConnection() path — the wrapped
 * sockets consumers actually receive — offline (no connect(), no network).
 */

// createConnection builds a startClosed socket; args are only used for query
// params, so minimal per-service options are fine and never touch the network.
const SERVICES: Array<[string, (c: DeepgramClient) => Promise<any>]> = [
    ["agent.v1", (c) => c.agent.v1.createConnection({} as any)],
    ["listen.v1", (c) => c.listen.v1.createConnection({ model: "nova-3" } as any)],
    ["listen.v2", (c) => c.listen.v2.createConnection({ model: "flux-general-en" } as any)],
    ["speak.v1", (c) => c.speak.v1.createConnection({ model: "aura-2-thalia-en" } as any)],
    ["speak.v2", (c) => c.speak.v2.createConnection({ model: "flux-general-en" } as any)],
];

describe.each(SERVICES)("%s wrapped socket close() idempotency", (_name, make) => {
    it("does not recurse when the close handler calls close()", async () => {
        const client = new DeepgramClient({ apiKey: "test" });
        const conn = await make(client);
        let calls = 0;
        conn.on("close", () => {
            calls++;
            conn.close(); // idiomatic cleanup — must not recurse
        });
        expect(() => conn.close()).not.toThrow();
        expect(calls).toBe(1); // exactly one notification, cycle terminated
    });

    it("is idempotent — repeated close() fires the handler once", async () => {
        const client = new DeepgramClient({ apiKey: "test" });
        const conn = await make(client);
        let calls = 0;
        conn.on("close", () => calls++);
        conn.close();
        conn.close();
        conn.close();
        expect(calls).toBe(1);
    });
});

describe("connect() re-arms the close guard (reconnect support)", () => {
    it("allows close() again after a reconnect", async () => {
        // A stub transport keeps connect() fully offline (no real socket).
        const stub: DeepgramTransport = {
            send() {},
            onOpen() {},
            onMessage() {},
            onError() {},
            onClose() {},
            isOpen: () => false,
            close() {},
        };
        const client = new DeepgramClient({ apiKey: "test", transportFactory: () => stub } as any);
        const conn = await client.listen.v2.createConnection({ model: "flux-general-en" } as any);
        let calls = 0;
        conn.on("close", () => calls++);

        conn.close();
        expect(calls).toBe(1);

        conn.connect(); // re-arms the guard
        conn.close();
        expect(calls).toBe(2);
    });
});
