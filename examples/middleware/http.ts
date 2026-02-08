/**
 * Example: Raw Node.js HTTP Server for Deepgram API Proxy
 *
 * This example demonstrates how to create a proxy server for the Deepgram API
 * using only Node.js built-in modules (no framework dependencies). This allows you to:
 * - Hide your API key server-side
 * - Add custom logic (logging, rate limiting, etc.)
 * - Proxy both REST and WebSocket requests
 * - Deploy with minimal dependencies
 *
 * Prerequisites: NONE! Uses only built-in Node.js modules
 */

import http from "node:http";
import { createDeepgramHttpServer } from "../../dist/esm/index.mjs";

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
 * Create Deepgram proxy handlers
 */
console.log("🔧 Creating Deepgram proxy handlers...");

const { handler, upgradeHandler } = createDeepgramHttpServer({
  apiKey: API_KEY,
  enableTokenAuth: false, // Set to true to enable temporary token generation
  // tokenExpiresIn: 600,  // Token lifetime in seconds (default: 300)
});

/**
 * Create HTTP server with custom routing
 */
const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id",
    });
    res.end(JSON.stringify({ status: "ok", service: "deepgram-proxy" }));
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
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id",
        });
        res.end(
          JSON.stringify({
            success: true,
            message: "Custom route working!",
            received: data,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
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
  console.log(`✅ Deepgram proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/deepgram`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log("");
  console.log("🎯 Advantages of raw Node.js HTTP:");
  console.log("  • Zero dependencies (only built-in modules)");
  console.log("  • Maximum performance");
  console.log("  • Full control over routing");
  console.log("  • Minimal memory footprint");
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
