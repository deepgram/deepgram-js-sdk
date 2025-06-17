import {
  DEFAULT_HEADERS,
  DEFAULT_URL,
  DEFAULT_OPTIONS,
  SOCKET_STATES,
  CONNECTION_STATE,
} from "../../src/lib/constants";

describe("Unit Tests - Constants and Configuration", () => {
  describe("DEFAULT_HEADERS", () => {
    it("should have required headers with correct structure", () => {
      expect(DEFAULT_HEADERS["Content-Type"]).toBe("application/json");
      expect(DEFAULT_HEADERS["X-Client-Info"]).toMatch(
        /@deepgram\/sdk; (browser|server); v[\d.-]+/
      );
      expect(DEFAULT_HEADERS["User-Agent"]).toMatch(
        /@deepgram\/sdk\/[\d.-]+(automated)? (node\/[\d.]+|bun\/[\d.]+|javascript)/
      );
    });

    it("should have all required header fields", () => {
      expect(DEFAULT_HEADERS).toHaveProperty("Content-Type");
      expect(DEFAULT_HEADERS["Content-Type"]).toBeTruthy();

      expect(DEFAULT_HEADERS).toHaveProperty("X-Client-Info");
      expect(DEFAULT_HEADERS["X-Client-Info"]).toBeTruthy();

      expect(DEFAULT_HEADERS).toHaveProperty("User-Agent");
      expect(DEFAULT_HEADERS["User-Agent"]).toBeTruthy();
    });
  });

  describe("DEFAULT_URL and DEFAULT_OPTIONS", () => {
    it("should have correct default URL", () => {
      expect(DEFAULT_URL).toBe("https://api.deepgram.com");
    });

    it("should have properly structured DEFAULT_OPTIONS", () => {
      expect(DEFAULT_OPTIONS).toHaveProperty("global");
      expect(DEFAULT_OPTIONS).toHaveProperty("agent");

      // Global options structure
      expect(DEFAULT_OPTIONS.global).toHaveProperty("fetch");
      expect(DEFAULT_OPTIONS.global).toHaveProperty("websocket");
      expect(DEFAULT_OPTIONS.global?.fetch).toHaveProperty("options");
      expect(DEFAULT_OPTIONS.global?.websocket).toHaveProperty("options");

      // Agent options structure
      expect(DEFAULT_OPTIONS.agent).toHaveProperty("fetch");
      expect(DEFAULT_OPTIONS.agent).toHaveProperty("websocket");
      expect(DEFAULT_OPTIONS.agent?.fetch).toHaveProperty("options");
      expect(DEFAULT_OPTIONS.agent?.websocket).toHaveProperty("options");
    });

    it("should have correct URLs in options", () => {
      expect(DEFAULT_OPTIONS.global?.fetch?.options?.url).toBe("https://api.deepgram.com");
      expect(DEFAULT_OPTIONS.global?.websocket?.options?.url).toBe("wss://api.deepgram.com");
      expect(DEFAULT_OPTIONS.agent?.fetch?.options?.url).toBe("https://api.deepgram.com");
      expect(DEFAULT_OPTIONS.agent?.websocket?.options?.url).toBe("wss://agent.deepgram.com");
    });

    it("should include headers in options", () => {
      expect(DEFAULT_OPTIONS.global?.fetch?.options?.headers).toEqual(DEFAULT_HEADERS);
      expect(DEFAULT_OPTIONS.global?.websocket?.options?._nodeOnlyHeaders).toEqual(DEFAULT_HEADERS);
      expect(DEFAULT_OPTIONS.agent?.fetch?.options?.headers).toEqual(DEFAULT_HEADERS);
      expect(DEFAULT_OPTIONS.agent?.websocket?.options?._nodeOnlyHeaders).toEqual(DEFAULT_HEADERS);
    });
  });

  describe("Enums", () => {
    it("should have correct SOCKET_STATES values", () => {
      expect(SOCKET_STATES.connecting).toBe(0);
      expect(SOCKET_STATES.open).toBe(1);
      expect(SOCKET_STATES.closing).toBe(2);
      expect(SOCKET_STATES.closed).toBe(3);
    });

    it("should have correct CONNECTION_STATE values", () => {
      expect(CONNECTION_STATE.Connecting).toBe("connecting");
      expect(CONNECTION_STATE.Open).toBe("open");
      expect(CONNECTION_STATE.Closing).toBe("closing");
      expect(CONNECTION_STATE.Closed).toBe("closed");
    });

    it("should have all expected enum members", () => {
      const expectedSocketStates = ["connecting", "open", "closing", "closed"];
      const expectedConnectionStates = ["Connecting", "Open", "Closing", "Closed"];

      expectedSocketStates.forEach((state) => {
        expect(SOCKET_STATES).toHaveProperty(state);
      });

      expectedConnectionStates.forEach((state) => {
        expect(CONNECTION_STATE).toHaveProperty(state);
      });
    });
  });
});
