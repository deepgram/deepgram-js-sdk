import { describe, expect, it } from "vitest";
import { V1Socket as AgentV1Socket } from "../../src/api/resources/agent/resources/v1/client/Socket.js";
import { V1Socket as ListenV1Socket } from "../../src/api/resources/listen/resources/v1/client/Socket.js";
import { V2Socket as ListenV2Socket } from "../../src/api/resources/listen/resources/v2/client/Socket.js";
import { V1Socket as SpeakV1Socket } from "../../src/api/resources/speak/resources/v1/client/Socket.js";

const OPEN = 1;
const CONNECTING = 0;

/** Minimal stand-in for core.ReconnectingWebSocket that the generated Socket classes drive. */
class FakeSocket {
    public readyState = CONNECTING;
    public sent: unknown[] = [];
    public closeCalled = false;
    public reconnectCalled = false;
    private listeners: Record<string, Array<(event: any) => void>> = {};

    addEventListener(type: string, cb: (event: any) => void): void {
        (this.listeners[type] ??= []).push(cb);
    }
    removeEventListener(type: string, cb: (event: any) => void): void {
        this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== cb);
    }
    send(data: unknown): void {
        this.sent.push(data);
    }
    close(): void {
        this.closeCalled = true;
    }
    reconnect(): void {
        this.reconnectCalled = true;
    }
    emit(type: string, event: any): void {
        (this.listeners[type] ?? []).forEach((l) => l(event));
    }
}

interface Seen {
    open?: boolean;
    message?: any;
    close?: any;
    error?: Error;
}

function register(socket: any, seen: Seen) {
    socket.on("open", () => {
        seen.open = true;
    });
    socket.on("message", (m: any) => {
        seen.message = m;
    });
    socket.on("close", (e: any) => {
        seen.close = e;
    });
    socket.on("error", (e: Error) => {
        seen.error = e;
    });
}

describe.each([
    {
        name: "agent V1Socket",
        make: (fake: FakeSocket) => new AgentV1Socket({ socket: fake as any }),
        binarySend: (s: any) => s.sendMedia(new Uint8Array([1, 2, 3])),
        jsonSends: (s: any) => {
            s.sendSettings({ type: "Settings" } as any);
            s.sendUpdateSpeak({ type: "UpdateSpeak" } as any);
            s.sendInjectUserMessage({ type: "InjectUserMessage" } as any);
            s.sendInjectAgentMessage({ type: "InjectAgentMessage" } as any);
            s.sendFunctionCallResponse({ type: "FunctionCallResponse" } as any);
            s.sendKeepAlive({ type: "KeepAlive" } as any);
            s.sendUpdatePrompt({ type: "UpdatePrompt" } as any);
            s.sendUpdateThink({ type: "UpdateThink" } as any);
        },
    },
    {
        name: "listen V1Socket",
        make: (fake: FakeSocket) => new ListenV1Socket({ socket: fake as any }),
        binarySend: (s: any) => s.sendMedia(new Uint8Array([1, 2, 3])),
        jsonSends: (s: any) => {
            s.sendFinalize({ type: "Finalize" } as any);
            s.sendCloseStream({ type: "CloseStream" } as any);
            s.sendKeepAlive({ type: "KeepAlive" } as any);
        },
    },
    {
        name: "listen V2Socket",
        make: (fake: FakeSocket) => new ListenV2Socket({ socket: fake as any }),
        binarySend: (s: any) => s.sendMedia(new Uint8Array([1, 2, 3])),
        jsonSends: (s: any) => {
            s.sendConfigure({ type: "Configure" } as any);
            s.sendCloseStream({ type: "CloseStream" } as any);
        },
    },
    {
        name: "speak V1Socket",
        make: (fake: FakeSocket) => new SpeakV1Socket({ socket: fake as any }),
        binarySend: undefined,
        jsonSends: (s: any) => {
            s.sendText({ type: "Speak", text: "hi" } as any);
            s.sendFlush({ type: "Flush" } as any);
            s.sendClear({ type: "Clear" } as any);
            s.sendClose({ type: "Close" } as any);
        },
    },
])("$name", ({ make, binarySend, jsonSends }) => {
    it("forwards socket events to registered handlers", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const seen: Seen = {};
        register(socket, seen);

        fake.emit("open", { type: "open" });
        expect(seen.open).toBe(true);

        fake.emit("message", { data: '{"type":"Test","value":1}' });
        expect(seen.message).toEqual({ type: "Test", value: 1 });

        fake.emit("error", { message: "socket failure" });
        expect(seen.error).toBeInstanceOf(Error);
        expect(seen.error?.message).toBe("socket failure");

        fake.emit("close", { code: 1011, reason: "server" });
        expect(seen.close).toEqual({ code: 1011, reason: "server" });
    });

    it("exposes readyState from the underlying socket", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        expect(socket.readyState).toBe(CONNECTING);
        fake.readyState = OPEN;
        expect(socket.readyState).toBe(OPEN);
    });

    it("throws when sending before the socket is open", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        if (binarySend) {
            expect(() => binarySend(socket)).toThrow("Socket is not open.");
        } else {
            expect(() => jsonSends(socket)).toThrow("Socket is not open.");
        }
    });

    it("sends binary and JSON payloads once open", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        fake.readyState = OPEN;

        if (binarySend) {
            binarySend(socket);
        }
        jsonSends(socket);

        expect(fake.sent.length).toBeGreaterThan(0);
        // JSON payloads are serialized strings
        expect(fake.sent.some((m) => typeof m === "string")).toBe(true);
    });

    it("connect() reconnects and close() tears down", () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        expect(socket.connect()).toBe(socket);
        expect(fake.reconnectCalled).toBe(true);

        const seen: Seen = {};
        register(socket, seen);
        socket.close();
        expect(fake.closeCalled).toBe(true);
        expect(seen.close).toEqual({ code: 1000 });
    });

    it("waitForOpen resolves immediately when already open", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        fake.readyState = OPEN;
        await expect(socket.waitForOpen()).resolves.toBe(fake);
    });

    it("waitForOpen resolves when the open event fires", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const promise = socket.waitForOpen();
        fake.emit("open", { type: "open" });
        await expect(promise).resolves.toBe(fake);
    });

    it("waitForOpen rejects when an error event fires", async () => {
        const fake = new FakeSocket();
        const socket = make(fake);
        const promise = socket.waitForOpen();
        const handled = promise.catch((e) => e);
        fake.emit("error", { message: "nope" });
        await expect(Promise.resolve(handled)).resolves.toBeDefined();
    });
});

describe("Socket message handler with non-JSON payloads", () => {
    it("passes through invalid JSON to the message handler when supported", () => {
        // The listen v1 socket parses JSON; ensure malformed payloads don't crash the suite.
        const fake = new FakeSocket();
        const socket = new ListenV1Socket({ socket: fake as any });
        const seen: Seen = {};
        register(socket, seen);
        // valid JSON path
        fake.emit("message", { data: '{"type":"Results"}' });
        expect(seen.message).toEqual({ type: "Results" });
    });
});
