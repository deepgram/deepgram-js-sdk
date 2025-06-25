import { expect } from "chai";
import { AbstractLiveClient } from "../src/packages/AbstractLiveClient";
import { DeepgramWebSocketError } from "../src/lib/errors";
import { LiveTranscriptionEvents } from "../src/lib/enums";
import type { DeepgramClientOptions } from "../src/lib/types";

// Mock WebSocket for testing
class MockWebSocket {
  public url: string;
  public readyState: number = 0;
  public onopen: ((event: any) => void) | null = null;
  public onclose: ((event: any) => void) | null = null;
  public onerror: ((event: any) => void) | null = null;
  public onmessage: ((event: any) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  close() {
    this.readyState = 3;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(_data: any) {
    // Mock send method
  }
}

// Test implementation of AbstractLiveClient
class TestLiveClient extends AbstractLiveClient {
  public namespace: string = "test";

  constructor(options: DeepgramClientOptions) {
    super(options);
  }

  public setupConnection(): void {
    this.setupConnectionEvents({
      Open: LiveTranscriptionEvents.Open,
      Close: LiveTranscriptionEvents.Close,
      Error: LiveTranscriptionEvents.Error,
    });
  }

  // Expose protected methods for testing
  public testExtractErrorInformation(event: any, conn: any) {
    return this.extractErrorInformation(event, conn);
  }

  public testCreateEnhancedError(event: any, enhancedInfo: any) {
    return this.createEnhancedError(event, enhancedInfo);
  }

  public testBuildEnhancedErrorMessage(event: any, enhancedInfo: any) {
    return this.buildEnhancedErrorMessage(event, enhancedInfo);
  }
}

describe("Enhanced WebSocket Error Handling Integration", () => {
  let client: TestLiveClient;

  beforeEach(() => {
    client = new TestLiveClient({
      key: "test-key",
    });
  });

  describe("extractErrorInformation", () => {
    it("should extract basic connection information", () => {
      const mockEvent = {
        type: "error",
        message: "Connection failed",
      };

      const mockConn = {
        readyState: 0,
        url: "wss://api.deepgram.com/v1/listen",
      };

      const result = client.testExtractErrorInformation(mockEvent, mockConn);

      expect(result.readyState).to.equal(0);
      expect(result.url).to.equal("wss://api.deepgram.com/v1/listen");
    });

    it("should extract status code and headers from ws package", () => {
      const mockEvent = {
        type: "error",
        message: "Connection failed",
      };

      const mockConn = {
        readyState: 0,
        url: "wss://api.deepgram.com/v1/listen",
        _req: {
          res: {
            statusCode: 502,
            headers: {
              "dg-request-id": "test-request-123",
              "x-custom-header": "test-value",
            },
          },
        },
      };

      const result = client.testExtractErrorInformation(mockEvent, mockConn);

      expect(result.statusCode).to.equal(502);
      expect(result.requestId).to.equal("test-request-123");
      expect(result.responseHeaders).to.deep.equal({
        "dg-request-id": "test-request-123",
        "x-custom-header": "test-value",
      });
    });

    it("should extract information from event target for native WebSocket", () => {
      const mockTarget = {
        url: "wss://api.deepgram.com/v1/listen",
        readyState: 1,
      };

      const mockEvent = {
        type: "error",
        message: "Connection failed",
        target: mockTarget,
      };

      const mockConn = {};

      const result = client.testExtractErrorInformation(mockEvent, mockConn);

      expect(result.url).to.equal("wss://api.deepgram.com/v1/listen");
      expect(result.readyState).to.equal(1);
    });

    it("should handle missing connection gracefully", () => {
      const mockEvent = {
        type: "error",
        message: "Connection failed",
      };

      const result = client.testExtractErrorInformation(mockEvent, null);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.be.undefined;
      expect(result.requestId).to.be.undefined;
    });
  });

  describe("buildEnhancedErrorMessage", () => {
    it("should build a comprehensive error message with all details", () => {
      const mockEvent = {
        message: "Received network error or non-101 status code.",
      };

      const enhancedInfo = {
        statusCode: 502,
        requestId: "test-request-123",
        readyState: 0,
        url: "wss://api.deepgram.com/v1/listen",
      };

      const result = client.testBuildEnhancedErrorMessage(mockEvent, enhancedInfo);

      expect(result).to.include("Received network error or non-101 status code.");
      expect(result).to.include("Status: 502");
      expect(result).to.include("Request ID: test-request-123");
      expect(result).to.include("Ready State: CONNECTING");
      expect(result).to.include("URL: wss://api.deepgram.com/v1/listen");
    });

    it("should handle minimal information gracefully", () => {
      const mockEvent = {
        message: "Simple error",
      };

      const enhancedInfo = {};

      const result = client.testBuildEnhancedErrorMessage(mockEvent, enhancedInfo);

      expect(result).to.equal("Simple error");
    });

    it("should provide default message when none exists", () => {
      const mockEvent = {};
      const enhancedInfo = { statusCode: 401 };

      const result = client.testBuildEnhancedErrorMessage(mockEvent, enhancedInfo);

      expect(result).to.include("WebSocket connection error");
      expect(result).to.include("Status: 401");
    });
  });

  describe("createEnhancedError", () => {
    it("should create a backward-compatible error object", () => {
      const mockEvent = {
        type: "error",
        message: "Connection failed",
        timeStamp: 1234567890,
      };

      const enhancedInfo = {
        statusCode: 502,
        requestId: "test-request-123",
        url: "wss://api.deepgram.com/v1/listen",
        readyState: 0,
      };

      const result = client.testCreateEnhancedError(mockEvent, enhancedInfo);

      // Check backward compatibility - original event properties
      expect(result.type).to.equal("error");
      expect(result.timeStamp).to.equal(1234567890);

      // Check enhanced properties
      expect(result.statusCode).to.equal(502);
      expect(result.requestId).to.equal("test-request-123");
      expect(result.url).to.equal("wss://api.deepgram.com/v1/listen");
      expect(result.readyState).to.equal(0);
      expect(result.message).to.include("Connection failed");
      expect(result.message).to.include("Status: 502");

      // Check enhanced error object
      expect(result.error).to.be.instanceOf(DeepgramWebSocketError);
      expect(result.error.statusCode).to.equal(502);
      expect(result.error.requestId).to.equal("test-request-123");
    });
  });

  describe("setupConnectionEvents integration", () => {
    it("should emit enhanced error events", (done) => {
      // Create a mock connection
      const mockConn = new MockWebSocket("wss://api.deepgram.com/v1/listen");
      client.conn = mockConn as any;

      // Set up the connection
      client.setupConnection();

      // Listen for the enhanced error event
      client.on(LiveTranscriptionEvents.Error, (errorData) => {
        expect(errorData).to.have.property("error");
        expect(errorData.error).to.be.instanceOf(DeepgramWebSocketError);
        expect(errorData).to.have.property("url", "wss://api.deepgram.com/v1/listen");
        expect(errorData).to.have.property("readyState", 0);
        expect(errorData.message).to.include("Test error");
        done();
      });

      // Simulate an error event
      const mockErrorEvent = {
        type: "error",
        message: "Test error",
        timeStamp: Date.now(),
      };

      mockConn.onerror!(mockErrorEvent);
    });
  });
});
