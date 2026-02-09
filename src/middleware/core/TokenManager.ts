import type { IncomingMessage, ServerResponse } from "node:http";

import { CustomDeepgramClient as DeepgramClient } from "../../CustomClient.js";
import type { MiddlewareOptions, TokenRequest, TokenResponse } from "./types.js";
import { createProxyToken } from "./jwt.js";

/**
 * Manages temporary token generation for client authentication
 */
export class TokenManager {
  private readonly client: DeepgramClient;
  private readonly apiKey: string;
  private readonly tokenMode: "deepgram" | "jwt";
  private readonly defaultExpiration: number;

  constructor(options: MiddlewareOptions) {
    this.client = new DeepgramClient({ apiKey: options.apiKey });
    this.apiKey = options.apiKey;
    this.tokenMode = options.tokenMode ?? "deepgram";
    this.defaultExpiration = options.defaultTokenExpiration ?? 3600;
  }

  /**
   * Generate a temporary access token
   * Uses either Deepgram's native token API or JWT signing based on tokenMode
   */
  async generateToken(ttlSeconds: number): Promise<string> {
    if (this.tokenMode === "jwt") {
      return createProxyToken(this.apiKey, { ttl: ttlSeconds });
    }

    const response = await this.client.auth.v1.tokens.grant({
      ttl_seconds: ttlSeconds,
    });

    return response.access_token;
  }

  /**
   * Handle token generation request from client
   */
  async handleTokenRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    try {
      // Parse request body
      const body = await this.parseBody(req);
      const tokenRequest: TokenRequest = body;

      // Generate token with requested or default TTL
      const ttlSeconds = tokenRequest.ttlSeconds ?? this.defaultExpiration;

      const token = await this.generateToken(ttlSeconds);

      // Send response
      const response: TokenResponse = {
        token,
        expiresIn: ttlSeconds,
      };

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end(JSON.stringify(response));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Parse JSON request body
   */
  private async parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error("Invalid JSON in request body"));
        }
      });
      req.on("error", reject);
    });
  }

  /**
   * Handle errors and send appropriate response
   */
  private handleError(error: unknown, res: ServerResponse): void {
    console.error("TokenManager error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";
    const statusCode = message.includes("Invalid JSON") ? 400 : 500;

    res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(
      JSON.stringify({
        error: message,
      })
    );
  }
}
