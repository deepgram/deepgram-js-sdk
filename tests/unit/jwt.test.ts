/* eslint-disable vitest/valid-expect -- Tests don't require assertion messages */
/* eslint-disable max-lines-per-function -- Test suites naturally have many cases */
/* eslint-disable max-nested-callbacks -- Vitest structure requires nesting */

import { describe, it, expect } from "vitest";
import * as jose from "jose";
import {
  createProxyToken,
  verifyProxyToken,
} from "../../src/middleware/core/jwt.js";

const MOCK_API_KEY = "test-project-id:test-secret-key";
const MOCK_PROJECT_ID = "test-project-id";

describe("JWT Token Management", () => {
  describe("createProxyToken", () => {
    it("should create a valid JWT token with default options", async () => {
      const token = await createProxyToken(MOCK_API_KEY);

      expect(token).toBeTypeOf("string");
      expect(token.split(".").length).toBe(3);
    });

    it("should include project ID as issuer", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.iss).toBe(MOCK_PROJECT_ID);
    });

    it("should include identity as subject when provided", async () => {
      const token = await createProxyToken(MOCK_API_KEY, {
        identity: "user-123",
      });
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.sub).toBe("user-123");
    });

    it("should not include subject when identity is not provided", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.sub).toBeUndefined();
    });

    it("should include scopes when provided", async () => {
      const token = await createProxyToken(MOCK_API_KEY, {
        scopes: ["listen", "speak"],
      });
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.scopes).toEqual(["listen", "speak"]);
    });

    it("should include custom metadata when provided", async () => {
      const metadata = { userId: "123", role: "admin" };
      const token = await createProxyToken(MOCK_API_KEY, { metadata });
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.metadata).toEqual(metadata);
    });

    it("should use default TTL of 1 hour", async () => {
      const beforeCreation = Math.floor(Date.now() / 1000);
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      const expectedExpiry = beforeCreation + 3600;
      expect(payload.exp).toBeGreaterThanOrEqual(expectedExpiry);
      expect(payload.exp).toBeLessThanOrEqual(expectedExpiry + 2);
    });

    it("should accept TTL as string", async () => {
      const token = await createProxyToken(MOCK_API_KEY, { ttl: "30m" });
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      const now = Math.floor(Date.now() / 1000);
      const expectedExpiry = now + 30 * 60;
      expect(payload.exp).toBeGreaterThanOrEqual(expectedExpiry - 2);
      expect(payload.exp).toBeLessThanOrEqual(expectedExpiry + 2);
    });

    it("should accept TTL as number in seconds", async () => {
      const beforeCreation = Math.floor(Date.now() / 1000);
      const token = await createProxyToken(MOCK_API_KEY, { ttl: 7200 });
      const payload = await verifyProxyToken(token, MOCK_API_KEY);

      const expectedExpiry = beforeCreation + 7200;
      expect(payload.exp).toBeGreaterThanOrEqual(expectedExpiry);
      expect(payload.exp).toBeLessThanOrEqual(expectedExpiry + 2);
    });

    it("should include issued at timestamp", async () => {
      const beforeCreation = Math.floor(Date.now() / 1000);
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.iat).toBeGreaterThanOrEqual(beforeCreation);
      expect(payload.iat).toBeLessThanOrEqual(beforeCreation + 2);
    });

    it("should include not before timestamp", async () => {
      const beforeCreation = Math.floor(Date.now() / 1000);
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { payload } = await jose.jwtVerify(token, secret);

      expect(payload.nbf).toBeGreaterThanOrEqual(beforeCreation);
      expect(payload.nbf).toBeLessThanOrEqual(beforeCreation + 2);
    });

    it("should use HS256 algorithm", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const secret = new TextEncoder().encode(MOCK_API_KEY);
      const { protectedHeader } = await jose.jwtVerify(token, secret);

      expect(protectedHeader.alg).toBe("HS256");
    });

    it("should throw error for invalid API key format", async () => {
      await expect(createProxyToken("invalid-key")).rejects.toThrow(
        "Invalid API key format"
      );
    });
  });

  describe("verifyProxyToken", () => {
    it("should verify a valid token", async () => {
      const token = await createProxyToken(MOCK_API_KEY, {
        identity: "user-456",
        scopes: ["listen"],
      });

      const payload = await verifyProxyToken(token, MOCK_API_KEY);

      expect(payload.iss).toBe(MOCK_PROJECT_ID);
      expect(payload.sub).toBe("user-456");
      expect(payload.scopes).toEqual(["listen"]);
    });

    it("should return payload with correct types", async () => {
      const token = await createProxyToken(MOCK_API_KEY, {
        identity: "user-789",
        metadata: { custom: "data" },
      });

      const payload = await verifyProxyToken(token, MOCK_API_KEY);

      expect(payload).toMatchObject({
        iss: MOCK_PROJECT_ID,
        sub: "user-789",
        metadata: { custom: "data" },
      });
      expect(payload.iat).toBeTypeOf("number");
      expect(payload.exp).toBeTypeOf("number");
      expect(payload.nbf).toBeTypeOf("number");
    });

    it("should reject token with wrong API key", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const wrongApiKey = "wrong-project:wrong-secret";

      await expect(verifyProxyToken(token, wrongApiKey)).rejects.toThrow();
    });

    it("should reject expired token", async () => {
      const token = await createProxyToken(MOCK_API_KEY, { ttl: "1s" });

      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });

      await expect(verifyProxyToken(token, MOCK_API_KEY)).rejects.toThrow();
    });

    it("should reject malformed token", async () => {
      const malformedToken = "not.a.valid.jwt.token";

      await expect(
        verifyProxyToken(malformedToken, MOCK_API_KEY)
      ).rejects.toThrow();
    });

    it("should reject token with wrong issuer", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const differentApiKey = "different-project:test-secret";

      await expect(verifyProxyToken(token, differentApiKey)).rejects.toThrow();
    });

    it("should verify token without optional fields", async () => {
      const token = await createProxyToken(MOCK_API_KEY);
      const payload = await verifyProxyToken(token, MOCK_API_KEY);

      expect(payload.iss).toBe(MOCK_PROJECT_ID);
      expect(payload.sub).toBeUndefined();
      expect(payload.scopes).toBeUndefined();
      expect(payload.metadata).toBeUndefined();
    });

    it("should throw error for invalid API key format", async () => {
      const token = await createProxyToken(MOCK_API_KEY);

      await expect(verifyProxyToken(token, "invalid-key")).rejects.toThrow(
        "Invalid API key format"
      );
    });
  });

  describe("Round-trip token flow", () => {
    it("should successfully create and verify token with all options", async () => {
      const options = {
        identity: "user-complete",
        ttl: "2h",
        scopes: ["listen", "speak", "analyze"],
        metadata: { role: "admin", tier: "premium" },
      };

      const token = await createProxyToken(MOCK_API_KEY, options);
      const payload = await verifyProxyToken(token, MOCK_API_KEY);

      expect(payload.sub).toBe(options.identity);
      expect(payload.scopes).toEqual(options.scopes);
      expect(payload.metadata).toEqual(options.metadata);
      expect(payload.iss).toBe(MOCK_PROJECT_ID);
    });

    it("should handle multiple tokens independently", async () => {
      const token1 = await createProxyToken(MOCK_API_KEY, {
        identity: "user-1",
      });
      const token2 = await createProxyToken(MOCK_API_KEY, {
        identity: "user-2",
      });

      const payload1 = await verifyProxyToken(token1, MOCK_API_KEY);
      const payload2 = await verifyProxyToken(token2, MOCK_API_KEY);

      expect(payload1.sub).toBe("user-1");
      expect(payload2.sub).toBe("user-2");
      expect(token1).not.toBe(token2);
    });
  });
});
