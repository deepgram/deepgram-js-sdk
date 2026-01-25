import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";
import { MockServer } from "../../mock-server/MockServer";
import { WebSocketEventTracker } from "./helpers";
import type { Server } from "ws";

/**
 * Tests for duplicate WebSocket 'open' event issue.
 *
 * Issue: The auto-generated Socket classes register event listeners twice:
 * - Once in the constructor
 * - Again in the connect() method
 *
 * This causes events to fire multiple times when connect() is called.
 * Our wrapped socket classes should prevent this.
 */
describe("WebSocket duplicate 'open' event prevention", () => {
  let server: MockServer;
  let wsServer: Server;
  let wsPort: number;

  beforeEach(async () => {
    // Create HTTP mock server
    server = mockServerPool.createServer();

    // Import and create WebSocket server
    const { WebSocketServer } = await import("ws");
    wsServer = new WebSocketServer({ port: 0 });

    // Get the actual port after server starts
    await new Promise<void>((resolve) => {
      wsServer.on("listening", () => {
        const address = wsServer.address();
        wsPort = typeof address === "object" ? address.port : 0;
        resolve();
      });
    });

    // Mock the WebSocket upgrade endpoint
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
  });

  afterEach(() => {
    wsServer?.close();
  });

  it("should fire 'open' event exactly once for listen.v1", async () => {
    const tracker = new WebSocketEventTracker();
    const client = new DeepgramClient({
      maxRetries: 0,
      apiKey: "test",
      environment: {
        base: server.baseUrl,
        ws: `ws://localhost:${wsPort}`,
      }
    });

    // Create connection (doesn't connect yet)
    const socket = await client.listen.v1.createConnection({
      model: "nova-2"
    });

    // Track open events
    socket.on("open", () => {
      tracker.track("open");
    });

    // Handle WebSocket connection on server
    wsServer.on("connection", (ws) => {
      // Send a test message to verify connection
      ws.send(JSON.stringify({
        type: "Metadata",
        transaction_key: "test",
        request_id: "test-123",
        created: new Date().toISOString(),
        duration: 0,
        channels: 1
      }));
    });

    // Connect - this should NOT cause duplicate events
    socket.connect();

    // Wait for connection to establish
    await socket.waitForOpen();

    // Give a bit more time for any duplicate events to fire
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify only one open event fired
    expect(tracker.getCount("open")).toBe(1);

    socket.close();
  });

  it("should fire 'open' event exactly once for listen.v2", async () => {
    const tracker = new WebSocketEventTracker();
    const client = new DeepgramClient({
      maxRetries: 0,
      apiKey: "test",
      environment: {
        base: server.baseUrl,
        ws: `ws://localhost:${wsPort}`,
      }
    });

    // Mock v2 endpoint
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

    const socket = await client.listen.v2.createConnection({
      model: "nova-3"
    });

    socket.on("open", () => {
      tracker.track("open");
    });

    wsServer.on("connection", (ws) => {
      ws.send(JSON.stringify({ type: "Metadata" }));
    });

    socket.connect();
    await socket.waitForOpen();
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(tracker.getCount("open")).toBe(1);

    socket.close();
  });

  it("should fire 'open' event exactly once for speak.v1", async () => {
    const tracker = new WebSocketEventTracker();
    const client = new DeepgramClient({
      maxRetries: 0,
      apiKey: "test",
      environment: {
        base: server.baseUrl,
        ws: `ws://localhost:${wsPort}`,
      }
    });

    // Mock speak endpoint
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

    const socket = await client.speak.v1.createConnection({
      model: "aura-asteria-en"
    });

    socket.on("open", () => {
      tracker.track("open");
    });

    wsServer.on("connection", (ws) => {
      ws.send(JSON.stringify({ type: "Metadata" }));
    });

    socket.connect();
    await socket.waitForOpen();
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(tracker.getCount("open")).toBe(1);

    socket.close();
  });

  it("should fire 'open' event exactly once for agent.v1", async () => {
    const tracker = new WebSocketEventTracker();
    const client = new DeepgramClient({
      maxRetries: 0,
      apiKey: "test",
      environment: {
        base: server.baseUrl,
        ws: `ws://localhost:${wsPort}`,
      }
    });

    // Mock agent endpoint
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

    const socket = await client.agent.v1.createConnection({
      model: "aura-eos-2"
    });

    socket.on("open", () => {
      tracker.track("open");
    });

    wsServer.on("connection", (ws) => {
      ws.send(JSON.stringify({ type: "UserStartedSpeaking" }));
    });

    socket.connect();
    await socket.waitForOpen();
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(tracker.getCount("open")).toBe(1);

    socket.close();
  });

  it("should not duplicate events when connect() is called multiple times", async () => {
    const tracker = new WebSocketEventTracker();
    const client = new DeepgramClient({
      maxRetries: 0,
      apiKey: "test",
      environment: {
        base: server.baseUrl,
        ws: `ws://localhost:${wsPort}`,
      }
    });

    const socket = await client.listen.v1.createConnection({
      model: "nova-2"
    });

    // Track all events
    socket.on("open", () => tracker.track("open"));
    socket.on("close", () => tracker.track("close"));
    socket.on("error", (err) => tracker.track("error", err));
    socket.on("message", (msg) => tracker.track("message", msg));

    let connectionCount = 0;
    wsServer.on("connection", (ws) => {
      connectionCount++;
      ws.send(JSON.stringify({ type: "Metadata", connection: connectionCount }));
    });

    // First connect
    socket.connect();
    await socket.waitForOpen();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Close connection
    socket.close();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Second connect - should NOT duplicate event handlers
    socket.connect();
    await socket.waitForOpen();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Should have exactly 2 open events (one per connect)
    expect(tracker.getCount("open")).toBe(2);

    // Check message events - should have received 2 metadata messages
    const messageEvents = tracker.getHistory()
      .filter(e => e.event === "message")
      .filter(e => e.data?.type === "Metadata");
    expect(messageEvents).toHaveLength(2);

    socket.close();
  });
});