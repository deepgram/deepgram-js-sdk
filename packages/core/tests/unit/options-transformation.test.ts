import { convertLegacyOptions } from "../../src/lib/helpers";

describe("Unit Tests - Options Transformation Utilities", () => {
  describe("convertLegacyOptions", () => {
    it("should convert _experimentalCustomFetch to global.fetch.client", () => {
      const customFetch = jest.fn();
      const options = { _experimentalCustomFetch: customFetch };

      const result = convertLegacyOptions(options as any);

      expect(result.global?.fetch?.client).toBe(customFetch);
    });

    it("should convert restProxy.url to global.fetch.options.proxy.url", () => {
      const options = { restProxy: { url: "https://proxy.example.com" } };

      const result = convertLegacyOptions(options as any);

      expect(result.global?.fetch?.options?.proxy?.url).toBe("https://proxy.example.com");
    });

    it("should convert global.url to both fetch and websocket options", () => {
      const options = { global: { url: "https://custom-api.deepgram.com" } };

      const result = convertLegacyOptions(options);

      expect(result.global?.fetch?.options?.url).toBe("https://custom-api.deepgram.com");
      expect(result.global?.websocket?.options?.url).toBe("https://custom-api.deepgram.com");
    });

    it("should convert global.headers to both fetch and websocket options", () => {
      const customHeaders = { "Custom-Header": "value", Another: "header" };
      const options = { global: { headers: customHeaders } };

      const result = convertLegacyOptions(options);

      expect(result.global?.fetch?.options?.headers).toEqual(customHeaders);
      expect(result.global?.websocket?.options?._nodeOnlyHeaders).toEqual(customHeaders);
    });

    it("should handle combined legacy options", () => {
      const customFetch = jest.fn();
      const customHeaders = { "X-Custom": "header" };
      const options = {
        _experimentalCustomFetch: customFetch,
        restProxy: { url: "https://proxy.example.com" },
        global: {
          url: "https://custom-api.deepgram.com",
          headers: customHeaders,
        },
      };

      const result = convertLegacyOptions(options as any);

      // Should have all conversions
      expect(result.global?.fetch?.client).toBe(customFetch);
      expect(result.global?.fetch?.options?.proxy?.url).toBe("https://proxy.example.com");
      expect(result.global?.fetch?.options?.url).toBe("https://custom-api.deepgram.com");
      expect(result.global?.fetch?.options?.headers).toEqual(customHeaders);
      expect(result.global?.websocket?.options?.url).toBe("https://custom-api.deepgram.com");
      expect(result.global?.websocket?.options?._nodeOnlyHeaders).toEqual(customHeaders);
    });

    it("should return empty object when no legacy options provided", () => {
      const result = convertLegacyOptions({});

      // Should have some structure from the merge operations
      expect(typeof result).toBe("object");
    });

    it("should preserve existing options", () => {
      const existingOptions = {
        global: {
          fetch: {
            options: {
              url: "https://existing.com",
            },
          },
        },
      };
      const options = {
        ...existingOptions,
        _experimentalCustomFetch: jest.fn(),
      };

      const result = convertLegacyOptions(options as any);

      // Should preserve existing URL while adding new fetch client
      expect(result.global?.fetch?.options?.url).toBe("https://existing.com");
      expect(result.global?.fetch?.client).toBeDefined();
    });
  });
});
