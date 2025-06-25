import { expect } from "chai";
import { fetchWithAuth, resolveResponse } from "../src/lib/fetch";

describe("fetchWithAuth", () => {
  it("should include the Authorization header with the provided API key", async () => {
    const apiKey = "test-api-key";
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const headers = new Headers(init?.headers);
      expect(headers?.get("Authorization")).to.equal(`Token ${apiKey}`);
      return new Response();
    };
    const fetchWithAuthInstance = fetchWithAuth({ apiKey, customFetch });
    await fetchWithAuthInstance("https://example.com");
  });

  it("should include the Authorization header with Bearer for access token", async () => {
    const accessToken = "test-access-token";
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const headers = new Headers(init?.headers);
      expect(headers?.get("Authorization")).to.equal(`Bearer ${accessToken}`);
      return new Response();
    };
    const fetchWithAuthInstance = fetchWithAuth({ accessToken, customFetch });
    await fetchWithAuthInstance("https://example.com");
  });

  it("should prioritize access token over API key when both are provided", async () => {
    const apiKey = "test-api-key";
    const accessToken = "test-access-token";
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const headers = new Headers(init?.headers);
      expect(headers?.get("Authorization")).to.equal(`Bearer ${accessToken}`);
      return new Response();
    };
    const fetchWithAuthInstance = fetchWithAuth({ apiKey, accessToken, customFetch });
    await fetchWithAuthInstance("https://example.com");
  });

  it("should not overwrite existing Authorization header", async () => {
    const apiKey = "test-api-key";
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const headers = new Headers(init?.headers);
      expect(headers?.get("Authorization")).to.equal("existing-token");
      return new Response();
    };
    const fetchWithAuthInstance = fetchWithAuth({ apiKey, customFetch });
    await fetchWithAuthInstance("https://example.com", {
      headers: { Authorization: "existing-token" },
    });
  });
});

describe("resolveResponse", async () => {
  it("should return the global Response object if available", async () => {
    const resolvedResponse = await resolveResponse();
    expect(resolvedResponse).to.equal(Response);
  });

  it("should return the cross-fetch Response object if global Response is not available", async () => {
    const globalResponse = global.Response;
    // @ts-expect-error
    global.Response = undefined;
    const resolvedResponse = await resolveResponse();
    expect(resolvedResponse).to.equal((await import("cross-fetch")).Response);
    global.Response = globalResponse;
  });
});
