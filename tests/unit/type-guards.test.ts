import {
  isUrlSource,
  isTextSource,
  isFileSource,
  isLiveSchema,
  isDeepgramClientOptions,
} from "../../src/core/lib/helpers";
import { Readable } from "node:stream";

describe("Unit Tests - Type Guards and Validators", () => {
  describe("isUrlSource", () => {
    it("should identify URL sources correctly", () => {
      // Valid URL sources
      expect(isUrlSource({ url: "https://dpgr.am/spacewalk.wav" })).toBe(true);
      expect(isUrlSource({ url: "file://local.wav" })).toBe(true);
      expect(isUrlSource({ url: "" })).toBe(false); // Empty string should be false

      // Invalid sources
      expect(isUrlSource({ text: "This is not a URL source" } as any)).toBe(false);
      expect(isUrlSource({ buffer: Buffer.from("fake audio") } as any)).toBe(false);
      expect(isUrlSource({ invalidProperty: "value" } as any)).toBe(false);
      expect(isUrlSource({} as any)).toBe(false);
      expect(isUrlSource(null as any)).toBe(false);
      expect(isUrlSource(undefined as any)).toBe(false);
    });
  });

  describe("isTextSource", () => {
    it("should identify text sources correctly", () => {
      // Valid text sources
      expect(isTextSource({ text: "This is a text source" })).toBe(true);
      expect(isTextSource({ text: "Multi-line\ntext content" })).toBe(true);

      // Empty string should be falsy
      expect(isTextSource({ text: "" })).toBe(false);

      // Invalid sources
      expect(isTextSource({ url: "https://dpgr.am/spacewalk.wav" } as any)).toBe(false);
      expect(isTextSource({ invalidProperty: "value" } as any)).toBe(false);
      expect(isTextSource({} as any)).toBe(false);
      expect(isTextSource(null as any)).toBe(false);
      expect(isTextSource(undefined as any)).toBe(false);
    });
  });

  describe("isFileSource", () => {
    it("should identify file sources correctly", () => {
      const buffer = Buffer.from("fake audio data");
      const readable = new Readable({
        read() {
          this.push("audio data");
          this.push(null);
        },
      });

      // Valid file sources
      expect(isFileSource(buffer)).toBe(true);
      expect(isFileSource(readable)).toBe(true);

      // Invalid sources
      expect(isFileSource({ url: "https://dpgr.am/spacewalk.wav" } as any)).toBe(false);
      expect(isFileSource({ text: "This is text" } as any)).toBe(false);
      expect(isFileSource("string data" as any)).toBe(false);
      expect(isFileSource({} as any)).toBe(false);
      expect(isFileSource(null as any)).toBe(false);
      expect(isFileSource(undefined as any)).toBe(false);
      expect(isFileSource(123 as any)).toBe(false);
      expect(isFileSource([] as any)).toBe(false);
    });
  });

  describe("isLiveSchema", () => {
    it("should identify live schema correctly", () => {
      // Valid live schemas
      expect(isLiveSchema({ interim_results: true })).toBe(true);
      expect(isLiveSchema({ interim_results: false })).toBe(true);
      expect(isLiveSchema({ interim_results: true, language: "en-US" })).toBe(true);

      // Invalid schemas - interim_results must be defined
      expect(isLiveSchema({ language: "en-US", model: "nova-2" })).toBe(false);
      expect(isLiveSchema({})).toBe(false);
      expect(isLiveSchema(null)).toBe(false);
      expect(isLiveSchema(undefined)).toBe(false);
      expect(isLiveSchema("not an object")).toBe(false);
      expect(isLiveSchema(123)).toBe(false);
    });
  });

  describe("isDeepgramClientOptions", () => {
    it("should identify Deepgram client options correctly", () => {
      // Valid client options
      expect(isDeepgramClientOptions({ global: { url: "https://api.deepgram.com" } })).toBe(true);
      expect(isDeepgramClientOptions({ global: {} })).toBe(true);
      expect(isDeepgramClientOptions({ global: { headers: { Custom: "Header" } } })).toBe(true);

      // Invalid options - global property must be defined
      expect(isDeepgramClientOptions({ apiKey: "test-key" })).toBe(false);
      expect(isDeepgramClientOptions({})).toBe(false);
      expect(isDeepgramClientOptions(null)).toBe(false);
      expect(isDeepgramClientOptions(undefined)).toBe(false);
      expect(isDeepgramClientOptions("not an object")).toBe(false);
      expect(isDeepgramClientOptions(123)).toBe(false);
    });
  });
});

describe("isFileSource with duck-typed stream detection", () => {
  let isBrowserMock: jest.SpyInstance;

  beforeEach(() => {
    // Import and mock the isBrowser function
    const runtime = require("../../src/core/lib/runtime"); // eslint-disable-line @typescript-eslint/no-require-imports
    isBrowserMock = jest.spyOn(runtime, "isBrowser");
  });

  afterEach(() => {
    isBrowserMock.mockRestore();
  });

  describe("in Node.js environment", () => {
    beforeEach(() => {
      isBrowserMock.mockReturnValue(false);
    });

    it("should detect objects with all required stream properties", () => {
      const streamLikeObject = {
        pipe: jest.fn(),
        read: jest.fn(),
        _readableState: { flowing: null, ended: false },
      };

      expect(isFileSource(streamLikeObject as any)).toBe(true);
    });

    it("should reject objects missing pipe method", () => {
      const invalidStream = {
        read: jest.fn(),
        _readableState: {},
      };

      expect(isFileSource(invalidStream as any)).toBe(false);
    });

    it("should reject objects missing read method", () => {
      const invalidStream = {
        pipe: jest.fn(),
        _readableState: {},
      };

      expect(isFileSource(invalidStream as any)).toBe(false);
    });

    it("should reject objects missing _readableState", () => {
      const invalidStream = {
        pipe: jest.fn(),
        read: jest.fn(),
      };

      expect(isFileSource(invalidStream as any)).toBe(false);
    });

    it("should reject objects where methods are not functions", () => {
      const invalidStream = {
        pipe: "not a function",
        read: jest.fn(),
        _readableState: {},
      };

      expect(isFileSource(invalidStream as any)).toBe(false);
    });
  });

  describe("in browser environment", () => {
    beforeEach(() => {
      isBrowserMock.mockReturnValue(true);
    });

    it("should always return false for stream-like objects", () => {
      const streamLikeObject = {
        pipe: jest.fn(),
        read: jest.fn(),
        _readableState: {},
      };

      // Even with all properties, should return false in browser
      expect(isFileSource(streamLikeObject as any)).toBe(false);
    });

    it("should still detect Buffer objects", () => {
      const buffer = Buffer.from("test data");
      expect(isFileSource(buffer)).toBe(true);
    });
  });
});
