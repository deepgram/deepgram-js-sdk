import { resolveHeadersConstructor } from "../../src/lib/helpers";
import { resolveFetch, fetchWithAuth, resolveResponse } from "../../src/lib/fetch";

describe("Unit Tests - Fetch Utilities", () => {
  describe("resolveHeadersConstructor", () => {
    it("should return a valid Headers constructor", () => {
      const HeadersConstructor = resolveHeadersConstructor();

      expect(typeof HeadersConstructor).toBe("function");

      // Should be able to create a Headers instance
      const headers = new HeadersConstructor();
      expect(headers).toBeDefined();

      // Should be able to set and get headers
      headers.set("Content-Type", "application/json");
      expect(headers.get("Content-Type")).toBe("application/json");
    });
  });

  describe("resolveFetch", () => {
    it("should return the custom fetch when provided", () => {
      const customFetch = jest.fn();
      const resolved = resolveFetch(customFetch);

      expect(typeof resolved).toBe("function");

      // Should use the custom fetch when called
      resolved("test-url", {});
      expect(customFetch).toHaveBeenCalledWith("test-url", {});
    });

    it("should return a working fetch function when no custom fetch provided", () => {
      const resolved = resolveFetch();

      expect(typeof resolved).toBe("function");
      // Function should be callable (we can't easily test actual network calls in unit tests)
    });

    it("should handle fetch arguments correctly", () => {
      const customFetch = jest.fn().mockResolvedValue({ ok: true });
      const resolved = resolveFetch(customFetch);

      const url = "https://api.example.com/test";
      const options = { method: "POST", body: "test data" };

      resolved(url, options);

      expect(customFetch).toHaveBeenCalledWith(url, options);
    });
  });

  describe("fetchWithAuth", () => {
    it("should add Authorization header when not present", async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: true });
      const apiKey = "test-api-key";
      const authenticatedFetch = fetchWithAuth(apiKey, mockFetch);

      await authenticatedFetch("https://api.example.com/test", {});

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );

      const callArgs = mockFetch.mock.calls[0][1];
      const headers = callArgs.headers;
      expect(headers.get("Authorization")).toBe("Token test-api-key");
    });

    it("should not override existing Authorization header", async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: true });
      const apiKey = "test-api-key";
      const authenticatedFetch = fetchWithAuth(apiKey, mockFetch);

      const existingHeaders = new Headers();
      existingHeaders.set("Authorization", "Bearer existing-token");

      await authenticatedFetch("https://api.example.com/test", {
        headers: existingHeaders,
      });

      const callArgs = mockFetch.mock.calls[0][1];
      const headers = callArgs.headers;
      expect(headers.get("Authorization")).toBe("Bearer existing-token");
    });

    it("should preserve other headers", async () => {
      const mockFetch = jest.fn().mockResolvedValue({ ok: true });
      const apiKey = "test-api-key";
      const authenticatedFetch = fetchWithAuth(apiKey, mockFetch);

      const headers = { "Content-Type": "application/json", "X-Custom": "value" };

      await authenticatedFetch("https://api.example.com/test", { headers });

      const callArgs = mockFetch.mock.calls[0][1];
      const resultHeaders = callArgs.headers;
      expect(resultHeaders.get("Content-Type")).toBe("application/json");
      expect(resultHeaders.get("X-Custom")).toBe("value");
      expect(resultHeaders.get("Authorization")).toBe("Token test-api-key");
    });
  });

  describe("resolveResponse", () => {
    it("should return a valid Response constructor", async () => {
      const ResponseConstructor = await resolveResponse();

      expect(typeof ResponseConstructor).toBe("function");
      expect(ResponseConstructor.name).toBe("Response");

      // Should be able to create a Response instance
      const response = new ResponseConstructor("test body", { status: 200 });
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });
  });
});
