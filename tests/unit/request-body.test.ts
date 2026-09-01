import { describe, expect, it } from "vitest";
import { mergeAdditionalBodyParameters } from "../../src/core/requestBody";

/**
 * Coverage for `src/core/requestBody.ts`, added by the 2026-08-19 regen with no tests of
 * its own. It is now wired into the request body of every REST endpoint, so a regression
 * here would corrupt payloads across the whole client — worth pinning even though the file
 * is generator-owned and not frozen.
 *
 * The contract that matters: when no additional parameters are supplied the body must pass
 * through byte-identical, so serialization is unaffected for the overwhelmingly common case.
 */
describe("mergeAdditionalBodyParameters", () => {
    it("returns the body unchanged when there are no additional parameters", () => {
        const body = { text: "hello" };
        expect(mergeAdditionalBodyParameters(body, undefined)).toBe(body);
    });

    it("passes undefined bodies through untouched", () => {
        // The keys.create(projectId) optionality patch relies on this: an omitted request
        // body must stay undefined rather than becoming an empty object.
        expect(mergeAdditionalBodyParameters(undefined, undefined)).toBeUndefined();
    });

    it("spreads additional parameters onto an object body", () => {
        expect(mergeAdditionalBodyParameters({ text: "hello" }, { extra: 1 })).toEqual({
            text: "hello",
            extra: 1,
        });
    });

    it("lets caller-supplied parameters win over the endpoint body", () => {
        expect(mergeAdditionalBodyParameters({ text: "endpoint" }, { text: "caller" })).toEqual({
            text: "caller",
        });
    });

    it("uses the additional parameters as the body when the body is null or undefined", () => {
        expect(mergeAdditionalBodyParameters(undefined, { a: 1 })).toEqual({ a: 1 });
        expect(mergeAdditionalBodyParameters(null, { a: 1 })).toEqual({ a: 1 });
    });

    it("leaves array and primitive bodies alone (object keys cannot spread into them)", () => {
        const arr = [1, 2, 3];
        expect(mergeAdditionalBodyParameters(arr, { a: 1 })).toBe(arr);
        expect(mergeAdditionalBodyParameters("raw-text", { a: 1 })).toBe("raw-text");
        expect(mergeAdditionalBodyParameters(42, { a: 1 })).toBe(42);
    });

    it("does not mutate the original body", () => {
        const body = { text: "hello" };
        mergeAdditionalBodyParameters(body, { extra: 1 });
        expect(body).toEqual({ text: "hello" });
    });
});
