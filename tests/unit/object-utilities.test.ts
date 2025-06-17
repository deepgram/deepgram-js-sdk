import { applyDefaults, appendSearchParams } from "../../src/lib/helpers";

describe("Unit Tests - Object Manipulation Utilities", () => {
  describe("applyDefaults", () => {
    it("should merge options with defaults correctly", () => {
      const defaults = { punctuate: true, smart_format: false, language: "en-US" };
      const options = { language: "es-ES", model: "nova-2" };

      const result = applyDefaults(options, defaults) as any;

      // Options should override defaults
      expect(result.language).toBe("es-ES");
      expect(result.model).toBe("nova-2");

      // Defaults should be preserved when not overridden
      expect(result.punctuate).toBe(true);
      expect(result.smart_format).toBe(false);
    });

    it("should handle empty options", () => {
      const defaults = { punctuate: true, smart_format: false };
      const result = applyDefaults({}, defaults);

      expect(result).toEqual(defaults);
    });

    it("should handle empty defaults", () => {
      const options = { language: "en-US", model: "nova-2" };
      const result = applyDefaults(options, {});

      expect(result).toEqual(options);
    });

    it("should handle nested objects", () => {
      const defaults = {
        nested: { deep: "default", other: "property" },
        simple: "value",
      };
      const options = {
        nested: { deep: "override" },
        new: "property",
      };

      const result = applyDefaults(options, defaults) as any;

      expect(result.nested.deep).toBe("override");
      expect(result.nested.other).toBe("property");
      expect(result.simple).toBe("value");
      expect(result.new).toBe("property");
    });

    it("should handle undefined inputs", () => {
      const defaults = { punctuate: true };

      const result1 = applyDefaults(undefined, defaults);
      expect(result1).toEqual(defaults);

      const result2 = applyDefaults({ language: "en" }, undefined);
      expect(result2).toEqual({ language: "en" });
    });
  });

  describe("appendSearchParams", () => {
    it("should handle string parameters", () => {
      const searchParams = new URLSearchParams();
      appendSearchParams(searchParams, { language: "en-US", model: "nova-2" });

      expect(searchParams.get("language")).toBe("en-US");
      expect(searchParams.get("model")).toBe("nova-2");
    });

    it("should handle boolean parameters", () => {
      const searchParams = new URLSearchParams();
      appendSearchParams(searchParams, { punctuate: true, smart_format: false });

      expect(searchParams.get("punctuate")).toBe("true");
      expect(searchParams.get("smart_format")).toBe("false");
    });

    it("should handle number parameters", () => {
      const searchParams = new URLSearchParams();
      appendSearchParams(searchParams, { confidence: 0.8, alternatives: 3 });

      expect(searchParams.get("confidence")).toBe("0.8");
      expect(searchParams.get("alternatives")).toBe("3");
    });

    it("should handle array parameters", () => {
      const searchParams = new URLSearchParams();
      appendSearchParams(searchParams, { keywords: ["hello", "world", "test"] });

      const keywords = searchParams.getAll("keywords");
      expect(keywords).toEqual(["hello", "world", "test"]);
    });

    it("should handle mixed parameter types", () => {
      const searchParams = new URLSearchParams();
      const options = {
        keywords: ["hello", "world"],
        language: "en-US",
        punctuate: true,
        confidence: 0.9,
      };

      appendSearchParams(searchParams, options);

      expect(searchParams.getAll("keywords")).toEqual(["hello", "world"]);
      expect(searchParams.get("language")).toBe("en-US");
      expect(searchParams.get("punctuate")).toBe("true");
      expect(searchParams.get("confidence")).toBe("0.9");
    });

    it("should handle empty options", () => {
      const searchParams = new URLSearchParams();
      appendSearchParams(searchParams, {});

      expect(searchParams.toString()).toBe("");
    });
  });
});
