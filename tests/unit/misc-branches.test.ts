import { describe, expect, it } from "vitest";
import { DeepgramTimeoutError } from "../../src";
import * as core from "../../src/core/index.js";
import { join } from "../../src/core/url/join.js";

describe("DeepgramTimeoutError", () => {
    it("captures an optional cause", () => {
        const cause = new Error("root");
        const withCause = new DeepgramTimeoutError("timed out", { cause });
        expect(withCause.cause).toBe(cause);
        expect(withCause.name).toBe("DeepgramTimeoutError");

        const withoutCause = new DeepgramTimeoutError("timed out");
        expect(withoutCause.cause).toBeUndefined();
    });
});

describe("url join", () => {
    it("returns empty string for a falsy base", () => {
        expect(join("")).toBe("");
    });

    it("returns the base unchanged when there are no segments", () => {
        expect(join("https://api.deepgram.com")).toBe("https://api.deepgram.com");
    });

    it("joins segments onto a relative (non-URL) base", () => {
        expect(join("v1", "listen")).toBe("v1/listen");
    });

    it("skips empty segments and preserves a trailing slash", () => {
        expect(join("https://api.deepgram.com/", "", "v1/")).toBe("https://api.deepgram.com/v1/");
    });

    it("preserves a trailing slash on a relative base", () => {
        expect(join("v1", "listen/")).toBe("v1/listen/");
    });
});

describe("QueryStringBuilder", () => {
    it("supports comma array style and skips null/undefined values", () => {
        const qs = core.url
            .queryBuilder()
            .add("tags", ["a", "b"], { style: "comma" })
            .add("skip", null)
            .add("skip2", undefined)
            .build();
        expect(qs).toContain("tags=");
        expect(qs).not.toContain("skip");
    });

    it("mergeAdditional overrides keys and ignores null/undefined", () => {
        const qs = core.url
            .queryBuilder()
            .addMany({ model: "nova-3", empty: null })
            .mergeAdditional({ model: "nova-2", dropped: undefined, alsoDropped: null })
            .build();
        expect(qs).toContain("model=nova-2");
        expect(qs).not.toContain("dropped");
    });

    it("addMany tolerates a nullish record and build returns empty", () => {
        expect(
            core.url
                .queryBuilder()
                .addMany(undefined as never)
                .mergeAdditional(undefined)
                .build(),
        ).toBe("");
    });

    it("skips params and merged values that serialize to nothing", () => {
        const qs = core.url.queryBuilder().add("emptyArr", []).mergeAdditional({ alsoEmpty: [] }).build();
        expect(qs).toBe("");
    });
});
