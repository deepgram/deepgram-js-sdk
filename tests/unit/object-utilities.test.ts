import { applyDefaults, appendSearchParams } from "../../src/lib/helpers";

describe("Unit Tests - Object Manipulation Utilities", () => {
  describe("applyDefaults", () => {
    it("should merge options with defaults correctly", () => {
      const testCases = [
        {
          options: { language: "en-US", model: "nova-2" } as any,
          subordinate: { punctuate: true, smart_format: false } as any,
        },
        {
          options: {} as any,
          subordinate: { default: "value" } as any,
        },
        {
          options: { override: "new" } as any,
          subordinate: { default: "value", override: "old" } as any,
        },
        {
          options: { nested: { deep: "value" } } as any,
          subordinate: { nested: { other: "property" } } as any,
        },
      ];

      const results = testCases.map((testCase) => ({
        input: testCase,
        output: applyDefaults(testCase.options, testCase.subordinate),
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("appendSearchParams", () => {
    it("should handle various parameter types", () => {
      const testCases = [
        { language: "en-US", model: "nova-2" },
        { keywords: ["hello", "world", "test"] },
        { punctuate: true, smart_format: false },
        { confidence: 0.8, alternatives: 3 },
        { mixed: ["array", "values"], single: "value", boolean: true, number: 42 },
      ];

      const results = testCases.map((options) => {
        const searchParams = new URLSearchParams();
        appendSearchParams(searchParams, options);
        return {
          input: options,
          output: Object.fromEntries(searchParams.entries()),
          toString: searchParams.toString(),
        };
      });

      expect(results).toMatchSnapshot();
    });
  });
});
