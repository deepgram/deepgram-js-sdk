/**
 * Deepgram SDK Middleware
 *
 * This module provides middleware for integrating Deepgram API proxying
 * into Node.js web frameworks like Express and Fastify.
 *
 * ## Features
 * - Server-side API key injection (hide keys from clients)
 * - Temporary token generation (client requests token, uses it temporarily)
 * - WebSocket proxying for Live/Agent APIs
 * - Framework integration (Raw Node.js, Express, Fastify)
 *
 * @example Express
 * ```typescript
 * import express from 'express';
 * import { createDeepgramProxy, createWebSocketHandler } from '@deepgram/sdk';
 *
 * const app = express();
 * const options = {
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * };
 *
 * app.use('/api/deepgram', createDeepgramProxy(options));
 *
 * const server = app.listen(3000);
 * server.on('upgrade', createWebSocketHandler(options));
 * ```
 *
 * @example Fastify
 * ```typescript
 * import Fastify from 'fastify';
 * import { fastifyDeepgramProxy } from '@deepgram/sdk';
 *
 * const fastify = Fastify();
 *
 * fastify.register(fastifyDeepgramProxy, {
 *   prefix: '/api/deepgram',
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   enableTokenAuth: true
 * });
 *
 * fastify.listen({ port: 3000 });
 * ```
 *
 * @packageDocumentation
 */

// Core types
export type { MiddlewareOptions, TokenRequest, TokenResponse } from "./core/types.js";

// Raw Node.js HTTP/HTTPS adapter (no dependencies)
export {
  createHttpHandler,
  createUpgradeHandler as createHttpUpgradeHandler,
  createDeepgramHttpServer,
  type HttpRequestHandler,
  type UpgradeHandler as HttpUpgradeHandler,
} from "./adapters/http.js";

// Express adapter
export {
  createDeepgramProxy,
  createDeepgramMiddleware,
  createWebSocketHandler,
  type ExpressMiddleware,
  type UpgradeHandler,
} from "./adapters/express.js";

// Fastify adapter
export {
  fastifyDeepgramProxy,
  deepgramProxyPlugin,
  type FastifyDeepgramProxyOptions,
} from "./adapters/fastify.js";

// JWT token management
export {
  createProxyToken,
  verifyProxyToken,
  type ProxyTokenOptions,
  type ProxyTokenPayload,
} from "./core/jwt.js";

// Core classes (for advanced usage)
export { ProxyHandler } from "./core/ProxyHandler.js";
export { TokenManager } from "./core/TokenManager.js";
export { WebSocketProxy } from "./core/WebSocketProxy.js";
