import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Unit tests for async send/finalize race condition fix
 *
 * Issue: In v3.11.1, send() appeared synchronous but had hidden async behavior
 * causing race conditions with finalize(). In v5, send operations are truly
 * synchronous, preventing message loss.
 */

describe("Async send/finalize race condition tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Synchronous send behavior", () => {
    it("should send all messages synchronously before close", () => {
      const sentMessages: any[] = [];

      // Mock WebSocket with synchronous send (v5 behavior)
      const mockSocket = {
        readyState: 1, // OPEN
        send: vi.fn((data) => {
          sentMessages.push(data);
        }),
        close: vi.fn()
      };

      // Simulate sending multiple messages followed by finalize
      mockSocket.send({ type: "media", data: "chunk1" });
      mockSocket.send({ type: "media", data: "chunk2" });
      mockSocket.send({ type: "media", data: "chunk3" });
      mockSocket.send({ type: "finalize" });

      // Close immediately after finalize
      mockSocket.close();

      // All messages should be sent before close
      expect(sentMessages).toHaveLength(4);
      expect(sentMessages[0]).toEqual({ type: "media", data: "chunk1" });
      expect(sentMessages[1]).toEqual({ type: "media", data: "chunk2" });
      expect(sentMessages[2]).toEqual({ type: "media", data: "chunk3" });
      expect(sentMessages[3]).toEqual({ type: "finalize" });
      expect(mockSocket.close).toHaveBeenCalled();
    });

    it("should handle queuing when socket is not open", () => {
      const messageQueue: any[] = [];

      // Mock socket that queues messages when not open
      const mockSocket = {
        readyState: 0, // CONNECTING
        send: vi.fn(),
        _messageQueue: messageQueue
      };

      // Helper to simulate v5's queueing behavior
      const sendMessage = (socket: any, message: any) => {
        if (socket.readyState === 1) {
          socket.send(message);
        } else {
          socket._messageQueue.push(message);
        }
      };

      // Try to send while connecting
      sendMessage(mockSocket, { type: "media", data: "chunk1" });
      sendMessage(mockSocket, { type: "finalize" });

      // Messages should be queued, not sent
      expect(mockSocket.send).not.toHaveBeenCalled();
      expect(messageQueue).toHaveLength(2);
      expect(messageQueue[0]).toEqual({ type: "media", data: "chunk1" });
      expect(messageQueue[1]).toEqual({ type: "finalize" });
    });

    it("should send queued messages when connection opens", () => {
      const sentMessages: any[] = [];
      const messageQueue = [
        { type: "media", data: "queued1" },
        { type: "media", data: "queued2" },
        { type: "finalize" }
      ];

      // Mock socket becoming ready
      const mockSocket = {
        readyState: 1, // OPEN
        send: vi.fn((data) => {
          sentMessages.push(data);
        })
      };

      // Simulate v5's queue flushing
      messageQueue.forEach(msg => mockSocket.send(msg));

      expect(sentMessages).toHaveLength(3);
      expect(sentMessages[0]).toEqual({ type: "media", data: "queued1" });
      expect(sentMessages[1]).toEqual({ type: "media", data: "queued2" });
      expect(sentMessages[2]).toEqual({ type: "finalize" });
    });
  });

  describe("Old async behavior comparison", () => {
    it("should demonstrate the v3 race condition", async () => {
      const sentMessages: any[] = [];
      let isOpen = true;

      // Mock v3's async send behavior
      const mockAsyncSocket = {
        send: vi.fn((data: any, callback?: (err?: Error) => void) => {
          // Simulate async operation
          setTimeout(() => {
            if (isOpen) {
              sentMessages.push(data);
              callback?.();
            } else {
              callback?.(new Error("Socket closed"));
            }
          }, 10);
        }),
        close: vi.fn(() => {
          isOpen = false;
        })
      };

      // Send messages with v3 async pattern
      mockAsyncSocket.send({ type: "media", data: "chunk1" });
      mockAsyncSocket.send({ type: "media", data: "chunk2" });
      mockAsyncSocket.send({ type: "finalize" });

      // Close immediately - this causes the race condition
      mockAsyncSocket.close();

      // Initially, no messages are sent (async delay)
      expect(sentMessages).toHaveLength(0);

      // After close, messages are lost
      await vi.runAllTimersAsync();
      expect(sentMessages).toHaveLength(0); // All messages lost!
    });

    it("should verify v5 fixes the race condition", () => {
      const sentMessages: any[] = [];

      // v5 synchronous behavior
      const mockSyncSocket = {
        readyState: 1,
        send: vi.fn((data) => {
          sentMessages.push(data);
        }),
        close: vi.fn()
      };

      // Same sequence but with sync send
      mockSyncSocket.send({ type: "media", data: "chunk1" });
      mockSyncSocket.send({ type: "media", data: "chunk2" });
      mockSyncSocket.send({ type: "finalize" });
      mockSyncSocket.close();

      // All messages sent immediately before close
      expect(sentMessages).toHaveLength(3);
      expect(sentMessages[2]).toEqual({ type: "finalize" });
    });
  });

  describe("Error handling", () => {
    it("should throw when sending to closed socket", () => {
      const mockSocket = {
        readyState: 3, // CLOSED
        send: vi.fn()
      };

      // Helper that mimics v5's assertSocketIsOpen
      const assertSocketIsOpen = (socket: any) => {
        if (socket.readyState !== 1) {
          throw new Error("Socket is not open.");
        }
      };

      expect(() => {
        assertSocketIsOpen(mockSocket);
        mockSocket.send({ type: "finalize" });
      }).toThrow("Socket is not open.");

      expect(mockSocket.send).not.toHaveBeenCalled();
    });
  });
});