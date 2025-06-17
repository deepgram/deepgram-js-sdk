import {
  DEFAULT_HEADERS,
  DEFAULT_URL,
  DEFAULT_OPTIONS,
  SOCKET_STATES,
  CONNECTION_STATE,
} from "../../src/lib/constants";

describe("Unit Tests - Constants and Configuration", () => {
  describe("DEFAULT_HEADERS", () => {
    it("should have correct structure and dynamic values", () => {
      const headers = { ...DEFAULT_HEADERS };

      // Replace dynamic values for consistent snapshots
      const result = {
        ...headers,
        "X-Client-Info": headers["X-Client-Info"].replace(/v[\d.]+/, "v[VERSION]"),
        "User-Agent": headers["User-Agent"]
          .replace(/\/[\d.]+/, "/[VERSION]")
          .replace(/(node|bun)\/[\d.]+/, "$1/[VERSION]"),
      };

      expect(result).toMatchSnapshot();
    });
  });

  describe("DEFAULT_URL and DEFAULT_OPTIONS", () => {
    it("should have correct default configuration", () => {
      const config = {
        DEFAULT_URL,
        // Simplified to avoid TypeScript header indexing issues
        DEFAULT_OPTIONS_STRUCTURE: {
          hasGlobal: !!DEFAULT_OPTIONS.global,
          hasAgent: !!DEFAULT_OPTIONS.agent,
          globalHasFetch: !!DEFAULT_OPTIONS.global?.fetch,
          globalHasWebsocket: !!DEFAULT_OPTIONS.global?.websocket,
          agentHasFetch: !!DEFAULT_OPTIONS.agent?.fetch,
          agentHasWebsocket: !!DEFAULT_OPTIONS.agent?.websocket,
        },
      };

      expect(config).toMatchSnapshot();
    });
  });

  describe("Enums", () => {
    it("should have correct enum values", () => {
      const enums = {
        SOCKET_STATES,
        CONNECTION_STATE,
      };

      expect(enums).toMatchSnapshot();
    });
  });
});
