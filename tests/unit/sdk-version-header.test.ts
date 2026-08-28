import { describe, expect, it } from "vitest";
import { normalizeClientOptions } from "../../src/BaseClient";
import { SDK_VERSION } from "../../src/version";

/**
 * Guards the `src/BaseClient.ts` freeze patch.
 *
 * Fern emits BaseClient with the SDK version hardcoded as a string literal in two places
 * (`X-Fern-SDK-Version` and `User-Agent`). We patch it to derive both from
 * `src/version.ts`, which is the single source of truth carrying the release-please
 * marker. That patch had no test, and the failure mode is silent: a regen re-hardcodes
 * the literal, the build still passes, and the User-Agent quietly drifts from the real
 * released version. This has happened before — version.ts sat at 5.2.1 while the release
 * was 5.4.0.
 *
 * These tests fail if either header stops tracking SDK_VERSION.
 */
// mergeHeaders lowercases header names, so the defaults are keyed lowercase.
describe("SDK version headers derive from src/version.ts", () => {
    it("x-fern-sdk-version is exactly SDK_VERSION", () => {
        const { headers } = normalizeClientOptions({});
        expect(headers["x-fern-sdk-version"]).toBe(SDK_VERSION);
    });

    it("user-agent embeds SDK_VERSION", () => {
        const { headers } = normalizeClientOptions({});
        expect(headers["user-agent"]).toBe(`@deepgram/sdk/${SDK_VERSION}`);
    });

    it("neither header is a hardcoded literal that drifted from version.ts", () => {
        // The specific regression: a regen reinstating Fern's literal. Both headers must
        // carry the current SDK_VERSION rather than some other version-shaped string.
        const { headers } = normalizeClientOptions({});
        const version = headers["x-fern-sdk-version"];
        const userAgent = headers["user-agent"];

        expect(version).toMatch(/^\d+\.\d+\.\d+/);
        expect(userAgent).toContain(version as string);
        expect(SDK_VERSION).toMatch(/^\d+\.\d+\.\d+/);
    });

    it("caller-supplied headers still win over the defaults", () => {
        // Confirms the patch did not change merge precedence.
        const { headers } = normalizeClientOptions({ headers: { "User-Agent": "my-app/9.9.9" } });
        expect(headers["user-agent"]).toBe("my-app/9.9.9");
    });
});
