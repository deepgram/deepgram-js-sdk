/**
 * Example 33: Configuring EU Endpoint with baseUrl
 *
 * This example demonstrates how to configure the Deepgram SDK to use
 * the EU endpoint (api.eu.deepgram.com) instead of the default US endpoint.
 *
 * Use cases:
 * - GDPR compliance (data processed in EU)
 * - Lower latency for EU-based users
 * - Regional data residency requirements
 *
 * The baseUrl option routes ALL API requests (auth, listen, manage, etc.)
 * to the specified endpoint.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

async function testEUEndpoint(): Promise<void> {
	console.log("=== EU Endpoint Configuration Example ===\n");

	// Create client configured for EU endpoint
	const euClient = new DeepgramClient({
		apiKey: process.env.DEEPGRAM_API_KEY ?? "",
		baseUrl: "https://api.eu.deepgram.com", // Route to EU data center
	});

	console.log("Client configured with:");
	console.log("  baseUrl: https://api.eu.deepgram.com");
	console.log("  (all requests will go to EU endpoint)\n");

	try {
		// Test 1: Auth endpoint
		console.log("Test 1: Auth endpoint (generate temporary token)");
		console.log("Expected URL: https://api.eu.deepgram.com/v1/auth/grant\n");

		const tokenResponse = await euClient.auth.v1.tokens.grant({
			scopes: ["usage:write"],
			expires_in: 30,
		});

		console.log("✓ Auth request successful!");
		console.log(`  Token generated: ${tokenResponse.token?.substring(0, 20)}...`);
		console.log();

		// Test 2: Management endpoint
		console.log("Test 2: Management endpoint (list projects)");
		console.log("Expected URL: https://api.eu.deepgram.com/v1/projects\n");

		const projects = await euClient.manage.v1.projects.list();

		console.log("✓ Management request successful!");
		console.log(`  Projects found: ${projects.projects?.length ?? 0}`);
		if (projects.projects?.[0]) {
			console.log(`  First project: ${projects.projects[0].name}`);
		}
		console.log();

		// Test 3: Listen endpoint (transcribe from URL)
		console.log("Test 3: Listen endpoint (transcribe from URL)");
		console.log("Expected URL: https://api.eu.deepgram.com/v1/listen\n");

		const transcription = await euClient.listen.v1.media.transcribeUrl({
			url: "https://dpgr.am/spacewalk.wav",
			model: "nova-3",
			language: "en",
		});

		console.log("✓ Transcription request successful!");
		const transcript =
			transcription.results?.channels?.[0]?.alternatives?.[0]?.transcript;
		if (transcript) {
			console.log(`  Transcript preview: ${transcript.substring(0, 100)}...`);
		}
		console.log();

		console.log("=== All tests passed! ===");
		console.log("The baseUrl configuration is working correctly.");
		console.log("All requests were routed to api.eu.deepgram.com\n");
	} catch (error) {
		console.error("✗ Test failed!");
		if (error instanceof Error) {
			console.error(`  Error: ${error.message}`);
		}
		throw error;
	}
}

async function compareWithDefaultEndpoint(): Promise<void> {
	console.log("\n=== Comparison: Default US Endpoint ===\n");

	// Create client WITHOUT custom baseUrl (uses default US endpoint)
	const usClient = new DeepgramClient({
		apiKey: process.env.DEEPGRAM_API_KEY ?? "",
	});

	console.log("Client configured with:");
	console.log("  baseUrl: (not set - defaults to api.deepgram.com)");
	console.log("  (requests will go to US endpoint)\n");

	try {
		console.log("Test: List projects with default endpoint");
		console.log("Expected URL: https://api.deepgram.com/v1/projects\n");

		const projects = await usClient.manage.v1.projects.list();

		console.log("✓ Default endpoint request successful!");
		console.log(`  Projects found: ${projects.projects?.length ?? 0}\n`);
	} catch (error) {
		console.error("✗ Default endpoint test failed!");
		if (error instanceof Error) {
			console.error(`  Error: ${error.message}`);
		}
	}
}

async function demonstrateOtherRegions(): Promise<void> {
	console.log("\n=== Other Available Regional Endpoints ===\n");

	console.log("The baseUrl option can be used with any Deepgram regional endpoint:");
	console.log("  • US (default):  https://api.deepgram.com");
	console.log("  • EU:            https://api.eu.deepgram.com");
	console.log("  • Custom proxy:  http://localhost:8001");
	console.log("  • Self-hosted:   https://your-domain.com\n");

	console.log("Example configurations:\n");

	// EU endpoint
	console.log("1. EU Endpoint:");
	console.log("   const client = new DeepgramClient({");
	console.log('     apiKey: "YOUR_API_KEY",');
	console.log('     baseUrl: "https://api.eu.deepgram.com"');
	console.log("   });\n");

	// Development proxy
	console.log("2. Development Proxy:");
	console.log("   const client = new DeepgramClient({");
	console.log('     apiKey: "proxy",');
	console.log('     baseUrl: "http://localhost:8001"');
	console.log("   });\n");

	// Self-hosted
	console.log("3. Self-Hosted Deepgram:");
	console.log("   const client = new DeepgramClient({");
	console.log('     apiKey: "YOUR_ONPREM_KEY",');
	console.log('     baseUrl: "https://deepgram.your-domain.com"');
	console.log("   });\n");
}

// Main execution
async function main(): Promise<void> {
	if (!process.env.DEEPGRAM_API_KEY) {
		console.error("Error: DEEPGRAM_API_KEY environment variable not set");
		console.error("Please set your API key before running this example:");
		console.error("  export DEEPGRAM_API_KEY=your_key_here");
		process.exit(1);
	}

	try {
		await testEUEndpoint();
		await compareWithDefaultEndpoint();
		await demonstrateOtherRegions();
	} catch (error) {
		console.error("\nExample failed!");
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		}
		process.exit(1);
	}
}

main();
