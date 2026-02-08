/**
 * Raw Node.js HTTP/HTTPS server adapter for proxying Deepgram API requests.
 *
 * @packageDocumentation
 *
 * **No Dependencies Required** - Uses only built-in Node.js modules
 *
 * This module provides a request handler for raw Node.js `http` and `https` servers,
 * allowing proxy integration without any framework dependencies.
 */

import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";

import { ProxyHandler } from "../core/ProxyHandler.js";
import { TokenManager } from "../core/TokenManager.js";
import { WebSocketProxy } from "../core/WebSocketProxy.js";
import type { MiddlewareOptions } from "../core/types.js";

/**
 * Request handler type for Node.js HTTP server
 */
export type HttpRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse
) => void | Promise<void>;

/**
 * WebSocket upgrade handler type
 */
export type UpgradeHandler = (
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer
) => void;

/**
 * Create a request handler for raw Node.js HTTP/HTTPS servers
 *
 * This handler can be used directly with `http.createServer()` or `https.createServer()`.
 *
 * @param options - Middleware configuration options
 * @returns HTTP request handler function
 *
 * @example Basic HTTP server
 * ```typescript
 * import http from 'node:http';
 * import { createHttpHandler, createUpgradeHandler } from '@deepgram/sdk';
 *
 * const options = {
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * };
 *
 * // Create request handler
 * const handler = createHttpHandler(options);
 *
 * // Create server
 * const server = http.createServer(handler);
 *
 * // Register WebSocket upgrade handler
 * server.on('upgrade', createUpgradeHandler(options));
 *
 * server.listen(3000);
 * ```
 *
 * @example HTTPS server
 * ```typescript
 * import https from 'node:https';
 * import fs from 'node:fs';
 * import { createHttpHandler, createUpgradeHandler } from '@deepgram/sdk';
 *
 * const options = {
 *   apiKey: process.env.DEEPGRAM_API_KEY!
 * };
 *
 * const server = https.createServer({
 *   key: fs.readFileSync('server.key'),
 *   cert: fs.readFileSync('server.cert')
 * }, createHttpHandler(options));
 *
 * server.on('upgrade', createUpgradeHandler(options));
 * server.listen(443);
 * ```
 *
 * @example With routing
 * ```typescript
 * import http from 'node:http';
 * import { createHttpHandler } from '@deepgram/sdk';
 *
 * const deepgramHandler = createHttpHandler({
 *   apiKey: process.env.DEEPGRAM_API_KEY!
 * });
 *
 * const server = http.createServer((req, res) => {
 *   // Route /api/deepgram/* to Deepgram proxy
 *   if (req.url?.startsWith('/api/deepgram')) {
 *     // Strip prefix before proxying
 *     req.url = req.url.slice('/api/deepgram'.length);
 *     return deepgramHandler(req, res);
 *   }
 *
 *   // Handle other routes
 *   res.writeHead(404);
 *   res.end('Not Found');
 * });
 *
 * server.listen(3000);
 * ```
 */
export function createHttpHandler(options: MiddlewareOptions): HttpRequestHandler {
  const proxyHandler = new ProxyHandler(options);
  const tokenManager = options.enableTokenAuth ? new TokenManager(options) : null;

  return async (req, res) => {
    try {
      // Handle token generation requests
      if (options.enableTokenAuth && req.url === "/token" && req.method === "GET") {
        await tokenManager!.handleTokenRequest(req, res);
        return;
      }

      // Handle all other requests (proxy to Deepgram)
      await proxyHandler.handleRequest(req, res);
    } catch (error) {
      // Set error response
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };
}

/**
 * Create WebSocket upgrade handler for raw Node.js HTTP/HTTPS servers
 *
 * This must be registered on the server using `server.on('upgrade', handler)`.
 *
 * @param options - Middleware configuration options
 * @returns Upgrade handler function
 *
 * @example
 * ```typescript
 * import http from 'node:http';
 * import { createHttpHandler, createUpgradeHandler } from '@deepgram/sdk';
 *
 * const options = {
 *   apiKey: process.env.DEEPGRAM_API_KEY!
 * };
 *
 * const server = http.createServer(createHttpHandler(options));
 *
 * // Register WebSocket handler
 * server.on('upgrade', createUpgradeHandler(options));
 *
 * server.listen(3000);
 * ```
 */
export function createUpgradeHandler(options: MiddlewareOptions): UpgradeHandler {
  const wsProxy = new WebSocketProxy(options);

  return (req, socket, head) => {
    wsProxy.handleUpgrade(req, socket, head);
  };
}

/**
 * Combined helper that returns both HTTP handler and upgrade handler
 *
 * Convenience function for setting up both REST and WebSocket proxying.
 *
 * @param options - Middleware configuration options
 * @returns Object with HTTP handler and upgrade handler
 *
 * @example
 * ```typescript
 * import http from 'node:http';
 * import { createDeepgramHttpServer } from '@deepgram/sdk';
 *
 * const { handler, upgradeHandler } = createDeepgramHttpServer({
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * });
 *
 * const server = http.createServer(handler);
 * server.on('upgrade', upgradeHandler);
 *
 * server.listen(3000, () => {
 *   console.log('Deepgram proxy running on port 3000');
 * });
 * ```
 */
export function createDeepgramHttpServer(options: MiddlewareOptions): {
  handler: HttpRequestHandler;
  upgradeHandler: UpgradeHandler;
  server: (httpServer: Server) => void;
} {
  const handler = createHttpHandler(options);
  const upgradeHandler = createUpgradeHandler(options);

  return {
    handler,
    upgradeHandler,
    server: (httpServer: Server) => {
      httpServer.on("upgrade", upgradeHandler);
    },
  };
}
