/* eslint-disable @typescript-eslint/no-unused-vars */
import { SOCKET_STATES } from "../../src/lib/constants";

/**
 * Mock WebSocket data for different live client scenarios
 */
export const mockWebSocketData = {
  listen: {
    metadata: {
      type: "Metadata",
      transaction_key: "deprecated",
      request_id: "550e8400-e29b-41d4-a716-446655440000",
      sha256: "abc123def456",
      created: "2024-01-15T10:30:00Z",
      duration: 120.5,
      channels: 1,
    },
    transcript: {
      type: "Results",
      channel_index: [0, 1],
      duration: 2.5,
      start: 0.0,
      is_final: true,
      channel: {
        alternatives: [
          {
            transcript: "Hello world from WebSocket test",
            confidence: 0.95,
            words: [
              { word: "Hello", start: 0.0, end: 0.5, confidence: 0.95 },
              { word: "world", start: 0.6, end: 1.0, confidence: 0.94 },
              { word: "from", start: 1.1, end: 1.3, confidence: 0.96 },
              { word: "WebSocket", start: 1.4, end: 1.8, confidence: 0.93 },
              { word: "test", start: 1.9, end: 2.2, confidence: 0.97 },
            ],
          },
        ],
      },
    },
    utteranceEnd: {
      type: "UtteranceEnd",
      channel: [0],
      last_word_end: 2.5,
    },
    speechStarted: {
      type: "SpeechStarted",
      channel: [0],
      timestamp: 1.2,
    },
  },
  speak: {
    metadata: {
      type: "Metadata",
      request_id: "550e8400-e29b-41d4-a716-446655440001",
      model_name: "aura-asteria-en",
      model_uuid: "c0e51fb0-7b76-42f0-b8c0-8ad7a14fb5b5",
      char_count: 25,
      transfer_encoding: "chunked",
      date: "Thu, 15 Aug 2024 17:22:02 GMT",
    },
    warning: {
      type: "Warning",
      warn_code: "W001",
      warn_msg: "Sample warning message from TTS",
    },
    flushed: {
      type: "Flushed",
    },
  },
  agent: {
    welcome: {
      type: "Welcome",
      request_id: "550e8400-e29b-41d4-a716-446655440002",
    },
    conversationText: {
      type: "ConversationText",
      role: "user",
      content: "Hello, how can you help me today?",
    },
    agentThinking: {
      type: "AgentThinking",
      content: "Let me think about that...",
    },
    functionCallRequest: {
      type: "FunctionCallRequest",
      functions: [
        {
          id: "function-123",
          name: "get_weather",
          arguments: '{"location": "San Francisco", "units": "celsius"}',
          client_side: true,
        },
      ],
    },
    agentStartedSpeaking: {
      type: "AgentStartedSpeaking",
      total_latency: 250,
      tts_latency: 100,
      ttt_latency: 150,
    },
    agentAudioDone: {
      type: "AgentAudioDone",
    },
  },
};

/**
 * Mock audio data for testing binary WebSocket messages
 */
export const mockAudioData = new ArrayBuffer(1024);

/**
 * Event handler type for WebSocket events
 */
type EventHandler = (event?: any) => void;

/**
 * Mock WebSocket class that simulates WebSocket behavior for testing
 */
export class MockWebSocket {
  public url: string;
  public readyState: number = SOCKET_STATES.connecting;
  public onopen: EventHandler | null = null;
  public onclose: EventHandler | null = null;
  public onerror: EventHandler | null = null;
  public onmessage: EventHandler | null = null;
  public binaryType: string = "arraybuffer";

  private sendBuffer: any[] = [];
  private messageQueue: any[] = [];
  private isConnected = false;

  constructor(url: string, protocols?: string | string[], options?: any) {
    this.url = url.toString();

    // Simulate async connection
    setTimeout(() => {
      this.readyState = SOCKET_STATES.open;
      this.isConnected = true;
      if (this.onopen) {
        this.onopen();
      }
    }, 0);
  }

  /**
   * Mock send method that stores sent data for testing
   */
  public send(data: string | ArrayBuffer | Blob): void {
    if (this.readyState !== SOCKET_STATES.open) {
      throw new Error("WebSocket is not open");
    }
    this.sendBuffer.push(data);
  }

