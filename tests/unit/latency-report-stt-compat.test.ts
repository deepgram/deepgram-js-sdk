import { describe, it, expect } from "vitest";
import { Deepgram } from "../../src";

// AgentV1LatencyReport is exported under the `Deepgram.agent.*` namespace, not
// the top-level barrel — mirror compat-aliases.test.ts and alias via import-equals.
import AgentV1LatencyReport = Deepgram.agent.AgentV1LatencyReport;

/**
 * Regression test for `AgentV1LatencyReport.stt_latency`.
 *
 * The 2026-07-20 spec removal of `stt_latency` was reverted upstream, so the
 * field is generated natively again. The hand-applied shim and its `.fernignore`
 * freeze were dropped in the 2026-08-11 regen — this file is no longer guarding a
 * manual patch and Fern owns AgentV1LatencyReport again.
 *
 * This test stays as the guard against a future re-removal: if a later spec change
 * drops the field again (or narrows its type), `make typecheck-tests` fails here
 * rather than breaking existing readers silently. TypeScript types are erased at
 * runtime, so the compile-time assertions below are the real guard — this file is
 * compiled against `src` by `make typecheck-tests` (tsconfig.typecheck.json).
 */

// Compile-time identity check: `stt_latency` remains an optional `number` field.
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type SttLatencyType = AgentV1LatencyReport["stt_latency"];
const _sttStillOptionalNumber: Equals<SttLatencyType, number | undefined> = true;

describe("AgentV1LatencyReport.stt_latency native field guard", () => {
    it("compiles: stt_latency is a readable optional number field", () => {
        expect(_sttStillOptionalNumber).toBe(true);
    });

    it("reads as undefined when the server omits it (optional field)", () => {
        const report: AgentV1LatencyReport = { type: "LatencyReport" };
        expect(report.stt_latency).toBeUndefined();
    });

    it("still accepts a value at the type + runtime level", () => {
        const report: AgentV1LatencyReport = { type: "LatencyReport", stt_latency: 0.42 };
        expect(report.stt_latency).toBe(0.42);
    });
});
