/**
 * Example: Fastify Plugin for Deepgram API Proxy
 *
 * This example demonstrates how to create a proxy server for the Deepgram API
 * using Fastify. This allows you to:
 * - Hide your API key server-side
 * - Add custom logic (logging, rate limiting, etc.)
 * - Proxy both REST and WebSocket requests
 *
 * Prerequisites:
 * ```bash
 * npm install fastify fastify-plugin
 * # or
 * pnpm add fastify fastify-plugin
 * ```
 */

import Fastify from "fastify";
import { fastifyDeepgramProxy } from "../../dist/esm/index.mjs";

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
  return { status: "ok", service: "deepgram-proxy" };
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
 * Register Deepgram proxy plugin
 * All requests to /api/deepgram/* will be proxied to api.deepgram.com
 * WebSocket upgrades are automatically handled
 */
console.log("🔧 Registering Deepgram proxy plugin...");

await fastify.register(fastifyDeepgramProxy, {
  prefix: "/api/deepgram",
  apiKey: API_KEY,
  enableTokenAuth: false, // Set to true to enable temporary token generation
  // tokenExpiresIn: 600,  // Token lifetime in seconds (default: 300)
});

/**
 * Start the server
 */
try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });

  console.log(`✅ Deepgram proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/deepgram`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log("");
  console.log("Usage with Deepgram SDK:");
  console.log(`
  const client = new DeepgramClient({
    apiKey: 'proxy',  // Placeholder, ignored by proxy
    baseUrl: 'http://localhost:${PORT}/api/deepgram'
  });

  // REST API example
  const result = await client.listen.v1.media.transcribeUrl({
    url: 'https://example.com/audio.mp3'
  });

  // WebSocket example
  const connection = await client.listen.v1.connect({
    model: 'nova-3'
  });
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
