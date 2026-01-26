import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { WebSocketEventTracker, waitForEventCount } from "./helpers";
import type { Server } from "ws";

/**
 * Edge case tests for WebSocket connections.
 * These tests verify proper handling of various error conditions and edge cases.
 */
describe("WebSocket edge cases and error handling", () => {
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

  describe("Connection state management", () => {
    it("should handle rapid connect/disconnect cycles", async () => {
      const tracker = new WebSocketEventTracker();

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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.listen.v1.createConnection({
        model: "nova-2"
      });

      socket.on("open", () => tracker.track("open"));
      socket.on("close", () => tracker.track("close"));
      socket.on("error", (err) => tracker.track("error", err));

      wsServer.on("connection", (ws) => {
        ws.send(JSON.stringify({ type: "Metadata" }));
      });

      // Rapid connect/disconnect cycles
      for (let i = 0; i < 3; i++) {
        socket.connect();
        await socket.waitForOpen();
        socket.close();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Should have exactly 3 open and 3 close events
      expect(tracker.getCount("open")).toBe(3);
      expect(tracker.getCount("close")).toBe(3);
    });

    it("should handle multiple event registrations without duplicates", async () => {
      const tracker = new WebSocketEventTracker();

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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      // Register the same handler multiple times
      const handler = () => tracker.track("open");
      socket.on("open", handler);
      socket.on("open", handler);
      socket.on("open", handler);

      wsServer.on("connection", (ws) => {
        ws.send(JSON.stringify({ type: "Metadata" }));
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should still only fire once per actual event
      expect(tracker.getCount("open")).toBe(1);

      socket.close();
    });
  });

  describe("Message handling edge cases", () => {
    it("should handle very large binary messages", async () => {
      const receivedData: any[] = [];

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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.speak.v1.createConnection({
        model: "aura-asteria-en"
      });

      socket.on("message", (data) => {
        // Handle binary data (ArrayBuffer or Blob depending on environment)
        if (data instanceof ArrayBuffer) {
          receivedData.push({
            type: "binary",
            size: data.byteLength
          });
        } else if (data instanceof Blob) {
          receivedData.push({
            type: "binary",
            size: data.size
          });
        } else {
          receivedData.push(data);
        }
      });

      wsServer.on("connection", (ws) => {
        // Send a very large binary message (1MB)
        const largeBuffer = new ArrayBuffer(1024 * 1024);
        const view = new Uint8Array(largeBuffer);
        view.fill(42);

        ws.send(JSON.stringify({ type: "Metadata" }));
        ws.send(largeBuffer);
        ws.send(JSON.stringify({ type: "Flushed" }));
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(receivedData).toHaveLength(3);
      expect(receivedData[0]).toMatchObject({ type: "Metadata" });
      expect(receivedData[1]).toMatchObject({
        type: "binary",
        size: 1024 * 1024
      });
      expect(receivedData[2]).toMatchObject({ type: "Flushed" });

      socket.close();
    });

    it("should handle empty messages", async () => {
      const receivedData: any[] = [];

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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.listen.v1.createConnection({
        model: "nova-2"
      });

      socket.on("message", (data) => {
        receivedData.push(data);
      });

      wsServer.on("connection", (ws) => {
        // Send various empty messages
        ws.send("");  // Empty string
        ws.send(JSON.stringify({}));  // Empty object
        ws.send(new ArrayBuffer(0));  // Empty buffer
        ws.send(JSON.stringify({ type: "Transcript", transcript: "" }));  // Normal message
      });

      socket.connect();
      await socket.waitForOpen();
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(receivedData).toHaveLength(4);
      expect(receivedData[0]).toBe("");
      expect(receivedData[1]).toEqual({});
      // Empty binary can be ArrayBuffer or Blob depending on environment
      const isEmptyBinary = receivedData[2] instanceof ArrayBuffer || receivedData[2] instanceof Blob;
      expect(isEmptyBinary).toBe(true);
      const emptyBinarySize = receivedData[2] instanceof ArrayBuffer ? receivedData[2].byteLength : receivedData[2].size;
      expect(emptyBinarySize).toBe(0);
      expect(receivedData[3]).toMatchObject({ type: "Transcript", transcript: "" });

      socket.close();
    });
  });

  describe("Error recovery", () => {
    it("should handle server closing connection unexpectedly", async () => {
      const tracker = new WebSocketEventTracker();

      server
        .mockEndpoint()
        .get("/v2/listen")
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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.listen.v2.createConnection({
        model: "nova-3"
      });

      socket.on("open", () => tracker.track("open"));
      socket.on("close", (event) => tracker.track("close", event));
      socket.on("error", (error) => tracker.track("error", error));

      let serverWs: any;
      wsServer.on("connection", (ws) => {
        serverWs = ws;
        ws.send(JSON.stringify({ type: "Metadata" }));

        // Close connection from server side after 200ms
        setTimeout(() => {
          ws.close(1000, "Server closing");
        }, 200);
      });

      socket.connect();
      await socket.waitForOpen();

      // Wait for server to close connection
      await waitForEventCount(tracker, "close", 1, 5000);

      expect(tracker.getCount("open")).toBe(1);
      expect(tracker.getCount("close")).toBe(1);

      const closeEvent = tracker.getHistory().find(e => e.event === "close");
      expect(closeEvent?.data).toMatchObject({
        code: 1000,
        reason: "Server closing"
      });
    });

    it("should handle sending data after connection is closed", async () => {
      const errors: any[] = [];

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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.listen.v1.createConnection({
        model: "nova-2"
      });

      socket.on("error", (error) => {
        errors.push(error);
      });

      wsServer.on("connection", (ws) => {
        ws.send(JSON.stringify({ type: "Metadata" }));
      });

      socket.connect();
      await socket.waitForOpen();

      // Close the connection
      socket.close();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Try to send data after close
      try {
        socket.send(new ArrayBuffer(100));
      } catch (error) {
        errors.push(error);
      }

      // Should have received an error
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Event listener cleanup", () => {
    it("should properly clean up internal event listeners on close", async () => {
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
          production: `ws://localhost:${wsPort}`,
          agent: `ws://localhost:${wsPort}`,
        }
      });

      const socket = await client.agent.v1.createConnection({
        model: "aura-eos-2"
      });

      // Set up event handlers using on() method
      let openCalled = false;
      let closeCalled = false;
      socket.on("open", () => { openCalled = true; });
      socket.on("close", () => { closeCalled = true; });

      wsServer.on("connection", (ws) => {
        ws.send(JSON.stringify({ type: "Welcome" }));
      });

      socket.connect();
      await socket.waitForOpen();

      // Verify handlers were called
      expect(openCalled).toBe(true);

      // Access internal socket to verify listeners exist
      const internalSocket = (socket as any).socket;
      expect(internalSocket._listeners.open.length).toBeGreaterThan(0);
      expect(internalSocket._listeners.message.length).toBeGreaterThan(0);

      // Close connection
      socket.close();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify close handler was called
      expect(closeCalled).toBe(true);
    });
  });
});