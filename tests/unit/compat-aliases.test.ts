import { describe, it, expect } from "vitest";
import type { CreateKeyV1Request, CreateKeyV1RequestOne } from "../../src";
import { Deepgram } from "../../src";

/**
 * Regression test for backward-compatibility aliases preserved across SDK
 * regenerations.
 *
 * Each `as` cast in this file is a structural type-equality assertion: if the
 * legacy alias ever drifts from its canonical type, the file will fail to
 * compile and the test run will fail before any test body executes.
 *
 * Because TypeScript types are erased at runtime, the runtime assertions only
 * confirm that the *imports* resolve. Type identity is enforced by the
 * compile-time casts.
 */

// Compile-time identity check for `Equals<X, Y>`. This pattern returns `true`
// only when X and Y are the exact same type, including variance.
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe("Backwards-compatibility aliases", () => {
    describe("CreateKeyV1RequestOne (renamed to CreateKeyV1Request)", () => {
        it("flat re-export is identical to CreateKeyV1Request", () => {
            const _equality: Equals<CreateKeyV1RequestOne, CreateKeyV1Request> = true;
            expect(_equality).toBe(true);
        });

        it("is bidirectionally assignable with CreateKeyV1Request", () => {
            const fromCanonical: CreateKeyV1RequestOne = {} as CreateKeyV1Request;
            const fromLegacy: CreateKeyV1Request = {} as CreateKeyV1RequestOne;
            expect(fromCanonical).toBeDefined();
            expect(fromLegacy).toBeDefined();
        });

        it("Deepgram namespace re-export is identical to Deepgram.CreateKeyV1Request", () => {
            const _equality: Equals<Deepgram.CreateKeyV1RequestOne, Deepgram.CreateKeyV1Request> = true;
            expect(_equality).toBe(true);
        });

        it("accepts a request body shape suitable for keys.create", () => {
            const request: CreateKeyV1RequestOne = {
                comment: "back-compat alias check",
                scopes: ["usage:read"],
            };
            expect(request).toEqual({
                comment: "back-compat alias check",
                scopes: ["usage:read"],
            });
        });
    });
});
