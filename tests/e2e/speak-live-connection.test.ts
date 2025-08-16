import { SpeakLiveClient } from "../../src/core/packages/SpeakLiveClient";
import { LiveTTSEvents } from "../../src/core/lib/enums/LiveTTSEvents";
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

describe("speak live connection E2E", () => {
  let mockWebSocketInstance: MockWebSocket;
  let client: SpeakLiveClient;

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

    client = new SpeakLiveClient({
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

  it("should handle complete TTS synthesis workflow", async () => {
    await waitForEvent(client, LiveTTSEvents.Open);

    expect(client.connectionState()).toBe(CONNECTION_STATE.Open);
    expect(mockWebSocketInstance.url).toContain("speak");

    // Set up event collectors for TTS workflow
    const eventsPromise = collectEvents(client, [
      LiveTTSEvents.Metadata,
      LiveTTSEvents.Audio,
      LiveTTSEvents.Flushed,
    ]);

    // Simulate TTS synthesis
    const scenario = new WebSocketScenario(mockWebSocketInstance);
    await scenario.simulateSpeakTTS();

    const events = await eventsPromise;
    expect(events).toHaveLength(3);

    const eventMap = events.reduce((acc, { event, data }) => {
      acc[event] = data;
      return acc;
    }, {});

    expect(eventMap[LiveTTSEvents.Metadata]).toEqual(mockWebSocketData.speak.metadata);
    expect(eventMap[LiveTTSEvents.Audio]).toBeInstanceOf(Buffer);
    expect(eventMap[LiveTTSEvents.Flushed]).toEqual(mockWebSocketData.speak.flushed);
  });

  it("should handle streaming text-to-speech session", async () => {
    await waitForEvent(client, LiveTTSEvents.Open);

    // Simulate streaming text input
    const texts = [
      "Hello, this is the first sentence.",
      "This is the second sentence to synthesize.",
      "And here's the final sentence.",
    ];

    texts.forEach((text) => {
      client.sendText(text);
    });

    // Flush to get all audio
    client.flush();

    const sentMessages = mockWebSocketInstance.getSentMessages();

    // Verify all text messages were sent
    texts.forEach((text) => {
      expect(sentMessages).toContain(JSON.stringify({ type: "Speak", text }));
    });

    // Verify flush was sent
    expect(sentMessages).toContain(JSON.stringify({ type: "Flush" }));
  });

  it("should handle TTS session with multiple operations", async () => {
    await waitForEvent(client, LiveTTSEvents.Open);

    // Simulate complex TTS session
    client.sendText("Start of message");
    client.sendText("Middle part");
    client.flush(); // Get audio for first part
    client.clear(); // Clear buffer
    client.sendText("New message after clear");
    client.requestClose(); // End session

    const sentMessages = mockWebSocketInstance.getSentMessages();
    expect(sentMessages).toContain(JSON.stringify({ type: "Speak", text: "Start of message" }));
    expect(sentMessages).toContain(JSON.stringify({ type: "Speak", text: "Middle part" }));
    expect(sentMessages).toContain(JSON.stringify({ type: "Flush" }));
    expect(sentMessages).toContain(JSON.stringify({ type: "Clear" }));
    expect(sentMessages).toContain(
      JSON.stringify({ type: "Speak", text: "New message after clear" })
    );
    expect(sentMessages).toContain(JSON.stringify({ type: "Close" }));
  });
});
