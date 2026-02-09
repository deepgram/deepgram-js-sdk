import * as jose from "jose";

/**
 * Options for creating a proxy token
 */
export interface ProxyTokenOptions {
  /** Optional user or session identifier */
  identity?: string;

  /** Token time-to-live (e.g., "1h", "30m", 3600). Defaults to "1h" */
  ttl?: string | number;

  /** Optional scopes/permissions for the token */
  scopes?: string[];

  /** Optional custom metadata to include in token */
  metadata?: Record<string, unknown>;
}

/**
 * Decoded proxy token payload
 */
export interface ProxyTokenPayload {
  /** Issuer - the project ID extracted from API key */
  iss: string;

  /** Subject - optional user/session identifier */
  sub?: string;

  /** Issued at timestamp */
  iat: number;

  /** Expiration timestamp */
  exp: number;

  /** Not before timestamp */
  nbf: number;

  /** Optional scopes/permissions */
  scopes?: string[];

  /** Optional custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Creates a proxy token signed with the Deepgram API key.
 * This token should be generated on the backend and sent to browser clients.
 * The browser uses this token to connect to the proxy middleware.
 *
 * @param apiKey - Deepgram API key (used as signing secret)
 * @param options - Token configuration options
 * @returns JWT token string
 *
 * @example
 * ```typescript
 * const token = await createProxyToken(process.env.DEEPGRAM_API_KEY, {
 *   identity: 'user-123',
 *   ttl: '1h',
 *   scopes: ['listen', 'speak']
 * });
 * ```
 */
export async function createProxyToken(
  apiKey: string,
  options: ProxyTokenOptions = {}
): Promise<string> {
  const { identity, ttl = "1h", scopes, metadata } = options;

  const projectId = extractProjectId(apiKey);

  const secret = new TextEncoder().encode(apiKey);

  const payload: Record<string, unknown> = {};

  if (scopes !== undefined) {
    payload.scopes = scopes;
  }

  if (metadata !== undefined) {
    payload.metadata = metadata;
  }

  const expirationTime = typeof ttl === "number"
    ? Math.floor(Date.now() / 1000) + ttl
    : ttl;

  const jwt = new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(projectId)
    .setIssuedAt()
    .setNotBefore(new Date())
    .setExpirationTime(expirationTime);

  if (identity !== undefined) {
    jwt.setSubject(identity);
  }

  return jwt.sign(secret);
}

/**
 * Verifies a proxy token and returns the decoded payload.
 * This should be called by the proxy middleware to validate tokens from clients.
 *
 * @param token - JWT token to verify
 * @param apiKey - Deepgram API key (used to verify signature)
 * @returns Decoded token payload
 * @throws Error if token is invalid, expired, or signature doesn't match
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyProxyToken(token, process.env.DEEPGRAM_API_KEY);
 *   console.log('Valid token for user:', payload.sub);
 * } catch (error) {
 *   console.error('Invalid token:', error);
 * }
 * ```
 */
export async function verifyProxyToken(
  token: string,
  apiKey: string
): Promise<ProxyTokenPayload> {
  const secret = new TextEncoder().encode(apiKey);
  const projectId = extractProjectId(apiKey);

  const { payload } = await jose.jwtVerify(token, secret, {
    algorithms: ["HS256"],
    issuer: projectId,
  });

  return payload as ProxyTokenPayload;
}

/**
 * Extracts the project ID from a Deepgram API key.
 * API keys are formatted as: {project_id}:{secret}
 *
 * @param apiKey - Deepgram API key
 * @returns Project ID portion of the API key
 */
function extractProjectId(apiKey: string): string {
  const parts = apiKey.split(":");
  if (parts.length < 2) {
    throw new Error("Invalid API key format");
  }
  return parts[0];
}
