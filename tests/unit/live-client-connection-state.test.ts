import { ListenLiveClient } from "../../src/packages/ListenLiveClient";
import { SpeakLiveClient } from "../../src/packages/SpeakLiveClient";
import { AgentLiveClient } from "../../src/packages/AgentLiveClient";
import { CONNECTION_STATE, SOCKET_STATES } from "../../src/lib/constants";
import { LiveTranscriptionEvents } from "../../src/lib/enums/LiveTranscriptionEvents";

describe("Unit Tests - Live Client Connection State", () => {
  describe("Connection State Management", () => {
    let client: ListenLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      // Mock the connection object
      mockConnection = {
        readyState: SOCKET_STATES.connecting,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
      };

      // Create a mock WebSocket constructor
      const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

      // Create client with mocked transport
      client = new ListenLiveClient({
        key: "test-key",
        global: {
          websocket: {
            // @ts-expect-error - bypassing TypeScript for testing
            client: MockWebSocket,
          },
        },
      });
    });

    afterEach(() => {
      if (client) {
        client.disconnect();
      }
    });

    it("should report correct connection state during lifecycle", () => {
      // Initially connecting
      expect(client.connectionState()).toBe(CONNECTION_STATE.Connecting);

      // Simulate connection open
      mockConnection.readyState = SOCKET_STATES.open;
      expect(client.connectionState()).toBe(CONNECTION_STATE.Open);

      // Simulate connection closing
      mockConnection.readyState = SOCKET_STATES.closing;
      expect(client.connectionState()).toBe(CONNECTION_STATE.Closing);

      // Simulate connection closed
      mockConnection.readyState = SOCKET_STATES.closed;
      expect(client.connectionState()).toBe(CONNECTION_STATE.Closed);
    });

    it("should correctly report if connected", () => {
      // Not connected initially
      expect(client.isConnected()).toBe(false);

      // Connected when open
      mockConnection.readyState = SOCKET_STATES.open;
      expect(client.isConnected()).toBe(true);

      // Not connected when closing
      mockConnection.readyState = SOCKET_STATES.closing;
      expect(client.isConnected()).toBe(false);
    });

    it("should provide ready state access", () => {
      mockConnection.readyState = SOCKET_STATES.open;
      expect(client.getReadyState()).toBe(SOCKET_STATES.open);

      mockConnection.readyState = SOCKET_STATES.closed;
      expect(client.getReadyState()).toBe(SOCKET_STATES.closed);
    });

    it("should handle disconnection properly", () => {
      mockConnection.readyState = SOCKET_STATES.open;

      client.disconnect();

      expect(mockConnection.close).toHaveBeenCalled();
    });

    it("should handle disconnection with code and reason", () => {
      mockConnection.readyState = SOCKET_STATES.open;

      client.disconnect(1000, "Test closure");

      expect(mockConnection.close).toHaveBeenCalledWith(1000, "Test closure");
    });

    it("should have reconnect function available", () => {
      expect(typeof client.reconnect).toBe("function");
    });
  });

  describe("ListenLiveClient Specific Functionality", () => {
    let client: ListenLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      mockConnection = {
        readyState: SOCKET_STATES.open,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
      };

      const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

      client = new ListenLiveClient({
        key: "test-key",
        global: {
          websocket: {
            // @ts-expect-error - bypassing TypeScript for testing
            client: MockWebSocket,
          },
        },
      });
    });

    afterEach(() => {
      client.disconnect();
    });

    it("should send audio data correctly", () => {
      const audioData = new ArrayBuffer(1024);
      client.send(audioData);

      expect(mockConnection.send).toHaveBeenCalledWith(audioData);
    });

    it("should send string data correctly", () => {
      const textData = "test message";
      client.send(textData);

      expect(mockConnection.send).toHaveBeenCalledWith(textData);
    });

    it("should buffer messages when not connected", () => {
      mockConnection.readyState = SOCKET_STATES.connecting;

      const audioData = new ArrayBuffer(512);
      client.send(audioData);

      // Should not send immediately when not connected
      expect(mockConnection.send).not.toHaveBeenCalled();
    });

    it("should send keepAlive messages", () => {
      client.keepAlive();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "KeepAlive" }));
    });

    it("should send close stream requests", () => {
      client.requestClose();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "CloseStream" }));
    });

    it("should use finish method (deprecated)", () => {
      client.finish();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "CloseStream" }));
    });
  });

  describe("SpeakLiveClient Specific Functionality", () => {
    let client: SpeakLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      mockConnection = {
        readyState: SOCKET_STATES.open,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
      };

      const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

      client = new SpeakLiveClient({
        key: "test-key",
        global: {
          websocket: {
            // @ts-expect-error - bypassing TypeScript for testing
            client: MockWebSocket,
          },
        },
      });
    });

    afterEach(() => {
      client.disconnect();
    });

    it("should send text for TTS synthesis", () => {
      const text = "Hello, this is a test.";
      client.sendText(text);

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Speak", text }));
    });

    it("should send flush commands", () => {
      client.flush();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Flush" }));
    });

    it("should send clear commands", () => {
      client.clear();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Clear" }));
    });

    it("should send close requests", () => {
      client.requestClose();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "Close" }));
    });
  });

  describe("AgentLiveClient Specific Functionality", () => {
    let client: AgentLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      mockConnection = {
        readyState: SOCKET_STATES.open,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
      };

      const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

      client = new AgentLiveClient({
        key: "test-key",
        global: {
          websocket: {
            // @ts-expect-error - bypassing TypeScript for testing
            client: MockWebSocket,
          },
        },
      });
    });

    afterEach(() => {
      client.disconnect();
    });

    it("should send keepAlive messages", () => {
      client.keepAlive();

      expect(mockConnection.send).toHaveBeenCalledWith(JSON.stringify({ type: "KeepAlive" }));
    });

    it("should send audio data", () => {
      const audioData = new ArrayBuffer(1024);
      client.send(audioData);

      expect(mockConnection.send).toHaveBeenCalledWith(audioData);
    });

    it("should handle namespace correctly", () => {
      expect(client.namespace).toBe("agent");
    });
  });

  describe("Error Handling", () => {
    let client: ListenLiveClient;
    let mockConnection: any;

    beforeEach(() => {
      mockConnection = {
        readyState: SOCKET_STATES.open,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
      };

      const MockWebSocket = jest.fn().mockImplementation(() => mockConnection);

      client = new ListenLiveClient({
        key: "test-key",
        global: {
          websocket: {
            // @ts-expect-error - bypassing TypeScript for testing
            client: MockWebSocket,
          },
        },
      });

      client.setupConnection();
    });

    afterEach(() => {
      client.disconnect();
    });

    it("should handle empty blob data gracefully", async () => {
      const logSpy = jest.spyOn(client as any, "log").mockImplementation();

      const emptyBlob = new Blob([]);
      client.send(emptyBlob);

      // Wait for async blob processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(logSpy).toHaveBeenCalledWith("warn", "skipping `send` for zero-byte blob", emptyBlob);
      expect(mockConnection.send).not.toHaveBeenCalled();

      logSpy.mockRestore();
    });

    it("should handle zero-byte ArrayBuffer gracefully", () => {
      const logSpy = jest.spyOn(client as any, "log").mockImplementation();

      const emptyBuffer = new ArrayBuffer(0);
      client.send(emptyBuffer);

      expect(logSpy).toHaveBeenCalledWith(
        "warn",
        "skipping `send` for zero-byte payload",
        emptyBuffer
      );
      expect(mockConnection.send).not.toHaveBeenCalled();

      logSpy.mockRestore();
    });

    it("should handle connection errors gracefully", () => {
      const errorSpy = jest.fn();
      client.on(LiveTranscriptionEvents.Error, errorSpy);

      const errorEvent = { type: "error", message: "Connection failed" };
      mockConnection.onerror(errorEvent);

      expect(errorSpy).toHaveBeenCalledWith(errorEvent);
    });
  });
});
