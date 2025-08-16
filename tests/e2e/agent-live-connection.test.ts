import { AgentLiveClient } from "../../src/core/packages/AgentLiveClient";
import { AgentEvents } from "../../src/core/lib/enums/AgentEvents";
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

describe("agent live connection E2E", () => {
  let mockWebSocketInstance: MockWebSocket;
  let client: AgentLiveClient;

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

    client = new AgentLiveClient({
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

  it("should handle complete agent conversation workflow", async () => {
    await waitForEvent(client, AgentEvents.Open);

    expect(client.connectionState()).toBe(CONNECTION_STATE.Open);
    expect(mockWebSocketInstance.url).toContain("agent");

    // Set up event collectors for conversation workflow
    const eventsPromise = collectEvents(client, [
      AgentEvents.Welcome,
      AgentEvents.ConversationText,
      AgentEvents.AgentThinking,
      AgentEvents.AgentStartedSpeaking,
      AgentEvents.Audio,
      AgentEvents.AgentAudioDone,
    ]);

    // Simulate complete conversation
    const scenario = new WebSocketScenario(mockWebSocketInstance);
    await scenario.simulateAgentConversation();

    const events = await eventsPromise;
    expect(events).toHaveLength(6);

    const eventMap = events.reduce((acc, { event, data }) => {
      acc[event] = data;
      return acc;
    }, {});

    expect(eventMap[AgentEvents.Welcome]).toEqual(mockWebSocketData.agent.welcome);
    expect(eventMap[AgentEvents.ConversationText]).toEqual(
      mockWebSocketData.agent.conversationText
    );
    expect(eventMap[AgentEvents.AgentThinking]).toEqual(mockWebSocketData.agent.agentThinking);
    expect(eventMap[AgentEvents.AgentStartedSpeaking]).toEqual(
      mockWebSocketData.agent.agentStartedSpeaking
    );
    expect(eventMap[AgentEvents.Audio]).toBeInstanceOf(Buffer);
    expect(eventMap[AgentEvents.AgentAudioDone]).toEqual(mockWebSocketData.agent.agentAudioDone);
  });

  it("should handle function call interaction workflow", async () => {
    await waitForEvent(client, AgentEvents.Open);

    // Set up event collectors for function call scenario
    const eventsPromise = collectEvents(client, [
      AgentEvents.Welcome,
      AgentEvents.FunctionCallRequest,
    ]);

    // Simulate function call scenario
    const scenario = new WebSocketScenario(mockWebSocketInstance);
    await scenario.simulateFunctionCall();

    const events = await eventsPromise;
    expect(events).toHaveLength(2);

    const functionCallEvent = events.find((e) => e.event === AgentEvents.FunctionCallRequest);
    expect(functionCallEvent.data).toEqual(mockWebSocketData.agent.functionCallRequest);
    expect(functionCallEvent.data.functions).toHaveLength(1);
    expect(functionCallEvent.data.functions[0].name).toBe("get_weather");
  });

  it("should handle bidirectional audio communication", async () => {
    await waitForEvent(client, AgentEvents.Open);

    // Simulate sending user audio to agent
    const userAudio1 = new ArrayBuffer(1024);
    const userAudio2 = new ArrayBuffer(2048);

    client.send(userAudio1);
    client.send(userAudio2);

    // Send keepAlive during conversation
    client.keepAlive();

    const sentMessages = mockWebSocketInstance.getSentMessages();
    expect(sentMessages).toContain(userAudio1);
    expect(sentMessages).toContain(userAudio2);
    expect(sentMessages).toContain(JSON.stringify({ type: "KeepAlive" }));
  });
});
