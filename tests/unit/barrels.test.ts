import { describe, expect, it } from "vitest";

/**
 * Smoke test that every generated barrel/subpath entrypoint (`exports.ts` and
 * `index.ts`) can be imported without throwing. These files are pure
 * re-exports that back the package.json "exports" subpath map
 * (e.g. `@deepgram/sdk/listen`, `@deepgram/sdk/agent/v1`). A broken or missing
 * re-export here ships as a runtime "module not found" for consumers, so we
 * exercise all of them at once.
 */
const barrelModules = import.meta.glob(["../../src/**/exports.ts", "../../src/**/index.ts"], {
    eager: true,
});

describe("generated barrel exports", () => {
    it("loads every barrel module", () => {
        const entries = Object.entries(barrelModules);
        // There are dozens of generated barrels; guard against the glob silently
        // matching nothing (which would make this test pass vacuously).
        expect(entries.length).toBeGreaterThan(40);
    });

    it.each(Object.entries(barrelModules))("%s resolves to a module object", (path, mod) => {
        expect(mod, path).toBeTypeOf("object");
        expect(mod, path).not.toBeNull();
    });
});
