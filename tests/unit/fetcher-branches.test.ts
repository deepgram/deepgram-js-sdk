import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getErrorResponseBody } from "../../src/core/fetcher/getErrorResponseBody.js";
import { requestWithRetries } from "../../src/core/fetcher/requestWithRetries.js";

describe("requestWithRetries", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    async function run(responses: Array<() => Response>, maxRetries: number) {
        let i = 0;
        const fn = async () => responses[Math.min(i++, responses.length - 1)]!();
        const promise = requestWithRetries(fn, maxRetries);
        await vi.advanceTimersByTimeAsync(70_000);
        const res = await promise;
        return { res, calls: i };
    }

    it("returns immediately on a non-retryable status", async () => {
        const { res, calls } = await run([() => new Response("{}", { status: 200 })], 2);
        expect(res.status).toBe(200);
        expect(calls).toBe(1);
    });

    it("retries a 500 using exponential backoff, then succeeds", async () => {
        const { res, calls } = await run(
            [() => new Response("", { status: 500 }), () => new Response("{}", { status: 200 })],
            2,
        );
        expect(res.status).toBe(200);
        expect(calls).toBe(2);
    });

    it("honors a numeric Retry-After header", async () => {
        const { calls } = await run(
            [
                () => new Response("", { status: 429, headers: { "Retry-After": "1" } }),
                () => new Response("{}", { status: 200 }),
            ],
            2,
        );
        expect(calls).toBe(2);
    });

    it("honors an HTTP-date Retry-After header", async () => {
        const future = new Date(Date.now() + 2000).toUTCString();
        const { calls } = await run(
            [
                () => new Response("", { status: 503, headers: { "Retry-After": future } }),
                () => new Response("{}", { status: 200 }),
            ],
            2,
        );
        expect(calls).toBe(2);
    });

    it("honors an X-RateLimit-Reset header", async () => {
        const reset = Math.floor(Date.now() / 1000) + 2;
        const { calls } = await run(
            [
                () => new Response("", { status: 429, headers: { "X-RateLimit-Reset": String(reset) } }),
                () => new Response("{}", { status: 200 }),
            ],
            2,
        );
        expect(calls).toBe(2);
    });

    it("stops retrying once the attempt budget is exhausted", async () => {
        const { res, calls } = await run([() => new Response("", { status: 500 })], 2);
        expect(res.status).toBe(500);
        expect(calls).toBe(3); // initial + 2 retries
    });
});

describe("getErrorResponseBody additional content types", () => {
    it("parses application/hal+json", async () => {
        const res = new Response(JSON.stringify({ hal: 1 }), { headers: { "content-type": "application/hal+json" } });
        expect(await getErrorResponseBody(res)).toEqual({ hal: 1 });
    });

    it("treats an empty content-type as no content-type", async () => {
        const res = new Response("body", { headers: { "content-type": "" } });
        expect(await getErrorResponseBody(res)).toBeDefined();
    });

    it("falls back to text for a vendor type that is not +json", async () => {
        const res = new Response("raw", { headers: { "content-type": "application/vnd.custom+xml" } });
        expect(await getErrorResponseBody(res)).toBe("raw");
    });
});