  /**
   * Mock close method
   */
  public close(code?: number, reason?: string): void {
    this.readyState = SOCKET_STATES.closing;
    setTimeout(() => {
      this.readyState = SOCKET_STATES.closed;
      if (this.onclose) {
        this.onclose({ code: code || 1000, reason: reason || "Normal closure" });
      }
    }, 0);
  }

  /**
   * Simulate receiving a message (for testing)
   */
  public simulateMessage(data: any): void {
    if (this.onmessage && this.isConnected) {
      const messageEvent = {
        data: typeof data === "string" ? data : JSON.stringify(data),
        type: "message",
      };
      this.onmessage(messageEvent);
    }
  }

  /**
   * Simulate receiving binary data (for testing)
   */
  public simulateBinaryMessage(data: ArrayBuffer | Buffer): void {
    if (this.onmessage && this.isConnected) {
      const messageEvent = {
        data: data instanceof Buffer ? data.buffer : data,
        type: "message",
      };
      this.onmessage(messageEvent);
    }
  }

  /**
   * Simulate a connection error (for testing)
   */
  public simulateError(message: string = "Connection error"): void {
    if (this.onerror) {
      this.onerror({ type: "error", message });
    }
  }

  /**
   * Get all messages that were sent (for testing assertions)
   */
  public getSentMessages(): any[] {
    return [...this.sendBuffer];
  }

  /**
   * Clear the send buffer (for testing cleanup)
   */
  public clearSentMessages(): void {
    this.sendBuffer = [];
  }

  /**
   * Check if WebSocket is in a connected state
   */
  public isOpen(): boolean {
    return this.readyState === SOCKET_STATES.open;
  }
}

/**
 * Creates a MockWebSocket constructor that can be used in tests
 */
export function createMockWebSocketConstructor(): typeof MockWebSocket {
  return MockWebSocket;
}

/**
 * Helper function to create a mock WebSocket instance
 */
export function createMockWebSocket(url: string = "wss://api.deepgram.com"): MockWebSocket {
  return new MockWebSocket(url);
}

/**
 * WebSocket scenario simulator for different test cases
 */
export class WebSocketScenario {
  private mockWebSocket: MockWebSocket;

  constructor(mockWebSocket: MockWebSocket) {
    this.mockWebSocket = mockWebSocket;
  }

  /**
   * Simulate a successful listen transcription scenario
   */
  public async simulateListenTranscription(): Promise<void> {
    // Wait for connection
    await this.waitForConnection();

    // Send metadata first
    this.mockWebSocket.simulateMessage(mockWebSocketData.listen.metadata);

    // Send speech started
    this.mockWebSocket.simulateMessage(mockWebSocketData.listen.speechStarted);

    // Send transcript
    this.mockWebSocket.simulateMessage(mockWebSocketData.listen.transcript);

    // Send utterance end
    this.mockWebSocket.simulateMessage(mockWebSocketData.listen.utteranceEnd);
  }

  /**
   * Simulate a speak TTS scenario
   */
  public async simulateSpeakTTS(): Promise<void> {
    // Wait for connection
    await this.waitForConnection();

    // Send metadata
    this.mockWebSocket.simulateMessage(mockWebSocketData.speak.metadata);

    // Send audio data
    this.mockWebSocket.simulateBinaryMessage(mockAudioData);

    // Send flushed
    this.mockWebSocket.simulateMessage(mockWebSocketData.speak.flushed);
  }

  /**
   * Simulate an agent conversation scenario
   */
  public async simulateAgentConversation(): Promise<void> {
    // Wait for connection
    await this.waitForConnection();

    // Send welcome
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.welcome);

    // User speaks
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.conversationText);

    // Agent thinks
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.agentThinking);

    // Agent starts speaking
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.agentStartedSpeaking);

    // Send audio
    this.mockWebSocket.simulateBinaryMessage(mockAudioData);

    // Agent done
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.agentAudioDone);
  }

  /**
   * Simulate a function call scenario
   */
  public async simulateFunctionCall(): Promise<void> {
    // Wait for connection
    await this.waitForConnection();

    // Send welcome
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.welcome);

    // Send function call request
    this.mockWebSocket.simulateMessage(mockWebSocketData.agent.functionCallRequest);
  }

  /**
   * Wait for WebSocket connection to be established
   */
  private async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.mockWebSocket.isOpen()) {
        resolve();
      } else {
        const checkConnection = () => {
          if (this.mockWebSocket.isOpen()) {
            resolve();
          } else {
            setTimeout(checkConnection, 10);
          }
        };
        checkConnection();
      }
    });
  }
}
