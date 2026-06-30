import { afterEach, describe, expect, it, vi } from "vitest";
import { DeepgramClient, type DeepgramTransport, type DeepgramTransportFactory } from "../../src";

type ListenerMap = {
    open?: () => void;
    message?: (message: string | ArrayBuffer | Blob | ArrayBufferView) => void;
    error?: (error: Error) => void;
    close?: (event: { code?: number; reason?: string }) => void;
};

class FakeTransport implements DeepgramTransport {
    public readonly listeners: ListenerMap = {};
    public readonly sent: Array<string | ArrayBuffer | Blob | ArrayBufferView> = [];
    public closed = false;
    public closeArgs: Array<{ code?: number; reason?: string }> = [];
    public pingPayloads: Array<string | ArrayBuffer | Blob | ArrayBufferView | undefined> = [];
    private open = false;

    public send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
        this.sent.push(data);
    }
    public onOpen(listener: () => void): void {
        this.listeners.open = listener;
    }
    public onMessage(listener: (message: string | ArrayBuffer | Blob | ArrayBufferView) => void): void {
        this.listeners.message = listener;
    }
    public onError(listener: (error: Error) => void): void {
        this.listeners.error = listener;
    }
    public onClose(listener: (event: { code?: number; reason?: string }) => void): void {
        this.listeners.close = listener;
    }
    public isOpen(): boolean {
        return this.open;
    }
    public close(code?: number, reason?: string): void {
        this.closed = true;
        this.open = false;
        this.closeArgs.push({ code, reason });
        this.listeners.close?.({ code, reason });
    }
    public ping(data?: string | ArrayBuffer | Blob | ArrayBufferView): void {
        this.pingPayloads.push(data);
    }
    public emitOpen(): void {
        this.open = true;
        this.listeners.open?.();
    }
    public emitMessage(message: string | ArrayBuffer | Blob | ArrayBufferView): void {
        this.listeners.message?.(message);
    }
}

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

interface Harness {
    client: DeepgramClient;
    transports: FakeTransport[];
    created: Array<{ url: string; headers: Record<string, string> }>;
}

function makeClient(opts: Record<string, unknown> = {}): Harness {
    const transports: FakeTransport[] = [];
    const created: Array<{ url: string; headers: Record<string, string> }> = [];
    const transportFactory: DeepgramTransportFactory = (url, headers) => {
        created.push({ url, headers });
        const t = new FakeTransport();
        transports.push(t);
        return t;
    };
    const client = new DeepgramClient({
        apiKey: "test-api-key",
        transportFactory,
        reconnect: true,
        ...opts,
    });
    return { client, transports, created };
}

async function makeAdapter(clientOpts: Record<string, unknown> = {}, connectArgs: Record<string, unknown> = {}) {
    const harness = makeClient(clientOpts);
    const wrapped = await harness.client.listen.v1.createConnection({ model: "nova-3", ...connectArgs });
    const adapter = (wrapped as any).socket;
    return { ...harness, wrapped, adapter };
}

afterEach(() => {
    vi.useRealTimers();
});

describe("TransportWebSocketAdapter getters", () => {
    it("exposes default getter values without connecting", async () => {
        const { adapter } = await makeAdapter();
        expect(adapter.readyState).toBe(adapter.CLOSED);
        expect(adapter.extensions).toBe("");
        expect(adapter.protocol).toBe("");
        expect(adapter.retryCount).toBe(0);
        expect(adapter.url).toContain("/v1/listen");
        expect(adapter.binaryType).toBe("blob");
        adapter.binaryType = "arraybuffer";
        expect(adapter.binaryType).toBe("arraybuffer");
    });

    it("computes bufferedAmount across string, Blob and ArrayBufferView", async () => {
        const { adapter } = await makeAdapter();
        adapter.send("abc"); // 3
        adapter.send(new Uint8Array([1, 2, 3, 4])); // 4
        adapter.send(new Blob(["xy"])); // 2
        expect(adapter.bufferedAmount).toBe(9);
    });

    it("returns the first protocol when protocols are supplied", async () => {
        const { adapter } = await makeAdapter({}, { protocols: ["graphql-ws", "other"] });
        expect(adapter.protocol).toBe("graphql-ws");
    });
});

describe("TransportWebSocketAdapter event listeners", () => {
    it("dispatches to function and handleEvent-object listeners and supports removal", async () => {
        const { adapter } = await makeAdapter();
        const fnCalls: string[] = [];
        const fnListener = () => fnCalls.push("fn");
        const objListener = { handleEvent: () => fnCalls.push("obj") };

        adapter.addEventListener("open", fnListener);
        adapter.addEventListener("open", objListener);
        adapter.dispatchEvent({ type: "open", target: adapter });
        expect(fnCalls).toEqual(["fn", "obj"]);

        adapter.removeEventListener("open", fnListener);
        adapter.dispatchEvent({ type: "open", target: adapter });
        expect(fnCalls).toEqual(["fn", "obj", "obj"]);
    });

    it("dispatchEvent for an unknown type is a no-op that returns true", async () => {
        const { adapter } = await makeAdapter();
        expect(adapter.dispatchEvent({ type: "nope", target: adapter })).toBe(true);
    });
});

