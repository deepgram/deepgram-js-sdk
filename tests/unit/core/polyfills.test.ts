import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The custom `Headers` polyfill and the non-`Buffer` base64 paths only run in
 * environments that lack the corresponding global (older browsers / runtimes
 * without `Buffer`). Under Node those branches are dead code, so we force them
 * by stubbing the relevant globals and re-importing the module fresh.
 */

afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
});

describe("Headers polyfill (no global Headers)", () => {
    async function loadPolyfill() {
        vi.stubGlobal("Headers", undefined);
        vi.resetModules();
        const mod = await import("../../../src/core/fetcher/Headers.js");
        return mod.Headers as unknown as typeof globalThis.Headers;
    }

    it("constructs empty and supports append/get/has/set/delete", async () => {
        const Headers = await loadPolyfill();
        const h = new Headers();
        expect(h.has("x")).toBe(false);
        expect(h.get("x")).toBeNull();

        h.append("X-Test", "a");
        h.append("x-test", "b");
        expect(h.get("X-TEST")).toBe("a, b");
        expect(h.has("x-test")).toBe(true);

        h.set("X-Test", "only");
        expect(h.get("x-test")).toBe("only");

        h.delete("x-test");
        expect(h.has("x-test")).toBe(false);
    });

    it("initializes from another Headers instance", async () => {
        const Headers = await loadPolyfill();
        const source = new Headers();
        source.append("a", "1");
        const copy = new Headers(source);
        expect(copy.get("a")).toBe("1");
    });

    it("initializes from a tuple array and rejects non-string tuples", async () => {
        const Headers = await loadPolyfill();
        const h = new Headers([
            ["a", "1"],
            ["a", "2"],
        ]);
        expect(h.get("a")).toBe("1, 2");

        expect(() => new Headers([["a", 1 as unknown as string]])).toThrow(TypeError);
    });

    it("initializes from a record and rejects non-string values", async () => {
        const Headers = await loadPolyfill();
        const h = new Headers({ a: "1", b: "2" });
        expect(h.get("a")).toBe("1");
        expect(h.get("b")).toBe("2");

        expect(() => new Headers({ a: 1 as unknown as string })).toThrow(TypeError);
    });

    it("supports iteration, forEach (with thisArg) and getSetCookie", async () => {
        const Headers = await loadPolyfill();
        const h = new Headers();
        h.append("a", "1");
        h.append("set-cookie", "session=1");

        expect(Array.from(h.keys())).toContain("a");
        expect(Array.from(h.values())).toContain("1");
        expect(Array.from(h.entries())).toContainEqual(["a", "1"]);
        expect(Array.from(h)).toContainEqual(["a", "1"]);
        expect(h.getSetCookie()).toEqual(["session=1"]);

        const seen: Record<string, string> = {};
        const ctx = { seen };
        h.forEach(function (this: typeof ctx, value, key) {
            this.seen[key] = value;
        }, ctx);
        expect(seen.a).toBe("1");
    });
});

describe("base64 without Buffer", () => {
    async function loadBase64NoBuffer() {
        vi.stubGlobal("Buffer", undefined);
        vi.resetModules();
        return import("../../../src/core/base64.js");
    }

    it("round-trips encode/decode using TextEncoder/atob/btoa", async () => {
        const { base64Encode, base64Decode } = await loadBase64NoBuffer();
        const original = "hello world ✨";
        const encoded = base64Encode(original);
        expect(encoded).toBe("aGVsbG8gd29ybGQg4pyo");
        expect(base64Decode(encoded)).toBe(original);
    });
});

describe("base64 with Buffer (Node path)", async () => {
    const { base64Encode, base64Decode } = await import("../../../src/core/base64.js");

    it("round-trips using Buffer", () => {
        const original = "deepgram";
        const encoded = base64Encode(original);
        expect(base64Decode(encoded)).toBe(original);
    });
});
