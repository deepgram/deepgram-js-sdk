import { buildRequestUrl } from "../../src/core/lib/helpers";

describe("Unit Tests - URL Building Utilities", () => {
  describe("buildRequestUrl", () => {
    it("should build URLs with string base URL", () => {
      const url = buildRequestUrl("v1/listen", "https://api.deepgram.com", {
        language: "en-US",
        model: "nova-2",
      });

      expect(url.href).toBe("https://api.deepgram.com/v1/listen?language=en-US&model=nova-2");
      expect(url.searchParams.get("language")).toBe("en-US");
      expect(url.searchParams.get("model")).toBe("nova-2");
    });

    it("should build URLs with URL object base", () => {
      const baseUrl = new URL("https://api.deepgram.com");
      const url = buildRequestUrl("v1/listen", baseUrl, { punctuate: true, smart_format: false });

      expect(url.href).toBe("https://api.deepgram.com/v1/listen?punctuate=true&smart_format=false");
      expect(url.searchParams.get("punctuate")).toBe("true");
      expect(url.searchParams.get("smart_format")).toBe("false");
    });

    it("should handle array parameters", () => {
      const url = buildRequestUrl("v1/speak", "https://api.deepgram.com", {
        keywords: ["hello", "world"],
      });

      expect(url.searchParams.getAll("keywords")).toEqual(["hello", "world"]);
      expect(url.href).toBe("https://api.deepgram.com/v1/speak?keywords=hello&keywords=world");
    });

    it("should handle empty options", () => {
      const url = buildRequestUrl("v1/listen", "https://api.deepgram.com", {});

      expect(url.href).toBe("https://api.deepgram.com/v1/listen");
      expect(url.search).toBe("");
    });

    it("should handle numeric parameters", () => {
      const url = buildRequestUrl("v1/listen", "https://api.deepgram.com", {
        confidence: 0.8,
        alternatives: 3,
      });

      expect(url.searchParams.get("confidence")).toBe("0.8");
      expect(url.searchParams.get("alternatives")).toBe("3");
    });

    it("should handle boolean parameters", () => {
      const url = buildRequestUrl("v1/listen", "https://api.deepgram.com", {
        interim_results: true,
        endpointing: false,
      });

      expect(url.searchParams.get("interim_results")).toBe("true");
      expect(url.searchParams.get("endpointing")).toBe("false");
    });

    it("should preserve base URL path", () => {
      const url = buildRequestUrl("listen", "https://api.deepgram.com/v1/", { language: "en-US" });

      expect(url.pathname).toBe("/v1/listen");
      expect(url.href).toBe("https://api.deepgram.com/v1/listen?language=en-US");
    });
  });
});
