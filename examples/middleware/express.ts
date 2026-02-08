/**
 * Example: Express Middleware for Deepgram API Proxy
 *
 * This example demonstrates how to create a proxy server for the Deepgram API
 * using Express middleware. This allows you to:
 * - Hide your API key server-side
 * - Add custom logic (logging, rate limiting, etc.)
 * - Proxy both REST and WebSocket requests
 *
 * Prerequisites:
 * ```bash
 * npm install express
 * # or
 * pnpm add express
 * ```
 */

import express from "express";
import { createDeepgramMiddleware } from "../../dist/esm/index.mjs";

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
 * Create Express app
 */
const app = express();

/**
 * Add CORS support for browser clients
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

/**
 * Health check endpoint
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "deepgram-proxy" });
});

/**
 * Custom JSON endpoint (demonstrates mixing proxy with custom routes)
 */
app.post("/json", express.json(), (req, res) => {
  res.json({
    success: true,
    message: "Custom route working!",
    received: req.body,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Create Deepgram proxy middleware
 */
console.log("🔧 Creating Deepgram proxy middleware...");

const { middleware, server: registerWebSocket } = createDeepgramMiddleware({
  apiKey: API_KEY,
  enableTokenAuth: false, // Set to true to enable temporary token generation
  // tokenExpiresIn: 600,  // Token lifetime in seconds (default: 300)
});

/**
 * Mount the middleware at /api/deepgram
 * All requests to /api/deepgram/* will be proxied to api.deepgram.com
 *
 * IMPORTANT: Do NOT use body parsing middleware (express.json(), express.raw(), etc.)
 * before this route! The proxy needs to stream the raw request body to Deepgram.
 */
app.use("/api/deepgram", middleware);

/**
 * Start the server
 */
const httpServer = app.listen(PORT, () => {
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
});

/**
 * Register WebSocket upgrade handler
 * This is required for Live Transcription, Streaming TTS, and Voice Agent
 */
registerWebSocket(httpServer);

/**
 * Graceful shutdown
 */
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down proxy server...");
  httpServer.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
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
