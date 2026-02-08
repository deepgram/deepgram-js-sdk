/**
 * Example: Temporary Token Authentication with Fastify
 *
 * This example demonstrates how to use temporary token authentication
 * with the Deepgram proxy using Fastify. This provides enhanced security by:
 * - Keeping the main API key server-side
 * - Issuing short-lived tokens to clients
 * - Allowing token expiration and renewal
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
  return { status: "ok", service: "deepgram-proxy-token-auth" };
});

/**
 * Custom JSON endpoint (demonstrates mixing proxy with custom routes)
 */
fastify.post("/json", async (request) => {
  return {
    success: true,
    message: "Custom route working!",
    received: request.body,
    timestamp: new Date().toISOString(),
  };
});

/**
 * Example client endpoint that demonstrates the token flow
 */
fastify.post<{ Body: { url?: string } }>("/demo/transcribe", async (request, reply) => {
  try {
    const { url: audioUrl } = request.body;

    if (!audioUrl) {
      return reply.status(400).send({ error: "Missing 'url' in request body" });
    }

    console.log("\n📝 Demo: Transcribing with temporary token...");

    // Step 1: Request a temporary token from the proxy
    console.log("  1️⃣  Requesting temporary token...");
    const tokenResponse = await fetch(`http://localhost:${PORT}/api/deepgram/token`, {
      method: "GET",
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const { token, expiresIn } = (await tokenResponse.json()) as {
      token: string;
      expiresIn: number;
    };
    console.log(`  ✅ Received token (expires in ${expiresIn}s)`);

    // Step 2: Use the token with the Deepgram SDK
    console.log("  2️⃣  Creating Deepgram client with token...");
    const client = new DeepgramClient({
      apiKey: token, // Use the temporary token
      baseUrl: `http://localhost:${PORT}/api/deepgram`,
    });

    // Step 3: Make API request
    console.log("  3️⃣  Transcribing audio...");
    const result = await client.listen.v1.media.transcribeUrl({ url: audioUrl });

    console.log("  ✅ Transcription complete!");

    // Return the transcription
    return {
      success: true,
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
 * Register Deepgram proxy plugin with token auth enabled
 * All requests to /api/deepgram/* will be proxied to api.deepgram.com
 * WebSocket upgrades are automatically handled
 */
console.log("🔧 Registering Deepgram proxy with token authentication...");

await fastify.register(fastifyDeepgramProxy, {
  prefix: "/api/deepgram",
  apiKey: API_KEY,
  enableTokenAuth: true, // Enable temporary tokens
  tokenExpiresIn: 300, // Token lifetime: 5 minutes
});

/**
 * Start the server
 */
try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });

  console.log(`✅ Deepgram proxy server with token auth running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/deepgram/token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Demo endpoint: POST http://localhost:${PORT}/demo/transcribe`);
  console.log("");
  console.log("Token Authentication Flow:");
  console.log(`
  1. Client requests temporary token:
     GET http://localhost:${PORT}/api/deepgram/token

     Response: { "token": "...", "expiresIn": 300 }

  2. Client uses token with SDK:
     const client = new DeepgramClient({
       apiKey: token,
       baseUrl: 'http://localhost:${PORT}/api/deepgram'
     });

  3. Token expires after 5 minutes
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
  console.error("❌ Error starting server:", error);
  process.exit(1);
}

/**
 * Graceful shutdown
 */
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Received ${signal}, shutting down proxy server...`);
  await fastify.close();
  console.log("✅ Server closed");
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

/**
 * Error handling
 */
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled rejection at:", promise, "reason:", reason);
  process.exit(1);
});
