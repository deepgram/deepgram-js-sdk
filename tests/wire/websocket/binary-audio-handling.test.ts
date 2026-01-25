import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { generateMockAudioData, WebSocketEventTracker } from "./helpers";
import type { Server } from "ws";

/**
 * Tests for binary audio data handling in WebSocket connections.
 *
 * Issue: The auto-generated Socket classes incorrectly assume all WebSocket
 * messages are JSON strings and try to parse binary audio data, resulting
 * in empty objects {} instead of ArrayBuffer/Blob data.
 *
 * Our wrapped socket classes should properly handle both text and binary data.
 */
describe("WebSocket binary audio data handling", () => {
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
  });

  afterEach(() => {
    wsServer?.close();
  });

  describe("TTS (speak.v1) binary audio handling", () => {
    beforeEach(() => {
      server
        .mockEndpoint()
        .get("/v1/speak")
        .respondWith()
        .statusCode(101)
        .headers({
          "Upgrade": "websocket",
          "Connection": "Upgrade",
        })
        .build();
    });

    it("should receive binary audio data as ArrayBuffer, not empty object", async () => {
      const tracker = new WebSocketEventTracker();
      const receivedData: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          ws: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en",
        encoding: "linear16",
        sample_rate: 16000
      });

      // Track all message events
      socket.on("message", (data) => {
        tracker.track("message", data);
        receivedData.push(data);
      });

      // Handle WebSocket connection
      wsServer.on("connection", (ws) => {
        // Send metadata first (JSON)
        ws.send(JSON.stringify({
          type: "Metadata",
          request_id: "test-123",
          model_name: "aura-asteria-en",
          model_version: "latest"
        }));

        // Send binary audio chunks
        const audioData1 = generateMockAudioData(1024);
        const audioData2 = generateMockAudioData(2048);
        const audioData3 = generateMockAudioData(512);

        ws.send(audioData1);
        ws.send(audioData2);
        ws.send(audioData3);

        // Send flushed message (JSON)
        ws.send(JSON.stringify({
          type: "Flushed",
          sequence_id: 0
        }));
      });

      socket.connect();
      await socket.waitForOpen();

      // Wait for all messages
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify we received 5 messages total
      expect(tracker.getCount("message")).toBe(5);

      // Check each message type
      expect(receivedData[0]).toMatchObject({ type: "Metadata" });

      // Binary audio should be ArrayBuffer, NOT empty object {}
      expect(receivedData[1]).toBeInstanceOf(ArrayBuffer);
      expect(receivedData[1]).toHaveProperty("byteLength", 1024);

      expect(receivedData[2]).toBeInstanceOf(ArrayBuffer);
      expect(receivedData[2]).toHaveProperty("byteLength", 2048);

      expect(receivedData[3]).toBeInstanceOf(ArrayBuffer);
      expect(receivedData[3]).toHaveProperty("byteLength", 512);

      expect(receivedData[4]).toMatchObject({ type: "Flushed" });

      socket.close();
    });

    it("should handle mixed text and binary messages in correct order", async () => {
      const receivedData: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          ws: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("message", (data) => {
        receivedData.push({
          type: typeof data === "object" && data?.type ? data.type : "binary",
          isBinary: data instanceof ArrayBuffer || data instanceof Blob,
          size: data instanceof ArrayBuffer ? data.byteLength :
                data instanceof Blob ? data.size :
                undefined
        });
      });

      wsServer.on("connection", (ws) => {
        // Interleave JSON and binary messages
        ws.send(JSON.stringify({ type: "Metadata" }));
        ws.send(generateMockAudioData(100));
        ws.send(JSON.stringify({ type: "Warning", message: "test" }));
        ws.send(generateMockAudioData(200));
        ws.send(JSON.stringify({ type: "Flushed" }));
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(receivedData).toEqual([
        { type: "Metadata", isBinary: false, size: undefined },
        { type: "binary", isBinary: true, size: 100 },
        { type: "Warning", isBinary: false, size: undefined },
        { type: "binary", isBinary: true, size: 200 },
        { type: "Flushed", isBinary: false, size: undefined }
      ]);

      socket.close();
    });
  });

  describe("STT (listen.v1/v2) binary handling", () => {
    it("should properly send binary audio data in listen.v1", async () => {
      const sentData: any[] = [];

      server
        .mockEndpoint()
        .get("/v1/listen")
        .respondWith()
        .statusCode(101)
        .headers({
          "Upgrade": "websocket",
          "Connection": "Upgrade",
        })
        .build();

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          ws: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.listen.v1.createConnection({
        model: "nova-2",
        encoding: "linear16",
        sample_rate: 16000
      });

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          sentData.push({
            isBinary: Buffer.isBuffer(data),
            size: Buffer.isBuffer(data) ? data.length : undefined,
            isString: typeof data === "string"
          });

          // Send back a transcript response
          ws.send(JSON.stringify({
            channel: { alternatives: [{ transcript: "test" }] },
            is_final: true
          }));
        });
      });

      socket.connect();
      await socket.waitForOpen();

      // Send binary audio data
      const audioBuffer = generateMockAudioData(4096);
      socket.send(audioBuffer);

      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify binary data was sent properly
      expect(sentData).toHaveLength(1);
      expect(sentData[0]).toEqual({
        isBinary: true,
        size: 4096,
        isString: false
      });

      socket.close();
    });
  });

  describe("Agent (agent.v1) binary handling", () => {
    it("should handle binary audio from agent WebSocket", async () => {
      const receivedData: any[] = [];

      server
        .mockEndpoint()
        .get("/v1/agent")
        .respondWith()
        .statusCode(101)
        .headers({
          "Upgrade": "websocket",
          "Connection": "Upgrade",
        })
        .build();

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          ws: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.agent.v1.createConnection({
        model: "aura-eos-2"
      });

      socket.on("message", (data) => {
        receivedData.push({
          type: typeof data === "object" && data?.type ? data.type : "audio",
          isBinary: data instanceof ArrayBuffer || data instanceof Blob
        });
      });

      wsServer.on("connection", (ws) => {
        // Agent messages
        ws.send(JSON.stringify({ type: "Welcome" }));
        ws.send(JSON.stringify({ type: "UserStartedSpeaking" }));

        // Binary audio from agent
        ws.send(generateMockAudioData(1000));

        ws.send(JSON.stringify({ type: "AgentThinking" }));

        // More audio
        ws.send(generateMockAudioData(2000));

        ws.send(JSON.stringify({ type: "AgentStartedSpeaking" }));
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(receivedData).toEqual([
        { type: "Welcome", isBinary: false },
        { type: "UserStartedSpeaking", isBinary: false },
        { type: "audio", isBinary: true },
        { type: "AgentThinking", isBinary: false },
        { type: "audio", isBinary: true },
        { type: "AgentStartedSpeaking", isBinary: false }
      ]);

      socket.close();
    });
  });

  describe("Error handling for malformed messages", () => {
    it("should handle invalid JSON gracefully", async () => {
      const receivedData: any[] = [];
      const errors: any[] = [];

      server
        .mockEndpoint()
        .get("/v1/speak")
        .respondWith()
        .statusCode(101)
        .headers({
          "Upgrade": "websocket",
          "Connection": "Upgrade",
        })
        .build();

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          ws: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("message", (data) => {
        receivedData.push(data);
      });

      socket.on("error", (error) => {
        errors.push(error);
      });

      wsServer.on("connection", (ws) => {
        // Send valid JSON
        ws.send(JSON.stringify({ type: "Metadata" }));

        // Send invalid JSON (should pass through as string)
        ws.send("{ invalid json");

        // Send binary
        ws.send(generateMockAudioData(100));

        // Send another valid JSON
        ws.send(JSON.stringify({ type: "Flushed" }));
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should have received all 4 messages
      expect(receivedData).toHaveLength(4);

      // First should be parsed JSON
      expect(receivedData[0]).toMatchObject({ type: "Metadata" });

      // Invalid JSON should be passed as raw string
      expect(receivedData[1]).toBe("{ invalid json");

      // Binary should be ArrayBuffer
      expect(receivedData[2]).toBeInstanceOf(ArrayBuffer);

      // Last should be parsed JSON
      expect(receivedData[3]).toMatchObject({ type: "Flushed" });

      // No errors should be thrown
      expect(errors).toHaveLength(0);

      socket.close();
    });
  });
});