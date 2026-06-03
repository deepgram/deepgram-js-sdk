import { Agent } from "node:http";

import { describe, expect, it } from "vitest";

import { DeepgramClient } from "../../src";
import { createAgentInjectingWebSocket } from "../../src/CustomClient";

/**
 * Minimal stand-in for `ws.WebSocket` that records the constructor arguments it
 * receives. `CLOSING = 2` mirrors the real class so the SDK's `isWebSocket()`
 * guard (which checks `WebSocket.CLOSING === 2`) accepts the wrapped subclass.
 */
class FakeBaseWebSocket {
    public static readonly CLOSING = 2;

    public constructor(
        public readonly url: string,
        public readonly protocols: string | string[] | undefined,
        public readonly opts: Record<string, unknown> | undefined,
    ) {}
}

/** Reach the underlying ReconnectingWebSocket of a wrapped socket. */
function reconnectingWebSocketOf(socket: unknown): any {
    return (socket as { socket: unknown }).socket;
}

/** The WebSocket class the ReconnectingWebSocket will instantiate. */
function chosenWebSocketClass(socket: unknown): any {
    return reconnectingWebSocketOf(socket)._options.WebSocket;
}

describe("createAgentInjectingWebSocket", () => {
    it("injects the agent into the ws constructor options", () => {
        const agent = new Agent();
        const Wrapped = createAgentInjectingWebSocket(FakeBaseWebSocket, agent);

        const instance = new Wrapped("wss://api.deepgram.com/v1/listen", ["token", "k"], {
            headers: { Authorization: "Token k" },
        });

        expect(instance.opts?.agent).toBe(agent);
        // Existing ws options (headers) are preserved alongside the injected agent.
        expect(instance.opts?.headers).toEqual({ Authorization: "Token k" });
        expect(instance.url).toBe("wss://api.deepgram.com/v1/listen");
        expect(instance.protocols).toEqual(["token", "k"]);
    });

    it("works when the ws options object is omitted", () => {
        const agent = new Agent();
        const Wrapped = createAgentInjectingWebSocket(FakeBaseWebSocket, agent);

        const instance = new Wrapped("wss://api.deepgram.com/v1/listen");

        expect(instance.opts).toEqual({ agent });
    });

    it("uses the requested agent even if one is already on the options object", () => {
        const requested = new Agent();
        const stale = new Agent();
        const Wrapped = createAgentInjectingWebSocket(FakeBaseWebSocket, requested);

        const instance = new Wrapped("wss://api.deepgram.com/v1/listen", undefined, { agent: stale });

        expect(instance.opts?.agent).toBe(requested);
    });

    it("inherits the base static CLOSING so isWebSocket() accepts it", () => {
        const Wrapped = createAgentInjectingWebSocket(FakeBaseWebSocket, new Agent());
        expect(Wrapped.CLOSING).toBe(2);
    });
});

describe("WebSocket agent wiring", () => {
    it("does not wrap the ws class when no agent is configured", async () => {
        const client = new DeepgramClient({ apiKey: "test-api-key" });

        // No agent → the shared ws class is used as-is, so two connections
        // resolve to the very same class object (no per-connection subclass).
        const a = chosenWebSocketClass(await client.listen.v1.createConnection({ model: "nova-3" }));
        const b = chosenWebSocketClass(await client.listen.v1.createConnection({ model: "nova-3" }));

        expect(typeof a).toBe("function");
        expect(a).toBe(b);
    });

    it("wraps the ws class with a subclass when a per-connection agent is set", async () => {
        const client = new DeepgramClient({ apiKey: "test-api-key" });

        const plain = chosenWebSocketClass(await client.listen.v1.createConnection({ model: "nova-3" }));
        const wrapped = chosenWebSocketClass(
            await client.listen.v1.createConnection({ model: "nova-3", agent: new Agent() }),
        );

        // The wrapper is a fresh subclass whose superclass is exactly the ws
        // class used when no agent is configured.
        expect(wrapped).not.toBe(plain);
        expect(Object.getPrototypeOf(wrapped)).toBe(plain);
    });

    it("applies a client-level agent to every streaming service", async () => {
        const agent = new Agent();
        const client = new DeepgramClient({ apiKey: "test-api-key", agent });
        const plainClient = new DeepgramClient({ apiKey: "test-api-key" });
        const plain = chosenWebSocketClass(await plainClient.listen.v1.createConnection({ model: "nova-3" }));

        const listen = chosenWebSocketClass(await client.listen.v1.createConnection({ model: "nova-3" }));
        const speak = chosenWebSocketClass(await client.speak.v1.createConnection({ model: "aura-2-thalia-en" }));
        const agentSocket = chosenWebSocketClass(await client.agent.v1.createConnection());

        for (const cls of [listen, speak, agentSocket]) {
            expect(cls).not.toBe(plain);
            expect(Object.getPrototypeOf(cls)).toBe(plain);
        }
    });

    it("wraps the ws class when both client-level and per-connection agents are set", async () => {
        const client = new DeepgramClient({ apiKey: "test-api-key", agent: new Agent() });
        const plainClient = new DeepgramClient({ apiKey: "test-api-key" });
        const plain = chosenWebSocketClass(await plainClient.listen.v2.createConnection({ model: "flux-general-en" }));

        const wrapped = chosenWebSocketClass(
            await client.listen.v2.createConnection({ model: "flux-general-en", agent: new Agent() }),
        );

        expect(Object.getPrototypeOf(wrapped)).toBe(plain);
    });

    it("does not send the agent as a query parameter", async () => {
        const client = new DeepgramClient({ apiKey: "test-api-key" });
        const socket = await client.listen.v1.createConnection({ model: "nova-3", agent: new Agent() });

        const queryParams = reconnectingWebSocketOf(socket)._queryParameters ?? {};
        expect(queryParams.agent).toBeUndefined();
        expect(queryParams.model).toBe("nova-3");
    });
});
