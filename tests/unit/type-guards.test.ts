import {
  isUrlSource,
  isTextSource,
  isFileSource,
  isLiveSchema,
  isDeepgramClientOptions,
} from "../../src/lib/helpers";
import { Readable } from "stream";

describe("Unit Tests - Type Guards and Validators", () => {
  describe("isUrlSource", () => {
    it("should identify URL sources correctly", () => {
      const testCases = [
        { url: "https://dpgr.am/spacewalk.wav" },
        { text: "This is not a URL source" },
        { url: "file://local.wav" },
        { buffer: Buffer.from("fake audio") },
        { invalidProperty: "value" },
        {},
        null,
        undefined,
      ];

      const results = testCases.map((source) => ({
        input: source,
        output: source ? isUrlSource(source as any) : false,
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("isTextSource", () => {
    it("should identify text sources correctly", () => {
      const testCases = [
        { text: "This is a text source" },
        { url: "https://dpgr.am/spacewalk.wav" },
        { text: "" },
        { text: "Multi-line\ntext content" },
        { invalidProperty: "value" },
        {},
        null,
        undefined,
      ];

      const results = testCases.map((source) => ({
        input: source,
        output: source ? isTextSource(source as any) : false,
      }));

      expect(results).toMatchSnapshot();
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

      const testCases = [
        buffer,
        readable,
        { url: "https://dpgr.am/spacewalk.wav" },
        { text: "This is text" },
        "string data",
        {},
        null,
        undefined,
      ];

      const results = testCases.map((source) => ({
        input: source?.constructor?.name || typeof source,
        output: isFileSource(source as any),
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("isLiveSchema", () => {
    it("should identify live schema correctly", () => {
      const testCases = [
        { interim_results: true },
        { interim_results: false },
        { language: "en-US", model: "nova-2" },
        { interim_results: true, language: "en-US" },
        {},
        null,
        undefined,
        "not an object",
      ];

      const results = testCases.map((arg) => ({
        input: arg,
        output: isLiveSchema(arg),
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("isDeepgramClientOptions", () => {
    it("should identify Deepgram client options correctly", () => {
      const testCases = [
        { global: { url: "https://api.deepgram.com" } },
        { global: {} },
        { apiKey: "test-key" },
        { global: { headers: { Custom: "Header" } } },
        {},
        null,
        undefined,
        "not an object",
      ];

      const results = testCases.map((arg) => ({
        input: arg,
        output: isDeepgramClientOptions(arg),
      }));

      expect(results).toMatchSnapshot();
    });
  });
});
