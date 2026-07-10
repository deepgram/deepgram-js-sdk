import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import type { Deepgram } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { generateMockAudioData, WebSocketEventTracker, waitForEventCount } from "./helpers";
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
 *
 * Server-sent payloads are typed with the real SpeakV2* types so a schema drift
 * (renamed/removed field) surfaces as a compile error rather than silently
 * passing. Waits use waitForEventCount (not fixed sleeps) to avoid CI flakiness.
 */
describe("Speak v2 (Flux) WebSocket TTS streaming", () => {
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
        // Close any sockets a test created, even if it threw before its own cleanup,
        // so leaked ReconnectingWebSockets don't retry against the dead port.
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

    describe("Basic TTS streaming", () => {
        it("should send Speak text and receive binary audio + control messages", async () => {
            const receivedMessages: any[] = [];
            const sentToServer: any[] = [];
            const tracker = new WebSocketEventTracker();

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({
                model: "flux-alexis-en",
                encoding: "linear16",
                sample_rate: "24000",
            });
            openSockets.push(socket);

            socket.on("message", (data) => {
                receivedMessages.push(data);
                const isBinary = data instanceof ArrayBuffer || data instanceof Blob;
                tracker.track(isBinary ? "binary" : ((data as { type?: string })?.type ?? "unknown"));
            });

            wsServer.on("connection", (ws) => {
                // Server greets with Connected on open
                const connected: Deepgram.speak.SpeakV2Connected = {
                    type: "Connected",
                    request_id: "req-123",
                    model_name: "flux-alexis-en",
                    model_version: "2025-01-01",
                    model_uuids: ["uuid-1"],
                };
                ws.send(JSON.stringify(connected));

                ws.on("message", (data) => {
                    const parsed = JSON.parse(data.toString());
                    sentToServer.push(parsed);

                    if (parsed.type === "Speak") {
                        const speechStarted: Deepgram.speak.SpeakV2SpeechStarted = {
                            type: "SpeechStarted",
                            speech_id: "dg_sp_abcdef012345",
                        };
                        ws.send(JSON.stringify(speechStarted));
                        // Binary audio frames — MUST NOT be parsed as JSON by the client
                        ws.send(generateMockAudioData(1024));
                        ws.send(generateMockAudioData(2048));
                    }

                    if (parsed.type === "Flush") {
                        ws.send(generateMockAudioData(512));
                        const speechMetadata: Deepgram.speak.SpeakV2SpeechMetadata = {
                            type: "SpeechMetadata",
                            speech_id: "dg_sp_abcdef012345",
                            audio_duration_ms: 1234,
                            input_character_count: 22,
                            billable_character_count: 22,
                            controls_applied: {
                                pronunciations_applied: 0,
                                pronunciation_warnings: 0,
                            },
                        };
                        ws.send(JSON.stringify(speechMetadata));
                        const flushed: Deepgram.speak.SpeakV2Flushed = {
                            type: "Flushed",
                            speech_id: "dg_sp_abcdef012345",
                        };
                        ws.send(JSON.stringify(flushed));
                    }
                });
            });

            socket.connect();
            await socket.waitForOpen();
            await waitForEventCount(tracker, "Connected", 1);

            socket.sendSpeak({ type: "Speak", text: "Hello from Flux." });
            await waitForEventCount(tracker, "SpeechStarted", 1);
            await waitForEventCount(tracker, "binary", 2);

            socket.sendFlush({ type: "Flush" });
            await waitForEventCount(tracker, "Flushed", 1);
            await waitForEventCount(tracker, "binary", 3);

            // Verify messages sent to the server
            expect(sentToServer).toEqual([{ type: "Speak", text: "Hello from Flux." }, { type: "Flush" }]);

            // Connected greeting arrived as parsed JSON
            const connected = receivedMessages.find((m) => m?.type === "Connected");
            expect(connected).toMatchObject({ type: "Connected", request_id: "req-123" });

            // Exactly 3 binary audio frames arrived as binary (NOT parsed/dropped as JSON,
            // and NOT duplicated by a listener bug).
            const isBinary = (d: any) => d instanceof ArrayBuffer || d instanceof Blob;
            const binaryFrames = receivedMessages.filter(isBinary);
            expect(binaryFrames).toHaveLength(3);

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
        it("should send Close and receive a 1000 close with the server's reason", async () => {
            const sentToServer: any[] = [];
            const tracker = new WebSocketEventTracker();

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });
            openSockets.push(socket);

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
            await waitForEventCount(tracker, "close", 1, 5000);

            // The server only closes in response to receiving Close, so a close event
            // with code 1000 + the server's reason proves the round-trip completed.
            expect(sentToServer).toEqual([{ type: "Close" }]);
            const closeEvent = tracker.getHistory().find((e) => e.event === "close");
            expect(closeEvent?.data).toMatchObject({ code: 1000, reason: "Closing as requested" });

            socket.close();
        });
    });

    describe("Warning and Error handling", () => {
        it("should deliver Warning and Error control messages", async () => {
            const receivedMessages: any[] = [];
            const tracker = new WebSocketEventTracker();

            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });
            openSockets.push(socket);

            socket.on("message", (data) => {
                receivedMessages.push(data);
                tracker.track((data as { type?: string })?.type ?? "binary");
            });

            wsServer.on("connection", (ws) => {
                const warning: Deepgram.speak.SpeakV2Warning = {
                    type: "Warning",
                    code: "NO_ACTIVE_SPEECH",
                    description: "A speech-scoped message arrived with no active turn.",
                };
                ws.send(JSON.stringify(warning));
                ws.on("message", (data) => {
                    const parsed = JSON.parse(data.toString());
                    if (parsed.type === "Speak") {
                        const error: Deepgram.speak.SpeakV2Error = {
                            type: "Error",
                            code: "NET-0000",
                            description: "Synthesis failed.",
                        };
                        ws.send(JSON.stringify(error));
                    }
                });
            });

            socket.connect();
            await socket.waitForOpen();
            await waitForEventCount(tracker, "Warning", 1);

            socket.sendSpeak({ type: "Speak", text: "Test" });
            await waitForEventCount(tracker, "Error", 1);

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
        it("should throw 'Socket is not open' when sending before the connection is open", async () => {
            const client = makeClient();

            const socket = await client.speak.v2.createConnection({ model: "flux-alexis-en" });
            openSockets.push(socket);

            // Not connected — sending must throw with the specific not-open error
            expect(() => {
                socket.sendSpeak({ type: "Speak", text: "Test" });
            }).toThrow("Socket is not open");

            socket.close();
        });
    });
});
