/**
 * Example: JWT Token Authentication with Middleware
 *
 * This example demonstrates how to use JWT-based token authentication
 * with the Deepgram proxy middleware. This provides enhanced security by:
 * - Keeping the main API key server-side only
 * - Issuing JWT tokens signed with the API key
 * - Verifying JWTs on the proxy before forwarding to Deepgram
 * - Supporting custom scopes and metadata in tokens
 *
 * This follows the same pattern as LiveKit's token-based authentication.
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
  res.json({ status: "ok", service: "deepgram-proxy-jwt-auth" });
});

/**
 * Create Deepgram proxy middleware with JWT auth enabled
 */
console.log("🔧 Creating Deepgram proxy with JWT authentication...");

const { middleware, server: registerWebSocket } = createDeepgramMiddleware({
  apiKey: API_KEY,
  enableTokenAuth: true,       // Enable token generation endpoint
  tokenMode: "jwt",             // Use JWT mode instead of Deepgram's temp tokens
  defaultTokenExpiration: 3600, // Default JWT lifetime: 1 hour
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
 * Example client endpoint that demonstrates the JWT flow
 */
app.post("/demo/transcribe", express.json(), async (req, res) => {
  try {
    const audioUrl = req.body.url;

    if (!audioUrl) {
      return res.status(400).json({ error: "Missing 'url' in request body" });
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
    // IMPORTANT: Use Bearer token format, not Token format
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
    return res.json({
      success: true,
      tokenType: "jwt",
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
