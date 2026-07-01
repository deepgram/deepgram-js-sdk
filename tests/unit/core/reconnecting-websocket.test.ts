import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReconnectingWebSocket } from "../../../src/core/websocket/ws.js";

/**
 * Mock WebSocket class compatible with the `ws` interface that
 * ReconnectingWebSocket expects (static CLOSING === 2 for the isWebSocket
 * guard, addEventListener/removeEventListener, send, close).
 */
class MockWebSocket {
    public static readonly CLOSING = 2;
    public static instances: MockWebSocket[] = [];

    public readonly CONNECTING = 0;
    public readonly OPEN = 1;
    public readonly CLOSING = 2;
    public readonly CLOSED = 3;

    public readyState = 0;
    public binaryType: BinaryType = "blob";
    public bufferedAmount = 7;
    public extensions = "permessage-deflate";
    public protocol = "selected-proto";
    public url: string;
    public sent: unknown[] = [];
    public closeArgs: Array<{ code?: number; reason?: string }> = [];
    private listeners: Record<string, Array<(event: any) => void>> = {};

    constructor(url: string, _protocols?: string | string[], _options?: unknown) {
        this.url = url;
        MockWebSocket.instances.push(this);
    }

    addEventListener(type: string, cb: (event: any) => void): void {
        (this.listeners[type] ??= []).push(cb);
    }
    removeEventListener(type: string, cb: (event: any) => void): void {
        this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== cb);
    }
    send(data: unknown): void {
        this.sent.push(data);
    }
    close(code?: number, reason?: string): void {
        this.readyState = this.CLOSED;
        this.closeArgs.push({ code, reason });
        this.emit("close", { type: "close", code: code ?? 1000, reason: reason ?? "", target: this });
    }

    emit(type: string, event: any): void {
        (this.listeners[type] ?? []).forEach((l) => l(event));
    }
    emitOpen(): void {
        this.readyState = this.OPEN;
        this.emit("open", { type: "open", target: this });
    }
    emitMessage(data: unknown): void {
        this.emit("message", { type: "message", data, target: this });
    }
    emitError(message = "socket error"): void {
        this.emit("error", { type: "error", message, error: new Error(message), target: this });
    }
}

function makeRws(
    overrides: Partial<ReconnectingWebSocket.Options> = {},
    args: Partial<ReconnectingWebSocket.Args> = {},
) {
    MockWebSocket.instances = [];
    const rws = new ReconnectingWebSocket({
        url: "wss://example.com/socket",
        protocols: [],
        options: {
            WebSocket: MockWebSocket as unknown as new () => WebSocket,
            minReconnectionDelay: 10,
            maxReconnectionDelay: 50,
            minUptime: 100,
            connectionTimeout: 200,
            maxRetries: 5,
            ...overrides,
        },
        ...args,
    });
    return rws;
}

/** Advance fake timers enough to flush the _wait()/_connect() promise chain. */
async function settle() {
    await vi.advanceTimersByTimeAsync(60);
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
});

describe("ReconnectingWebSocket lifecycle", () => {
    it("connects, opens, forwards messages and closes", async () => {
        const rws = makeRws();
        await settle();
        const ws = MockWebSocket.instances[0]!;

        const events: string[] = [];
        rws.onopen = () => events.push("open");
        rws.onmessage = (e: MessageEvent) => events.push(`message:${e.data}`);
        rws.onclose = () => events.push("close");
        rws.onerror = () => events.push("error");

        ws.emitOpen();
        expect(events).toContain("open");

        // getters delegate to the underlying socket once connected
        expect(rws.extensions).toBe("permessage-deflate");
        expect(rws.protocol).toBe("selected-proto");
        expect(rws.url).toBe("wss://example.com/socket");
        expect(rws.readyState).toBe(rws.OPEN);
        expect(rws.bufferedAmount).toBe(7);
        rws.binaryType = "arraybuffer";
        expect(rws.binaryType).toBe("arraybuffer");
        expect(ws.binaryType).toBe("arraybuffer");

        ws.emitMessage("hello");
        expect(events).toContain("message:hello");

        rws.close(1000, "done");
        expect(ws.closeArgs.at(-1)?.code).toBe(1000);
    });

    it("queues messages while connecting and flushes them on open", async () => {
        const rws = makeRws();
        rws.send("queued-1");
        rws.send(new Uint8Array([1, 2, 3]));
        expect(rws.bufferedAmount).toBe("queued-1".length + 3);

        await settle();
        const ws = MockWebSocket.instances[0]!;
        ws.emitOpen();
        expect(ws.sent).toHaveLength(2);

        // once open, send goes straight through
        rws.send("direct");
        expect(ws.sent).toContain("direct");
    });

    it("respects maxEnqueuedMessages", async () => {
        const rws = makeRws({ maxEnqueuedMessages: 1 });
        rws.send("a");
        rws.send("b"); // dropped
        await settle();
        MockWebSocket.instances[0]!.emitOpen();
        expect(MockWebSocket.instances[0]!.sent).toEqual(["a"]);
    });

    it("reconnects after an abnormal (non-1000) close", async () => {
        const rws = makeRws();
        await settle();
        rws.onerror = () => {};
        MockWebSocket.instances[0]!.emitOpen();

        // server-initiated abnormal close should trigger another connect
        MockWebSocket.instances[0]!.emit("close", { type: "close", code: 1006, reason: "abnormal", target: null });
        await settle();
        expect(MockWebSocket.instances.length).toBeGreaterThanOrEqual(2);
    });

    it("does not reconnect after a normal (1000) close", async () => {
        const rws = makeRws();
        await settle();
        MockWebSocket.instances[0]!.emitOpen();
        MockWebSocket.instances[0]!.emit("close", { type: "close", code: 1000, reason: "bye", target: null });
        await settle();
        expect(MockWebSocket.instances).toHaveLength(1);
    });

    it("surfaces errors from the underlying socket", async () => {
        const rws = makeRws();
        await settle();
        const errors: string[] = [];
        rws.onerror = (e: { message: string }) => errors.push(e.message);
        MockWebSocket.instances[0]!.emitOpen();

        MockWebSocket.instances[0]!.emitError("kaboom");
        await settle();
        expect(errors).toContain("kaboom");
    });

    it("treats a connection timeout as an error", async () => {
        const rws = makeRws({ connectionTimeout: 30, maxRetries: 0 });
        const errors: string[] = [];
        rws.onerror = (e: { message: string }) => errors.push(e.message);
        // never open; let the connect timeout fire
        await vi.advanceTimersByTimeAsync(60);
        expect(errors).toContain("TIMEOUT");
    });

    it("stops connecting once maxRetries is reached", async () => {
        const rws = makeRws({ maxRetries: 1 });
        await settle();
        rws.onerror = () => {};
        MockWebSocket.instances[0]!.emitOpen();
        // first error -> retry (count goes to 1), second -> blocked by maxRetries
        MockWebSocket.instances[0]!.emitError();
        await settle();
        const countAfterFirst = MockWebSocket.instances.length;
        MockWebSocket.instances.at(-1)!.emitError();
        await settle();
        expect(MockWebSocket.instances.length).toBe(countAfterFirst);
    });
});

