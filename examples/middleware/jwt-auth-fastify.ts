/**
 * Example: JWT Token Authentication with Fastify
 *
 * This example demonstrates how to use JWT-based token authentication
 * with the Deepgram proxy using Fastify. This provides enhanced security by:
 * - Keeping the main API key server-side only
 * - Issuing JWT tokens signed with the API key
 * - Verifying JWTs on the proxy before forwarding to Deepgram
 * - Supporting custom scopes and metadata in tokens
 *
 * This follows the same pattern as LiveKit's token-based authentication.
 *
 * Prerequisites:
 * ```bash
 * npm install fastify fastify-plugin
 * # or
 * pnpm add fastify fastify-plugin
 * ```
 */

import Fastify from "fastify";
import { fastifyDeepgramProxy, DeepgramClient } from "../../dist/esm/index.mjs";

/**
 * Configuration
 */
const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const API_KEY = process.env.DEEPGRAM_API_KEY ?? "";

if (!API_KEY) {
  console.error("❌ DEEPGRAM_API_KEY environment variable is required");
  process.exit(1);
}

/**
 * Create Fastify instance
 */
const fastify = Fastify({
  logger: false, // Set to true for request logging
});

/**
 * Add CORS hook for custom routes
 */
fastify.addHook("onRequest", async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id");
});

fastify.options("*", async (request, reply) => {
  reply.status(204).send();
});

/**
 * Health check endpoint
 */
fastify.get("/health", async () => {
  return { status: "ok", service: "deepgram-proxy-jwt-auth" };
});

/**
 * Example client endpoint that demonstrates the JWT flow
 */
fastify.post<{ Body: { url?: string } }>("/demo/transcribe", async (request, reply) => {
  try {
    const { url: audioUrl } = request.body;

    if (!audioUrl) {
      return reply.status(400).send({ error: "Missing 'url' in request body" });
    }

    console.log("\n📝 Demo: Transcribing with JWT token...");

    // Step 1: Request a JWT from the proxy
    console.log("  1️⃣  Requesting JWT token...");
    const tokenResponse = await fetch(`http://localhost:${PORT}/api/deepgram/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ttlSeconds: 3600, // 1 hour expiration
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const { token, expiresIn } = (await tokenResponse.json()) as {
      token: string;
      expiresIn: number;
    };
    console.log(`  ✅ Received JWT token (expires in ${expiresIn}s)`);

    // Step 2: Use the JWT with the Deepgram SDK
    console.log("  2️⃣  Creating Deepgram client with JWT...");
    const client = new DeepgramClient({
      apiKey: `Bearer ${token}`, // Use Bearer format for JWTs
      baseUrl: `http://localhost:${PORT}/api/deepgram`,
    });

    // Step 3: Make API request
    console.log("  3️⃣  Transcribing audio...");
    const result = await client.listen.v1.media.transcribeUrl({ url: audioUrl });

    console.log("  ✅ Transcription complete!");

    // Return the transcription
    return {
      success: true,
      tokenType: "jwt",
      tokenExpiresIn: expiresIn,
      transcription: result.results,
    };
  } catch (error) {
    console.error("  ❌ Error:", error);
    return reply.status(500).send({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Register Deepgram proxy plugin with JWT auth enabled
 * All requests to /api/deepgram/* will be proxied to api.deepgram.com
 * WebSocket upgrades are automatically handled
 */
console.log("🔧 Registering Deepgram proxy with JWT authentication...");

await fastify.register(fastifyDeepgramProxy, {
  prefix: "/api/deepgram",
  apiKey: API_KEY,
  enableTokenAuth: true,         // Enable token generation endpoint
  tokenMode: "jwt",               // Use JWT mode instead of Deepgram's temp tokens
  defaultTokenExpiration: 3600,  // Default JWT lifetime: 1 hour
});

/**
 * Start the server
 */
try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });

  console.log(`✅ Deepgram proxy server with JWT auth running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/deepgram/token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Demo endpoint: POST http://localhost:${PORT}/demo/transcribe`);
  console.log("");
  console.log("JWT Authentication Flow:");
  console.log(`
  1. Client requests JWT token:
     POST http://localhost:${PORT}/api/deepgram/token
     Body: { "ttlSeconds": 3600 }

     Response: { "token": "eyJhbGc...", "expiresIn": 3600 }

  2. Client uses JWT with SDK (Bearer format):
     const client = new DeepgramClient({
       apiKey: 'Bearer ' + token,
       baseUrl: 'http://localhost:${PORT}/api/deepgram'
     });

  3. Proxy verifies JWT signature and uses server API key
     - JWT is signed with HMAC256 using the API key
     - Proxy verifies JWT before forwarding to Deepgram
     - API key never leaves the server!

  4. Token expires after configured time
     Client must request a new token after expiration
  `);
  console.log("");
  console.log("Try the demo:");
  console.log(`
  curl -X POST http://localhost:${PORT}/demo/transcribe \\
    -H "Content-Type: application/json" \\
    -d '{"url": "https://dpgr.am/spacewalk.wav"}'
  `);
} catch (error) {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
}

/**
 * Graceful shutdown
 */
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down proxy server...");
  await fastify.close();
  console.log("✅ Server closed");
  process.exit(0);
});