describe("TransportWebSocketAdapter lifecycle", () => {
    it("flushes queued messages on open and forwards messages", async () => {
        const { adapter, transports } = await makeAdapter();
        const messages: unknown[] = [];
        adapter.onmessage = (event: MessageEvent) => messages.push(event.data);

        adapter.send("queued-before-open");
        adapter.reconnect();
        await flush();
        const transport = transports[transports.length - 1]!;

        transport.emitOpen();
        expect(transport.sent).toContain("queued-before-open");

        transport.emitMessage("live");
        expect(messages).toContain("live");
    });

    it("reconnects after a non-1000 close and stops after a 1000 close", async () => {
        const { adapter, transports } = await makeAdapter({}, { reconnectAttempts: 5 });
        adapter.onerror = () => {};
        adapter.reconnect();
        await flush();
        expect(transports).toHaveLength(1);

        // abnormal close -> should reconnect
        transports[0]!.listeners.close?.({ code: 1006, reason: "abnormal" });
        await flush();
        expect(transports).toHaveLength(2);

        // normal close -> should NOT reconnect
        transports[1]!.listeners.close?.({ code: 1000, reason: "bye" });
        await flush();
        expect(transports).toHaveLength(2);
    });

    it("reconnects after a transport error", async () => {
        const { adapter, transports } = await makeAdapter({}, { reconnectAttempts: 5 });
        adapter.onerror = () => {};
        adapter.reconnect();
        await flush();
        transports[0]!.listeners.error?.(new Error("boom"));
        await flush();
        expect(transports).toHaveLength(2);
    });

    it("stops retrying once reconnectAttempts is exhausted", async () => {
        const { adapter, transports } = await makeAdapter({}, { reconnectAttempts: 0 });
        adapter.onerror = () => {};
        adapter.reconnect();
        await flush();
        expect(transports).toHaveLength(1);
        transports[0]!.listeners.error?.(new Error("boom"));
        await flush();
        // max retries reached -> no new transport
        expect(transports).toHaveLength(1);
    });

    it("close() before any transport exists transitions straight to CLOSED", async () => {
        const { adapter } = await makeAdapter();
        adapter.close(1000, "done");
        expect(adapter.readyState).toBe(adapter.CLOSED);
    });

    it("close() tears down an active transport", async () => {
        const { adapter, transports } = await makeAdapter();
        adapter.reconnect();
        await flush();
        transports[0]!.emitOpen();
        adapter.close(1000, "done");
        expect(transports[0]!.closed).toBe(true);
        expect(adapter.readyState).toBe(adapter.CLOSED);
    });
});

describe("TransportWebSocketAdapter abort handling", () => {
    it("emits close when the abort signal fires", async () => {
        const controller = new AbortController();
        const { adapter } = await makeAdapter({}, { abortSignal: controller.signal, debug: true });
        let closeEvent: { code: number; reason: string } | undefined;
        adapter.onclose = (event: { code: number; reason: string }) => {
            closeEvent = event;
        };
        controller.abort();
        expect(closeEvent?.code).toBe(1000);
        expect(closeEvent?.reason).toBe("aborted");
        expect(adapter.readyState).toBe(adapter.CLOSED);
    });
});

describe("TransportWebSocketAdapter connect timeout", () => {
    it("fires an error when the connection times out", async () => {
        vi.useFakeTimers();
        const { adapter, transports } = await makeAdapter({}, { connectionTimeoutInSeconds: 1 });
        const errors: Error[] = [];
        adapter.onerror = (event: { error: Error }) => errors.push(event.error);

        adapter.reconnect();
        await vi.advanceTimersByTimeAsync(0); // let the factory promise resolve
        expect(transports).toHaveLength(1);
        // transport never opens; advance past the 1s timeout
        await vi.advanceTimersByTimeAsync(1100);
        expect(errors.some((e) => e.message === "TIMEOUT")).toBe(true);
    });
});

describe("auth provider wrappers (via transport headers)", () => {
    // The transport factory only runs when the socket actually connects, so we
    // trigger a connect and read the Authorization header it was handed.
    async function authHeaderFor(clientOpts: Record<string, unknown>): Promise<string | undefined> {
        const { adapter, created } = await makeAdapter(clientOpts);
        adapter.reconnect();
        await flush();
        return created[0]?.headers.Authorization ?? created[0]?.headers.authorization;
    }

    it("prefixes a bare api key with 'Token '", async () => {
        expect(await authHeaderFor({})).toBe("Token test-api-key");
    });

    it("does not stack a second Token prefix on the provider output", async () => {
        // HeaderAuthProvider already returns "Token <key>"; the wrapper must
        // recognize the existing scheme and not produce "Token Token <key>".
        expect(await authHeaderFor({ apiKey: "plain-key" })).toBe("Token plain-key");
    });

    it("uses a Bearer scheme when an accessToken is provided", async () => {
        expect(await authHeaderFor({ accessToken: "my-access-token" })).toBe("Bearer my-access-token");
    });

    it("falls back to the api key when the accessToken supplier resolves nullish", async () => {
        expect(await authHeaderFor({ accessToken: () => undefined })).toBe("Token test-api-key");
    });
});

describe("CustomDeepgramClient surface", () => {
    it("exposes a stable session id and reconnect flag", () => {
        const client = new DeepgramClient({
            apiKey: "k",
            transportFactory: () => new FakeTransport(),
            reconnect: true,
        });
        expect(client.sessionId).toMatch(/[0-9a-f-]{36}/i);
        expect(client.reconnect).toBe(true);
        // getters are memoized
        expect(client.listen).toBe(client.listen);
        expect(client.agent).toBe(client.agent);
        expect(client.speak).toBe(client.speak);
    });
});
