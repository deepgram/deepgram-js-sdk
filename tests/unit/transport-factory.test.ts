import { describe, expect, it } from "vitest";

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

describe("transportFactory", () => {
    it("routes listen websocket connections through the custom transport", async () => {
        const created: Array<{ url: string; headers: Record<string, string>; request: { service: string } }> = [];
        const transport = new FakeTransport();

        const transportFactory: DeepgramTransportFactory = (url, headers, request) => {
            created.push({ url, headers, request: { service: request.service } });
            return transport;
        };

        const client = new DeepgramClient({
            apiKey: "test-api-key",
            transportFactory,
        });

        const socket = await client.listen.v1.createConnection({ model: "nova-3" });
        let opened = false;
        let receivedType: string | undefined;

        socket.on("open", () => {
            opened = true;
        });
        socket.on("message", (message: any) => {
            receivedType = message.type;
        });

        socket.connect();
        await Promise.resolve();

        expect(created).toHaveLength(1);
        expect(created[0]?.url).toContain("wss://api.deepgram.com/v1/listen");
        expect(created[0]?.url).toContain("model=nova-3");
        expect(created[0]?.headers.Authorization ?? created[0]?.headers.authorization).toBe("Token test-api-key");
        expect(created[0]?.headers["x-deepgram-session-id"]).toBeTruthy();
        expect(created[0]?.request.service).toBe("listen.v1");

        transport.emitOpen();
        expect(opened).toBe(true);

        socket.sendMedia(new Uint8Array([1, 2, 3]));
        expect(transport.sent).toHaveLength(1);
        expect(transport.sent[0]).toBeInstanceOf(Uint8Array);

        transport.emitMessage('{"type":"Results"}');
        expect(receivedType).toBe("Results");

        socket.close();
        expect(transport.closed).toBe(true);
    });

    it("exposes transport ping through listen.v2 sockets when available", async () => {
        const transport = new FakeTransport();
        const client = new DeepgramClient({
            apiKey: "test-api-key",
            transportFactory: () => transport,
        });

        const socket = await client.listen.v2.createConnection({ model: "flux-general-en" });
        socket.connect();
        await Promise.resolve();
        transport.emitOpen();

        socket.ping("keepalive");
        expect(transport.pingPayloads).toEqual(["keepalive"]);
    });
});
