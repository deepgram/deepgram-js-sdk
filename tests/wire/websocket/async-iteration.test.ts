import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import type { Server } from "ws";

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
            setTimeout(() => ws.close(), 50);
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
            setTimeout(() => ws.close(), 100);
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
});