describe("ReconnectingWebSocket listener management", () => {
    it("supports addEventListener, dispatchEvent and removeEventListener", async () => {
        const rws = makeRws({ startClosed: true });
        const calls: string[] = [];
        const fnListener = () => {
            calls.push("fn");
        };
        const objListener = {
            handleEvent: () => {
                calls.push("obj");
            },
        };

        rws.addEventListener("open", fnListener);
        rws.addEventListener("open", objListener as never);
        rws.dispatchEvent({ type: "open", target: rws } as never);
        expect(calls).toEqual(["fn", "obj"]);

        rws.removeEventListener("open", fnListener);
        rws.dispatchEvent({ type: "open", target: rws } as never);
        expect(calls).toEqual(["fn", "obj", "obj"]);
    });

    it("startClosed reports CLOSED and does not connect", async () => {
        const rws = makeRws({ startClosed: true });
        await settle();
        expect(rws.readyState).toBe(rws.CLOSED);
        expect(MockWebSocket.instances).toHaveLength(0);
        // unconnected getters return defaults
        expect(rws.extensions).toBe("");
        expect(rws.protocol).toBe("");
        expect(rws.url).toBe("");
        expect(rws.binaryType).toBe("blob");
    });

    it("ignores add/remove/dispatch for unknown event types", async () => {
        const rws = makeRws({ startClosed: true });
        rws.addEventListener("bogus" as never, (() => {}) as never);
        rws.removeEventListener("bogus" as never, (() => {}) as never);
        expect(rws.dispatchEvent({ type: "bogus", target: rws } as never)).toBe(true);
    });
});

describe("ReconnectingWebSocket reconnect and retry limits", () => {
    it("reconnect() disconnects an open socket and connects again", async () => {
        const rws = makeRws();
        await settle();
        MockWebSocket.instances[0]!.emitOpen();
        rws.reconnect(1000, "cycling");
        await settle();
        expect(MockWebSocket.instances[0]!.closeArgs.length).toBeGreaterThan(0);
    });

    it("stops after maxRetries consecutive abnormal closes", async () => {
        const rws = makeRws({ maxRetries: 1 });
        await settle();
        rws.onerror = () => {};
        MockWebSocket.instances[0]!.emitOpen();
        // retryCount is 0; first abnormal close reconnects (retryCount -> 1)
        MockWebSocket.instances[0]!.emit("close", { type: "close", code: 1006, target: null });
        await settle();
        const afterFirst = MockWebSocket.instances.length;
        // second abnormal close hits retryCount >= maxRetries and stops
        MockWebSocket.instances.at(-1)!.emit("close", { type: "close", code: 1006, target: null });
        await settle();
        expect(MockWebSocket.instances.length).toBe(afterFirst);
    });

    it("throws synchronously when no valid WebSocket class is available", () => {
        expect(
            () =>
                new ReconnectingWebSocket({
                    url: "wss://x",
                    options: { WebSocket: {} as never },
                }),
        ).toThrow("No valid WebSocket class provided");
    });
});

describe("ReconnectingWebSocket url providers", () => {
    it("accepts a function url provider", async () => {
        const rws = makeRws({}, { url: (() => "wss://fn.example.com/x") as unknown as string });
        await settle();
        expect(MockWebSocket.instances[0]!.url).toBe("wss://fn.example.com/x");
        rws.close();
    });

    it("accepts an async function url provider and appends query parameters", async () => {
        const rws = makeRws(
            {},
            {
                url: (() => Promise.resolve("wss://async.example.com/x")) as unknown as string,
                queryParameters: { model: "nova-3", tag: ["a", "b"] },
            },
        );
        await settle();
        expect(MockWebSocket.instances[0]!.url).toContain("wss://async.example.com/x?");
        expect(MockWebSocket.instances[0]!.url).toContain("model=nova-3");
        rws.close();
    });
});

describe("ReconnectingWebSocket abort handling", () => {
    it("aborts an in-flight connection when the signal fires", async () => {
        const controller = new AbortController();
        const rws = makeRws({}, { abortSignal: controller.signal });
        await settle();
        MockWebSocket.instances[0]!.emitOpen();
        controller.abort();
        expect(MockWebSocket.instances[0]!.closeArgs.at(-1)?.reason).toBe("aborted");
        expect(rws.onclose).toBeNull();
    });
});
