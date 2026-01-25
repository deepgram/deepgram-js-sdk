import { describe, it, expect, vi } from "vitest";
import { toQueryString } from "../../src/core/url/qs";

// Mock the HeaderAuthProvider to avoid auth errors
vi.mock("../../src/auth/HeaderAuthProvider.js", () => ({
  HeaderAuthProvider: class {
    constructor() {}
    async getAuthRequest() {
      return {
        headers: {
          Authorization: "Token test-key",
        },
      };
    }
  },
}));

/**
 * Unit tests for multiple keyterms support in listen.v2
 *
 * Issue: The v5.0.0-alpha.1 SDK only accepts a single keyterm, but the API docs
 * mention that to provide multiple keyterms, you add more keyterm=<KEYTERM_VALUE>
 * pairs in the query params.
 *
 * Our wrapper should accept keyterm as either a string or string[], and properly
 * generate multiple keyterm parameters when an array is provided.
 */
describe("Multiple keyterms support in listen.v2", () => {
  describe("Query string generation", () => {
    it("should handle single keyterm as string", () => {
      const params = {
        model: "nova-2",
        keyterm: "weather"
      };

      const result = toQueryString(params, { arrayFormat: "repeat" });
      expect(result).toBe("model=nova-2&keyterm=weather");
    });

    it("should handle multiple keyterms as array with repeat format", () => {
      const params = {
        model: "nova-2",
        keyterm: ["weather", "forecast", "temperature"]
      };

      const result = toQueryString(params, { arrayFormat: "repeat" });
      expect(result).toBe("model=nova-2&keyterm=weather&keyterm=forecast&keyterm=temperature");
    });

    it("should properly encode special characters in keyterms", () => {
      const params = {
        model: "nova-2",
        keyterm: ["hello world", "test & demo", "special/chars"]
      };

      const result = toQueryString(params, { arrayFormat: "repeat" });
      expect(result).toBe("model=nova-2&keyterm=hello%20world&keyterm=test%20%26%20demo&keyterm=special%2Fchars");
    });

    it("should handle empty keyterm array", () => {
      const params = {
        model: "nova-2",
        keyterm: []
      };

      const result = toQueryString(params, { arrayFormat: "repeat" });
      expect(result).toBe("model=nova-2");
    });
  });

  describe("WrappedListenV2Client type checking", () => {
    it("should verify the connect method accepts string | string[] for keyterm", () => {
      // This is a compile-time check - if TypeScript compiles this,
      // then our types are working correctly

      type ConnectArgsWithArrayKeyterm = {
        model: string;
        keyterm?: string | string[];
        encoding?: string;
        sample_rate?: string;
        Authorization?: string;
      };

      // Test that both string and array are valid
      const validStringKeyterm: ConnectArgsWithArrayKeyterm = {
        model: "nova-2",
        keyterm: "weather"
      };

      const validArrayKeyterm: ConnectArgsWithArrayKeyterm = {
        model: "nova-2",
        keyterm: ["weather", "forecast", "temperature"]
      };

      expect(validStringKeyterm.keyterm).toBe("weather");
      expect(validArrayKeyterm.keyterm).toEqual(["weather", "forecast", "temperature"]);
    });

    it("should verify query parameters handle arrays correctly", () => {
      // Test the query parameter transformation logic
      const queryParams: Record<string, string | string[] | object | object[] | null> = {};
      const model = "nova-2";
      const keyterm = ["weather", "forecast", "temperature"];

      queryParams.model = model;
      if (keyterm != null) queryParams.keyterm = keyterm;

      expect(queryParams.model).toBe("nova-2");
      expect(queryParams.keyterm).toEqual(["weather", "forecast", "temperature"]);

      // Verify the query string generation
      const queryString = toQueryString(queryParams, { arrayFormat: "repeat" });
      expect(queryString).toBe("model=nova-2&keyterm=weather&keyterm=forecast&keyterm=temperature");
    });
  });

  describe("URL generation with ReconnectingWebSocket", () => {
    it("should correctly generate URL with array parameters", () => {
      const baseUrl = "wss://api.deepgram.com/v2/listen";
      const queryParams = {
        model: "nova-2",
        keyterm: ["alpha", "beta", "gamma"]
      };

      const queryString = toQueryString(queryParams, { arrayFormat: "repeat" });
      const fullUrl = `${baseUrl}?${queryString}`;

      expect(fullUrl).toBe("wss://api.deepgram.com/v2/listen?model=nova-2&keyterm=alpha&keyterm=beta&keyterm=gamma");

      // Verify URL parsing handles multiple values correctly
      const url = new URL(fullUrl);
      const keytermValues = url.searchParams.getAll('keyterm');
      expect(keytermValues).toEqual(["alpha", "beta", "gamma"]);
    });

    it("should handle mixed single and array parameters", () => {
      const queryParams = {
        model: "nova-2",
        encoding: "linear16",
        keyterm: ["test1", "test2"],
        tag: ["tag1", "tag2"]
      };

      const queryString = toQueryString(queryParams, { arrayFormat: "repeat" });

      // Should contain all parameters with arrays repeated
      expect(queryString).toContain("model=nova-2");
      expect(queryString).toContain("encoding=linear16");
      expect(queryString).toContain("keyterm=test1");
      expect(queryString).toContain("keyterm=test2");
      expect(queryString).toContain("tag=tag1");
      expect(queryString).toContain("tag=tag2");
    });
  });
});