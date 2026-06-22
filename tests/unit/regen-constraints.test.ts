import { describe, it, expect } from "vitest";
import type { DeepgramListenProviderV2, ListenV2ProfanityFilter } from "../../src";
import { Deepgram } from "../../src";

/**
 * Regression coverage for the constraints and compat shims introduced by the
 * 2026-06-16 regeneration:
 *   - `ListenV2CloseStream.type` literal + the trimmed `Type` shim
 *   - `DeepgramListenProviderV2.language_hints` (with the deprecated
 *     `language_hint` field kept for back-compat)
 *   - the new `ListenV2ProfanityFilter` listen-v2 enum
 *   - `ListenV2TurnInfo` word `start`/`end` being OPTIONAL
 *
 * The `@ts-expect-error` lines and typed object literals here are compile-time
 * assertions; they are gated by `make typecheck-tests` (tsconfig.typecheck.json),
 * not by vitest (which strips types at runtime).
 */
describe("2026-06-16 regen constraints & compat shims", () => {
    describe("ListenV2CloseStream", () => {
        it('serializes `type` to the literal "CloseStream"', () => {
            const msg: Deepgram.listen.v2.ListenV2CloseStream = { type: "CloseStream" };
            expect(JSON.parse(JSON.stringify(msg))).toEqual({ type: "CloseStream" });
        });

        it("Type shim exposes only CloseStream (Finalize/KeepAlive were dropped)", () => {
            expect(Deepgram.listen.v2.ListenV2CloseStream.Type.CloseStream).toBe("CloseStream");
            expect(Object.keys(Deepgram.listen.v2.ListenV2CloseStream.Type)).toEqual(["CloseStream"]);

            // @ts-expect-error `Finalize` was a bogus v1-copied member, removed from the v2 Type shim.
            const _noFinalize = Deepgram.listen.v2.ListenV2CloseStream.Type.Finalize;
            // @ts-expect-error `KeepAlive` was a bogus v1-copied member, removed from the v2 Type shim.
            const _noKeepAlive = Deepgram.listen.v2.ListenV2CloseStream.Type.KeepAlive;
            expect(_noFinalize).toBeUndefined();
            expect(_noKeepAlive).toBeUndefined();
        });
    });

    describe("DeepgramListenProviderV2 language_hints", () => {
        it("language_hints (string[]) round-trips through JSON", () => {
            const provider: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hints: ["en", "es"],
            };
            const roundTripped = JSON.parse(JSON.stringify(provider)) as DeepgramListenProviderV2;
            expect(roundTripped.language_hints).toEqual(["en", "es"]);
        });

        it("deprecated `language_hint` field still compiles for both string and string[]", () => {
            // The singular field was never honored by the API; it is retained only
            // so pre-rename call sites keep compiling. Prefer `language_hints`.
            const single: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hint: "en",
            };
            const multi: DeepgramListenProviderV2 = {
                type: "deepgram",
                model: "flux-general-multi",
                language_hint: ["en", "es"],
            };
            expect(single.language_hint).toBe("en");
            expect(multi.language_hint).toEqual(["en", "es"]);
        });
    });

    describe("ListenV2ProfanityFilter (new listen v2 enum)", () => {
        it("exposes True/False members and stays open to arbitrary strings", () => {
            const on: ListenV2ProfanityFilter = Deepgram.ListenV2ProfanityFilter.True;
            const off: ListenV2ProfanityFilter = Deepgram.ListenV2ProfanityFilter.False;
            const open: ListenV2ProfanityFilter = "custom";
            expect(on).toBe("true");
            expect(off).toBe("false");
            expect(open).toBe("custom");
        });
    });

    describe("ListenV2TurnInfo word timings are OPTIONAL", () => {
        it("a word item is valid WITH start/end", () => {
            const item: Deepgram.listen.v2.ListenV2TurnInfo.Words.Item = {
                word: "hello",
                confidence: 0.99,
                start: 0.1,
                end: 0.5,
            };
            expect(item.start).toBe(0.1);
            expect(item.end).toBe(0.5);
        });

        it("a word item is valid WITHOUT start/end (both optional)", () => {
            const item: Deepgram.listen.v2.ListenV2TurnInfo.Words.Item = {
                word: "hello",
                confidence: 0.99,
            };
            expect(item.start).toBeUndefined();
            expect(item.end).toBeUndefined();

            // A server payload that omits the timings entirely must still parse.
            const parsed = JSON.parse(
                JSON.stringify({ word: "hi", confidence: 1 }),
            ) as Deepgram.listen.v2.ListenV2TurnInfo.Words.Item;
            expect(parsed.word).toBe("hi");
            expect(parsed.start).toBeUndefined();
        });
    });
});
