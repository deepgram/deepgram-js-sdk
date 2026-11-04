import { CloseEvent, ErrorEvent } from "../../../src/core/websocket/events";
import { ReconnectingWebSocket } from "../../../src/core/websocket/ws";

type Listener = (event: unknown) => void;

class FakeWebSocket {
    public static readonly CONNECTING = 0;
    public static readonly OPEN = 1;
    public static readonly CLOSING = 2;
    public static readonly CLOSED = 3;

    public static instances: FakeWebSocket[] = [];

    public readyState = FakeWebSocket.CONNECTING;
    public binaryType: BinaryType = "blob";
    public bufferedAmount = 0;
    public extensions = "";
    public protocol = "";
    public readonly url: string;
    public closeCalls: { code?: number; reason?: string }[] = [];
    private listeners: Record<string, Listener[]> = {};
    private emitterListeners: Record<string, Listener[]> = {};

    constructor(url: string) {
        this.url = url;
        FakeWebSocket.instances.push(this);
    }

    public addEventListener(type: string, listener: Listener): void {
        (this.listeners[type] ??= []).push(listener);
    }

    // EventEmitter-style API used by the `ws` package (and by the unexpected-response patch).
    public on(type: string, listener: Listener): void {
        (this.emitterListeners[type] ??= []).push(listener);
    }

    public simulateUnexpectedResponse(response: FakeIncomingMessage): void {
        for (const listener of [...(this.emitterListeners["unexpected-response"] ?? [])]) {
            (listener as (req: unknown, res: unknown) => void)({}, response);
        }
    }

    public removeEventListener(type: string, listener: Listener): void {
        this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== listener);
    }

    public send(): void {}

    public close(code?: number, reason?: string): void {
        this.closeCalls.push({ code, reason });
        this.readyState = FakeWebSocket.CLOSED;
    }

    public simulateOpen(): void {
        this.readyState = FakeWebSocket.OPEN;
        this.dispatch("open", { type: "open" });
    }

    public simulateError(message = "connect ECONNREFUSED"): void {
        this.dispatch("error", new ErrorEvent(new Error(message), this));
    }

    public simulateServerClose(code: number, reason = ""): void {
        this.readyState = FakeWebSocket.CLOSED;
        this.dispatch("close", new CloseEvent(code, reason, this));
    }

    private dispatch(type: string, event: unknown): void {
        for (const listener of [...(this.listeners[type] ?? [])]) {
            listener(event);
        }
    }
}

// Minimal stand-in for Node's http.IncomingMessage as seen by the `unexpected-response` handler.
class FakeIncomingMessage {
    private dataListeners: ((chunk: string) => void)[] = [];
    private endListeners: (() => void)[] = [];
    public destroyed = false;

    constructor(
        public readonly statusCode: number,
        public readonly headers: Record<string, string | string[] | undefined>,
        private readonly body = "",
    ) {}

    public setEncoding(_encoding: string): void {}

    public on(type: string, listener: (...args: any[]) => void): this {
        if (type === "data") this.dataListeners.push(listener);
        if (type === "end") this.endListeners.push(listener);
        return this;
    }

    public destroy(): void {
        this.destroyed = true;
    }

    // Emit the buffered body then end, as a real response stream would.
    public flush(): void {
        if (this.body) this.dataListeners.forEach((l) => l(this.body));
        this.endListeners.forEach((l) => l());
    }
}

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

const createSocket = (options: ReconnectingWebSocket.Options = {}): ReconnectingWebSocket =>
    new ReconnectingWebSocket({
        url: "ws://localhost/test",
        options: {
            WebSocket: FakeWebSocket,
            minReconnectionDelay: 0,
            maxReconnectionDelay: 0,
            ...options,
        },
    });

