/* eslint-disable vitest/valid-expect -- Tests don't require assertion messages */
/* eslint-disable @typescript-eslint/naming-convention -- Package names use hyphens */

import { describe, expect, it } from "vitest";
import { DeepgramClient } from "../../src";
import { DeepgramEnvironment } from "../../src/environments";

/**
 * Tests for baseUrl priority and fallback behavior
 *
 * Verifies the SDK uses this priority order for determining endpoints:
 * 1. baseUrl (if specified) - HIGHEST PRIORITY
 * 2. environment (if specified)
 * 3. DeepgramEnvironment.Production (default fallback)
 */

describe("baseUrl Priority Order", () => {
	it("should use default Production environment when neither baseUrl nor environment is specified", () => {
		const client = new DeepgramClient({
			apiKey: "test_key",
		});

		// baseUrl should not be set
		expect(client._options.baseUrl).toBeUndefined();

		// environment should not be set (will use DeepgramEnvironment.Production)
		expect(client._options.environment).toBeUndefined();
	});

	it("should use custom baseUrl when specified", () => {
		const customBaseUrl = "https://api.eu.deepgram.com";

		const client = new DeepgramClient({
			apiKey: "test_key",
			baseUrl: customBaseUrl,
		});

		// baseUrl should be set to custom value
		expect(client._options.baseUrl).toBe(customBaseUrl);
	});

	it("should use custom environment when specified without baseUrl", () => {
		const customEnvironment = {
			base: "https://custom.deepgram.com",
			production: "wss://custom.deepgram.com",
			agent: "wss://agent-custom.deepgram.com",
		};

		const client = new DeepgramClient({
			apiKey: "test_key",
			environment: customEnvironment,
		});

		// baseUrl should not be set
		expect(client._options.baseUrl).toBeUndefined();

		// environment should be set to custom value
		expect(client._options.environment).toEqual(customEnvironment);
	});

	it("should prioritize baseUrl over environment when both are specified", () => {
		const customBaseUrl = "https://api.eu.deepgram.com";
		const customEnvironment = {
			base: "https://api.us.deepgram.com",
			production: "wss://api.us.deepgram.com",
			agent: "wss://agent.us.deepgram.com",
		};

		const client = new DeepgramClient({
			apiKey: "test_key",
			baseUrl: customBaseUrl,
			environment: customEnvironment,
		});

		// Both should be set, but baseUrl takes priority in actual requests
		expect(client._options.baseUrl).toBe(customBaseUrl);
		expect(client._options.environment).toEqual(customEnvironment);
	});

	it("should accept localhost URLs for proxying", () => {
		const proxyUrl = "http://localhost:8001";

		const client = new DeepgramClient({
			apiKey: "proxy",
			baseUrl: proxyUrl,
		});

		expect(client._options.baseUrl).toBe(proxyUrl);
	});

	it("should accept custom domain URLs", () => {
		const customUrl = "https://custom.example.com";

		const client = new DeepgramClient({
			apiKey: "test_key",
			baseUrl: customUrl,
		});

		expect(client._options.baseUrl).toBe(customUrl);
	});

	it("should use DeepgramEnvironment.Production by default", () => {
		const client = new DeepgramClient({
			apiKey: "test_key",
		});

		// Should use default environment
		expect(client._options.environment).toBeUndefined();

		// The SDK will fall back to DeepgramEnvironment.Production internally
		expect(DeepgramEnvironment.Production.base).toBe("https://api.deepgram.com");
	});
});
