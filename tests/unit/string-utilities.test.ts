import { stripTrailingSlash, convertProtocolToWs } from "../../src/lib/helpers";

describe("Unit Tests - String and URL Utilities", () => {
  describe("stripTrailingSlash", () => {
    it("should handle various URL formats", () => {
      const testCases = [
        "https://api.deepgram.com/",
        "https://api.deepgram.com",
        "https://api.deepgram.com/v1/",
        "https://api.deepgram.com/v1",
        "/",
        "",
        "path/",
        "path",
      ];

      const results = testCases.map((url) => ({
        input: url,
        output: stripTrailingSlash(url),
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("convertProtocolToWs", () => {
    it("should convert HTTP protocols to WebSocket protocols", () => {
      const testCases = [
        "https://api.deepgram.com",
        "http://api.deepgram.com",
        "HTTPS://API.DEEPGRAM.COM",
        "HTTP://API.DEEPGRAM.COM",
        "wss://already-websocket.com",
        "ws://already-websocket.com",
      ];

      const results = testCases.map((url) => ({
        input: url,
        output: convertProtocolToWs(url),
      }));

      expect(results).toMatchSnapshot();
    });
  });
});
