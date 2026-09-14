import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { main, type ReconnectConnection } from "../../examples/41-transcription-live-reconnect";

type Listener = (data: never) => void;

class FakeConnection implements ReconnectConnection {
    readyState = 1;
    socket = { close: vi.fn() };
    sendCloseStream = vi.fn();
    sendKeepAlive = vi.fn();
    sendMedia = vi.fn();
    close = vi.fn();
    private listeners = new Map<string, Listener>();

    on(event: "open", listener: () => void): void;
    on(event: "message", listener: (data: { type: string }) => void): void;
    on(event: "error", listener: (error: Error) => void): void;
    on(event: "close", listener: (event: { code?: number }) => void): void;
    on(event: string, listener: Listener): void {
        this.listeners.set(event, listener);
    }

    connect() {}

    async waitForOpen() {}

    emit(event: string, data: unknown): void {
        this.listeners.get(event)?.(data as never);
    }
}

describe("live reconnect example", () => {
    let originalExitCode: number | string | undefined;

    beforeEach(() => {
        originalExitCode = process.exitCode;
        vi.useFakeTimers();
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(Math, "random").mockReturnValue(0);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.restoreAllMocks();
        vi.useRealTimers();
        process.exitCode = originalExitCode;
    });

    it("keeps discarded buffered audio in the first post-reconnect transcript", async () => {
        const bytesPerSecond = 44100 * 2;
        const firstConnection = new FakeConnection();
        const secondConnection = new FakeConnection();
        let resolveSecondConnection: (connection: ReconnectConnection) => void;
        const connectionFactory = vi
            .fn<() => Promise<ReconnectConnection>>()
            .mockResolvedValueOnce(firstConnection)
            .mockImplementationOnce(
                () =>
                    new Promise<ReconnectConnection>((resolve) => {
                        resolveSecondConnection = resolve;
                    }),
            );

        await main({
            audio: new Uint8Array(bytesPerSecond * 50),
            connectionFactory,
            simulateDrop: false,
        });
        await vi.advanceTimersByTimeAsync(8000);
        firstConnection.emit("close", { code: 4000 });
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(32000);

        if (!resolveSecondConnection) {
            throw new Error("Reconnect attempt did not create a second connection");
        }
        resolveSecondConnection(secondConnection);
        await vi.advanceTimersByTimeAsync(0);
        secondConnection.emit("message", {
            type: "Results",
            is_final: true,
            start: 0,
            duration: 1,
            channel: { alternatives: [{ transcript: "resumed" }] },
        });

        expect(connectionFactory).toHaveBeenCalledTimes(2);
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Transcript [10.00s - 11.00s]: resumed"));
    });

    it("reconnects after the SDK emits an error following a synthetic normal close", async () => {
        const firstConnection = new FakeConnection();
        const secondConnection = new FakeConnection();
        const connectionFactory = vi
            .fn<() => Promise<ReconnectConnection>>()
            .mockResolvedValueOnce(firstConnection)
            .mockResolvedValueOnce(secondConnection);

        await main({
            audio: new Uint8Array(44100 * 2 * 20),
            connectionFactory,
            simulateDrop: false,
        });
        firstConnection.emit("close", { code: 1000 });
        firstConnection.emit("error", new Error("network lost"));
        await vi.advanceTimersByTimeAsync(0);

        expect(connectionFactory).toHaveBeenCalledTimes(2);
    });

    it("fails shutdown when Deepgram closes before sending metadata", async () => {
        const connection = new FakeConnection();
        const connectionFactory = vi.fn<() => Promise<ReconnectConnection>>().mockResolvedValue(connection);

        await main({
            audio: new Uint8Array((44100 * 2) / 4),
            connectionFactory,
            simulateDrop: false,
        });
        await vi.advanceTimersByTimeAsync(250);
        connection.emit("close", { code: 1006 });
        await vi.advanceTimersByTimeAsync(0);

        expect(connection.sendCloseStream).toHaveBeenCalledWith({ type: "CloseStream" });
        expect(process.exitCode).toBe(1);
    });

    it("succeeds only after Deepgram sends metadata and closes normally", async () => {
        const connection = new FakeConnection();
        const connectionFactory = vi.fn<() => Promise<ReconnectConnection>>().mockResolvedValue(connection);

        await main({
            audio: new Uint8Array((44100 * 2) / 4),
            connectionFactory,
            simulateDrop: false,
        });
        await vi.advanceTimersByTimeAsync(250);
        connection.emit("message", { type: "Metadata", request_id: "request-id" });
        connection.emit("close", { code: 1000 });
        await vi.advanceTimersByTimeAsync(0);

        expect(connection.sendCloseStream).toHaveBeenCalledWith({ type: "CloseStream" });
        expect(process.exitCode).toBe(0);
    });
});
