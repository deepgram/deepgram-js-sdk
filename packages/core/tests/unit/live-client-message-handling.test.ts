import { ListenLiveClient } from "../../src/packages/ListenLiveClient";
import { SpeakLiveClient } from "../../src/packages/SpeakLiveClient";
import { AgentLiveClient } from "../../src/packages/AgentLiveClient";
import { LiveTranscriptionEvents } from "../../src/lib/enums/LiveTranscriptionEvents";
import { LiveTTSEvents } from "../../src/lib/enums/LiveTTSEvents";
import { AgentEvents } from "../../src/lib/enums/AgentEvents";
import { SOCKET_STATES } from "../../src/lib/constants";

describe("Unit Tests - Live Client Message Handling", () => {
  describe("ListenLiveClient Message Handling", () => {
    let client: ListenLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      // Mock the connection object
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
      client = new ListenLiveClient({
        key: "test-key",
        global: {
          websocket: {
            client: MockWebSocket as any, // Use custom transport to avoid real connections
          },
        },
      });

      // The constructor already calls connect, so just setup the connection
      client.setupConnection();
    });

    it("should emit Open event when connection opens", () => {
      const openSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Open, openSpy);

      // Simulate connection open
      mockConnection.onopen();

      expect(openSpy).toHaveBeenCalledWith(client);
    });

    it("should emit Close event when connection closes", () => {
      const closeSpy = jest.fn();
      const closeEvent = { code: 1000, reason: "Normal closure" };
      client.on(LiveTranscriptionEvents.Close, closeSpy);

      // Simulate connection close
      mockConnection.onclose(closeEvent);

      expect(closeSpy).toHaveBeenCalledWith(closeEvent);
    });

    it("should emit Error event when connection errors", () => {
      const errorSpy = jest.fn();
      const errorEvent = { type: "error", message: "Connection failed" };
      client.on(LiveTranscriptionEvents.Error, errorSpy);

      // Simulate connection error
      mockConnection.onerror(errorEvent);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          message: expect.stringContaining("Connection failed"),
          error: expect.any(Object),
          readyState: expect.any(Number),
        })
      );
    });

    it("should handle Transcript messages correctly", () => {
      const transcriptSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Transcript, transcriptSpy);

      const transcriptData = {
        type: "Results",
        channel_index: [0, 1],
        duration: 2.5,
        start: 0.0,
        is_final: true,
        channel: {
          alternatives: [
            {
              transcript: "Hello world",
              confidence: 0.95,
              words: [
                { word: "Hello", start: 0.0, end: 0.5, confidence: 0.95 },
                { word: "world", start: 0.6, end: 1.0, confidence: 0.94 },
              ],
            },
          ],
        },
      };

      // Simulate receiving transcript message
      const messageEvent = { data: JSON.stringify(transcriptData) };
      mockConnection.onmessage(messageEvent);

      expect(transcriptSpy).toHaveBeenCalledWith(transcriptData);
    });

    it("should handle Metadata messages correctly", () => {
      const metadataSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Metadata, metadataSpy);

      const metadataData = {
        type: "Metadata",
        transaction_key: "deprecated",
        request_id: "550e8400-e29b-41d4-a716-446655440002",
        sha256: "abc123",
        created: "2024-01-15T10:30:00Z",
        duration: 120.5,
        channels: 1,
      };

      // Simulate receiving metadata message
      const messageEvent = { data: JSON.stringify(metadataData) };
      mockConnection.onmessage(messageEvent);

      expect(metadataSpy).toHaveBeenCalledWith(metadataData);
    });

    it("should handle UtteranceEnd messages correctly", () => {
      const utteranceEndSpy = jest.fn();
      client.on(LiveTranscriptionEvents.UtteranceEnd, utteranceEndSpy);

      const utteranceEndData = {
        type: "UtteranceEnd",
        channel: [0],
        last_word_end: 2.5,
      };

      // Simulate receiving utterance end message
      const messageEvent = { data: JSON.stringify(utteranceEndData) };
      mockConnection.onmessage(messageEvent);

      expect(utteranceEndSpy).toHaveBeenCalledWith(utteranceEndData);
    });

    it("should handle SpeechStarted messages correctly", () => {
      const speechStartedSpy = jest.fn();
      client.on(LiveTranscriptionEvents.SpeechStarted, speechStartedSpy);

      const speechStartedData = {
        type: "SpeechStarted",
        channel: [0],
        timestamp: 1.2,
      };

      // Simulate receiving speech started message
      const messageEvent = { data: JSON.stringify(speechStartedData) };
      mockConnection.onmessage(messageEvent);

      expect(speechStartedSpy).toHaveBeenCalledWith(speechStartedData);
    });

    it("should emit Unhandled event for unknown message types", () => {
      const unhandledSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Unhandled, unhandledSpy);

      const unknownData = {
        type: "UnknownMessageType",
        data: "some data",
      };

      // Simulate receiving unknown message
      const messageEvent = { data: JSON.stringify(unknownData) };
      mockConnection.onmessage(messageEvent);

      expect(unhandledSpy).toHaveBeenCalledWith(unknownData);
    });

    it("should emit Error event for malformed JSON messages", () => {
      const errorSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Error, errorSpy);

      // Simulate receiving malformed JSON
      const messageEvent = { data: "invalid json {" };
      mockConnection.onmessage(messageEvent);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: messageEvent,
          message: "Unable to parse `data` as JSON.",
          error: expect.any(Error),
        })
      );
    });

    it("should send keepAlive message correctly", () => {
      client.keepAlive();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "KeepAlive" }));
    });

    it("should send requestClose message correctly", () => {
      client.requestClose();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "CloseStream" }));
    });
  });

  describe("SpeakLiveClient Message Handling", () => {
    let client: SpeakLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      // Mock the connection object
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
      client = new SpeakLiveClient({
        key: "test-key",
        global: {
          websocket: {
            client: MockWebSocket as any, // Use custom transport to avoid real connections
          },
        },
      });

      // The constructor already calls connect, so just setup the connection
      client.setupConnection();
    });

    it("should emit Open event when connection opens", () => {
      const openSpy = jest.fn();
      client.on(LiveTTSEvents.Open, openSpy);

      // Simulate connection open
      mockConnection.onopen();

      expect(openSpy).toHaveBeenCalledWith(client);
    });

    it("should handle Metadata messages correctly", () => {
      const metadataSpy = jest.fn();
      client.on(LiveTTSEvents.Metadata, metadataSpy);

      const metadataData = {
        type: "Metadata",
        request_id: "550e8400-e29b-41d4-a716-446655440003",
        model_name: "aura-asteria-en",
        model_uuid: "c0e51fb0-7b76-42f0-b8c0-8ad7a14fb5b5",
        char_count: 25,
        transfer_encoding: "chunked",
        date: "Thu, 15 Aug 2024 17:22:02 GMT",
      };

      // Simulate receiving metadata message
      const messageEvent = { data: JSON.stringify(metadataData) };
      mockConnection.onmessage(messageEvent);

      expect(metadataSpy).toHaveBeenCalledWith(metadataData);
    });

    it("should handle Flushed messages correctly", () => {
      const flushedSpy = jest.fn();
      client.on(LiveTTSEvents.Flushed, flushedSpy);

      const flushedData = {
        type: "Flushed",
      };

      // Simulate receiving flushed message
      const messageEvent = { data: JSON.stringify(flushedData) };
      mockConnection.onmessage(messageEvent);

      expect(flushedSpy).toHaveBeenCalledWith(flushedData);
    });

    it("should handle Warning messages correctly", () => {
      const warningSpy = jest.fn();
      client.on(LiveTTSEvents.Warning, warningSpy);

      const warningData = {
        type: "Warning",
        warn_code: "W001",
        warn_msg: "Sample warning message",
      };

      // Simulate receiving warning message
      const messageEvent = { data: JSON.stringify(warningData) };
      mockConnection.onmessage(messageEvent);

      expect(warningSpy).toHaveBeenCalledWith(warningData);
    });

    it("should handle binary audio data correctly", () => {
      const audioSpy = jest.fn();
      client.on(LiveTTSEvents.Audio, audioSpy);

      const audioBuffer = new ArrayBuffer(1024);
      const messageEvent = { data: audioBuffer };
      mockConnection.onmessage(messageEvent);

      expect(audioSpy).toHaveBeenCalledWith(Buffer.from(audioBuffer));
    });

    it("should handle Blob audio data correctly", () => {
      const audioSpy = jest.fn();
      client.on(LiveTTSEvents.Audio, audioSpy);

      const audioData = new Uint8Array([1, 2, 3, 4]);
      const blob = new Blob([audioData]);

      // Mock blob.arrayBuffer()
      blob.arrayBuffer = jest.fn().mockResolvedValue(audioData.buffer);

      const messageEvent = { data: blob };
      mockConnection.onmessage(messageEvent);

      // Wait for async arrayBuffer processing
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(audioSpy).toHaveBeenCalledWith(Buffer.from(audioData.buffer));
          resolve(undefined);
        }, 0);
      });
    });

    it("should emit Unhandled event for unknown message types", () => {
      const unhandledSpy = jest.fn();
      client.on(LiveTTSEvents.Unhandled, unhandledSpy);

      const unknownData = {
        type: "UnknownMessageType",
        data: "some data",
      };

      // Simulate receiving unknown message
      const messageEvent = { data: JSON.stringify(unknownData) };
      mockConnection.onmessage(messageEvent);

      expect(unhandledSpy).toHaveBeenCalledWith(unknownData);
    });

    it("should send text correctly", () => {
      const text = "Hello, this is a test message.";
      client.sendText(text);

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Speak", text }));
    });

    it("should send flush correctly", () => {
      client.flush();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Flush" }));
    });
  });

  describe("AgentLiveClient Message Handling", () => {
    let client: AgentLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      // Mock the connection object
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

      // The constructor already calls connect, so just setup the connection
      client.setupConnection();
    });

    it("should emit Open event when connection opens", () => {
      const openSpy = jest.fn();
      client.on(AgentEvents.Open, openSpy);

      // Simulate connection open
      mockConnection.onopen();

      expect(openSpy).toHaveBeenCalledWith(client);
    });

    it("should handle Welcome messages correctly", () => {
      const welcomeSpy = jest.fn();
      client.on(AgentEvents.Welcome, welcomeSpy);

      const welcomeData = {
        type: "Welcome",
        request_id: "550e8400-e29b-41d4-a716-446655440004",
      };

      // Simulate receiving welcome message
      const messageEvent = { data: JSON.stringify(welcomeData) };
      mockConnection.onmessage(messageEvent);

      expect(welcomeSpy).toHaveBeenCalledWith(welcomeData);
    });

    it("should handle ConversationText messages correctly", () => {
      const conversationTextSpy = jest.fn();
      client.on(AgentEvents.ConversationText, conversationTextSpy);

      const conversationTextData = {
        type: "ConversationText",
        role: "user",
        content: "Hello, how are you?",
      };

      // Simulate receiving conversation text message
      const messageEvent = { data: JSON.stringify(conversationTextData) };
      mockConnection.onmessage(messageEvent);

      expect(conversationTextSpy).toHaveBeenCalledWith(conversationTextData);
    });

    it("should handle FunctionCallRequest messages correctly", () => {
      const functionCallSpy = jest.fn();
      client.on(AgentEvents.FunctionCallRequest, functionCallSpy);

      const functionCallData = {
        type: "FunctionCallRequest",
        functions: [
          {
            id: "function-1",
            name: "get_weather",
            arguments: '{"location": "New York"}',
            client_side: true,
          },
        ],
      };

      // Simulate receiving function call request
      const messageEvent = { data: JSON.stringify(functionCallData) };
      mockConnection.onmessage(messageEvent);

      expect(functionCallSpy).toHaveBeenCalledWith(functionCallData);
    });

    it("should handle AgentStartedSpeaking messages correctly", () => {
      const agentStartedSpy = jest.fn();
      client.on(AgentEvents.AgentStartedSpeaking, agentStartedSpy);

      const agentStartedData = {
        type: "AgentStartedSpeaking",
        total_latency: 250,
        tts_latency: 100,
        ttt_latency: 150,
      };

      // Simulate receiving agent started speaking message
      const messageEvent = { data: JSON.stringify(agentStartedData) };
      mockConnection.onmessage(messageEvent);

      expect(agentStartedSpy).toHaveBeenCalledWith(agentStartedData);
    });

    it("should handle binary audio data correctly", () => {
      const audioSpy = jest.fn();
      client.on(AgentEvents.Audio, audioSpy);

      const audioBuffer = new ArrayBuffer(2048);
      const messageEvent = { data: audioBuffer };
      mockConnection.onmessage(messageEvent);

      expect(audioSpy).toHaveBeenCalledWith(Buffer.from(audioBuffer));
    });

    it("should emit Unhandled event for unknown message types", () => {
      const unhandledSpy = jest.fn();
      client.on(AgentEvents.Unhandled, unhandledSpy);

      const unknownData = {
        type: "UnknownMessageType",
        data: "some data",
      };

      // Simulate receiving unknown message
      const messageEvent = { data: JSON.stringify(unknownData) };
      mockConnection.onmessage(messageEvent);

      expect(unhandledSpy).toHaveBeenCalledWith(unknownData);
    });

    it("should handle messages with unknown data types correctly", () => {
      const errorSpy = jest.fn();
      client.on(AgentEvents.Error, errorSpy);

      // Simulate receiving message with unknown data type
      const unknownDataType = { some: "weird data type" };
      const messageEvent = { data: unknownDataType };
      mockConnection.onmessage(messageEvent);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: messageEvent,
          message: "Received unknown data type.",
        })
      );
    });

    it("should send keepAlive message correctly", () => {
      client.keepAlive();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "KeepAlive" }));
    });

    describe("speak provider configuration", () => {
      it("should accept single provider", () => {
        const config = {
          audio: { input: { encoding: "linear16", sample_rate: 16000 } },
          agent: {
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

      it("should accept array of providers", () => {
        const config = {
          audio: { input: { encoding: "linear16", sample_rate: 16000 } },
          agent: {
            speak: [
              { provider: { type: "deepgram", model: "aura-2-zeus-en" } },
              {
                provider: { type: "openai", model: "tts-1", voice: "shimmer" },
                endpoint: {
                  url: "https://api.openai.com/v1/audio/speech",
                  headers: { auth: "key" },
                },
              },
            ],
          },
        };

        client.configure(config);
        expect(mockConnection.send).toHaveBeenCalledWith(
          JSON.stringify({ type: "Settings", ...config })
        );
      });
    });

    describe("mips_opt_out configuration", () => {
      it("should accept mips_opt_out as true", () => {
        const config = {
          audio: { input: { encoding: "linear16", sample_rate: 16000 } },
          mips_opt_out: true,
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

      it("should accept mips_opt_out as false", () => {
        const config = {
          audio: { input: { encoding: "linear16", sample_rate: 16000 } },
          mips_opt_out: false,
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

      it("should work without mips_opt_out (default behavior)", () => {
        const config = {
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
    });

    describe("updateSpeak method", () => {
      it("should update with single provider", () => {
        const provider = { provider: { type: "deepgram", model: "aura-2-zeus-en" } };

        client.updateSpeak(provider);
        expect(mockConnection.send).toHaveBeenCalledWith(
          JSON.stringify({ type: "UpdateSpeak", speak: provider })
        );
      });

      it("should update with array of providers", () => {
        const providers = [
          { provider: { type: "deepgram", model: "aura-2-zeus-en" } },
          { provider: { type: "openai", model: "tts-1", voice: "shimmer" } },
        ];

        client.updateSpeak(providers);
        expect(mockConnection.send).toHaveBeenCalledWith(
          JSON.stringify({ type: "UpdateSpeak", speak: providers })
        );
      });
    });

    describe("injectUserMessage method", () => {
      it("should send injectUserMessage correctly", () => {
        const content = "Hello! Can you hear me?";
        client.injectUserMessage(content);

        expect(mockConnection.send).toHaveBeenCalledWith(
          JSON.stringify({ type: "InjectUserMessage", content })
        );
      });

      it("should send injectUserMessage with different content types", () => {
        const testCases = [
          "What's the weather like today?",
          "Simple greeting",
          "Multi-line\nmessage content",
          "", // Edge case: empty string
        ];

        testCases.forEach((content) => {
          jest.clearAllMocks(); // Reset mock between test cases

          client.injectUserMessage(content);

          expect(mockConnection.send).toHaveBeenCalledWith(
            JSON.stringify({ type: "InjectUserMessage", content })
          );
        });
      });
    });
  });
});
