import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeepgramClient } from "../../src";
import { ReconnectingWebSocket } from "../../src/core/websocket/ws.js";

/**
 * Covers the native (non-transportFactory) websocket path: loadNodeWebSocket,
 * getWebSocketOptions' Node branch, and createWebSocketConnection. An aborted
 * signal plus the wrapper's startClosed flag keeps ReconnectingWebSocket from
 * opening a real socket.
 */
function aborted(): AbortSignal {
    const c = new AbortController();
    c.abort();
    return c.signal;
}

describe("native websocket connections (no transportFactory)", () => {
    it("builds a Node websocket for listen v1/v2, agent and speak", async () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        const listenV1 = await client.listen.v1.connect({ model: "nova-3", abortSignal: aborted() });
        const listenV2 = await client.listen.v2.connect({ model: "flux-general-en", abortSignal: aborted() });
        const agent = await client.agent.v1.connect({ abortSignal: aborted() });
        const speak = await client.speak.v1.connect({ model: "aura-2-thalia-en", abortSignal: aborted() });

        for (const socket of [listenV1, listenV2, agent, speak]) {
            expect(socket).toBeDefined();
            expect(socket.socket).toBeInstanceOf(ReconnectingWebSocket);
        }
    });

    it("passes custom headers, protocols and connection timeout through", async () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        const socket = await client.listen.v1.connect({
            model: "nova-3",
            headers: { "x-custom": "1" },
            protocols: ["p1", "p2"],
            connectionTimeoutInSeconds: 5,
            reconnectAttempts: 3,
            debug: true,
            abortSignal: aborted(),
        });
        expect(socket).toBeDefined();
    });

    it("supports the keyterm array shape on listen v2", async () => {
        const client = new DeepgramClient({ apiKey: "secret" });
        const socket = await client.listen.v2.connect({
            model: "flux-general-en",
            keyterm: ["a", "b"],
            abortSignal: aborted(),
        });
        expect(socket).toBeDefined();
    });
});

describe("generateUUID node crypto fallback", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("falls back to the node crypto module when global crypto is unavailable", () => {
        vi.stubGlobal("crypto", undefined);
        // RUNTIME is really "node" here, so generateUUID requires the crypto module.
        const client = new DeepgramClient({ apiKey: "secret" });
        expect(client.sessionId).toMatch(/^[0-9a-f-]{36}$/i);
    });
});

describe("ReconnectingWebSocket extra branches", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("resolves the global Node WebSocket when no WebSocket option is given", () => {
        // No `options.WebSocket` forces getGlobalWebSocket(); fake timers prevent
        // the deferred connect from ever opening a real socket.
        const rws = new ReconnectingWebSocket({
            url: "wss://example.com/socket",
            options: { minReconnectionDelay: 10_000, connectionTimeout: 10_000 },
        });
        expect(rws.readyState).toBe(rws.CONNECTING);
        rws.close();
    });

    it("close() before a socket exists is a no-op that stays closed", () => {
        const rws = new ReconnectingWebSocket({ url: "wss://x", options: { startClosed: true } });
        rws.close();
        rws.close(); // second close hits the "already closed / no ws" guard
        expect(rws.readyState).toBe(rws.CLOSED);
    });

    it("enqueues sends while closed and reports bufferedAmount without a socket", () => {
        const rws = new ReconnectingWebSocket({ url: "wss://x", options: { startClosed: true } });
        rws.send("abc");
        rws.send(new Uint8Array([1, 2]));
        rws.send(new Blob(["xy"]));
        expect(rws.bufferedAmount).toBe(3 + 2 + 2);
        expect(rws.binaryType).toBe("blob");
        rws.binaryType = "arraybuffer";
        expect(rws.binaryType).toBe("arraybuffer");
    });

    it("dispatches to handleEvent-style listeners and removes them", () => {
        const rws = new ReconnectingWebSocket({ url: "wss://x", options: { startClosed: true } });
        const calls: string[] = [];
        const listener = {
            handleEvent: () => {
                calls.push("obj");
            },
        };
        rws.addEventListener("open", listener as never);
        rws.dispatchEvent({ type: "open", target: rws } as never);
        rws.removeEventListener("open", listener as never);
        rws.dispatchEvent({ type: "open", target: rws } as never);
        expect(calls).toEqual(["obj"]);
    });

    it("logs when debug is enabled", () => {
        const spy = vi.spyOn(console, "log").mockImplementation(() => {});
        const rws = new ReconnectingWebSocket({
            url: "wss://x",
            options: { startClosed: true, debug: true },
        });
        rws.send("data-while-closed");
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
