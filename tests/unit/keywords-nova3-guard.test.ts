import { describe, it, expect } from "vitest";
import { DeepgramClient, DeepgramError } from "../../src/index.js";
import { isUnsupportedNova3Keywords } from "../../src/CustomClient.js";
import { BadRequestError } from "../../src/api/errors/index.js";

/**
 * Regression test for deepgram-js-sdk#474 / #470.
 *
 * Nova-3 models dropped the legacy `keywords` query parameter in favor of `keyterm`. The API
 * rejects the combination with a 400 on both REST and streaming, but the streaming WebSocket path
 * used to swallow the rejected handshake — the socket silently never opened, with no error
 * (`open=false, close=1000, err=none`). The SDK now rejects up front in
 * `WrappedListenV1Client.connect` with the *same* `BadRequestError` the REST path already throws,
 * so a developer gets an actionable error in both Node and the browser.
 */
describe("listen.v1 nova-3 + keywords guard (#474)", () => {
    describe("connect() rejects for nova-3 + keywords", () => {
        for (const model of ["nova-3", "nova-3-general", "nova-3-medical"]) {
            it(`rejects with a 400 BadRequestError for ${model}`, async () => {
                const client = new DeepgramClient({ apiKey: "test-key" });

                await expect(client.listen.v1.connect({ model, keywords: "deepgram" })).rejects.toMatchObject({
                    name: "BadRequestError",
                    statusCode: 400,
                });
            });
        }

        it("createConnection() rejects the same way (it delegates to connect)", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            await expect(
                client.listen.v1.createConnection({ model: "nova-3", keywords: "deepgram" }),
            ).rejects.toBeInstanceOf(BadRequestError);
        });

        it("the rejection mirrors the REST error: DeepgramError, status 400, points at keyterm", async () => {
            const client = new DeepgramClient({ apiKey: "test-key" });

            const err = await client.listen.v1.connect({ model: "nova-3", keywords: "deepgram" }).catch((e) => e);

            expect(err).toBeInstanceOf(BadRequestError);
            expect(err).toBeInstanceOf(DeepgramError);
            expect(err.statusCode).toBe(400);
            expect(err.body).toMatchObject({ err_code: "INVALID_QUERY_PARAMETER" });
            // The body is rendered into the message by DeepgramError, so the fix is discoverable
            // from `error.message` alone.
            expect(String(err.message)).toContain("keyterm");
        });
    });

    describe("isUnsupportedNova3Keywords predicate", () => {
        it("is true for the nova-3 family with non-empty keywords", () => {
            expect(isUnsupportedNova3Keywords("nova-3", "deepgram")).toBe(true);
            expect(isUnsupportedNova3Keywords("nova-3-general", ["alpha", "beta"])).toBe(true);
            expect(isUnsupportedNova3Keywords("nova-3-medical", "term")).toBe(true);
        });

        it("is false when keywords is absent or empty (nothing to reject)", () => {
            expect(isUnsupportedNova3Keywords("nova-3", undefined)).toBe(false);
            expect(isUnsupportedNova3Keywords("nova-3", null)).toBe(false);
            expect(isUnsupportedNova3Keywords("nova-3", "")).toBe(false);
            expect(isUnsupportedNova3Keywords("nova-3", [])).toBe(false);
        });

        it("is false for non-nova-3 models — keywords is valid there", () => {
            expect(isUnsupportedNova3Keywords("nova-2", "deepgram")).toBe(false);
            expect(isUnsupportedNova3Keywords("nova", "deepgram")).toBe(false);
            expect(isUnsupportedNova3Keywords("enhanced", "deepgram")).toBe(false);
        });

        it("is false when model is missing or not a string", () => {
            expect(isUnsupportedNova3Keywords(undefined, "deepgram")).toBe(false);
            expect(isUnsupportedNova3Keywords(123, "deepgram")).toBe(false);
        });
    });
});
