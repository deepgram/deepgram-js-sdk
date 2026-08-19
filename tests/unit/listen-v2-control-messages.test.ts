import { describe, expect, it } from "vitest";
import { DeepgramClient, type DeepgramTransport, type DeepgramTransportFactory } from "../../src";

/**
 * Wire-level coverage for the listen v2 control messages, driven through a fake transport
 * so the assertions are on the actual frames the SDK emits — no network.
 *
 * `ForceEndTurn` arrived in the 2026-08-19 regen with no test of its own. It is also not
 * yet enabled server-side (sending it to production returns `UNPARSABLE_CLIENT_MESSAGE`
 * — "not enabled on this deployment" — and closes the socket), so it cannot be covered by
 * an example or an e2e test until that gate lifts. Pinning the serialization here is the
 * only coverage available, and it is what proves the SDK is correct once the gate opens.
 *
 * `CloseStream` is included because `ListenV2CloseStream` is a frozen compat shim: the
 * shim widens the `type` field to a namespace type, and this asserts that widening did not
 * change the emitted frame.
 */

type ListenerMap = {
    open?: () => void;
    message?: (message: string | ArrayBuffer | Blob | ArrayBufferView) => void;
    close?: (event: { code?: number; reason?: string }) => void;
};

class FakeTransport implements DeepgramTransport {
    public readonly listeners: ListenerMap = {};
    public readonly sent: Array<string | ArrayBuffer | Blob | ArrayBufferView> = [];
    public closed = false;
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
        this.closed = true;
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
    const socket = await client.listen.v2.createConnection({ model: "flux-general-en" });
    socket.connect();
    await Promise.resolve();
    transport.emitOpen();
    return { socket, transport };
};

describe("listen v2 control messages", () => {
    it('sendForceEndTurn emits exactly {"type":"ForceEndTurn"}', async () => {
        const { socket, transport } = await openSocket();

        socket.sendForceEndTurn({ type: "ForceEndTurn" });

        expect(transport.sent).toHaveLength(1);
        expect(typeof transport.sent[0]).toBe("string");
        expect(JSON.parse(transport.sent[0] as string)).toEqual({ type: "ForceEndTurn" });
    });

    it('sendCloseStream still emits exactly {"type":"CloseStream"} through the compat shim', async () => {
        // ListenV2CloseStream is frozen: the shim widens `type` to a namespace type so
        // existing `ListenV2CloseStream.Type` references keep compiling. The emitted frame
        // must be unchanged by that widening.
        const { socket, transport } = await openSocket();

        socket.sendCloseStream({ type: "CloseStream" });

        expect(JSON.parse(transport.sent[0] as string)).toEqual({ type: "CloseStream" });
    });

    it("control messages are sent as text frames, not binary", async () => {
        // Audio goes out binary; control messages must not, or the server rejects them as
        // unparsable audio.
        const { socket, transport } = await openSocket();

        socket.sendForceEndTurn({ type: "ForceEndTurn" });
        socket.sendCloseStream({ type: "CloseStream" });

        for (const frame of transport.sent) {
            expect(typeof frame).toBe("string");
        }
    });

    it("surfaces a TurnInfo trigger when the server reports one", async () => {
        // `trigger` (model | manual | timeout) is new in this regen and identifies what
        // ended a turn. Pinned so the field stays readable off an inbound message.
        const { socket, transport } = await openSocket();
        let trigger: string | undefined;
        socket.on("message", (message: { trigger?: string }) => {
            trigger = message.trigger;
        });

        transport.emitMessage('{"type":"TurnInfo","event":"EndOfTurn","trigger":"manual"}');

        expect(trigger).toBe("manual");
    });
});