describe("ReconnectingWebSocket reconnect policy", () => {
    let socket: ReconnectingWebSocket | undefined;

    beforeEach(() => {
        FakeWebSocket.instances = [];
    });

    afterEach(() => {
        socket?.close();
        socket = undefined;
    });

    const openInitialConnection = async (options?: ReconnectingWebSocket.Options): Promise<FakeWebSocket> => {
        socket = createSocket(options);
        await flush();
        expect(FakeWebSocket.instances).toHaveLength(1);
        const ws = FakeWebSocket.instances[0] as FakeWebSocket;
        ws.simulateOpen();
        return ws;
    };

    it("does not reconnect after a normal closure (1000) by default", async () => {
        const ws = await openInitialConnection();
        const onClose = vi.fn();
        socket?.addEventListener("close", onClose);

        ws.simulateServerClose(1000);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("reconnects after a non-1000 close (1005) by default", async () => {
        const ws = await openInitialConnection();

        ws.simulateServerClose(1005);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(2);
        expect(socket?.retryCount).toBe(1);
    });

    it("reconnects after a connection error by default", async () => {
        socket = createSocket();
        await flush();
        expect(FakeWebSocket.instances).toHaveLength(1);
        const onError = vi.fn();
        socket.addEventListener("error", onError);

        (FakeWebSocket.instances[0] as FakeWebSocket).simulateError();
        await flush();

        expect(onError).toHaveBeenCalledTimes(1);
        expect(FakeWebSocket.instances).toHaveLength(2);
        expect(socket.retryCount).toBe(1);
    });

    it("does not reconnect after an error once close() was called", async () => {
        const ws = await openInitialConnection();

        socket?.close();
        ws.simulateError();
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(1);
    });

    it("reconnects after an abnormal close (1006) by default", async () => {
        const ws = await openInitialConnection();

        ws.simulateServerClose(1006);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it("does not reconnect when shouldReconnect returns false", async () => {
        const shouldReconnect = vi.fn((_event: CloseEvent) => false);
        const ws = await openInitialConnection({ shouldReconnect });
        const onClose = vi.fn();
        socket?.addEventListener("close", onClose);

        ws.simulateServerClose(1005, "stream finished");
        await flush();

        expect(shouldReconnect).toHaveBeenCalledTimes(1);
        expect(shouldReconnect.mock.calls[0]?.[0]).toMatchObject({ code: 1005, reason: "stream finished" });
        expect(FakeWebSocket.instances).toHaveLength(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("reconnects on 1000 when shouldReconnect returns true", async () => {
        const ws = await openInitialConnection({ shouldReconnect: () => true });

        ws.simulateServerClose(1000);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it("reconnects when explicitly requested despite a false close policy", async () => {
        await openInitialConnection({ shouldReconnect: () => false });

        socket?.reconnect();
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it("supports a stateful predicate that becomes terminal after a client-side end-of-stream", async () => {
        let streamEnded = false;
        const ws = await openInitialConnection({
            shouldReconnect: (event) => !streamEnded && event.code !== 1000,
        });

        ws.simulateServerClose(1005);
        await flush();
        expect(FakeWebSocket.instances).toHaveLength(2);

        const reconnected = FakeWebSocket.instances[1] as FakeWebSocket;
        reconnected.simulateOpen();
        streamEnded = true;
        reconnected.simulateServerClose(1005);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it("treats a throwing shouldReconnect as terminal", async () => {
        const ws = await openInitialConnection({
            shouldReconnect: () => {
                throw new Error("boom");
            },
        });

        ws.simulateServerClose(1005);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(1);
    });

    it("never reconnects after close() regardless of shouldReconnect", async () => {
        const shouldReconnect = vi.fn(() => true);
        const ws = await openInitialConnection({ shouldReconnect });

        socket?.close();
        ws.simulateServerClose(1000);
        await flush();

        expect(shouldReconnect).not.toHaveBeenCalled();
        expect(FakeWebSocket.instances).toHaveLength(1);
    });

    it("does not reconnect when maxRetries is 0", async () => {
        const ws = await openInitialConnection({ maxRetries: 0 });

        ws.simulateServerClose(1005);
        await flush();

        expect(FakeWebSocket.instances).toHaveLength(1);
    });

    describe("rejected handshake (unexpected-response)", () => {
        it("surfaces the dg-error header in the error message", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);

            const ws = FakeWebSocket.instances[0] as FakeWebSocket;
            const response = new FakeIncomingMessage(
                400,
                { "dg-error": "Unknown query parameters: vad_events" },
                '{"err_code":"INVALID_QUERY_PARAMETER","err_msg":"Unknown query parameters: vad_events"}',
            );
            ws.simulateUnexpectedResponse(response);
            response.flush();
            await flush();

            expect(onError).toHaveBeenCalledTimes(1);
            const event = onError.mock.calls[0]?.[0] as ErrorEvent;
            expect(event.message).toBe("Unexpected server response: 400 (Unknown query parameters: vad_events)");
            expect(response.destroyed).toBe(true);
        });

        it("falls back to the response body when no dg-error header is present", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);

            const ws = FakeWebSocket.instances[0] as FakeWebSocket;
            const response = new FakeIncomingMessage(503, {}, "service unavailable");
            ws.simulateUnexpectedResponse(response);
            response.flush();
            await flush();

            const event = onError.mock.calls[0]?.[0] as ErrorEvent;
            expect(event.message).toBe("Unexpected server response: 503 (service unavailable)");
        });
    });
});
