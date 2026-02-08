/**
 * Fastify plugin for proxying Deepgram API requests.
 *
 * @packageDocumentation
 *
 * **Peer Dependencies Required:**
 * ```bash
 * npm install fastify fastify-plugin
 * # or
 * pnpm add fastify fastify-plugin
 * ```
 *
 * This module provides a Fastify plugin for proxying requests to the Deepgram API,
 * including REST endpoints and WebSocket connections.
 */

import type { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { ProxyHandler } from "../core/ProxyHandler.js";
import { TokenManager } from "../core/TokenManager.js";
import { WebSocketProxy } from "../core/WebSocketProxy.js";
import type { MiddlewareOptions } from "../core/types.js";

// Lazy-load fastify-plugin
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic loading
let fp: any = null;

async function loadFastifyPlugin(): Promise<any> {
  if (fp) {
    return fp;
  }
  try {
    const module = await import("fastify-plugin");
    fp = module.default || module;
    return fp;
  } catch {
    throw new Error(
      "fastify-plugin is required for Fastify middleware. Install it with: npm install fastify-plugin"
    );
  }
}

/**
 * Fastify plugin options
 */
export interface FastifyDeepgramProxyOptions
  extends MiddlewareOptions,
    FastifyPluginOptions {
  /** URL prefix for the proxy routes (default: "") */
  prefix?: string;
}

/**
 * Fastify plugin for proxying Deepgram API requests
 *
 * @param fastify - Fastify instance
 * @param options - Plugin configuration options
 *
 * @example
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
 */
const fastifyDeepgramProxyPlugin: FastifyPluginAsync<FastifyDeepgramProxyOptions> =
  async (fastify, options) => {
    const proxyHandler = new ProxyHandler(options);
    const tokenManager = options.enableTokenAuth
      ? new TokenManager(options)
      : null;
    const wsProxy = new WebSocketProxy(options);

    // NOTE: We do NOT add a custom content type parser here because:
    // 1. fastify-plugin breaks encapsulation, so it would affect ALL routes
    // 2. We handle body reconstruction in our route handlers instead
    // This allows users to use their own body parsers for their routes

    // Register token endpoint if token auth is enabled
    if (tokenManager) {
      fastify.get("/token", (request, reply) => {
        reply.hijack();
        tokenManager.handleTokenRequest(request.raw, reply.raw).catch((error) => {
          console.error("Token generation error:", error);
        });
      });
    }

    // Register wildcard route to catch ALL paths
    // This must match any path depth: /, /v1, /v1/listen, /v1/listen/more/paths
    fastify.all("/*", (request, reply) => {
      reply.hijack();

      // Fastify has already consumed the request body stream, so we need to
      // write the parsed body back to the raw request
      if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        const bodyString = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);

        // Write the body to the raw request stream
        process.nextTick(() => {
          request.raw.emit('data', Buffer.from(bodyString));
          request.raw.emit('end');
        });
      }

      proxyHandler.handleRequest(request.raw, reply.raw).catch((error) => {
        console.error("[Fastify] Proxy error:", error);
      });
    });

    // Also catch root path explicitly
    fastify.all("/", (request, reply) => {
      reply.hijack();

      // Reconstruct body if needed
      if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        const bodyString = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
        process.nextTick(() => {
          request.raw.emit('data', Buffer.from(bodyString));
          request.raw.emit('end');
        });
      }

      proxyHandler.handleRequest(request.raw, reply.raw).catch((error) => {
        console.error("[Fastify] Root proxy error:", error);
      });
    });

    // Register WebSocket upgrade handler
    if (fastify.server) {
      const prefix = options.prefix ?? "";
      fastify.server.on("upgrade", (req, socket, head) => {
        // Only handle requests matching our prefix
        if (req.url?.startsWith(prefix)) {
          // Remove prefix from URL before proxying
          const originalUrl = req.url;
          req.url = originalUrl.slice(prefix.length);
          wsProxy.handleUpgrade(req, socket, head);
        }
      });
    }
  };

/**
 * Lazy-loaded Fastify plugin (only loads fastify-plugin when called)
 */
let _fastifyDeepgramProxy: FastifyPluginAsync<FastifyDeepgramProxyOptions> | null = null;

/**
 * Export as Fastify plugin with proper typing
 */
export const fastifyDeepgramProxy: FastifyPluginAsync<FastifyDeepgramProxyOptions> = async (fastify, options) => {
  if (!_fastifyDeepgramProxy) {
    const pluginWrapper = await loadFastifyPlugin();
    _fastifyDeepgramProxy = pluginWrapper(fastifyDeepgramProxyPlugin, {
      fastify: ">=4.0.0",
      name: "@deepgram/sdk-middleware",
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Guaranteed to be set above
  return _fastifyDeepgramProxy!(fastify, options);
};

/**
 * Alternative export for direct usage (without fastify-plugin wrapper)
 */
export const deepgramProxyPlugin: FastifyPluginAsync<FastifyDeepgramProxyOptions> = fastifyDeepgramProxyPlugin;
