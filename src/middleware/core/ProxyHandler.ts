import type { IncomingMessage, ServerResponse } from "node:http";
import https from "node:https";
import { URL } from "node:url";

import type { MiddlewareOptions } from "./types.js";

/**
 * Handles HTTP/REST request proxying to Deepgram API
 */
export class ProxyHandler {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: MiddlewareOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://api.deepgram.com";
  }

  /**
   * Handle incoming HTTP request and proxy to Deepgram
   */
  async handleRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      // Handle CORS preflight
      if (req.method === "OPTIONS") {
        this.handleCorsPreflightRequest(req, res);
        return;
      }

      // Forward request to Deepgram
      await this.forwardToDeepgram(req, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Forward request to Deepgram API
   */
  private async forwardToDeepgram(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    console.log(`[ProxyHandler] Starting forward to Deepgram`);
    console.log(`[ProxyHandler] Original URL: ${req.url}`);

    // Strip /api/deepgram prefix if present
    const cleanUrl = (req.url ?? "/").replace(/^\/api\/deepgram/, "");
    console.log(`[ProxyHandler] Clean URL: ${cleanUrl}`);

    // Build Deepgram URL
    const targetUrl = new URL(cleanUrl, this.baseUrl);
    console.log(`[ProxyHandler] Target URL: ${targetUrl.toString()}`);

    // Prepare headers
    const headers = this.prepareHeaders(req);
    console.log(`[ProxyHandler] Request headers prepared`);

    // Create request to Deepgram
    const options = {
      method: req.method,
      headers,
    };

    console.log(`[ProxyHandler] Creating ${req.method} request to Deepgram...`);
    console.log(`[ProxyHandler] Headers being SENT to Deepgram:`, JSON.stringify(headers, null, 2));
    const deepgramReq = https.request(targetUrl, options, (deepgramRes) => {
      console.log(`[ProxyHandler] Received response from Deepgram: ${deepgramRes.statusCode}`);
      console.log(`[ProxyHandler] Response headers from Deepgram:`, JSON.stringify(deepgramRes.headers, null, 2));

      // Don't set headers if they were already sent
      if (res.headersSent) {
        console.log(`[ProxyHandler] Headers already sent, skipping`);
        return;
      }

      // Build response headers with CORS
      const responseHeaders = {
        ...deepgramRes.headers,
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers":
          "Authorization, Content-Type, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-deepgram-session-id",
        "access-control-max-age": "3600",
      };

      // Forward status and headers
      console.log(`[ProxyHandler] Writing response headers`);
      res.writeHead(deepgramRes.statusCode ?? 200, responseHeaders);

      // Stream response body
      console.log(`[ProxyHandler] Piping response body to client`);
      deepgramRes.pipe(res);

      deepgramRes.on('end', () => {
        console.log(`[ProxyHandler] Response stream ended`);
      });
    });

    // Handle request errors
    deepgramReq.on("error", (error) => {
      console.error(`[ProxyHandler] Request error:`, error);
      this.handleError(error, res);
    });

    // Check if request stream is readable
    console.log(`[ProxyHandler] Request stream readable: ${req.readable}`);
    console.log(`[ProxyHandler] Request stream readableEnded: ${req.readableEnded}`);
    console.log(`[ProxyHandler] Request method: ${req.method}`);

    // For POST/PUT requests, manually read and forward the body
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log(`[ProxyHandler] Reading request body for ${req.method} request...`);

      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => {
        console.log(`[ProxyHandler] Received request chunk: ${chunk.length} bytes`);
        chunks.push(chunk);
      });

      req.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log(`[ProxyHandler] Request body complete: ${body.length} bytes total`);
        console.log(`[ProxyHandler] Request body content: ${body.toString()}`);

        deepgramReq.write(body);
        deepgramReq.end();
        console.log(`[ProxyHandler] Request sent to Deepgram`);
      });

      req.on('error', (err) => {
        console.error(`[ProxyHandler] Request stream error:`, err);
      });
    } else {
      // For GET requests, just end immediately
      console.log(`[ProxyHandler] No body expected for ${req.method} request`);
      deepgramReq.end();
    }
  }

  /**
   * Prepare headers for Deepgram request
   */
  private prepareHeaders(req: IncomingMessage): Record<string, string> {
    const headers: Record<string, string> = {};

    // Copy relevant headers
    const allowedHeaders = [
      "content-type",
      "content-length",
      "accept",
      "user-agent",
      "x-fern-language",
      "x-fern-sdk-name",
      "x-fern-sdk-version",
      "x-fern-runtime",
      "x-fern-runtime-version",
      "x-deepgram-session-id",
    ];

    for (const header of allowedHeaders) {
      const value = req.headers[header];
      if (value) {
        headers[header] = Array.isArray(value) ? value[0] : value;
      }
    }

    // Authentication logic:
    // 1. If client sends dummy key "Token Dummy key for SDK proxying" -> use server API key
    // 2. If client sends valid token (e.g., temp JWT from /token endpoint) -> forward it
    // 3. If client sends no auth header -> use server API key
    const clientAuth = req.headers.authorization;
    const isDummyKey = clientAuth === "Token Dummy key for SDK proxying";

    if (clientAuth && !isDummyKey) {
      console.log(`[ProxyHandler] Client provided authorization header, forwarding to Deepgram`);
      headers.authorization = clientAuth;
      console.log(`[ProxyHandler] Authorization header: ${headers.authorization.substring(0, 30)}...`);
    } else {
      if (isDummyKey) {
        console.log(`[ProxyHandler] Client sent dummy key, using server API key`);
      } else {
        console.log(`[ProxyHandler] No client auth, using server API key`);
      }
      headers.authorization = `Token ${this.apiKey}`;
      console.log(`[ProxyHandler] Authorization header: ${headers.authorization.substring(0, 30)}...`);
    }

    return headers;
  }

  /**
   * Add CORS headers to response
   */
  private addCorsHeaders(res: ServerResponse): void {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, x-fern-language, x-fern-sdk-name, x-fern-sdk-version, x-fern-runtime, x-fern-runtime-version, x-deepgram-session-id"
    );
    res.setHeader("Access-Control-Max-Age", "3600");
  }

  /**
   * Handle CORS preflight requests
   */
  private handleCorsPreflightRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): void {
    this.addCorsHeaders(res);
    res.writeHead(204);
    res.end();
  }

  /**
   * Handle errors and send appropriate response
   */
  private handleError(error: unknown, res: ServerResponse): void {
    console.error("ProxyHandler error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";

    this.addCorsHeaders(res);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: message,
      })
    );
  }
}
