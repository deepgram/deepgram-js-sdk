import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `evaluateRuntime()` runs once at module load, so each environment branch is
 * exercised by stubbing the relevant globals and re-importing the module. Under
 * a plain Node test run only the "node" branch is hit, leaving every other
 * branch uncovered.
 */

async function detectWith(stubs: Record<string, unknown>) {
    vi.resetModules();
    for (const [key, value] of Object.entries(stubs)) {
        vi.stubGlobal(key, value);
    }
    const { RUNTIME } = await import("../../../src/core/runtime/runtime.js");
    return RUNTIME;
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
});

describe("runtime detection", () => {
    it("detects node in the default test environment", async () => {
        const runtime = await detectWith({});
        expect(runtime.type).toBe("node");
        expect(typeof runtime.parsedVersion).toBe("number");
    });

    it("detects a browser", async () => {
        const runtime = await detectWith({
            window: { document: {}, navigator: { userAgent: "Mozilla/5.0" } },
        });
        expect(runtime.type).toBe("browser");
        expect(runtime.version).toBe("Mozilla/5.0");
    });

    it("detects Cloudflare Workers", async () => {
        const runtime = await detectWith({
            navigator: { userAgent: "Cloudflare-Workers" },
        });
        expect(runtime.type).toBe("workerd");
    });

    it("detects the Edge runtime", async () => {
        const runtime = await detectWith({ EdgeRuntime: "edge-runtime" });
        expect(runtime.type).toBe("edge-runtime");
    });

    it("detects a web worker", async () => {
        class DedicatedWorkerGlobalScope {
            importScripts() {}
        }
        const runtime = await detectWith({ self: new DedicatedWorkerGlobalScope() });
        expect(runtime.type).toBe("web-worker");
    });

    it("detects service and shared worker global scopes", async () => {
        class ServiceWorkerGlobalScope {
            importScripts() {}
        }
        expect((await detectWith({ self: new ServiceWorkerGlobalScope() })).type).toBe("web-worker");

        class SharedWorkerGlobalScope {
            importScripts() {}
        }
        expect((await detectWith({ self: new SharedWorkerGlobalScope() })).type).toBe("web-worker");
    });

    it("detects Deno", async () => {
        const runtime = await detectWith({ Deno: { version: { deno: "1.40.0" } } });
        expect(runtime.type).toBe("deno");
        expect(runtime.version).toBe("1.40.0");
    });

    it("detects Bun", async () => {
        const runtime = await detectWith({ Bun: { version: "1.1.0" } });
        expect(runtime.type).toBe("bun");
        expect(runtime.version).toBe("1.1.0");
    });

    it("detects React Native", async () => {
        const runtime = await detectWith({ navigator: { product: "ReactNative" } });
        expect(runtime.type).toBe("react-native");
    });
});
