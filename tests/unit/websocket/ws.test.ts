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

    public on(type: string, listener: Listener): void {
        (this.emitterListeners[type] ??= []).push(listener);
    }

    public removeListener(type: string, listener: Listener): void {
        this.emitterListeners[type] = (this.emitterListeners[type] ?? []).filter((candidate) => candidate !== listener);
    }

    public simulateUnexpectedResponse(response: FakeIncomingMessage): void {
        for (const listener of [...(this.emitterListeners["unexpected-response"] ?? [])]) {
            (listener as (request: unknown, response: FakeIncomingMessage) => void)({}, response);
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

class FakeIncomingMessage {
    private listeners: Record<string, Array<(...args: unknown[]) => void>> = {};
    public destroyed = false;

    constructor(
        public readonly statusCode: number,
        public readonly headers: Record<string, string | string[]>,
        private readonly body: string,
    ) {}

    public setEncoding(_encoding: string): void {}

    public on(type: string, listener: (...args: unknown[]) => void): void {
        (this.listeners[type] ??= []).push(listener);
    }

    public destroy(): void {
        this.destroyed = true;
    }

    public flush(): void {
        for (const listener of this.listeners.data ?? []) {
            listener(this.body);
        }
        for (const listener of this.listeners.end ?? []) {
            listener();
        }
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

    describe("rejected handshakes", () => {
        it("exposes the status, headers, and body from a rejected handshake", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);
            const opened = socket.waitForOpen().catch((error: unknown) => error);

            const response = new FakeIncomingMessage(
                401,
                { "dg-request-id": "request-123" },
                '{"err_code":"INVALID_AUTH","err_msg":"Invalid credentials"}',
            );
            (FakeWebSocket.instances[0] as FakeWebSocket).simulateUnexpectedResponse(response);
            response.flush();

            const event = (await opened) as ErrorEvent;
            expect(onError).toHaveBeenCalledWith(event);
            expect(event).toMatchObject({
                statusCode: 401,
                headers: { "dg-request-id": "request-123" },
                body: '{"err_code":"INVALID_AUTH","err_msg":"Invalid credentials"}',
            });
            expect(response.destroyed).toBe(true);
        });

        it("redacts cookies from rejected handshake headers", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);
            const response = new FakeIncomingMessage(
                401,
                { "dg-request-id": "request-123", "Set-Cookie": ["session=secret", "csrf=secret"] },
                "invalid credentials",
            );

            (FakeWebSocket.instances[0] as FakeWebSocket).simulateUnexpectedResponse(response);
            response.flush();

            const event = onError.mock.calls[0]?.[0] as ErrorEvent;
            expect(event.headers).toEqual({ "dg-request-id": "request-123", "Set-Cookie": "[REDACTED]" });
        });

        it("caps a rejected handshake body at 1,000 characters", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);
            const response = new FakeIncomingMessage(502, {}, "x".repeat(1001));

            (FakeWebSocket.instances[0] as FakeWebSocket).simulateUnexpectedResponse(response);
            response.flush();
            await flush();

            const event = onError.mock.calls[0]?.[0] as ErrorEvent;
            expect(event.body).toHaveLength(1000);
            expect(event.message).toBe(`Unexpected server response: 502 (${"x".repeat(1000)}...)`);
        });

        it("does not emit a rejected-handshake error after close()", async () => {
            socket = createSocket({ maxRetries: 0 });
            await flush();
            const onError = vi.fn();
            socket.addEventListener("error", onError);
            socket.close();
            const response = new FakeIncomingMessage(401, {}, "invalid credentials");

            (FakeWebSocket.instances[0] as FakeWebSocket).simulateUnexpectedResponse(response);
            response.flush();
            await flush();

            expect(response.destroyed).toBe(true);
            expect(onError).not.toHaveBeenCalled();
        });
    });
});
