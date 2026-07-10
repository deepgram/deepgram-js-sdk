import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import type { Deepgram } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { WebSocketEventTracker, waitForEventCount } from "./helpers";
import type { Server } from "ws";

/**
 * Wire test for the agent UpdateListen / ListenUpdated round-trip (2026-07-09 regen).
 *
 * The regen added:
 *   - AgentV1UpdateListen  (client -> server, sendUpdateListen)  with a
 *     DeepgramListenProviderV2 provider payload
 *   - AgentV1ListenUpdated (server -> client, "ListenUpdated" confirmation)
 *
 * This verifies the message serializes correctly over the wire and the
 * confirmation is delivered back through on("message"). The UpdateListen payload
 * is typed so a schema drift surfaces as a compile error; the wait uses
 * waitForEventCount rather than a fixed sleep.
 */
describe("Agent UpdateListen / ListenUpdated", () => {
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
            .get("/v1/agent")
            .respondWith()
            .statusCode(101)
            .headers({
                Upgrade: "websocket",
                Connection: "Upgrade",
            })
            .build();
    });

    afterEach(() => {
        // Close any sockets a test created, even if it threw before its own cleanup.
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

    it("should send UpdateListen (with a v2 provider) and receive ListenUpdated", async () => {
        const sentToServer: any[] = [];
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

        const socket = await client.agent.v1.createConnection();
        openSockets.push(socket);

        socket.on("message", (data) => tracker.track((data as { type?: string })?.type ?? "binary", data));

        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify({ type: "Welcome" }));
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                sentToServer.push(parsed);
                if (parsed.type === "UpdateListen") {
                    const updated: Deepgram.agent.AgentV1ListenUpdated = { type: "ListenUpdated" };
                    ws.send(JSON.stringify(updated));
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();
        await waitForEventCount(tracker, "Welcome", 1);

        const updateListen: Deepgram.agent.AgentV1UpdateListen = {
            type: "UpdateListen",
            listen: {
                provider: {
                    type: "deepgram",
                    version: "v2",
                    model: "flux-general-en",
                    // new Flux end-of-turn tuning fields added on DeepgramListenProviderV2
                    eot_threshold: 0.8,
                    eager_eot_threshold: 0.5,
                    eot_timeout_ms: 4000,
                },
            },
        };
        socket.sendUpdateListen(updateListen);

        await waitForEventCount(tracker, "ListenUpdated", 1);

        // The UpdateListen message serialized with its full provider payload
        const update = sentToServer.find((m) => m.type === "UpdateListen");
        expect(update).toMatchObject({
            type: "UpdateListen",
            listen: {
                provider: {
                    type: "deepgram",
                    model: "flux-general-en",
                    eot_threshold: 0.8,
                    eager_eot_threshold: 0.5,
                    eot_timeout_ms: 4000,
                },
            },
        });

        // The server confirmation is delivered back
        const confirmation = tracker.getHistory().find((e) => e.event === "ListenUpdated");
        expect(confirmation?.data).toMatchObject({ type: "ListenUpdated" });

        socket.close();
    });
});
