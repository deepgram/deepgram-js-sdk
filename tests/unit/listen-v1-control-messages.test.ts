import { describe, expect, it } from "vitest";
import { DeepgramClient, type DeepgramTransport, type DeepgramTransportFactory } from "../../src";
import type { Deepgram } from "../../src";

type ListenerMap = {
    open?: () => void;
    message?: (message: string | ArrayBuffer | Blob | ArrayBufferView) => void;
    close?: (event: { code?: number; reason?: string }) => void;
};

class FakeTransport implements DeepgramTransport {
    public readonly listeners: ListenerMap = {};
    public readonly sent: Array<string | ArrayBuffer | Blob | ArrayBufferView> = [];
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
    public onError(): void {}
    public onClose(listener: (event: { code?: number; reason?: string }) => void): void {
        this.listeners.close = listener;
    }
    public isOpen(): boolean {
        return this.open;
    }
    public close(code?: number, reason?: string): void {
        this.open = false;
        this.listeners.close?.({ code, reason });
    }
    public ping(): void {}
    public emitOpen(): void {
        this.open = true;
        this.listeners.open?.();
    }
    public emitMessage(message: string): void {
        this.listeners.message?.(message);
    }
}

const openSocket = async () => {
    const transport = new FakeTransport();
    const transportFactory: DeepgramTransportFactory = () => transport;
    const client = new DeepgramClient({ apiKey: "test-api-key", transportFactory });
    const socket = await client.listen.v1.createConnection({ model: "nova-3" });
    socket.connect();
    await Promise.resolve();
    transport.emitOpen();
    return { socket, transport };
};

describe("listen v1 control messages", () => {
    it("sendConfigure serializes keyterms and formatting features", async () => {
        const { socket, transport } = await openSocket();

        socket.sendConfigure({
            type: "Configure",
            keyterms: ["Deepgram", "voice AI"],
            features: { numerals: true, punctuate: false },
        });

        expect(JSON.parse(transport.sent[0] as string)).toEqual({
            type: "Configure",
            keyterms: ["Deepgram", "voice AI"],
            features: { numerals: true, punctuate: false },
        });
    });

    it("sendConfigure represents clearing keyterms with an empty array", async () => {
        const { socket, transport } = await openSocket();

        socket.sendConfigure({ type: "Configure", keyterms: [] });

        expect(JSON.parse(transport.sent[0] as string)).toEqual({ type: "Configure", keyterms: [] });
    });

    it("delivers typed Configure errors through on(message)", async () => {
        const { socket, transport } = await openSocket();
        let received: Deepgram.listen.ListenV1Error | undefined;
        socket.on("message", (message) => {
            if (message.type === "Error") {
                received = message;
            }
        });

        transport.emitMessage(
            JSON.stringify({
                type: "Error",
                variant: "InvalidConfigureMessage",
                code: "KeytermsNotSupported",
                description: "keyterms are only supported for Nova-3",
            }),
        );

        expect(received).toEqual({
            type: "Error",
            variant: "InvalidConfigureMessage",
            code: "KeytermsNotSupported",
            description: "keyterms are only supported for Nova-3",
        });
    });
});
