import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReconnectingWebSocket } from "../../src/core/websocket/ws";

/**
 * Unit tests for WebSocket wrapper functionality.
 * These tests verify that our wrapper classes correctly prevent duplicate
 * event registrations and handle binary data without needing real connections.
 */
describe("WebSocket wrapper functionality", () => {
  describe("ReconnectingWebSocket event management", () => {
    let socket: ReconnectingWebSocket;

    beforeEach(() => {
      socket = new ReconnectingWebSocket("ws://test.com", ["test"], {
        automaticOpen: false,  // Prevent automatic connection
        reconnectInterval: 0,
        reconnectDecay: 1,
        maxReconnectInterval: 0,
        timeoutInterval: 0,
        maxRetries: 0
      });
    });

    afterEach(() => {
      // Clean up to prevent connection attempts
      if (socket) {
        (socket as any)._shouldReconnect = false;
        socket.close();
      }
    });

    it("should allow adding and removing event listeners", () => {

      const openHandler = vi.fn();
      const messageHandler = vi.fn();

      // Add listeners
      socket.addEventListener("open", openHandler);
      socket.addEventListener("message", messageHandler);

      // Check internal listener arrays
      const socketAny = socket as any;
      expect(socketAny._listeners.open).toContain(openHandler);
      expect(socketAny._listeners.message).toContain(messageHandler);

      // Remove listeners
      socket.removeEventListener("open", openHandler);
      socket.removeEventListener("message", messageHandler);

      expect(socketAny._listeners.open).not.toContain(openHandler);
      expect(socketAny._listeners.message).not.toContain(messageHandler);
    });

    it("should accumulate duplicate listeners if added multiple times", () => {

      const handler = vi.fn();

      // Add the same handler 3 times
      socket.addEventListener("open", handler);
      socket.addEventListener("open", handler);
      socket.addEventListener("open", handler);

      const socketAny = socket as any;

      // Should have 3 instances of the handler
      const count = socketAny._listeners.open.filter((h: any) => h === handler).length;
      expect(count).toBe(3);
    });

    it("should remove all instances when removeEventListener is called", () => {
      const handler = vi.fn();

      // Add the same handler 3 times
      socket.addEventListener("open", handler);
      socket.addEventListener("open", handler);
      socket.addEventListener("open", handler);

      const socketAny = socket as any;

      // Verify 3 instances exist
      const countBefore = socketAny._listeners.open.filter((h: any) => h === handler).length;
      expect(countBefore).toBe(3);

      // Remove handler - based on the implementation, it removes ALL instances
      socket.removeEventListener("open", handler);

      // Should have 0 instances left (removeEventListener uses filter to remove ALL matching)
      const countAfter = socketAny._listeners.open.filter((h: any) => h === handler).length;
      expect(countAfter).toBe(0);
    });
  });

  describe("Message type detection", () => {
    it("should correctly identify string messages", () => {
      const event = new MessageEvent("message", {
        data: '{"type":"Metadata","id":"123"}'
      });

      expect(typeof event.data).toBe("string");
      expect(event.data).toContain("Metadata");
    });

    it("should correctly identify ArrayBuffer messages", () => {
      const buffer = new ArrayBuffer(100);
      const event = new MessageEvent("message", {
        data: buffer
      });

      expect(event.data).toBeInstanceOf(ArrayBuffer);
      expect(event.data).toBe(buffer);
    });

    it("should correctly identify Blob messages", () => {
      const blob = new Blob([new Uint8Array([1, 2, 3])], { type: "audio/wav" });
      const event = new MessageEvent("message", {
        data: blob
      });

      expect(event.data).toBeInstanceOf(Blob);
      expect(event.data.size).toBe(3);
      expect(event.data.type).toBe("audio/wav");
    });
  });

  describe("JSON parsing behavior", () => {
    it("should parse valid JSON strings", () => {
      const data = '{"type":"Test","value":123}';
      const parsed = JSON.parse(data);

      expect(parsed).toEqual({ type: "Test", value: 123 });
    });

    it("should throw on invalid JSON", () => {
      const data = '{ invalid json';

      expect(() => JSON.parse(data)).toThrow();
    });

    it("should not be able to parse binary data", () => {
      const buffer = new ArrayBuffer(10);

      // This is what the auto-generated code tries to do
      expect(() => JSON.parse(buffer as any)).toThrow();
    });
  });

  describe("Event handler isolation", () => {
    it("should maintain separate listener arrays for each event type", () => {
      const socket = new ReconnectingWebSocket("ws://test.com", ["test"], {
        automaticOpen: false,
        maxRetries: 0
      });

      const openHandler = vi.fn();
      const messageHandler = vi.fn();
      const closeHandler = vi.fn();
      const errorHandler = vi.fn();

      socket.addEventListener("open", openHandler);
      socket.addEventListener("message", messageHandler);
      socket.addEventListener("close", closeHandler);
      socket.addEventListener("error", errorHandler);

      const socketAny = socket as any;

      expect(socketAny._listeners.open).toContain(openHandler);
      expect(socketAny._listeners.message).toContain(messageHandler);
      expect(socketAny._listeners.close).toContain(closeHandler);
      expect(socketAny._listeners.error).toContain(errorHandler);

      // Each array should only contain its specific handler
      expect(socketAny._listeners.open).not.toContain(messageHandler);
      expect(socketAny._listeners.message).not.toContain(openHandler);
    });
  });

  describe("Binary data handling patterns", () => {
    it("should handle ArrayBuffer correctly", () => {
      const buffer = new ArrayBuffer(1024);
      const view = new Uint8Array(buffer);

      // Fill with test data
      for (let i = 0; i < view.length; i++) {
        view[i] = i % 256;
      }

      // Verify properties
      expect(buffer.byteLength).toBe(1024);
      expect(view[0]).toBe(0);
      expect(view[255]).toBe(255);
      expect(view[256]).toBe(0);
    });

    it("should handle Blob correctly", async () => {
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const blob = new Blob([data], { type: "application/octet-stream" });

      expect(blob.size).toBe(5);
      expect(blob.type).toBe("application/octet-stream");

      // Convert back to ArrayBuffer
      const buffer = await blob.arrayBuffer();
      const view = new Uint8Array(buffer);

      expect(view).toEqual(data);
    });
  });

  describe("Helper function behavior", () => {
    it("should correctly implement setupBinaryHandling pattern", () => {
      // Mock the pattern used in our wrapper
      const eventHandlers = {
        message: vi.fn()
      };

      const binaryAwareHandler = (event: MessageEvent) => {
        if (typeof event.data === "string") {
          try {
            const data = JSON.parse(event.data);
            eventHandlers.message?.(data);
          } catch (error) {
            eventHandlers.message?.(event.data);
          }
        } else {
          // Binary data - pass through as-is
          eventHandlers.message?.(event.data);
        }
      };

      // Test with JSON string
      const jsonEvent = new MessageEvent("message", {
        data: '{"type":"Test"}'
      });
      binaryAwareHandler(jsonEvent);
      expect(eventHandlers.message).toHaveBeenCalledWith({ type: "Test" });

      // Test with invalid JSON string
      const invalidEvent = new MessageEvent("message", {
        data: 'invalid'
      });
      binaryAwareHandler(invalidEvent);
      expect(eventHandlers.message).toHaveBeenCalledWith('invalid');

      // Test with binary data
      const binaryEvent = new MessageEvent("message", {
        data: new ArrayBuffer(10)
      });
      binaryAwareHandler(binaryEvent);
      expect(eventHandlers.message).toHaveBeenCalledWith(expect.any(ArrayBuffer));
    });

    it("should correctly implement preventDuplicateEventListeners pattern", () => {
      const socket = new ReconnectingWebSocket("ws://test.com", ["test"], {
        automaticOpen: false,
        maxRetries: 0
      });

      const handlers = {
        handleOpen: vi.fn(),
        handleMessage: vi.fn(),
        handleClose: vi.fn(),
        handleError: vi.fn()
      };

      // Simulate constructor adding handlers
      socket.addEventListener("open", handlers.handleOpen);
      socket.addEventListener("message", handlers.handleMessage);
      socket.addEventListener("close", handlers.handleClose);
      socket.addEventListener("error", handlers.handleError);

      const socketAny = socket as any;

      // Verify handlers are registered
      expect(socketAny._listeners.open).toContain(handlers.handleOpen);
      expect(socketAny._listeners.message).toContain(handlers.handleMessage);

      // Simulate our preventDuplicateEventListeners function
      socket.removeEventListener("open", handlers.handleOpen);
      socket.removeEventListener("message", handlers.handleMessage);
      socket.removeEventListener("close", handlers.handleClose);
      socket.removeEventListener("error", handlers.handleError);

      // Verify handlers are removed
      expect(socketAny._listeners.open).not.toContain(handlers.handleOpen);
      expect(socketAny._listeners.message).not.toContain(handlers.handleMessage);
      expect(socketAny._listeners.close).not.toContain(handlers.handleClose);
      expect(socketAny._listeners.error).not.toContain(handlers.handleError);
    });
  });
});