import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { generateMockAudioData, WebSocketEventTracker } from "./helpers";
import type { Server } from "ws";

/**
 * Wire tests for Speak v2 (Flux) WebSocket TTS streaming.
 *
 * These mirror the Speak v1 suite but exercise the v2 message set:
 * - sendSpeak / sendFlush / sendClose
 * - Connected, SpeechStarted, SpeechMetadata, Flushed, SessionMetadata,
 *   Warning, Error control messages
 * - binary audio frames delivered as ArrayBuffer/Blob (NOT parsed as JSON)
 *
 * The last point is the key regression guard: the auto-generated V2 socket
 * parses every message as JSON; WrappedSpeakV2Socket replaces that with a
 * binary-aware handler so Flux audio frames survive.
 */
describe("Speak v2 (Flux) WebSocket TTS streaming", () => {
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

        // Mock the v2 speak endpoint for WebSocket upgrade
        server
            .mockEndpoint()
            .get("/v2/speak")
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

    describe("Basic TTS streaming", () => {
        it("should send Speak text and receive binary audio + control messages", async () => {
            const receivedMessages: any[] = [];
            const sentToServer: any[] = [];

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({
                model: "flux-alexis-en",
                encoding: "linear16",
                sample_rate: "24000",
            });

            socket.on("message", (data) => {
                receivedMessages.push(data);
            });

            wsServer.on("connection", (ws) => {
                // Server greets with Connected on open
                ws.send(
                    JSON.stringify({
                        type: "Connected",
                        request_id: "req-123",
                        model_name: "flux-alexis-en",
                        model_version: "2025-01-01",
                        model_uuids: ["uuid-1"],
                    }),
                );

                ws.on("message", (data) => {
                    const parsed = JSON.parse(data.toString());
                    sentToServer.push(parsed);

                    if (parsed.type === "Speak") {
                        ws.send(JSON.stringify({ type: "SpeechStarted", speech_id: "dg_sp_abcdef012345" }));
                        // Binary audio frames — MUST NOT be parsed as JSON by the client
                        ws.send(generateMockAudioData(1024));
                        ws.send(generateMockAudioData(2048));
                    }

                    if (parsed.type === "Flush") {
                        ws.send(generateMockAudioData(512));
                        ws.send(
                            JSON.stringify({
                                type: "SpeechMetadata",
                                speech_id: "dg_sp_abcdef012345",
                                audio_duration_ms: 1234,
                                input_character_count: 22,
                                billable_character_count: 22,
                                controls_applied: {
                                    pronunciations_applied: 0,
                                    pronunciation_warnings: 0,
                                },
                            }),
                        );
                        ws.send(JSON.stringify({ type: "Flushed", speech_id: "dg_sp_abcdef012345" }));
                    }
                });
            });

            socket.connect();
            await socket.waitForOpen();

            socket.sendSpeak({ type: "Speak", text: "Hello from Flux." });
            await new Promise((resolve) => setTimeout(resolve, 300));

            socket.sendFlush({ type: "Flush" });
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Verify messages sent to the server
            expect(sentToServer).toEqual([{ type: "Speak", text: "Hello from Flux." }, { type: "Flush" }]);

            // Connected greeting arrived as parsed JSON
            const connected = receivedMessages.find((m) => m?.type === "Connected");
            expect(connected).toMatchObject({ type: "Connected", request_id: "req-123" });

            // Binary audio frames arrived as binary (NOT parsed/dropped as JSON)
            const isBinary = (d: any) => d instanceof ArrayBuffer || d instanceof Blob;
            const binaryFrames = receivedMessages.filter(isBinary);
            expect(binaryFrames.length).toBeGreaterThanOrEqual(3);

            // Control messages parsed correctly
            expect(receivedMessages.find((m) => m?.type === "SpeechStarted")).toMatchObject({
                type: "SpeechStarted",
                speech_id: "dg_sp_abcdef012345",
            });
            expect(receivedMessages.find((m) => m?.type === "SpeechMetadata")).toMatchObject({
                type: "SpeechMetadata",
                billable_character_count: 22,
            });
            expect(receivedMessages.find((m) => m?.type === "Flushed")).toMatchObject({
                type: "Flushed",
                speech_id: "dg_sp_abcdef012345",
            });

            socket.close();
        });
    });

    describe("Close command", () => {
        it("should send Close and receive the close event", async () => {
            const sentToServer: any[] = [];
            const tracker = new WebSocketEventTracker();

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });

            socket.on("close", (event) => tracker.track("close", event));

            wsServer.on("connection", (ws) => {
                ws.on("message", (data) => {
                    const parsed = JSON.parse(data.toString());
                    sentToServer.push(parsed);
                    if (parsed.type === "Close") {
                        ws.close(1000, "Closing as requested");
                    }
                });
            });

            socket.connect();
            await socket.waitForOpen();

            socket.sendClose({ type: "Close" });
            await new Promise((resolve) => setTimeout(resolve, 300));

            expect(sentToServer).toEqual([{ type: "Close" }]);
            expect(tracker.getCount("close")).toBeGreaterThanOrEqual(1);

            socket.close();
        });
    });

    describe("Warning and Error handling", () => {
        it("should deliver Warning and Error control messages", async () => {
            const receivedMessages: any[] = [];

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });

            socket.on("message", (data) => receivedMessages.push(data));

            wsServer.on("connection", (ws) => {
                ws.send(
                    JSON.stringify({
                        type: "Warning",
                        code: "NO_ACTIVE_SPEECH",
                        description: "A speech-scoped message arrived with no active turn.",
                    }),
                );
                ws.on("message", (data) => {
                    const parsed = JSON.parse(data.toString());
                    if (parsed.type === "Speak") {
                        ws.send(
                            JSON.stringify({
                                type: "Error",
                                code: "NET-0000",
                                description: "Synthesis failed.",
                            }),
                        );
                    }
                });
            });

            socket.connect();
            await socket.waitForOpen();
            socket.sendSpeak({ type: "Speak", text: "Test" });
            await new Promise((resolve) => setTimeout(resolve, 300));

            expect(receivedMessages.find((m) => m?.type === "Warning")).toMatchObject({
                type: "Warning",
                code: "NO_ACTIVE_SPEECH",
            });
            expect(receivedMessages.find((m) => m?.type === "Error")).toMatchObject({
                type: "Error",
                code: "NET-0000",
            });

            socket.close();
        });
    });

    describe("Guard rails", () => {
        it("should throw when sending before the connection is open", async () => {
            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });

            // Not connected — sending must throw
            expect(() => {
                socket.sendSpeak({ type: "Speak", text: "Test" });
            }).toThrow();

            socket.close();
        });
    });
});
