/**
 * Example: Temporary Token Authentication with Raw Node.js HTTP
 *
 * This example demonstrates how to use temporary token authentication
 * with the Deepgram proxy using only Node.js built-in modules. This provides:
 * - Enhanced security by keeping the main API key server-side
 * - Short-lived tokens issued to clients
 * - Token expiration and renewal
 * - Zero framework dependencies
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
 * Create Deepgram proxy handlers with token auth enabled
 */
console.log("🔧 Creating Deepgram proxy with token authentication...");

const { handler, upgradeHandler } = createDeepgramHttpServer({
  apiKey: API_KEY,
  enableTokenAuth: true, // Enable temporary tokens
  tokenExpiresIn: 300, // Token lifetime: 5 minutes
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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
    sendJson(res, 200, { status: "ok", service: "deepgram-proxy-token-auth" });
    return;
  }

  // Custom JSON endpoint (demonstrates mixing proxy with custom routes)
  if (req.url === "/json" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        sendJson(res, 200, {
          success: true,
          message: "Custom route working!",
          received: data,
          timestamp: new Date().toISOString(),
        });
      } catch {
        sendJson(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // Demo endpoint that demonstrates the token flow
  if (req.url === "/demo/transcribe" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      void (async () => {
        try {
          const data = JSON.parse(body) as { url?: string };

          if (!data.url) {
            sendJson(res, 400, { error: "Missing 'url' in request body" });
            return;
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
          const result = await client.listen.v1.media.transcribeUrl({ url: data.url });

          console.log("  ✅ Transcription complete!");

          // Return the transcription
          sendJson(res, 200, {
            success: true,
            tokenExpiresIn: expiresIn,
            transcription: result.results,
          });
        } catch (error) {
          console.error("  ❌ Error:", error);
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    });
    return;
  }

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id",
    });
    res.end();
    return;
  }

  // Route /api/deepgram/* to Deepgram proxy
  if (req.url?.startsWith("/api/deepgram")) {
    // Strip prefix before proxying
    req.url = req.url.slice("/api/deepgram".length) || "/";
    return handler(req, res);
  }

  // Handle all other routes (404)
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

/**
 * Register WebSocket upgrade handler
 */
server.on("upgrade", (req, socket, head) => {
  // Only handle requests matching our prefix
  if (req.url?.startsWith("/api/deepgram")) {
    // Strip prefix before proxying
    req.url = req.url.slice("/api/deepgram".length) || "/";
    upgradeHandler(req, socket, head);
  } else {
    // Reject other WebSocket connections
    socket.destroy();
  }
});

/**
 * Start the server
 */
server.listen(PORT, () => {
  console.log(`✅ Deepgram proxy server with token auth running`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/deepgram/token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Demo endpoint: POST http://localhost:${PORT}/demo/transcribe`);
  console.log("");
  console.log("🎯 Advantages of raw Node.js HTTP:");
  console.log("  • Zero dependencies (only built-in modules)");
  console.log("  • Maximum performance");
  console.log("  • Full control over routing");
  console.log("  • Minimal memory footprint");
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
