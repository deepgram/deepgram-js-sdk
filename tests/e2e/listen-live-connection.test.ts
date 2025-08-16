import { ListenLiveClient } from "../../src/core/packages/ListenLiveClient";
import { LiveTranscriptionEvents } from "../../src/core/lib/enums/LiveTranscriptionEvents";
import { CONNECTION_STATE } from "../../src/core/lib/constants";
import { MockWebSocket, WebSocketScenario, mockWebSocketData } from "../__utils__/websocket-mocks";

// Helper to wait for events
function waitForEvent(emitter: any, eventName: string, timeout = 2000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Event '${eventName}' did not fire within ${timeout}ms`));
    }, timeout);

    emitter.once(eventName, (data: any) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

// Helper to collect multiple events
function collectEvents(emitter: any, eventNames: string[], timeout = 3000): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const received = new Set<string>();

    const timer = setTimeout(() => {
      reject(
        new Error(
          `Not all events received within ${timeout}ms. Missing: ${eventNames.filter(
            (name) => !received.has(name)
          )}`
        )
      );
    }, timeout);

    eventNames.forEach((eventName) => {
      emitter.on(eventName, (data: any) => {
        if (!received.has(eventName)) {
          received.add(eventName);
          results.push({ event: eventName, data });

          if (received.size === eventNames.length) {
            clearTimeout(timer);
            resolve(results);
          }
        }
      });
    });
  });
}

describe("listen live connection E2E", () => {
  let mockWebSocketInstance: MockWebSocket;
  let client: ListenLiveClient;

  // Custom WebSocket constructor that captures the instance
  const createMockWebSocketConstructor = () => {
    return class MockWebSocketConstructor extends MockWebSocket {
      constructor(url: string, protocols?: string | string[], options?: any) {
        super(url, protocols, options);
        // Store instance for test access
        mockWebSocketInstance = this as MockWebSocket;
      }
    };
  };

  beforeEach(() => {
    const MockWebSocketConstructor = createMockWebSocketConstructor();

    client = new ListenLiveClient({
      key: "test-api-key",
      global: {
        websocket: {
          // @ts-expect-error - Using mock for testing
          client: MockWebSocketConstructor,
        },
      },
    });
  });

  afterEach(() => {
    if (client) {
      client.disconnect();
    }
  });

  it("should establish WebSocket connection and handle full transcription workflow", async () => {
    // Wait for connection to establish
    const connectionPromise = waitForEvent(client, LiveTranscriptionEvents.Open);
    await connectionPromise;

    expect(client.connectionState()).toBe(CONNECTION_STATE.Open);
    expect(mockWebSocketInstance.url).toContain("listen");
    expect(mockWebSocketInstance.isOpen()).toBe(true);

    // Set up event collectors for the full workflow
    const eventsPromise = collectEvents(client, [
      LiveTranscriptionEvents.Metadata,
      LiveTranscriptionEvents.SpeechStarted,
      LiveTranscriptionEvents.Transcript,
      LiveTranscriptionEvents.UtteranceEnd,
    ]);

    // Simulate a complete transcription session
    const scenario = new WebSocketScenario(mockWebSocketInstance);
    await scenario.simulateListenTranscription();

    // Verify all events were received in order
    const events = await eventsPromise;
    expect(events).toHaveLength(4);

    const eventMap = events.reduce((acc, { event, data }) => {
      acc[event] = data;
      return acc;
    }, {});

    expect(eventMap[LiveTranscriptionEvents.Metadata]).toEqual(mockWebSocketData.listen.metadata);
    expect(eventMap[LiveTranscriptionEvents.SpeechStarted]).toEqual(
      mockWebSocketData.listen.speechStarted
    );
    expect(eventMap[LiveTranscriptionEvents.Transcript]).toEqual(
      mockWebSocketData.listen.transcript
    );
    expect(eventMap[LiveTranscriptionEvents.UtteranceEnd]).toEqual(
      mockWebSocketData.listen.utteranceEnd
    );
  });

  it("should handle real-time audio streaming simulation", async () => {
    await waitForEvent(client, LiveTranscriptionEvents.Open);

    // Simulate sending audio chunks
    const audioChunk1 = new ArrayBuffer(1024);
    const audioChunk2 = new ArrayBuffer(2048);
    const audioChunk3 = new ArrayBuffer(512);

    client.send(audioChunk1);
    client.send(audioChunk2);
    client.send(audioChunk3);

    const sentMessages = mockWebSocketInstance.getSentMessages();
    expect(sentMessages).toContain(audioChunk1);
    expect(sentMessages).toContain(audioChunk2);
    expect(sentMessages).toContain(audioChunk3);
    expect(sentMessages).toHaveLength(3);
  });

  it("should handle connection interruption and recovery", async () => {
    await waitForEvent(client, LiveTranscriptionEvents.Open);

    // Simulate connection loss
    const closePromise = waitForEvent(client, LiveTranscriptionEvents.Close);
    mockWebSocketInstance.close(1006, "Connection lost");

    const closeEvent = await closePromise;
    expect(closeEvent.code).toBe(1006);
    expect(client.connectionState()).toBe(CONNECTION_STATE.Closed);

    // Verify reconnect capability exists
    expect(typeof client.reconnect).toBe("function");
  });

  it("should handle keepAlive mechanism for long sessions", async () => {
    await waitForEvent(client, LiveTranscriptionEvents.Open);

    // Simulate periodic keepAlive calls
    client.keepAlive();
    client.keepAlive();
    client.keepAlive();

    const sentMessages = mockWebSocketInstance.getSentMessages();
    const keepAliveMessages = sentMessages.filter(
      (msg) => msg === JSON.stringify({ type: "KeepAlive" })
    );
    expect(keepAliveMessages).toHaveLength(3);
  });

  it("should handle graceful session termination", async () => {
    await waitForEvent(client, LiveTranscriptionEvents.Open);

    // Send close stream request
    client.requestClose();

    const sentMessages = mockWebSocketInstance.getSentMessages();
    expect(sentMessages).toContain(JSON.stringify({ type: "CloseStream" }));

    // Disconnect the client
    client.disconnect();

    // Check final connection state
    expect(client.connectionState()).toBe(CONNECTION_STATE.Closed);
  });
});
