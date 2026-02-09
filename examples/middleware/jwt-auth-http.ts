/**
 * Example: JWT Token Authentication with Raw Node.js HTTP
 *
 * This example demonstrates how to use JWT-based token authentication
 * with the Deepgram proxy using only Node.js built-in modules. This provides:
 * - Enhanced security by keeping the main API key server-side only
 * - JWT tokens signed with HMAC256 using the API key
 * - Proxy verifies JWTs before forwarding to Deepgram
 * - Zero framework dependencies
 *
 * This follows the same pattern as LiveKit's token-based authentication.
 *
 * Prerequisites: NONE! Uses only built-in Node.js modules
 */

import http from "node:http";
import { createDeepgramHttpServer, DeepgramClient } from "../../dist/esm/index.mjs";

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
 * Create Deepgram proxy handlers with JWT auth enabled
 */
console.log("🔧 Creating Deepgram proxy with JWT authentication...");

const { handler, upgradeHandler } = createDeepgramHttpServer({
  apiKey: API_KEY,
  enableTokenAuth: true,        // Enable token generation endpoint
  tokenMode: "jwt",              // Use JWT mode instead of Deepgram's temp tokens
  defaultTokenExpiration: 3600, // Default JWT lifetime: 1 hour
});

/**
 * Helper function to send JSON responses
 */
const sendJson = (
  res: http.ServerResponse,
  statusCode: number,
  data: unknown
): void => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id",
  });
  res.end(JSON.stringify(data));
};

/**
 * Create HTTP server with custom routing
 */
const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, { status: "ok", service: "deepgram-proxy-jwt-auth" });
    return;
  }

  // Demo transcription endpoint
  if (req.url === "/demo/transcribe" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { url: audioUrl } = JSON.parse(body);

        if (!audioUrl) {
          sendJson(res, 400, { error: "Missing 'url' in request body" });
          return;
        }

        console.log("\n📝 Demo: Transcribing with JWT token...");

        // Step 1: Request a JWT from the proxy
        console.log("  1️⃣  Requesting JWT token...");
        const tokenResponse = await fetch(`http://localhost:${PORT}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ttlSeconds: 3600 }),
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
          baseUrl: `http://localhost:${PORT}`,
        });

        // Step 3: Make API request
        console.log("  3️⃣  Transcribing audio...");
        const result = await client.listen.v1.media.transcribeUrl({ url: audioUrl });

        console.log("  ✅ Transcription complete!");

        // Return the transcription
        sendJson(res, 200, {
          success: true,
          tokenType: "jwt",
          tokenExpiresIn: expiresIn,
          transcription: result.results,
        });
      } catch (error) {
        console.error("  ❌ Error:", error);
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
    return;
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id",
    });
    res.end();
    return;
  }

  // All other requests go to the Deepgram proxy
  handler(req, res);
});

/**
 * Handle WebSocket upgrade requests
 */
server.on("upgrade", upgradeHandler);

/**
 * Start the server
 */
server.listen(PORT, () => {
  console.log(`✅ Deepgram proxy server with JWT auth running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Demo endpoint: POST http://localhost:${PORT}/demo/transcribe`);
  console.log("");
  console.log("JWT Authentication Flow:");
  console.log(`
  1. Client requests JWT token:
     POST http://localhost:${PORT}/token
     Body: { "ttlSeconds": 3600 }

     Response: { "token": "eyJhbGc...", "expiresIn": 3600 }

  2. Client uses JWT with SDK (Bearer format):
     const client = new DeepgramClient({
       apiKey: 'Bearer ' + token,
       baseUrl: 'http://localhost:${PORT}'
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
 * Graceful shutdown
 */
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down proxy server...");
  server.close(() => {
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
