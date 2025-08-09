import { AgentLiveClient } from "../../src/packages/AgentLiveClient";
import { SOCKET_STATES } from "../../src/lib/constants";
import type { AgentLiveSchema, HistoryConversationText, HistoryFunctionCall } from "../../src/lib/types";

describe("Unit Tests - Agent History Functionality", () => {
  let client: AgentLiveClient;
  let mockConnection: any;

  beforeEach(() => {
    // Mock the connection object with Jest spies
    mockConnection = {
      readyState: SOCKET_STATES.open,
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
    };

    // Create a mock WebSocket constructor
    const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

    // Create client with minimal options
    client = new AgentLiveClient({
      key: "test-key",
      global: {
        websocket: {
          client: MockWebSocket as any, // Use custom transport to avoid real connections
        },
      },
    });

    // Setup the connection
    client.setupConnection();
  });

  afterEach(() => {
    if (client) {
      client.disconnect();
    }
  });

  describe("Schema Configuration with History Features", () => {
    it("should accept configuration with flags.history enabled", () => {
      const config: AgentLiveSchema = {
        flags: {
          history: true,
        },
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });

    it("should accept configuration with flags.history disabled", () => {
      const config: AgentLiveSchema = {
        flags: {
          history: false,
        },
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });

    it("should accept configuration with agent.context.messages", () => {
      const historyMessages: (HistoryConversationText | HistoryFunctionCall)[] = [
        {
          type: "History",
          role: "user",
          content: "What's the weather like today?",
        },
        {
          type: "History",
          role: "assistant",
          content: "Based on the current data, it's sunny with a temperature of 72°F (22°C).",
        },
      ];

      const config: AgentLiveSchema = {
        flags: {
          history: true,
        },
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          context: {
            messages: historyMessages,
          },
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });
  });

  describe("History Message Sending Methods", () => {
    it("should send history conversation text message", () => {
      const historyMessage: HistoryConversationText = {
        type: "History",
        role: "user",
        content: "Hello, how are you?",
      };

      client.sendHistoryConversationText(historyMessage);
      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify(historyMessage));
    });

    it("should send history function call message", () => {
      const historyMessage: HistoryFunctionCall = {
        type: "History",
        function_calls: [
          {
            id: "fc_12345678-90ab-cdef-1234-567890abcdef",
            name: "check_order_status",
            client_side: true,
            arguments: '{"order_id": "ORD-123456"}',
            response: "Order #123456 status: Shipped - Expected delivery date: 2024-03-15",
          },
        ],
      };

      client.sendHistoryFunctionCall(historyMessage);
      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify(historyMessage));
    });

    it("should send multiple history messages", () => {
      const historyMessages: (HistoryConversationText | HistoryFunctionCall)[] = [
        {
          type: "History",
          role: "user",
          content: "What's the weather like?",
        },
        {
          type: "History",
          function_calls: [
            {
              id: "fc_weather_123",
              name: "get_weather",
              client_side: false,
              arguments: '{"location": "New York"}',
              response: '{"temperature": 72, "condition": "sunny"}',
            },
          ],
        },
        {
          type: "History",
          role: "assistant",
          content: "It's sunny and 72°F in New York.",
        },
      ];

      client.sendHistoryMessages(historyMessages);

      // Should have called send for each message
      expect(mockConnection.send).toHaveBeenCalledTimes(3);
      historyMessages.forEach((message) => {
        expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify(message));
      });
    });
  });

  describe("Type Safety and Validation", () => {
    it("should enforce correct type for HistoryConversationText", () => {
      const validMessage: HistoryConversationText = {
        type: "History",
        role: "user",
        content: "Test message",
      };

      // This should compile without errors
      client.sendHistoryConversationText(validMessage);
      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify(validMessage));
    });

    it("should enforce correct type for HistoryFunctionCall", () => {
      const validMessage: HistoryFunctionCall = {
        type: "History",
        function_calls: [
          {
            id: "test_id",
            name: "test_function",
            client_side: true,
            arguments: "{}",
            response: "success",
          },
        ],
      };

      // This should compile without errors
      client.sendHistoryFunctionCall(validMessage);
      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify(validMessage));
    });
  });

  describe("Configuration Edge Cases", () => {
    it("should accept configuration without flags (backward compatibility)", () => {
      const config: AgentLiveSchema = {
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });

    it("should accept configuration without context (backward compatibility)", () => {
      const config: AgentLiveSchema = {
        flags: {
          history: true,
        },
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });

    it("should accept empty context messages array", () => {
      const config: AgentLiveSchema = {
        flags: {
          history: true,
        },
        audio: { input: { encoding: "linear16", sample_rate: 16000 } },
        agent: {
          language: "en",
          context: {
            messages: [],
          },
          speak: {
            provider: { type: "deepgram", model: "aura-2-zeus-en" },
          },
        },
      };

      client.configure(config);
      expect(mockConnection.send).toHaveBeenCalledWith(
        JSON.stringify({ type: "Settings", ...config })
      );
    });
  });
});