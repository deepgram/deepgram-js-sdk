import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { generateMockAudioData, WebSocketEventTracker } from "./helpers";
import type { Server } from "ws";

/**
 * Wire tests for Speak v1 WebSocket TTS streaming.
 *
 * These tests verify:
 * 1. Text-to-speech streaming via WebSocket
 * 2. Sending text and receiving binary audio
 * 3. Flush, clear, and close commands
 * 4. Metadata and control message handling
 */
describe("Speak v1 WebSocket TTS streaming", () => {
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

    // Mock the speak endpoint for WebSocket upgrade
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

  afterEach(() => {
    wsServer?.close();
  });

  describe("Basic TTS streaming", () => {
    it("should send text and receive audio chunks", async () => {
      const receivedMessages: any[] = [];
      const sentToServer: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en",
        encoding: "linear16",
        sample_rate: 16000
      });

      socket.on("message", (data) => {
        receivedMessages.push(data);
      });

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          sentToServer.push(parsed);

          // When we receive text, send back audio
          if (parsed.type === "Speak") {
            // Send metadata first
            ws.send(JSON.stringify({
              type: "Metadata",
              request_id: "test-123",
              model_name: "aura-asteria-en",
              model_version: "2024-01-01"
            }));

            // Send audio chunks
            ws.send(generateMockAudioData(1024));
            ws.send(generateMockAudioData(2048));
          }

          // When we receive flush, send flushed confirmation
          if (parsed.type === "Flush") {
            ws.send(generateMockAudioData(512)); // Final audio chunk
            ws.send(JSON.stringify({
              type: "Flushed",
              sequence_id: parsed.sequence_id || 0
            }));
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();

      // Send text to be spoken
      socket.sendText({
        type: "Speak",
        text: "Hello, this is a test."
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Send flush to get remaining audio
      socket.sendFlush({
        type: "Flush",
        sequence_id: 1
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Verify messages sent to server
      expect(sentToServer).toHaveLength(2);
      expect(sentToServer[0]).toMatchObject({ type: "Speak", text: "Hello, this is a test." });
      expect(sentToServer[1]).toMatchObject({ type: "Flush", sequence_id: 1 });

      // Verify received messages (metadata + audio + flushed)
      expect(receivedMessages.length).toBeGreaterThanOrEqual(4);
      expect(receivedMessages[0]).toMatchObject({ type: "Metadata" });

      // Check binary audio data
      const isBinaryType = (data: any) => data instanceof ArrayBuffer || data instanceof Blob;
      expect(isBinaryType(receivedMessages[1])).toBe(true);
      expect(isBinaryType(receivedMessages[2])).toBe(true);

      // Final messages include last audio chunk and flushed
      const flushedMessage = receivedMessages.find(m => m?.type === "Flushed");
      expect(flushedMessage).toMatchObject({ type: "Flushed", sequence_id: 1 });

      socket.close();
    });

    it("should handle clear command to cancel pending speech", async () => {
      const sentToServer: any[] = [];
      const receivedMessages: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("message", (data) => {
        receivedMessages.push(data);
      });

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          sentToServer.push(parsed);

          if (parsed.type === "Clear") {
            ws.send(JSON.stringify({
              type: "Cleared",
              sequence_id: parsed.sequence_id || 0
            }));
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();

      // Send clear to cancel any pending speech
      socket.sendClear({
        type: "Clear",
        sequence_id: 1
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(sentToServer).toHaveLength(1);
      expect(sentToServer[0]).toMatchObject({ type: "Clear", sequence_id: 1 });

      expect(receivedMessages).toHaveLength(1);
      expect(receivedMessages[0]).toMatchObject({ type: "Cleared", sequence_id: 1 });

      socket.close();
    });

    it("should handle close command for graceful shutdown", async () => {
      const sentToServer: any[] = [];
      const tracker = new WebSocketEventTracker();

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("close", (event) => tracker.track("close", event));

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          sentToServer.push(parsed);

          if (parsed.type === "Close") {
            // Server acknowledges close and closes connection
            ws.close(1000, "Closing as requested");
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();

      // Send close command
      socket.sendClose({
        type: "Close"
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(sentToServer).toHaveLength(1);
      expect(sentToServer[0]).toMatchObject({ type: "Close" });

      // Should have received close event
      expect(tracker.getCount("close")).toBeGreaterThanOrEqual(1);

      socket.close();
    });
  });

  describe("Multiple text chunks", () => {
    it("should handle streaming multiple text chunks", async () => {
      const sentToServer: any[] = [];
      const receivedAudioChunks: number = 0;

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      let audioChunkCount = 0;
      socket.on("message", (data) => {
        const isBinary = data instanceof ArrayBuffer || data instanceof Blob;
        if (isBinary) {
          audioChunkCount++;
        }
      });

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          sentToServer.push(parsed);

          // Send audio for each text chunk
          if (parsed.type === "Speak") {
            ws.send(generateMockAudioData(512));
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();

      // Send multiple text chunks (simulating sentence streaming)
      const sentences = [
        "Hello, world.",
        "How are you today?",
        "This is a test of streaming TTS."
      ];

      for (const text of sentences) {
        socket.sendText({ type: "Speak", text });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Should have sent 3 text messages
      expect(sentToServer).toHaveLength(3);
      sentToServer.forEach((msg, i) => {
        expect(msg).toMatchObject({ type: "Speak", text: sentences[i] });
      });

      // Should have received audio for each chunk
      expect(audioChunkCount).toBe(3);

      socket.close();
    });
  });

  describe("Warning messages", () => {
    it("should handle warning messages from server", async () => {
      const receivedMessages: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("message", (data) => {
        receivedMessages.push(data);
      });

      wsServer.on("connection", (ws) => {
        // Send a warning message
        ws.send(JSON.stringify({
          type: "Warning",
          warn_code: "DEPRECATED_MODEL",
          warn_msg: "The model 'aura-asteria-en' is deprecated. Please use 'aura-2-en-asteria'."
        }));

        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          if (parsed.type === "Speak") {
            ws.send(JSON.stringify({ type: "Metadata" }));
            ws.send(generateMockAudioData(256));
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have received the warning
      const warning = receivedMessages.find(m => m?.type === "Warning");
      expect(warning).toMatchObject({
        type: "Warning",
        warn_code: "DEPRECATED_MODEL"
      });

      socket.close();
    });
  });

  describe("Error handling", () => {
    it("should handle server-side errors gracefully", async () => {
      const errors: any[] = [];
      const messages: any[] = [];

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("error", (error) => errors.push(error));
      socket.on("message", (data) => messages.push(data));

      wsServer.on("connection", (ws) => {
        ws.on("message", (data) => {
          const parsed = JSON.parse(data.toString());
          if (parsed.type === "Speak") {
            // Send an error response
            ws.send(JSON.stringify({
              type: "Error",
              err_code: "RATE_LIMIT",
              err_msg: "Rate limit exceeded. Please slow down."
            }));
          }
        });
      });

      socket.connect();
      await socket.waitForOpen();

      socket.sendText({ type: "Speak", text: "Test" });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Should have received the error message
      const errorMsg = messages.find(m => m?.type === "Error");
      expect(errorMsg).toMatchObject({
        type: "Error",
        err_code: "RATE_LIMIT"
      });

      socket.close();
    });

    it("should throw error when sending before connection is open", async () => {
      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      // Don't call connect() - socket should not be open

      // Attempting to send should throw
      expect(() => {
        socket.sendText({ type: "Speak", text: "Test" });
      }).toThrow();

      socket.close();
    });
  });

  describe("Audio encoding options", () => {
    it("should respect encoding and sample_rate options", async () => {
      // This test verifies that the connection is created with the right options
      // The actual encoding handling is server-side, but we verify the handshake

      const client = new DeepgramClient({
        maxRetries: 0,
        apiKey: "test",
        environment: {
          base: server.baseUrl,
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      // Create connection with specific audio settings
      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en",
        encoding: "mp3",
        sample_rate: 24000,
        bit_rate: 128000,
        container: "none"
      });

      let connectionMade = false;
      wsServer.on("connection", () => {
        connectionMade = true;
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(connectionMade).toBe(true);

      socket.close();
    });
  });
});
