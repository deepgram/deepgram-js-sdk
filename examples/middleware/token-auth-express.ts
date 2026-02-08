/**
 * Example: Temporary Token Authentication with Middleware
 *
 * This example demonstrates how to use temporary token authentication
 * with the Deepgram proxy middleware. This provides enhanced security by:
 * - Keeping the main API key server-side
 * - Issuing short-lived tokens to clients
 * - Allowing token expiration and renewal
 *
 * Prerequisites:
 * ```bash
 * npm install express
 * # or
 * pnpm add express
 * ```
 */

import express from "express";
import { createDeepgramMiddleware, DeepgramClient } from "../../dist/esm/index.mjs";

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
  res.json({ status: "ok", service: "deepgram-proxy-token-auth" });
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
 * Create Deepgram proxy middleware with token auth enabled
 */
console.log("🔧 Creating Deepgram proxy with token authentication...");

const { middleware, server: registerWebSocket } = createDeepgramMiddleware({
  apiKey: API_KEY,
  enableTokenAuth: true, // Enable temporary tokens
  tokenExpiresIn: 300, // Token lifetime: 5 minutes
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
 * Example client endpoint that demonstrates the token flow
 */
app.post("/demo/transcribe", express.json(), async (req, res) => {
  try {
    const audioUrl = req.body.url;

    if (!audioUrl) {
      return res.status(400).json({ error: "Missing 'url' in request body" });
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
    return res.json({
      success: true,
      tokenExpiresIn: expiresIn,
      transcription: result.results,
    });
  } catch (error) {
    console.error("  ❌ Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Start the server
 */
const httpServer = app.listen(PORT, () => {
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
});

/**
 * Register WebSocket handler
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
