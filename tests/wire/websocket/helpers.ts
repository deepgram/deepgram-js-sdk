import type { ReconnectingWebSocket } from "../../../src/core/websocket/ws";
import type { Server } from "ws";

/**
 * Helper to create a mock WebSocket server for testing
 */
export function createMockWebSocketServer(port: number = 0): Promise<{ server: Server; url: string }> {
  return new Promise((resolve) => {
    // Dynamic import to handle environments where 'ws' might not be available
    import("ws").then(({ WebSocketServer }) => {
      const server = new WebSocketServer({ port });

      server.on("listening", () => {
        const address = server.address();
        const actualPort = typeof address === "object" ? address.port : port;
        resolve({
          server,
          url: `ws://localhost:${actualPort}`
        });
      });
    });
  });
}

/**
 * Helper to track event counts on a WebSocket connection
 */
export class WebSocketEventTracker {
  private eventCounts = new Map<string, number>();
  private eventHistory: Array<{ event: string; timestamp: number; data?: any }> = [];

  track(eventName: string, data?: any) {
    const current = this.eventCounts.get(eventName) || 0;
    this.eventCounts.set(eventName, current + 1);
    this.eventHistory.push({
      event: eventName,
      timestamp: Date.now(),
      data
    });
  }

  getCount(eventName: string): number {
    return this.eventCounts.get(eventName) || 0;
  }

  getHistory(): Array<{ event: string; timestamp: number; data?: any }> {
    return [...this.eventHistory];
  }

  reset() {
    this.eventCounts.clear();
    this.eventHistory = [];
  }
}

/**
 * Helper to wait for a specific number of events
 */
export function waitForEventCount(
  tracker: WebSocketEventTracker,
  eventName: string,
  expectedCount: number,
  timeout: number = 5000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkCount = () => {
      if (tracker.getCount(eventName) >= expectedCount) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for ${expectedCount} ${eventName} events. Got ${tracker.getCount(eventName)}`));
        return;
      }

      setTimeout(checkCount, 50);
    };

    checkCount();
  });
}

/**
 * Helper to simulate binary audio data
 */
export function generateMockAudioData(sizeInBytes: number = 1024): ArrayBuffer {
  const buffer = new ArrayBuffer(sizeInBytes);
  const view = new Uint8Array(buffer);

  // Fill with mock audio data (sine wave pattern)
  for (let i = 0; i < sizeInBytes; i++) {
    view[i] = Math.floor(128 + 127 * Math.sin(i / 10));
  }

  return buffer;
}

/**
 * Helper to create mock WebSocket message events
 */
export function createMockMessageEvent(data: string | ArrayBuffer | Blob): MessageEvent {
  return new MessageEvent("message", {
    data,
    origin: "ws://localhost",
    lastEventId: "",
    source: null,
    ports: []
  });
}