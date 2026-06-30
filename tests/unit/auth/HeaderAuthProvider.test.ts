import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HeaderAuthProvider } from "../../../src/auth/HeaderAuthProvider.js";
import { DeepgramError } from "../../../src/errors/index.js";

describe("HeaderAuthProvider", () => {
    const ENV_KEY = "DEEPGRAM_API_KEY";
    let savedEnv: string | undefined;

    beforeEach(() => {
        savedEnv = process.env[ENV_KEY];
        delete process.env[ENV_KEY];
    });

    afterEach(() => {
        if (savedEnv === undefined) {
            delete process.env[ENV_KEY];
        } else {
            process.env[ENV_KEY] = savedEnv;
        }
    });

    describe("canCreate", () => {
        it("returns true when an apiKey is provided", () => {
            expect(HeaderAuthProvider.canCreate({ apiKey: "secret" })).toBe(true);
        });

        it("returns true when the env var is set", () => {
            process.env[ENV_KEY] = "from-env";
            expect(HeaderAuthProvider.canCreate({})).toBe(true);
        });

        it("returns false when neither is present", () => {
            expect(HeaderAuthProvider.canCreate({})).toBe(false);
        });
    });

    describe("getAuthRequest", () => {
        it("builds the Authorization header from the apiKey option", async () => {
            const provider = new HeaderAuthProvider({ apiKey: "secret" });
            const request = await provider.getAuthRequest();
            expect(request.headers).toEqual({ Authorization: "secret" });
        });

        it("resolves a supplier function for the apiKey", async () => {
            const provider = new HeaderAuthProvider({ apiKey: () => "lazy-secret" });
            const request = await provider.getAuthRequest({});
            expect(request.headers).toEqual({ Authorization: "lazy-secret" });
        });

        it("falls back to the env var", async () => {
            process.env[ENV_KEY] = "env-secret";
            const provider = new HeaderAuthProvider({});
            const request = await provider.getAuthRequest();
            expect(request.headers).toEqual({ Authorization: "env-secret" });
        });

        it("throws a DeepgramError when no key can be resolved", async () => {
            const provider = new HeaderAuthProvider({});
            await expect(provider.getAuthRequest()).rejects.toBeInstanceOf(DeepgramError);
        });
    });

    describe("namespace helpers", () => {
        it("exposes auth scheme and config error message", () => {
            expect(HeaderAuthProvider.AUTH_SCHEME).toBe("ApiKeyAuth");
            expect(HeaderAuthProvider.AUTH_CONFIG_ERROR_MESSAGE).toContain("apiKey");
        });

        it("createInstance returns a working provider", async () => {
            const provider = HeaderAuthProvider.createInstance({ apiKey: "secret" });
            const request = await provider.getAuthRequest();
            expect(request.headers).toEqual({ Authorization: "secret" });
        });
    });
});
