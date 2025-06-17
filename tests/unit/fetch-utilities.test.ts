import { resolveHeadersConstructor } from "../../src/lib/helpers";
import { resolveFetch, fetchWithAuth, resolveResponse } from "../../src/lib/fetch";

describe("Unit Tests - Fetch Utilities", () => {
  describe("resolveHeadersConstructor", () => {
    it("should return appropriate Headers constructor", () => {
      const HeadersConstructor = resolveHeadersConstructor();
      const result = {
        isFunction: typeof HeadersConstructor === "function",
        name: HeadersConstructor.name,
        canInstantiate: (() => {
          try {
            new HeadersConstructor();
            return true;
          } catch {
            return false;
          }
        })(),
      };

      expect(result).toMatchSnapshot();
    });
  });

  describe("resolveFetch", () => {
    it("should resolve fetch function correctly", () => {
      const customFetch = jest.fn();

      const testCases = [{ customFetch: undefined }, { customFetch }];

      const results = testCases.map((testCase) => {
        const resolved = resolveFetch(testCase.customFetch as any);
        return {
          input: testCase.customFetch ? "[CustomFunction]" : undefined,
          output: {
            isFunction: typeof resolved === "function",
            name: resolved.name || "[Anonymous]",
          },
        };
      });

      expect(results).toMatchSnapshot();
    });
  });

  describe("fetchWithAuth", () => {
    it("should create authenticated fetch function", () => {
      const apiKey = "test-api-key";
      const customFetch = jest.fn().mockResolvedValue({ ok: true });

      const testCases = [
        { apiKey, customFetch: undefined },
        { apiKey, customFetch },
      ];

      const results = testCases.map((testCase) => ({
        input: {
          apiKey: testCase.apiKey,
          customFetch: testCase.customFetch ? "[CustomFunction]" : undefined,
        },
        output: {
          isFunction:
            typeof fetchWithAuth(testCase.apiKey, testCase.customFetch as any) === "function",
        },
      }));

      expect(results).toMatchSnapshot();
    });
  });

  describe("resolveResponse", () => {
    it("should resolve Response constructor", async () => {
      const ResponseConstructor = await resolveResponse();
      const result = {
        isFunction: typeof ResponseConstructor === "function",
        name: ResponseConstructor.name,
        canInstantiate: (() => {
          try {
            new ResponseConstructor();
            return true;
          } catch {
            return false;
          }
        })(),
      };

      expect(result).toMatchSnapshot();
    });
  });
});
