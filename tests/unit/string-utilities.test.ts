import { stripTrailingSlash, convertProtocolToWs } from "../../src/lib/helpers";

describe("Unit Tests - String and URL Utilities", () => {
  describe("stripTrailingSlash", () => {
    it("should remove trailing slash from URLs", () => {
      expect(stripTrailingSlash("https://api.deepgram.com/")).toBe("https://api.deepgram.com");
      expect(stripTrailingSlash("https://api.deepgram.com/v1/")).toBe(
        "https://api.deepgram.com/v1"
      );
      expect(stripTrailingSlash("path/")).toBe("path");
      expect(stripTrailingSlash("/")).toBe("");
    });

    it("should not modify URLs without trailing slash", () => {
      expect(stripTrailingSlash("https://api.deepgram.com")).toBe("https://api.deepgram.com");
      expect(stripTrailingSlash("https://api.deepgram.com/v1")).toBe("https://api.deepgram.com/v1");
      expect(stripTrailingSlash("path")).toBe("path");
    });

    it("should handle empty string", () => {
      expect(stripTrailingSlash("")).toBe("");
    });

    it("should only remove one trailing slash", () => {
      expect(stripTrailingSlash("https://api.deepgram.com//")).toBe("https://api.deepgram.com/");
    });
  });

  describe("convertProtocolToWs", () => {
    it("should convert HTTP to WebSocket protocols", () => {
      expect(convertProtocolToWs("https://api.deepgram.com")).toBe("wss://api.deepgram.com");
      expect(convertProtocolToWs("http://api.deepgram.com")).toBe("ws://api.deepgram.com");
    });

    it("should handle uppercase protocols", () => {
      expect(convertProtocolToWs("HTTPS://API.DEEPGRAM.COM")).toBe("wss://api.deepgram.com");
      expect(convertProtocolToWs("HTTP://API.DEEPGRAM.COM")).toBe("ws://api.deepgram.com");
    });

    it("should not modify WebSocket protocols", () => {
      expect(convertProtocolToWs("wss://already-websocket.com")).toBe(
        "wss://already-websocket.com"
      );
      expect(convertProtocolToWs("ws://already-websocket.com")).toBe("ws://already-websocket.com");
    });

    it("should handle mixed case protocols", () => {
      expect(convertProtocolToWs("Http://example.com")).toBe("ws://example.com");
      expect(convertProtocolToWs("Https://example.com")).toBe("wss://example.com");
    });

    it("should handle protocols without authority", () => {
      expect(convertProtocolToWs("http:example")).toBe("ws:example");
      expect(convertProtocolToWs("https:example")).toBe("wss:example");
    });
  });
});
