import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DeepgramClient } from "../../../src";
import type { Deepgram } from "../../../src";
import type { MockServer } from "../../mock-server/MockServer";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { WebSocketEventTracker, waitForEventCount } from "./helpers";
import type { Server } from "ws";

describe("Listen V1 Configure", () => {
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

    it("serializes Configure updates and delivers Configure errors", async () => {
        const sentToServer: unknown[] = [];
        const tracker = new WebSocketEventTracker();
        const client = new DeepgramClient({
            maxRetries: 0,
            apiKey: "test",
            environment: {
                base: server.baseUrl,
                production: `ws://localhost:${wsPort}`,
                agent: `ws://localhost:${wsPort}`,
            },
        });
        const socket = await client.listen.v1.createConnection({ model: "nova-3" });
        openSockets.push(socket);
        socket.on("message", (data) => tracker.track((data as { type?: string })?.type ?? "binary", data));

        wsServer.on("connection", (ws) => {
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                sentToServer.push(parsed);
                if (parsed.type === "Configure" && parsed.keyterms?.length === 0) {
                    const error: Deepgram.listen.ListenV1Error = {
                        type: "Error",
                        variant: "InvalidConfigureMessage",
                        code: "KeytermsNotSupported",
                        description: "keyterms are only supported for Nova-3",
                        message: JSON.stringify(parsed),
                    };
                    ws.send(JSON.stringify(error));
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();
        socket.sendConfigure({
            type: "Configure",
            keyterms: ["Deepgram", "voice AI"],
            features: { numerals: true, punctuate: false },
        });
        socket.sendConfigure({ type: "Configure", keyterms: [] });
        socket.sendConfigure({ type: "Configure", keyterms: null });

        await waitForEventCount(tracker, "Error", 1);
        expect(sentToServer).toEqual([
            {
                type: "Configure",
                keyterms: ["Deepgram", "voice AI"],
                features: { numerals: true, punctuate: false },
            },
            { type: "Configure", keyterms: [] },
            { type: "Configure", keyterms: null },
        ]);
        expect(tracker.getHistory().find((event) => event.event === "Error")?.data).toEqual({
            type: "Error",
            variant: "InvalidConfigureMessage",
            code: "KeytermsNotSupported",
            description: "keyterms are only supported for Nova-3",
            message: '{"type":"Configure","keyterms":[]}',
        });

        socket.close();
    });
});
