import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Server } from "ws";
import { DeepgramClient } from "../../../src";
import type { MockServer } from "../../mock-server/MockServer";
import { mockServerPool } from "../../mock-server/MockServerPool";

/**
 * Wire tests for `on()`/`off()` supporting more than one listener per event.
 *
 * The generated `on()` keeps a single handler slot per event: a second `on("message", ...)`
 * call silently displaces the first, with no way to remove a listener afterwards. These
 * tests exercise the fix — every distinct listener registered for an event fires on every
 * dispatch, `off()` removes exactly the one it targets, and re-registering the same callback
 * reference is a no-op, matching `EventTarget`.
 */
describe("Socket on()/off() multiple listeners", () => {
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

    it("delivers one message to every listener registered for the same event", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("hello", true)));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);

        const seenByA: unknown[] = [];
        const seenByB: unknown[] = [];
        const seenByC: unknown[] = [];
        socket.on("message", (m) => seenByA.push(m));
        socket.on("message", (m) => seenByB.push(m));
        socket.on("message", (m) => seenByC.push(m));

        socket.connect();
        await socket.waitForOpen();
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Before the fix, only the most recently registered listener (C) would fire.
        expect(seenByA).toHaveLength(1);
        expect(seenByB).toHaveLength(1);
        expect(seenByC).toHaveLength(1);
    });

    it("stops calling a listener once off() removes it, without disturbing the others", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("one", false)));
            ws.send(JSON.stringify(results("two", false)));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);

        const seenByA: unknown[] = [];
        const seenByB: unknown[] = [];
        const handlerA = (m: unknown) => {
            seenByA.push(m);
            socket.off("message", handlerA);
        };
        socket.on("message", handlerA);
        socket.on("message", (m) => seenByB.push(m));

        socket.connect();
        await socket.waitForOpen();
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(seenByA).toHaveLength(1);
        expect(seenByB).toHaveLength(2);
    });

    it("treats re-registering the same callback reference as a no-op, like addEventListener", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("hello", true)));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);

        const seen: unknown[] = [];
        const handler = (m: unknown) => seen.push(m);
        socket.on("message", handler);
        socket.on("message", handler);
        socket.on("message", handler);

        socket.connect();
        await socket.waitForOpen();
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(seen).toHaveLength(1);
    });

    it("removing a listener that was never added, or already removed, is a no-op", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("hello", true)));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);

        const neverAdded = () => {};
        expect(() => socket.off("message", neverAdded)).not.toThrow();

        const seen: unknown[] = [];
        const handler = (m: unknown) => seen.push(m);
        socket.on("message", handler);
        socket.off("message", handler);
        socket.off("message", handler); // second removal: no-op, must not throw

        socket.connect();
        await socket.waitForOpen();
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(seen).toHaveLength(0);
    });

    it("supports multiple listeners on open, close, and error alongside message", async () => {
        wsServer.on("connection", (ws) => {
            setTimeout(() => ws.close(1000), 30);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);

        let opens = 0;
        let closes = 0;
        socket.on("open", () => opens++);
        socket.on("open", () => opens++);
        socket.on("close", () => closes++);
        socket.on("close", () => closes++);
        socket.on("close", () => closes++);

        socket.connect();
        await socket.waitForOpen();
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(opens).toBe(2);
        expect(closes).toBe(3);
    });

    it("does not disturb the async iterator when on() adds a second callback listener", async () => {
        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify(results("shared", true)));
            setTimeout(() => ws.close(1000), 50);
        });

        const socket = await makeClient().listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.connect();
        await socket.waitForOpen();

        const iterator = socket[Symbol.asyncIterator]();
        const viaCallbackA: unknown[] = [];
        const viaCallbackB: unknown[] = [];
        socket.on("message", (m) => viaCallbackA.push(m));
        socket.on("message", (m) => viaCallbackB.push(m));

        const first = await iterator.next();

        expect((first.value as { type: string }).type).toBe("Results");
        expect(viaCallbackA).toHaveLength(1);
        expect(viaCallbackB).toHaveLength(1);

        await iterator.return?.();
    });
});
