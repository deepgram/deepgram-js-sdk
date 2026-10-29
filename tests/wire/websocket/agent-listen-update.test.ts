import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import type { Deepgram } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { WebSocketEventTracker, waitForEventCount } from "./helpers";
import type { Server } from "ws";

/**
 * Wire tests for Agent V1 control-message round trips.
 *
 * The regen added:
 *   - AgentV1UpdateListen  (client -> server, sendUpdateListen)  with a
 *     DeepgramListenProviderV2 provider payload
 *   - AgentV1ListenUpdated (server -> client, "ListenUpdated" confirmation)
 *
 * The Think Live test also covers UpdateThink_Live, dynamic agent-message
 * injection, ThinkLiveUpdated, and FrustrationDetected. Payloads are typed so a
 * schema drift surfaces as a compile error; waits use waitForEventCount rather
 * than fixed sleeps.
 */
describe("Agent control messages", () => {
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

    it("serializes Deepgram Think provider settings", async () => {
        let resolveSettings: (settings: unknown) => void = () => undefined;
        const settingsReceived = new Promise<unknown>((resolve) => {
            resolveSettings = resolve;
        });
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

        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify({ type: "Welcome" }));
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                if (parsed.type === "Settings") {
                    resolveSettings(parsed);
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();

        const settings: Deepgram.agent.AgentV1Settings = {
            type: "Settings",
            audio: {},
            agent: {
                think: {
                    provider: {
                        type: "deepgram",
                        version: "v1",
                        model: "think-fast",
                        temperature: 0.7,
                        reasoning_mode: "minimal",
                        voice_prompt_opt_out: true,
                    },
                },
            },
        };
        socket.sendSettings(settings);

        await expect(settingsReceived).resolves.toEqual(settings);
        socket.close();
    });

    it("delivers FunctionCallCancelled messages to consumers", async () => {
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
            const cancelled: Deepgram.agent.AgentV1FunctionCallCancelled = {
                type: "FunctionCallCancelled",
                functions: [{ id: "call-123", name: "book_flight" }],
            };
            ws.send(JSON.stringify(cancelled));
        });

        socket.connect();
        await socket.waitForOpen();
        await waitForEventCount(tracker, "FunctionCallCancelled", 1);

        expect(tracker.getHistory().find((event) => event.event === "FunctionCallCancelled")?.data).toEqual({
            type: "FunctionCallCancelled",
            functions: [{ id: "call-123", name: "book_flight" }],
        });
        socket.close();
    });

    it("round-trips Think Live controls and events", async () => {
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
        const socket = await client.agent.v1.createConnection();
        openSockets.push(socket);
        socket.on("message", (data) => tracker.track((data as { type?: string })?.type ?? "binary", data));

        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify({ type: "Welcome" }));
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                sentToServer.push(parsed);

                if (parsed.type === "UpdateThink_Live") {
                    const updated: Deepgram.agent.AgentV1ThinkLiveUpdated = { type: "ThinkLiveUpdated" };
                    ws.send(JSON.stringify(updated));
                }
                if (parsed.type === "InjectAgentMessage" && parsed.is_dynamic === true) {
                    const frustrated: Deepgram.agent.AgentV1FrustrationDetected = {
                        type: "FrustrationDetected",
                        count: 1,
                        escalated: false,
                    };
                    ws.send(JSON.stringify(frustrated));
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();
        await waitForEventCount(tracker, "Welcome", 1);

        socket.sendUpdateThinkLive({
            type: "UpdateThink_Live",
            think_live: {
                provider: {
                    type: "deepgram",
                    version: "v1",
                    frustration_max_count: 2,
                },
            },
        });
        socket.sendInjectDynamicAgentMessage({
            type: "InjectAgentMessage",
            is_dynamic: true,
            behavior: "queue",
        });

        await waitForEventCount(tracker, "ThinkLiveUpdated", 1);
        await waitForEventCount(tracker, "FrustrationDetected", 1);

        expect(sentToServer).toContainEqual({
            type: "UpdateThink_Live",
            think_live: { provider: { type: "deepgram", version: "v1", frustration_max_count: 2 } },
        });
        expect(sentToServer).toContainEqual({ type: "InjectAgentMessage", is_dynamic: true, behavior: "queue" });
        expect(tracker.getHistory().find((event) => event.event === "ThinkLiveUpdated")?.data).toEqual({
            type: "ThinkLiveUpdated",
        });
        expect(tracker.getHistory().find((event) => event.event === "FrustrationDetected")?.data).toEqual({
            type: "FrustrationDetected",
            count: 1,
            escalated: false,
        });

        socket.close();
    });

    it("round-trips custom think-provider messages", async () => {
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
        const socket = await client.agent.v1.createConnection();
        openSockets.push(socket);
        socket.on("message", (data) => tracker.track((data as { type?: string })?.type ?? "binary", data));

        wsServer.on("connection", (ws) => {
            ws.send(JSON.stringify({ type: "Welcome" }));
            ws.on("message", (data) => {
                const parsed = JSON.parse(data.toString());
                sentToServer.push(parsed);
                if (parsed.type === "__customToThinkProvider") {
                    const reply: Deepgram.agent.AgentV1CustomFromThinkProvider = {
                        type: "__customFromThinkProvider",
                        content: { accepted: true },
                    };
                    ws.send(JSON.stringify(reply));
                }
            });
        });

        socket.connect();
        await socket.waitForOpen();
        await waitForEventCount(tracker, "Welcome", 1);

        socket.sendCustomToThinkProvider({
            type: "__customToThinkProvider",
            content: { action: "handoff", conversationId: "conversation-123" },
        });

        await waitForEventCount(tracker, "__customFromThinkProvider", 1);
        expect(sentToServer).toContainEqual({
            type: "__customToThinkProvider",
            content: { action: "handoff", conversationId: "conversation-123" },
        });
        expect(tracker.getHistory().find((event) => event.event === "__customFromThinkProvider")?.data).toEqual({
            type: "__customFromThinkProvider",
            content: { accepted: true },
        });

        socket.close();
    });
});
