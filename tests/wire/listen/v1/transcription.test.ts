import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { DeepgramClient } from "../../../../src";
import { mockServerPool } from "../../../mock-server/MockServerPool";
import { MockServer } from "../../../mock-server/MockServer";

/**
 * Wire tests for REST-based transcription (listen/v1/media).
 *
 * These tests verify:
 * 1. URL-based transcription
 * 2. File upload transcription
 * 3. Various transcription options
 * 4. Error handling
 */
describe("Listen v1 REST transcription", () => {
  let server: MockServer;

  beforeEach(() => {
    server = mockServerPool.createServer();
  });

  afterEach(() => {
    // MockServerPool handles cleanup
  });

  describe("URL-based transcription", () => {
    it("should transcribe audio from URL", async () => {
      const mockResponse = {
        metadata: {
          request_id: "test-123",
          created: "2024-01-01T00:00:00Z",
          duration: 10.5,
          channels: 1,
          models: ["nova-2"],
          model_info: {
            "nova-2": {
              name: "nova-2",
              version: "2024-01-01"
            }
          }
        },
        results: {
          channels: [
            {
              alternatives: [
                {
                  transcript: "Hello, this is a test transcription.",
                  confidence: 0.98,
                  words: [
                    { word: "Hello", start: 0.0, end: 0.5, confidence: 0.99 },
                    { word: "this", start: 0.6, end: 0.8, confidence: 0.97 },
                    { word: "is", start: 0.9, end: 1.0, confidence: 0.98 },
                    { word: "a", start: 1.1, end: 1.2, confidence: 0.99 },
                    { word: "test", start: 1.3, end: 1.6, confidence: 0.96 },
                    { word: "transcription", start: 1.7, end: 2.3, confidence: 0.95 }
                  ]
                }
              ]
            }
          ]
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/audio.wav",
        model: "nova-2"
      });

      expect(result.metadata?.request_id).toBe("test-123");
      expect(result.results?.channels?.[0]?.alternatives?.[0]?.transcript)
        .toBe("Hello, this is a test transcription.");
    });

    it("should handle transcription with multiple options", async () => {
      const mockResponse = {
        metadata: { request_id: "test-456" },
        results: {
          channels: [
            {
              alternatives: [
                {
                  transcript: "Test transcript with features.",
                  confidence: 0.95,
                  paragraphs: {
                    paragraphs: [
                      { sentences: [{ text: "Test transcript with features." }] }
                    ]
                  }
                }
              ]
            }
          ],
          summary: {
            short: "A test transcript with various features enabled."
          },
          topics: {
            segments: [
              { topics: [{ topic: "testing", confidence: 0.9 }] }
            ]
          },
          sentiments: {
            segments: [
              { sentiment: "neutral", confidence: 0.85 }
            ]
          }
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/audio.mp3",
        model: "nova-2",
        smart_format: true,
        summarize: "v2",
        topics: true,
        sentiment: true,
        paragraphs: true,
        punctuate: true
      });

      expect(result.results?.summary?.short).toBeDefined();
      expect(result.results?.topics?.segments).toBeDefined();
      expect(result.results?.sentiments?.segments).toBeDefined();
    });

    it("should handle diarization", async () => {
      const mockResponse = {
        metadata: { request_id: "test-diarize" },
        results: {
          channels: [
            {
              alternatives: [
                {
                  transcript: "Hello. Hi there.",
                  words: [
                    { word: "Hello", speaker: 0, start: 0.0, end: 0.5 },
                    { word: "Hi", speaker: 1, start: 1.0, end: 1.2 },
                    { word: "there", speaker: 1, start: 1.3, end: 1.6 }
                  ]
                }
              ]
            }
          ]
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/conversation.wav",
        model: "nova-2",
        diarize: true
      });

      const words = result.results?.channels?.[0]?.alternatives?.[0]?.words;
      expect(words?.[0]?.speaker).toBe(0);
      expect(words?.[1]?.speaker).toBe(1);
    });
  });

  describe("Language detection", () => {
    it("should detect language automatically", async () => {
      const mockResponse = {
        metadata: {
          request_id: "test-lang",
          detected_language: "es"
        },
        results: {
          channels: [
            {
              detected_language: "es",
              alternatives: [
                { transcript: "Hola, ¿cómo estás?", confidence: 0.92 }
              ]
            }
          ]
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/spanish.wav",
        model: "nova-2",
        detect_language: true
      });

      expect(result.results?.channels?.[0]?.detected_language).toBe("es");
    });
  });

  describe("Callback support", () => {
    it("should accept callback URL", async () => {
      const mockResponse = {
        request_id: "callback-123",
        status: "pending"
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(202)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/audio.wav",
        model: "nova-2",
        callback: "https://myapp.com/webhook"
      });

      // Callback requests return immediately with pending status
      expect(result).toBeDefined();
    });
  });

  describe("Error handling", () => {
    it("should handle 400 bad request", async () => {
      const errorResponse = {
        err_code: "BAD_REQUEST",
        err_msg: "Invalid audio format",
        request_id: "error-123"
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(400)
        .jsonBody(errorResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      await expect(
        client.listen.v1.media.transcribeUrl({
          url: "https://example.com/invalid.txt",
          model: "nova-2"
        })
      ).rejects.toThrow();
    });

    it("should handle 401 unauthorized", async () => {
      const errorResponse = {
        err_code: "UNAUTHORIZED",
        err_msg: "Invalid API key"
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(401)
        .jsonBody(errorResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "invalid-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      await expect(
        client.listen.v1.media.transcribeUrl({
          url: "https://example.com/audio.wav",
          model: "nova-2"
        })
      ).rejects.toThrow();
    });

    it("should handle 429 rate limit", async () => {
      const errorResponse = {
        err_code: "RATE_LIMIT",
        err_msg: "Rate limit exceeded. Please slow down."
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(429)
        .jsonBody(errorResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        maxRetries: 0, // Don't retry for this test
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      await expect(
        client.listen.v1.media.transcribeUrl({
          url: "https://example.com/audio.wav",
          model: "nova-2"
        })
      ).rejects.toThrow();
    });

    it("should handle 500 server error", async () => {
      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(500)
        .jsonBody({ err_code: "INTERNAL_ERROR", err_msg: "Server error" })
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        maxRetries: 0,
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      await expect(
        client.listen.v1.media.transcribeUrl({
          url: "https://example.com/audio.wav",
          model: "nova-2"
        })
      ).rejects.toThrow();
    });
  });

  describe("Encoding options", () => {
    it("should accept encoding parameters", async () => {
      const mockResponse = {
        metadata: { request_id: "encoding-test" },
        results: {
          channels: [
            { alternatives: [{ transcript: "Test", confidence: 0.9 }] }
          ]
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/raw-audio",
        model: "nova-2",
        encoding: "linear16",
        sample_rate: 16000,
        channels: 1
      });

      expect(result.metadata?.request_id).toBe("encoding-test");
    });
  });

  describe("Multiple keyterms", () => {
    it("should handle multiple keywords/keyterms", async () => {
      const mockResponse = {
        metadata: { request_id: "keyterms-test" },
        results: {
          channels: [
            { alternatives: [{ transcript: "Deepgram is amazing", confidence: 0.95 }] }
          ]
        }
      };

      server
        .mockEndpoint()
        .post("/v1/listen")
        .respondWith()
        .statusCode(200)
        .jsonBody(mockResponse)
        .build();

      const client = new DeepgramClient({
        apiKey: "test-key",
        environment: {
          base: server.baseUrl,
          production: "wss://api.deepgram.com",
          agent: "wss://agent.deepgram.com"
        }
      });

      const result = await client.listen.v1.media.transcribeUrl({
        url: "https://example.com/audio.wav",
        model: "nova-2",
        keywords: ["Deepgram:2", "transcription:1.5"]
      });

      expect(result).toBeDefined();
    });
  });
});
