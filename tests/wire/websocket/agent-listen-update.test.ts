import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
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
 * confirmation is delivered back through on("message").
 */
describe("Agent UpdateListen / ListenUpdated", () => {
    let server: MockServer;
    let wsServer: Server;
    let wsPort: number;

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
        wsServer?.close();
    });

    it("should send UpdateListen (with a v2 provider) and receive ListenUpdated", async () => {
        const sentToServer: any[] = [];
        const receivedMessages: any[] = [];

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

        socket.on("message", (data) => receivedMessages.push(data));

        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify({ type: "Welcome" }));
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                sentToServer.push(parsed);
                if (parsed.type === "UpdateListen") {
                    ws.send(JSON.stringify({ type: "ListenUpdated" }));
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();

        socket.sendUpdateListen({
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
        });

        await new Promise((resolve) => setTimeout(resolve, 200));

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
        expect(receivedMessages.find((m) => m?.type === "ListenUpdated")).toMatchObject({
            type: "ListenUpdated",
        });

        socket.close();
    });
});
