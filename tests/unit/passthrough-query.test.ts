import { describe, expect, it, vi } from "vitest";
import { DeepgramClient } from "../../src/index";

// client.fetch() is documented as the passthrough for endpoints not yet in the SDK:
// "Relative paths are resolved against the configured base URL."
describe("client.fetch() relative path with a query string", () => {
    it("keeps the query string as a query string", async () => {
        const mockFetch = vi.fn(async () => new Response("{}", { status: 200 }));
        const client = new DeepgramClient({ apiKey: "test-key", fetch: mockFetch as unknown as typeof fetch });

        await client.fetch("/v1/projects/p1/requests?limit=10&page=2");

        const calledUrl = String((mockFetch.mock.calls[0] as unknown[])[0]);
        expect(calledUrl).toBe("https://api.deepgram.com/v1/projects/p1/requests?limit=10&page=2");
    });

    it("keeps the query string when the base URL has a path prefix", async () => {
        const mockFetch = vi.fn(async () => new Response("{}", { status: 200 }));
        const client = new DeepgramClient({
            apiKey: "test-key",
            baseUrl: "https://proxy.example.com/deepgram",
            fetch: mockFetch as unknown as typeof fetch,
        });

        await client.fetch("v1/models?include_outdated=true");

        const calledUrl = String((mockFetch.mock.calls[0] as unknown[])[0]);
        expect(calledUrl).toBe("https://proxy.example.com/deepgram/v1/models?include_outdated=true");
    });
});
