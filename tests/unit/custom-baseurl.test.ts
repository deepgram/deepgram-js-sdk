/* eslint-disable vitest/valid-expect -- Tests don't require assertion messages */
/* eslint-disable max-lines-per-function -- Test suites naturally have many cases */
/* eslint-disable @typescript-eslint/naming-convention -- Package names use hyphens */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import http from "node:http";
import type { Server } from "node:http";
import { DeepgramClient } from "../../src";

/**
 * Tests for custom baseUrl configuration
 *
 * Verifies that setting baseUrl correctly routes all requests (auth, listen, manage)
 * to the custom endpoint instead of the default api.deepgram.com
 */

describe("Custom baseUrl Configuration", () => {
	let mockServer: Server;
	let requestLog: Array<{
		method: string;
		url: string;
		path: string;
		headers: http.IncomingHttpHeaders;
	}>;
	const mockPort = 39_999; // Use a high port to avoid conflicts

	beforeAll(async () => {
		requestLog = [];

		// Create mock proxy server that logs requests and returns minimal valid responses
		mockServer = http.createServer((req, res) => {
			const requestInfo = {
				method: req.method ?? "GET",
				url: req.url ?? "/",
				path: new URL(req.url ?? "/", `http://localhost:${mockPort}`).pathname,
				headers: req.headers,
			};

			requestLog.push(requestInfo);

			// Return minimal valid responses for different endpoints
			res.writeHead(200, { "Content-Type": "application/json" });

			if (requestInfo.path === "/v1/auth/grant") {
				res.end(JSON.stringify({ token: "mock_token_12345" }));
			} else if (requestInfo.path === "/v1/projects") {
				res.end(
					JSON.stringify({
						projects: [{ project_id: "test", name: "Test Project" }],
					})
				);
			} else if (requestInfo.path === "/v1/listen") {
				res.end(
					JSON.stringify({
						metadata: { request_id: "test" },
						results: {
							channels: [
								{
									alternatives: [
										{
											transcript: "This is a mock transcription.",
										},
									],
								},
							],
						},
					})
				);
			} else {
				res.end(JSON.stringify({ success: true }));
			}
		});

		await new Promise<void>((resolve) => {
			mockServer.listen(mockPort, resolve);
		});
	});

	afterAll(() => {
		mockServer.close();
	});

	it("should route all API requests to custom baseUrl", async () => {
		// Clear request log
		requestLog = [];

		// Create client with custom baseUrl
		const client = new DeepgramClient({
			apiKey: "test_key_12345",
			baseUrl: `http://localhost:${mockPort}`,
		});

		// Test Auth endpoint
		await client.auth.v1.tokens.grant({ scopes: ["usage:write"] });

		// Test Management endpoint
		await client.manage.v1.projects.list();

		// Test Listen endpoint
		await client.listen.v1.media.transcribeUrl({
			url: "https://example.com/audio.wav",
			model: "nova-3",
		});

		// Verify all requests went to the custom baseUrl
		const expectedPaths = ["/v1/auth/grant", "/v1/projects", "/v1/listen"];
		const receivedPaths = requestLog.map((r) => r.path);

		for (const expectedPath of expectedPaths) {
			expect(receivedPaths).toContain(expectedPath);
		}

		// Verify we got exactly 3 requests
		expect(requestLog).toHaveLength(3);
	});

	it("should send correct Authorization headers to custom baseUrl", async () => {
		// Clear request log
		requestLog = [];

		// Create client with custom baseUrl
		const client = new DeepgramClient({
			apiKey: "test_custom_key",
			baseUrl: `http://localhost:${mockPort}`,
		});

		// Make a request
		await client.manage.v1.projects.list();

		// Verify Authorization header was sent correctly
		const request = requestLog[0];
		expect(request?.headers.authorization).toMatch(/^Token test_custom_key$/);
	});
});
