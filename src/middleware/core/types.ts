/**
 * Options for configuring the Deepgram proxy middleware
 */
export interface MiddlewareOptions {
  /** Deepgram API key for server-side authentication */
  apiKey: string;

  /** Enable temporary token generation endpoint (GET /token) */
  enableTokenAuth?: boolean;

  /** Custom Deepgram API base URL (e.g., for EU endpoint) */
  baseUrl?: string;

  /** Default token expiration in seconds (default: 3600 = 1 hour) */
  defaultTokenExpiration?: number;
}

/**
 * Request body for token generation
 */
export interface TokenRequest {
  /** Token time-to-live in seconds */
  ttlSeconds?: number;
}

/**
 * Response from token generation
 */
export interface TokenResponse {
  /** The generated access token */
  token: string;

  /** Token expiration time in seconds */
  expiresIn: number;
}
