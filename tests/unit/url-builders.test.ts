import { buildRequestUrl } from "../../src/lib/helpers";

describe("Unit Tests - URL Building Utilities", () => {
  describe("buildRequestUrl", () => {
    it("should build URLs with various options", () => {
      const testCases = [
        {
          endpoint: "v1/listen",
          baseUrl: "https://api.deepgram.com",
          options: { language: "en-US", model: "nova-2" } as any,
        },
        {
          endpoint: "v1/listen",
          baseUrl: new URL("https://api.deepgram.com"),
          options: { punctuate: true, smart_format: false } as any,
        },
        {
          endpoint: "v1/speak",
          baseUrl: "https://api.deepgram.com",
          options: { keywords: ["hello", "world"] } as any,
        },
        {
          endpoint: "v1/listen",
          baseUrl: "https://api.deepgram.com",
          options: {} as any,
        },
      ];

      const results = testCases.map((testCase) => ({
        input: testCase,
        output: {
          href: buildRequestUrl(testCase.endpoint, testCase.baseUrl, testCase.options).href,
          searchParams: buildRequestUrl(
            testCase.endpoint,
            testCase.baseUrl,
            testCase.options
          ).searchParams.toString(),
        },
      }));

      expect(results).toMatchSnapshot();
    });
  });
});
