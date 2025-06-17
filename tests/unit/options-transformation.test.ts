import { convertLegacyOptions } from "../../src/lib/helpers";

describe("Unit Tests - Options Transformation Utilities", () => {
  describe("convertLegacyOptions", () => {
    it("should convert legacy options to new format", () => {
      const testCases = [
        {
          _experimentalCustomFetch: jest.fn(),
        },
        {
          restProxy: { url: "https://proxy.example.com" },
        },
        {
          global: { url: "https://custom-api.deepgram.com" },
        },
        {
          global: { headers: { "Custom-Header": "value" } },
        },
        {
          _experimentalCustomFetch: jest.fn(),
          restProxy: { url: "https://proxy.example.com" },
          global: { url: "https://custom-api.deepgram.com", headers: { Custom: "Header" } },
        },
        {},
      ];

      const results = testCases.map((options) => {
        const converted = convertLegacyOptions(options as any);
        // Replace function references with their type for snapshot testing
        return JSON.parse(
          JSON.stringify(converted, (key, value) => {
            if (typeof value === "function") {
              return "[Function]";
            }
            return value;
          })
        );
      });

      expect(results).toMatchSnapshot();
    });
  });
});
