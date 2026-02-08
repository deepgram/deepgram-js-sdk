/**
 * Express middleware for proxying Deepgram API requests.
 *
 * @packageDocumentation
 *
 * **Peer Dependencies Required:**
 * ```bash
 * npm install express
 * # or
 * pnpm add express
 * ```
 *
 * This module provides Express-compatible middleware for proxying requests to the
 * Deepgram API, including REST endpoints and WebSocket connections.
 */

import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";

import { ProxyHandler } from "../core/ProxyHandler.js";
import { TokenManager } from "../core/TokenManager.js";
import { WebSocketProxy } from "../core/WebSocketProxy.js";
import type { MiddlewareOptions } from "../core/types.js";

/**
 * Express middleware type
 */
export type ExpressMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (error?: Error) => void
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
 * Create Express middleware for proxying Deepgram API requests
 *
 * @param options - Middleware configuration options
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createDeepgramProxy, createWebSocketHandler } from '@deepgram/sdk';
 *
 * const app = express();
 * const proxyOptions = {
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * };
 *
 * // REST API proxy
 * app.use('/api/deepgram', createDeepgramProxy(proxyOptions));
 *
 * // WebSocket upgrade handler
 * const server = app.listen(3000);
 * server.on('upgrade', createWebSocketHandler(proxyOptions));
 * ```
 */
export function createDeepgramProxy(options: MiddlewareOptions): ExpressMiddleware {
  const proxyHandler = new ProxyHandler(options);
  const tokenManager = options.enableTokenAuth
    ? new TokenManager(options)
    : null;

  return async (req, res, next) => {
    try {
      // Handle token generation requests
      if (
        options.enableTokenAuth &&
        req.url === "/token" &&
        req.method === "GET"
      ) {
        await tokenManager!.handleTokenRequest(req, res);
        return;
      }

      // Handle all other requests (proxy to Deepgram)
      await proxyHandler.handleRequest(req, res);
    } catch (error) {
      next(error instanceof Error ? error : new Error(String(error)));
    }
  };
}

/**
 * Create WebSocket upgrade handler for Express
 *
 * This must be registered on the HTTP server, not the Express app.
 *
 * @param options - Middleware configuration options
 * @returns Upgrade handler function
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createWebSocketHandler } from '@deepgram/sdk';
 *
 * const app = express();
 * const server = app.listen(3000);
 *
 * // Register WebSocket handler on the server
 * server.on('upgrade', createWebSocketHandler({
 *   apiKey: process.env.DEEPGRAM_API_KEY!
 * }));
 * ```
 */
export function createWebSocketHandler(options: MiddlewareOptions): UpgradeHandler {
  const wsProxy = new WebSocketProxy(options);

  return (req, socket, head) => {
    wsProxy.handleUpgrade(req, socket, head);
  };
}

/**
 * Combined helper that returns both middleware and upgrade handler
 *
 * @param options - Middleware configuration options
 * @returns Object with middleware and upgrade handler
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createDeepgramMiddleware } from '@deepgram/sdk';
 *
 * const app = express();
 * const { middleware, upgradeHandler } = createDeepgramMiddleware({
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * });
 *
 * app.use('/api/deepgram', middleware);
 *
 * const server = app.listen(3000);
 * server.on('upgrade', upgradeHandler);
 * ```
 */
export function createDeepgramMiddleware(options: MiddlewareOptions): {
  middleware: ExpressMiddleware;
  upgradeHandler: UpgradeHandler;
  server: (httpServer: Server) => void;
} {
  const middleware = createDeepgramProxy(options);
  const upgradeHandler = createWebSocketHandler(options);

  return {
    middleware,
    upgradeHandler,
    server: (httpServer: Server) => {
      httpServer.on("upgrade", upgradeHandler);
    },
  };
}
