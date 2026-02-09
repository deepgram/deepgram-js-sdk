import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import { URL } from "node:url";
import WebSocket from "ws";

import type { MiddlewareOptions } from "./types.js";
import { verifyProxyToken } from "./jwt.js";

/**
 * Handles WebSocket proxying to Deepgram API
 */
export class WebSocketProxy {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly tokenMode: "deepgram" | "jwt";

  constructor(options: MiddlewareOptions) {
    this.apiKey = options.apiKey;
    this.tokenMode = options.tokenMode ?? "deepgram";
    // Convert HTTP(S) base URL to WebSocket URL
    this.baseUrl = (options.baseUrl ?? "https://api.deepgram.com")
      .replace(/^https:/, "wss:")
      .replace(/^http:/, "ws:");
  }

  /**
   * Handle WebSocket upgrade request
   */
  handleUpgrade(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ): void {
    this.handleUpgradeAsync(req, socket, head).catch((error) => {
      console.error("WebSocket upgrade error:", error);
      socket.destroy();
    });
  }

  /**
   * Async version of handleUpgrade to support JWT verification
   */
  private async handleUpgradeAsync(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ): Promise<void> {
    try {
      // Build Deepgram WebSocket URL
      const targetUrl = this.buildWebSocketUrl(req);

      // Prepare headers (may verify JWT)
      const headers = await this.prepareHeaders(req);

      // Connect to Deepgram WebSocket
      const deepgramSocket = new WebSocket(targetUrl, { headers });

      // Handle connection open
      deepgramSocket.on("open", () => {
        // Complete the client upgrade
        socket.write(
          "HTTP/1.1 101 Switching Protocols\r\n" +
            "Upgrade: websocket\r\n" +
            "Connection: Upgrade\r\n" +
            "\r\n"
        );

        // Create client WebSocket
        const clientSocket = new WebSocket(null as never, null as never);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- WebSocket internals
        (clientSocket as any).setSocket(socket, head, { maxPayload: 100 * 1024 * 1024 });

        // Forward messages bidirectionally
        this.forwardMessages(clientSocket, deepgramSocket);
      });

      // Handle connection errors
      deepgramSocket.on("error", (error) => {
        console.error("WebSocket proxy error (Deepgram):", error);
        socket.destroy();
      });
    } catch (error) {
      console.error("WebSocket upgrade error:", error);
      throw error;
    }
  }

  /**
   * Build WebSocket URL for Deepgram
   */
  private buildWebSocketUrl(req: IncomingMessage): string {
    // Strip /api/deepgram prefix if present
    const cleanUrl = (req.url ?? "/").replace(/^\/api\/deepgram/, "");
    const url = new URL(cleanUrl, this.baseUrl);
    return url.toString();
  }

  /**
   * Prepare headers for Deepgram WebSocket connection
   */
  private async prepareHeaders(req: IncomingMessage): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // Copy relevant headers
    const allowedHeaders = [
      "user-agent",
      "x-fern-language",
      "x-fern-sdk-name",
      "x-fern-sdk-version",
      "x-deepgram-session-id",
    ];

    for (const header of allowedHeaders) {
      const value = req.headers[header];
      if (value) {
        headers[header] = Array.isArray(value) ? value[0] : value;
      }
    }

    // Authentication logic (similar to ProxyHandler)
    const clientAuth = req.headers.authorization;

    if (clientAuth && this.tokenMode === "jwt" && clientAuth.startsWith("Bearer ")) {
      const token = clientAuth.replace("Bearer ", "");
      console.log(`[WebSocketProxy] Client provided JWT token, verifying...`);

      try {
        await verifyProxyToken(token, this.apiKey);
        console.log(`[WebSocketProxy] JWT verified successfully, using server API key`);
        headers.authorization = `Token ${this.apiKey}`;
      } catch (error) {
        console.error(`[WebSocketProxy] JWT verification failed:`, error);
        throw new Error("Invalid or expired token");
      }
    } else {
      // Use server API key
      headers.authorization = `Token ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Forward WebSocket messages bidirectionally
   */
  private forwardMessages(
    clientSocket: WebSocket,
    deepgramSocket: WebSocket
  ): void {
    // Forward client messages to Deepgram
    clientSocket.on("message", (data, isBinary) => {
      if (deepgramSocket.readyState === WebSocket.OPEN) {
        deepgramSocket.send(data, { binary: isBinary });
      }
    });

    // Forward Deepgram messages to client
    deepgramSocket.on("message", (data, isBinary) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(data, { binary: isBinary });
      }
    });

    // Handle closures
    clientSocket.on("close", (code, reason) => {
      if (deepgramSocket.readyState === WebSocket.OPEN) {
        deepgramSocket.close(code, reason);
      }
    });

    deepgramSocket.on("close", (code, reason) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.close(code, reason);
      }
    });

    // Handle errors
    clientSocket.on("error", (error) => {
      console.error("WebSocket error (client):", error);
      deepgramSocket.close();
    });

    deepgramSocket.on("error", (error) => {
      console.error("WebSocket error (Deepgram):", error);
      clientSocket.close();
    });
  }
}
