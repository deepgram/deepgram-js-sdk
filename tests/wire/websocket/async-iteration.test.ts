import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Server } from "ws";
import { DeepgramClient } from "../../../src";
import type { MockServer } from "../../mock-server/MockServer";
import { mockServerPool } from "../../mock-server/MockServerPool";

/**
 * Wire tests for `for await` on the streaming sockets (issue #549).
 *
 * The generated `on()` keeps a single handler per event, so the interesting cases are not
 * "does a message arrive" but what happens around that: a callback registered after
 * iteration starts, messages arriving faster than the consumer reads them, and `break`.
 */
describe("Socket async iteration", () => {
    let server: MockServer;
    let wsServer: Server;
    let wsPort: number;
    const openSockets: Array<{ close: () => void }> = [];

    beforeEach(async () => {
        server = mockServerPool.createServer();

        const { WebSocketServer } = await import("ws");
        wsServer = new WebSocketServer({ port: 0 });

        await new Promise<void>((resolve) => {
            wsServer.on("listening", () => {
                const address = wsServer.address();
                wsPort = typeof address === "object" ? address.port : 0;
                resolve();
            });
        });

        server
            .mockEndpoint()
            .get("/v1/listen")
            .respondWith()
            .statusCode(101)
            .headers({ Upgrade: "websocket", Connection: "Upgrade" })
            .build();
    });

    afterEach(() => {
        for (const socket of openSockets) {
            try {
                socket.close();
            } catch {
                // already closed
            }
        }
        openSockets.length = 0;
        wsServer?.close();
    });

    const makeClient = () =>
        new DeepgramClient({
            maxRetries: 0,
            apiKey: "test",
            environment: {
                base: server.baseUrl,
                production: `ws://localhost:${wsPort}`,
                agent: `ws://localhost:${wsPort}`,
            },
        });

    const results = (transcript: string, isFinal: boolean) => ({
        type: "Results",
        is_final: isFinal,
        channel: { alternatives: [{ transcript }] },
    });

    it("yields messages in order and ends when the server closes", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("one", false)));
            ws.send(JSON.stringify(results("two", true)));
            ws.send(JSON.stringify({ type: "Metadata", request_id: "abc" }));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const seen: string[] = [];
        for await (const message of socket) {
            seen.push((message as { type: string }).type);
        }

        // Iteration terminated on its own, which is the half a callback API cannot express.
        expect(seen).toEqual(["Results", "Results", "Metadata"]);
    });

    it("buffers messages that arrive between iterations", async () => {
        wsServer.on("connection", (ws) => {
            for (let i = 0; i < 5; i++) {
                ws.send(JSON.stringify(results(`chunk-${i}`, false)));
            }
            setTimeout(() => ws.close(1000), 100);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const transcripts: string[] = [];
        for await (const message of socket) {
            const parsed = message as { channel?: { alternatives: Array<{ transcript: string }> } };
            if (parsed.channel) {
                transcripts.push(parsed.channel.alternatives[0].transcript);
            }
            // A consumer slower than the socket: everything else lands while we are away.
            await new Promise((resolve) => setTimeout(resolve, 15));
        }

        expect(transcripts).toEqual(["chunk-0", "chunk-1", "chunk-2", "chunk-3", "chunk-4"]);
    });

    it("still delivers to a callback registered after iteration starts", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("shared", true)));
            setTimeout(() => ws.close(), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();

        // Registering through on() must not displace the iterator, nor the iterator the callback.
        const viaCallback: unknown[] = [];
        socket.on("message", (data) => viaCallback.push(data));

        const first = await iterator.next();

        expect((first.value as { type: string }).type).toBe("Results");
        expect(viaCallback).toHaveLength(1);

        await iterator.return?.();
    });

    it("still delivers to a callback registered before iteration starts", async () => {
        wsServer.on("connection", (ws) => {
            ws.once("message", () => {
                ws.send(JSON.stringify(results("shared", true)));
                setTimeout(() => ws.close(1000), 50);
            });
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        const viaCallback: unknown[] = [];
        socket.on("message", (data) => viaCallback.push(data));
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        socket.sendKeepAlive({ type: "KeepAlive" });
        const first = await iterator.next();

        expect((first.value as { type: string }).type).toBe("Results");
        expect(viaCallback).toHaveLength(1);

        await iterator.return?.();
    });

    it("closes the connection when the consumer breaks", async () => {
        let serverSawClose = false;
        wsServer.on("connection", (ws) => {
            ws.on("close", () => {
                serverSawClose = true;
            });
            const timer = setInterval(() => ws.send(JSON.stringify(results("tick", false))), 10);
            ws.on("close", () => clearInterval(timer));
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        let received = 0;
        for await (const _message of socket) {
            received++;
            if (received === 2) {
                break;
            }
        }

        expect(received).toBe(2);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(serverSawClose).toBe(true);
    });

    it("settles a pending read when the iterator returns", async () => {
        wsServer.on("connection", () => {});

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        const pending = iterator.next();
        await iterator.return?.();

        await expect(pending).resolves.toEqual({ value: undefined, done: true });
    });

    it("rejects iteration when the connection errors", async () => {
        await new Promise<void>((resolve) => wsServer.close(() => resolve()));

        const socket = await makeClient().listen.v1.createConnection({
            model: "nova-3",
            reconnectAttempts: 0,
        });
        openSockets.push(socket);
        const iterator = socket[Symbol.asyncIterator]();
        socket.connect();

        await expect(iterator.next()).rejects.toThrow();
    });

    it("continues iteration after a recoverable reconnect", async () => {
        let connectionCount = 0;
        wsServer.on("connection", (ws) => {
            ws.once("message", () => {
                connectionCount++;
                ws.send(JSON.stringify(results(connectionCount === 1 ? "before" : "after", true)));
                setTimeout(() => ws.close(connectionCount === 1 ? 1011 : 1000), 10);
            });
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        const socketInternals = socket.socket as unknown as {
            _options: { minReconnectionDelay: number };
        };
        socketInternals._options.minReconnectionDelay = 0;
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        socket.sendKeepAlive({ type: "KeepAlive" });
        const first = await iterator.next();

        await new Promise((resolve) => setTimeout(resolve, 50));
        socket.sendKeepAlive({ type: "KeepAlive" });
        const second = await iterator.next();

        expect(
            (first.value as { channel: { alternatives: Array<{ transcript: string }> } }).channel.alternatives[0]
                .transcript,
        ).toBe("before");
        expect(
            (second.value as { channel: { alternatives: Array<{ transcript: string }> } }).channel.alternatives[0]
                .transcript,
        ).toBe("after");
    });

    it("ends iteration when recoverable retries are exhausted", async () => {
        wsServer.on("connection", (ws) => {
            ws.once("message", () => {
                ws.send(JSON.stringify(results("last", true)));
                setTimeout(() => ws.close(1011), 10);
            });
        });

        const socket = await makeClient().listen.v1.createConnection({
            model: "nova-3",
            reconnectAttempts: 0,
        });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        socket.sendKeepAlive({ type: "KeepAlive" });

        await expect(iterator.next()).resolves.toMatchObject({ done: false });
        await expect(iterator.next()).resolves.toEqual({ value: undefined, done: true });
    });

    it("ends iteration when a close callback stops a pending reconnect", async () => {
        wsServer.on("connection", (ws) => {
            ws.once("message", () => {
                ws.send(JSON.stringify(results("last", true)));
                setTimeout(() => ws.close(1011), 10);
            });
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.on("close", () => socket.close());
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        socket.sendKeepAlive({ type: "KeepAlive" });

        await expect(iterator.next()).resolves.toMatchObject({ done: false });
        await expect(iterator.next()).resolves.toEqual({ value: undefined, done: true });
    });

    it("ends iteration when an abort signal stops a pending reconnect", async () => {
        const abortController = new AbortController();
        wsServer.on("connection", (ws) => {
            ws.once("message", () => {
                ws.send(JSON.stringify(results("last", true)));
                setTimeout(() => ws.close(1011), 10);
            });
        });

        const socket = await makeClient().listen.v1.createConnection({
            model: "nova-3",
            abortSignal: abortController.signal,
        });
        openSockets.push(socket);
        socket.on("close", () => abortController.abort());
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        socket.sendKeepAlive({ type: "KeepAlive" });

        await expect(iterator.next()).resolves.toMatchObject({ done: false });
        await expect(iterator.next()).resolves.toEqual({ value: undefined, done: true });
    });

    it("rejects and closes when a consumer exceeds the queue limit", async () => {
        let serverSawClose = false;
        wsServer.on("connection", (ws) => {
            ws.on("close", () => {
                serverSawClose = true;
            });
            ws.once("message", () => {
                for (let i = 0; i <= 1001; i++) {
                    ws.send(JSON.stringify(results(`chunk-${i}`, false)));
                }
            });
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        const first = iterator.next();
        socket.sendKeepAlive({ type: "KeepAlive" });

        await expect(first).resolves.toMatchObject({ done: false });
        await new Promise((resolve) => setTimeout(resolve, 50));
        await expect(iterator.next()).rejects.toThrow("Async iterator buffer overflow");
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(serverSawClose).toBe(true);
    });

    it("rejects and closes when queued binary audio exceeds 16 MiB", async () => {
        let serverSawClose = false;
        wsServer.on("connection", (ws) => {
            ws.on("close", () => {
                serverSawClose = true;
            });
            ws.once("message", () => {
                for (let i = 0; i < 18; i++) {
                    ws.send(Buffer.alloc(1024 * 1024));
                }
            });
        });

        const socket = await makeClient().speak.v1.createConnection({ model: "aura-asteria-en" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        const first = iterator.next();
        socket.sendText({ type: "Speak", text: "trigger" });

        await expect(first).resolves.toMatchObject({ done: false, value: expect.any(Blob) });
        await new Promise((resolve) => setTimeout(resolve, 100));
        await expect(iterator.next()).rejects.toThrow("Async iterator buffer overflow");
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(serverSawClose).toBe(true);
    });

    it("rejects a second active iterator", async () => {
        wsServer.on("connection", () => {});

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        expect(() => socket[Symbol.asyncIterator]()).toThrow("Only one async iterator");

        await iterator.return?.();
    });
});
