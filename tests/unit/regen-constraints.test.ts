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

        it('Type namespace exposes ONLY "CloseStream" (the only valid v2 value)', () => {
            expect(Deepgram.listen.v2.ListenV2CloseStream.Type.CloseStream).toBe("CloseStream");

            // Finalize/KeepAlive are v1 control messages and were never valid on v2. An
            // earlier shim wrongly copied them from v1; they must NOT be present here.
            expect(Object.keys(Deepgram.listen.v2.ListenV2CloseStream.Type)).toEqual(["CloseStream"]);
            expect((Deepgram.listen.v2.ListenV2CloseStream.Type as Record<string, string>).Finalize).toBeUndefined();
            expect((Deepgram.listen.v2.ListenV2CloseStream.Type as Record<string, string>).KeepAlive).toBeUndefined();
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

/**
 * Coverage for the surface added by the 2026-07-09 regeneration:
 *   - Flux end-of-turn tuning fields on `DeepgramListenProviderV2`
 *     (`eot_threshold`, `eager_eot_threshold`, `eot_timeout_ms`)
 *   - the agent `UpdateListen` / `ListenUpdated` message types
 *   - the new Speak v2 (Flux streaming TTS) message + option types
 *
 * As above, the typed literals double as compile-time assertions under
 * `make typecheck-tests`.
 */
describe("2026-07-09 regen constraints", () => {
    describe("DeepgramListenProviderV2 end-of-turn fields", () => {
        it("accepts eot_threshold / eager_eot_threshold / eot_timeout_ms and round-trips", () => {
            const provider: DeepgramListenProviderV2 = {
                type: "deepgram",
                version: "v2",
                model: "flux-general-en",
                eot_threshold: 0.8,
                eager_eot_threshold: 0.5,
                eot_timeout_ms: 4000,
            };
            const roundTripped = JSON.parse(JSON.stringify(provider)) as DeepgramListenProviderV2;
            expect(roundTripped.eot_threshold).toBe(0.8);
            expect(roundTripped.eager_eot_threshold).toBe(0.5);
            expect(roundTripped.eot_timeout_ms).toBe(4000);
        });
    });

    describe("Agent UpdateListen / ListenUpdated", () => {
        it("UpdateListen carries a v2 listen provider and serializes", () => {
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: {
                    provider: {
                        type: "deepgram",
                        version: "v2",
                        model: "flux-general-en",
                        eot_threshold: 0.7,
                    },
                },
            };
            const parsed = JSON.parse(JSON.stringify(msg)) as Deepgram.agent.AgentV1UpdateListen;
            expect(parsed.type).toBe("UpdateListen");
            expect(parsed.listen.provider.model).toBe("flux-general-en");
        });

        it("ListenUpdated is a plain confirmation message", () => {
            const msg: Deepgram.agent.AgentV1ListenUpdated = { type: "ListenUpdated" };
            expect(msg.type).toBe("ListenUpdated");
        });
    });

    describe("Speak v2 (Flux streaming TTS) types", () => {
        it("client messages have the expected literal `type` fields", () => {
            const speak: Deepgram.speak.SpeakV2Speak = { type: "Speak", text: "hi" };
            const flush: Deepgram.speak.SpeakV2Flush = { type: "Flush" };
            const close: Deepgram.speak.SpeakV2Close = { type: "Close" };
            expect([speak.type, flush.type, close.type]).toEqual(["Speak", "Flush", "Close"]);
        });

        it("option enums expose members and stay open to arbitrary strings", () => {
            const encoding: Deepgram.SpeakV2Encoding = Deepgram.SpeakV2Encoding.Linear16;
            const sampleRate: Deepgram.SpeakV2SampleRate = Deepgram.SpeakV2SampleRate.TwentyFourThousand;
            // SpeakV2Model is an open string type
            const model: Deepgram.SpeakV2Model = "flux-alexis-en";
            expect(encoding).toBe("linear16");
            expect(sampleRate).toBe("24000");
            expect(model).toBe("flux-alexis-en");
        });

        it("pins the complete SpeakV2Encoding member set (guards a regen dropping a value)", () => {
            // linear16 is the only streaming-compatible member exposed as an enum;
            // mulaw/alaw round out the raw-audio set. Compressed encodings (mp3, etc.)
            // are batch-only and intentionally NOT in this enum.
            expect(Deepgram.SpeakV2Encoding).toEqual({
                Linear16: "linear16",
                Mulaw: "mulaw",
                Alaw: "alaw",
            });
            // Open union: an unknown string is still assignable.
            const custom: Deepgram.SpeakV2Encoding = "future-codec";
            expect(custom).toBe("future-codec");
        });

        it("pins the complete SpeakV2SampleRate member set (guards a regen dropping a value)", () => {
            expect(Deepgram.SpeakV2SampleRate).toEqual({
                EightThousand: "8000",
                SixteenThousand: "16000",
                TwentyFourThousand: "24000",
                ThirtyTwoThousand: "32000",
                FortyFourThousandOneHundred: "44100",
                FortyEightThousand: "48000",
            });
            // Open union: an arbitrary rate string is still assignable at the type level.
            const custom: Deepgram.SpeakV2SampleRate = "96000";
            expect(custom).toBe("96000");
        });

        it("SpeakV2Error.Code enum is open-ended", () => {
            const known: Deepgram.speak.SpeakV2Error.Code = Deepgram.speak.SpeakV2Error.Code.Net0000;
            const open: Deepgram.speak.SpeakV2Error.Code = "SOME-CUSTOM-CODE";
            expect(known).toBe("NET-0000");
            expect(open).toBe("SOME-CUSTOM-CODE");
        });
    });
    describe("2026-08-11 regen: Speak v2 barge-in + reconfigure", () => {
        it("Interrupt is a bare control message, optionally carrying a playback offset", () => {
            const bare: Deepgram.speak.SpeakV2Interrupt = { type: "Interrupt" };
            const withOffset: Deepgram.speak.SpeakV2Interrupt = {
                type: "Interrupt",
                playback_offset: { type: "time_ms", value: 1500 },
            };
            expect(bare.type).toBe("Interrupt");
            expect(withOffset.playback_offset).toEqual({ type: "time_ms", value: 1500 });
        });

        it("Configure carries the mid-stream speed change", () => {
            const configure: Deepgram.speak.SpeakV2Configure = { type: "Configure", speed: 1.1 };
            expect(JSON.parse(JSON.stringify(configure))).toEqual({ type: "Configure", speed: 1.1 });
        });

        it("ConfigureSuccess echoes what the server applied", () => {
            const ok: Deepgram.speak.SpeakV2ConfigureSuccess = {
                type: "ConfigureSuccess",
                applied: { speed: 1.1 },
            };
            expect(ok.applied.speed).toBe(1.1);
        });

        it("ConfigureFailure reports the rejected field, and its Code enum stays open", () => {
            const known: Deepgram.speak.SpeakV2ConfigureFailure.Code =
                Deepgram.speak.SpeakV2ConfigureFailure.Code.SpeedOutOfRange;
            const open: Deepgram.speak.SpeakV2ConfigureFailure.Code = "SOME-FUTURE-CODE";
            const fail: Deepgram.speak.SpeakV2ConfigureFailure = {
                type: "ConfigureFailure",
                code: known,
                field: "speed",
                value: 9,
                description: "speed must be between 0.85 and 1.15",
            };
            expect(known).toBe("SPEED_OUT_OF_RANGE");
            expect(open).toBe("SOME-FUTURE-CODE");
            expect(fail.field).toBe("speed");
        });

        it("SpeechInterrupted reports what was played, including the breaks_applied counter", () => {
            const interrupted: Deepgram.speak.SpeakV2SpeechInterrupted = {
                type: "SpeechInterrupted",
                audio_played_ms: 1200,
                text_spoken: "Hello there",
                text_remaining: "how are you?",
                metadata: {
                    speech_id: "dg_sp_abc",
                    audio_duration_ms: 4000,
                    input_character_count: 24,
                    billable_character_count: 24,
                    // breaks_applied is new in this regen and REQUIRED -- omitting it
                    // must fail typecheck (this literal is gated by tsconfig.typecheck.json).
                    controls_applied: {
                        pronunciations_applied: 2,
                        breaks_applied: 1,
                        pronunciation_warnings: 0,
                    },
                },
            };
            expect(interrupted.audio_played_ms).toBe(1200);
            expect(interrupted.metadata.controls_applied.breaks_applied).toBe(1);
        });

        it("SpeechMetadata carries the same required breaks_applied counter", () => {
            // Twin of SpeechInterrupted.metadata. This counter is referenced only from
            // tests/wire (which the typecheck gate does not compile), so pin it here too
            // -- otherwise dropping breaks_applied from this twin passes make typecheck-tests.
            const meta: Deepgram.speak.SpeakV2SpeechMetadata = {
                type: "SpeechMetadata",
                speech_id: "dg_sp_abc",
                audio_duration_ms: 4000,
                input_character_count: 24,
                billable_character_count: 24,
                controls_applied: {
                    pronunciations_applied: 0,
                    breaks_applied: 0,
                    pronunciation_warnings: 0,
                },
            };
            expect(meta.controls_applied.breaks_applied).toBe(0);
        });

        it("speed/expressivity are numeric (spec enums are NOT enforced in codegen)", () => {
            // The spec constrains speed to 0.85..1.15 (0.05 steps) and expressivity to
            // -2..2, but numeric enums generate as bare number, so out-of-range values
            // type-check and are only rejected server-side. Pinned so a future generator
            // that DOES narrow these is noticed here.
            const speed: Deepgram.SpeakV2Speed = 3.7;
            const expressivity: Deepgram.SpeakV2Expressivity = 99;
            expect([speed, expressivity]).toEqual([3.7, 99]);
        });

        it("ListenV2Redact accepts the documented values and stays open", () => {
            const numbers: Deepgram.ListenV2Redact = "numbers";
            const aggressive: Deepgram.ListenV2Redact = "aggressive_numbers";
            expect([numbers, aggressive]).toEqual(["numbers", "aggressive_numbers"]);
        });
    });

    describe("2026-08-11 regen: AgentV1UpdateListen provider back-compat", () => {
        // This shim was silently lost once (the file was missing from .fernignore, so a
        // regen overwrote it). These are the three ways the raw generated union broke
        // existing callers -- pinned so it cannot regress unnoticed.
        it("accepts the legacy provider shape with no version discriminant", () => {
            const legacy: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", model: "flux-general-en" } },
            };
            expect(legacy.listen.provider.model).toBe("flux-general-en");
        });

        it("keeps provider.model as string (not string | undefined)", () => {
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: { provider: { type: "deepgram", model: "flux-general-en" } },
            };
            const model: string = msg.listen.provider.model;
            expect(model).toBe("flux-general-en");
        });

        it("keeps the V2-only fields readable", () => {
            const msg: Deepgram.agent.AgentV1UpdateListen = {
                type: "UpdateListen",
                listen: {
                    provider: {
                        type: "deepgram",
                        version: "v2",
                        model: "flux-general-en",
                        eot_threshold: 0.7,
                        eot_timeout_ms: 4000,
                        language_hints: ["en"],
                    },
                },
            };
            const eot: number | undefined = msg.listen.provider.eot_threshold;
            const hints = msg.listen.provider.language_hints;
            expect(eot).toBe(0.7);
            expect(hints).toEqual(["en"]);
        });
    });
});
