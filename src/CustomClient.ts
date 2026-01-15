import { DeepgramClient } from "./Client";
import { ReconnectingWebSocket } from "./core/websocket/ws.js";
import type { AgentClient } from "./api/resources/agent/client/Client.js";
import type { ListenClient } from "./api/resources/listen/client/Client.js";
import type { SpeakClient } from "./api/resources/speak/client/Client.js";
import { AgentClient as AgentClientImpl } from "./api/resources/agent/client/Client.js";
import { ListenClient as ListenClientImpl } from "./api/resources/listen/client/Client.js";
import { SpeakClient as SpeakClientImpl } from "./api/resources/speak/client/Client.js";
import { V1Client as AgentV1Client } from "./api/resources/agent/resources/v1/client/Client.js";
import { V1Client as ListenV1Client } from "./api/resources/listen/resources/v1/client/Client.js";
import { V2Client as ListenV2Client } from "./api/resources/listen/resources/v2/client/Client.js";
import { V1Client as SpeakV1Client } from "./api/resources/speak/resources/v1/client/Client.js";
import { V1Socket as AgentV1Socket } from "./api/resources/agent/resources/v1/client/Socket.js";
import { V1Socket as ListenV1Socket } from "./api/resources/listen/resources/v1/client/Socket.js";
import { V2Socket as ListenV2Socket } from "./api/resources/listen/resources/v2/client/Socket.js";
import { V1Socket as SpeakV1Socket } from "./api/resources/speak/resources/v1/client/Socket.js";
import { mergeHeaders } from "./core/headers.js";
import { fromJson } from "./core/json.js";
import * as core from "./core/index.js";
import * as environments from "./environments.js";
import { RUNTIME } from "./core/runtime/index.js";

// Default WebSocket connection timeout in milliseconds
const DEFAULT_CONNECTION_TIMEOUT_MS = 10000;

// Import ws library for Node.js (will be undefined in browser)
let NodeWebSocket: any;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    NodeWebSocket = require("ws");
    // Handle both default export and named export
    NodeWebSocket = NodeWebSocket.WebSocket || NodeWebSocket.default || NodeWebSocket;
} catch {
    // ws not available (e.g., in browser)
    NodeWebSocket = undefined;
}

// Helper function to generate UUID that works in both Node.js and browser
function generateUUID(): string {
    // Try global crypto.randomUUID first (works in both Node.js 14.18+ and modern browsers)
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    
    // Fallback for Node.js: use the crypto module
    if (RUNTIME.type === "node") {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const nodeCrypto = require("crypto");
            return nodeCrypto.randomUUID();
        } catch {
            // Fallback if crypto module is not available
        }
    }
    
    // Final fallback: manual UUID generation (RFC4122 version 4)
    // This should work everywhere but is less secure than crypto.randomUUID()
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Wrapper auth provider that adds "Token " prefix to API keys.
 * The auto-generated HeaderAuthProvider doesn't add the prefix, so we wrap it here.
 */
class ApiKeyAuthProviderWrapper implements core.AuthProvider {
    private readonly originalProvider: core.AuthProvider;

    constructor(originalProvider: core.AuthProvider) {
        this.originalProvider = originalProvider;
    }

    public async getAuthRequest(arg?: { endpointMetadata?: core.EndpointMetadata }): Promise<core.AuthRequest> {
        const authRequest = await this.originalProvider.getAuthRequest(arg);
        const authHeader = authRequest.headers?.Authorization || authRequest.headers?.authorization;
        
        // If the header doesn't already have a scheme prefix, add "Token " prefix for API keys
        if (authHeader && typeof authHeader === "string") {
            // Only add prefix if it doesn't already have Bearer or Token prefix
            if (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("Token ") && !authHeader.startsWith("token ")) {
                return {
                    headers: {
                        ...authRequest.headers,
                        Authorization: `Token ${authHeader}`,
                    },
                };
            }
        }
        
        return authRequest;
    }
}

/**
 * Wrapper auth provider that checks for accessToken first (Bearer scheme)
 * before falling back to the original auth provider (Token scheme for API keys).
 */
class AccessTokenAuthProviderWrapper implements core.AuthProvider {
    private readonly originalProvider: core.AuthProvider;
    private readonly accessToken?: core.Supplier<string | undefined>;

    constructor(originalProvider: core.AuthProvider, accessToken?: core.Supplier<string | undefined>) {
        this.originalProvider = originalProvider;
        this.accessToken = accessToken;
    }

    public async getAuthRequest(arg?: { endpointMetadata?: core.EndpointMetadata }): Promise<core.AuthRequest> {
        // Check for access token first (highest priority)
        // Access tokens use Bearer scheme, API keys use Token scheme
        const accessToken = (await core.Supplier.get(this.accessToken)) ?? process.env?.DEEPGRAM_ACCESS_TOKEN;
        if (accessToken != null) {
            return {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
        }

        // Fall back to original provider (which handles API keys)
        return this.originalProvider.getAuthRequest(arg);
    }
}

/**
 * Custom wrapper around DeepgramClient that ensures the custom websocket implementation
 * from ws.ts is always used, even if the auto-generated code changes.
 */
export class CustomDeepgramClient extends DeepgramClient {
    private _customAgent: AgentClient | undefined;
    private _customListen: ListenClient | undefined;
    private _customSpeak: SpeakClient | undefined;
    private readonly _sessionId: string;

    constructor(options: DeepgramClient.Options & { accessToken?: core.Supplier<string | undefined> } = {}) {
        // Generate a UUID for the session ID
        const sessionId = generateUUID();
        
        // Add the session ID to headers so it's included in all REST requests
        const optionsWithSessionId: DeepgramClient.Options = {
            ...options,
            headers: {
                ...options.headers,
                "x-deepgram-session-id": sessionId,
            },
        };
        
        super(optionsWithSessionId);
        this._sessionId = sessionId;

        // Always wrap the auth provider to add "Token " prefix to API keys
        // The auto-generated HeaderAuthProvider doesn't add the prefix
        (this._options as any).authProvider = new ApiKeyAuthProviderWrapper(this._options.authProvider);

        // Wrap again to handle accessToken if provided
        // This ensures accessToken takes priority over apiKey/env var
        if (options.accessToken != null) {
            (this._options as any).authProvider = new AccessTokenAuthProviderWrapper(
                this._options.authProvider,
                options.accessToken
            );
        }
    }

    /**
     * Get the session ID that was generated for this client instance.
     */
    public get sessionId(): string {
        return this._sessionId;
    }

    /**
     * Override the agent getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    public get agent(): AgentClient {
        if (!this._customAgent) {
            // Create a wrapper that ensures custom websocket is used
            this._customAgent = new WrappedAgentClient(this._options);
        }
        return this._customAgent;
    }

    /**
     * Override the listen getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    public get listen(): ListenClient {
        if (!this._customListen) {
            // Create a wrapper that ensures custom websocket is used
            this._customListen = new WrappedListenClient(this._options);
        }
        return this._customListen;
    }

    /**
     * Override the speak getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    public get speak(): SpeakClient {
        if (!this._customSpeak) {
            // Create a wrapper that ensures custom websocket is used
            this._customSpeak = new WrappedSpeakClient(this._options);
        }
        return this._customSpeak;
    }
}

/**
 * Wrapper for AgentClient that ensures custom websocket implementation is used.
 *
 * This wrapper exists to guarantee that our custom WebSocket implementation
 * (from ws.ts) continues to be used even after the SDK code is auto-generated
 * by Fern. Without this wrapper, Fern regeneration could overwrite the client
 * with a different WebSocket implementation.
 */
class WrappedAgentClient extends AgentClientImpl {
    public get v1() {
        return new WrappedAgentV1Client(this._options);
    }
}

/**
 * Wrapper for ListenClient that ensures custom websocket implementation is used.
 *
 * This wrapper exists to guarantee that our custom WebSocket implementation
 * (from ws.ts) continues to be used even after the SDK code is auto-generated
 * by Fern. Without this wrapper, Fern regeneration could overwrite the client
 * with a different WebSocket implementation.
 */
class WrappedListenClient extends ListenClientImpl {
    public get v1() {
        return new WrappedListenV1Client(this._options);
    }

    public get v2() {
        return new WrappedListenV2Client(this._options);
    }
}

/**
 * Wrapper for SpeakClient that ensures custom websocket implementation is used.
 *
 * This wrapper exists to guarantee that our custom WebSocket implementation
 * (from ws.ts) continues to be used even after the SDK code is auto-generated
 * by Fern. Without this wrapper, Fern regeneration could overwrite the client
 * with a different WebSocket implementation.
 */
class WrappedSpeakClient extends SpeakClientImpl {
    public get v1() {
        return new WrappedSpeakV1Client(this._options);
    }
}

/**
 * Helper function to resolve Suppliers in headers to their actual values.
 */
async function resolveHeaders(headers: Record<string, unknown>): Promise<Record<string, unknown>> {
    const resolved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(headers)) {
        if (value == null) {
            continue;
        }
        // Resolve Supplier if it's a Supplier, otherwise use the value directly
        const resolvedValue = await core.Supplier.get(value as any);
        if (resolvedValue != null) {
            resolved[key] = resolvedValue;
        }
    }
    return resolved;
}

/**
 * Helper function to get WebSocket class and handle headers/protocols based on runtime.
 * In Node.js, use the 'ws' library which supports headers.
 * In browser, use Sec-WebSocket-Protocol for authentication since headers aren't supported.
 */
function getWebSocketOptions(headers: Record<string, unknown>): { 
    WebSocket?: any; 
    headers?: Record<string, unknown>; 
    protocols?: string[];
} {
    const options: { WebSocket?: any; headers?: Record<string, unknown>; protocols?: string[] } = {};
    
    // Check if we're in a browser environment (browser or web-worker)
    const isBrowser = RUNTIME.type === "browser" || RUNTIME.type === "web-worker";
    
    // Extract session ID header
    const sessionIdHeader = headers["x-deepgram-session-id"] || headers["X-Deepgram-Session-Id"];
    
    // In Node.js, ensure we use the 'ws' library which supports headers
    if (RUNTIME.type === "node" && NodeWebSocket) {
        options.WebSocket = NodeWebSocket;
        options.headers = headers;
    } else if (isBrowser) {
        // In browser, native WebSocket doesn't support custom headers
        // Extract Authorization header and use Sec-WebSocket-Protocol instead
        const authHeader = headers.Authorization || headers.authorization;
        const browserHeaders: Record<string, unknown> = { ...headers };
        
        // Remove Authorization and session ID from headers since they won't work in browser
        delete browserHeaders.Authorization;
        delete browserHeaders.authorization;
        delete browserHeaders["x-deepgram-session-id"];
        delete browserHeaders["X-Deepgram-Session-Id"];
        
        options.headers = browserHeaders;
        
        // Build protocols array for browser WebSocket
        const protocols: string[] = [];
        
        // If we have an Authorization header, extract the token and format as protocols
        // Deepgram expects:
        // - For API keys: Sec-WebSocket-Protocol: token,API_KEY_GOES_HERE
        // - For Bearer tokens: Sec-WebSocket-Protocol: bearer,TOKEN_GOES_HERE
        // The comma separates multiple protocols, so we pass them as an array
        if (authHeader && typeof authHeader === "string") {
            if (authHeader.startsWith("Token ")) {
                // API key: "Token API_KEY" -> ["token", "API_KEY"]
                const apiKey = authHeader.substring(6); // Remove "Token " prefix
                protocols.push("token", apiKey);
            } else if (authHeader.startsWith("Bearer ")) {
                // Access token: "Bearer TOKEN" -> ["bearer", "TOKEN"]
                const token = authHeader.substring(7); // Remove "Bearer " prefix
                protocols.push("bearer", token);
            } else {
                // Fallback: use the entire header value if it doesn't match expected format
                protocols.push(authHeader);
            }
        }
        
        // Add session ID as a protocol for browser WebSocket
        if (sessionIdHeader && typeof sessionIdHeader === "string") {
            protocols.push("x-deepgram-session-id", sessionIdHeader);
        }
        
        if (protocols.length > 0) {
            options.protocols = protocols;
        }
    } else {
        // Fallback for other environments
        options.headers = headers;
    }
    
    return options;
}

/**
 * Helper function to setup binary-aware message handling for WebSocket sockets.
 * Handles both text (JSON) and binary messages correctly.
 */
function setupBinaryHandling(socket: ReconnectingWebSocket, eventHandlers: { message?: (data: any) => void }): (event: MessageEvent) => void {
    const binaryAwareHandler = (event: MessageEvent) => {
        // Handle both text (JSON) and binary messages
        if (typeof event.data === "string") {
            try {
                const data = fromJson(event.data);
                eventHandlers.message?.(data);
            } catch (error) {
                // If JSON parsing fails, pass the raw string
                eventHandlers.message?.(event.data);
            }
        } else {
            // Binary data - pass through as-is
            eventHandlers.message?.(event.data);
        }
    };

    // Remove the original handler and add our binary-aware one
    const socketAny = socket as any;
    if (socketAny._listeners?.message) {
        // Remove all message listeners
        socketAny._listeners.message.forEach((listener: any) => {
            socket.removeEventListener("message", listener);
        });
    }
    
    // Add our binary-aware handler
    socket.addEventListener("message", binaryAwareHandler);
    
    return binaryAwareHandler;
}

/**
 * Helper function to reset socket connection state before connecting.
 * Ensures _connectLock is reset if the socket is in CLOSED state.
 */
function resetSocketConnectionState(socket: ReconnectingWebSocket): void {
    if (socket.readyState === socket.CLOSED) {
        // Force a fresh reconnect to ensure _connectLock is reset
        (socket as any)._connectLock = false;
        (socket as any)._shouldReconnect = true;
    }
}

/**
 * Helper function to create a WebSocket connection with common setup logic.
 * Handles authentication, header merging, and WebSocket configuration.
 * This reduces duplication across all Wrapped*Client classes.
 */
async function createWebSocketConnection({
    options,
    urlPath,
    environmentKey,
    queryParams,
    headers,
    debug,
    reconnectAttempts,
}: {
    options: DeepgramClient.Options;
    urlPath: string;
    environmentKey: 'agent' | 'production';
    queryParams: Record<string, string | string[] | object | object[] | null>;
    headers?: Record<string, unknown>;
    debug?: boolean;
    reconnectAttempts?: number;
}): Promise<ReconnectingWebSocket> {
    // Get Authorization from authProvider (cast to any to access internal property)
    const authRequest = await (options as any).authProvider?.getAuthRequest();

    // Merge headers from options (which includes session ID), auth headers, and request headers
    const mergedHeaders = mergeHeaders(
        options.headers ?? {},
        authRequest?.headers ?? {},
        headers,
    );

    // Resolve any Suppliers in headers to actual values
    const _headers = await resolveHeaders(mergedHeaders);

    // Get WebSocket options with proper header handling
    const wsOptions = getWebSocketOptions(_headers);

    // Get the appropriate base URL for the environment
    const baseUrl = (await core.Supplier.get(options.baseUrl)) ??
        (
            (await core.Supplier.get(options.environment)) ??
            environments.DeepgramEnvironment.Production
        )[environmentKey];

    // Create and return the ReconnectingWebSocket
    return new ReconnectingWebSocket({
        url: core.url.join(baseUrl, urlPath),
        protocols: wsOptions.protocols ?? [],
        queryParameters: queryParams,
        headers: wsOptions.headers,
        options: {
            WebSocket: wsOptions.WebSocket,
            debug: debug ?? false,
            maxRetries: reconnectAttempts ?? 30,
            startClosed: true,
            connectionTimeout: DEFAULT_CONNECTION_TIMEOUT_MS,
        },
    });
}

/**
 * Wrapper for Agent V1Client that overrides connect to use custom websocket.
 *
 * This wrapper ensures that the connect() method uses our custom ReconnectingWebSocket
 * implementation instead of any auto-generated WebSocket handling. This guarantees
 * consistent behavior across Fern regenerations and allows us to customize
 * connection setup, authentication, and header handling.
 */
class WrappedAgentV1Client extends AgentV1Client {
    public async connect(args: Omit<AgentV1Client.ConnectArgs, "Authorization"> & { Authorization?: string } = {}): Promise<AgentV1Socket> {
        const { headers, debug, reconnectAttempts } = args;

        // Use shared connection helper
        const socket = await createWebSocketConnection({
            options: this._options,
            urlPath: "/v1/agent/converse",
            environmentKey: 'agent',
            queryParams: {},
            headers,
            debug,
            reconnectAttempts,
        });

        return new WrappedAgentV1Socket({ socket });
    }
}

/**
 * Wrapper for Agent V1Socket that handles binary messages correctly.
 *
 * This wrapper ensures that both text (JSON) and binary WebSocket messages are
 * handled properly. The auto-generated socket class may not handle binary data
 * correctly, so we override the message handling to support both formats.
 * This is critical for audio and other binary data streaming.
 */
class WrappedAgentV1Socket extends AgentV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: AgentV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        this.binaryAwareHandler = setupBinaryHandling(this.socket, (this as any).eventHandlers);
    }

    public connect(): WrappedAgentV1Socket {
        resetSocketConnectionState(this.socket);
        super.connect();
        // Re-setup binary handling in case connect() re-registered handlers
        this.setupBinaryHandling();
        return this;
    }
}

/**
 * Wrapper for Listen V1Client that overrides connect to use custom websocket.
 *
 * This wrapper ensures that the connect() method uses our custom ReconnectingWebSocket
 * implementation instead of any auto-generated WebSocket handling. This guarantees
 * consistent behavior across Fern regenerations and allows us to customize
 * connection setup, authentication, and header handling.
 */
class WrappedListenV1Client extends ListenV1Client {
    public async connect(args: Omit<ListenV1Client.ConnectArgs, "Authorization"> & { Authorization?: string }): Promise<ListenV1Socket> {
        // Extract all the args (same as the original implementation)
        const {
            callback,
            callback_method: callbackMethod,
            channels,
            diarize,
            dictation,
            encoding,
            endpointing,
            extra,
            interim_results: interimResults,
            keyterm,
            keywords,
            language,
            mip_opt_out: mipOptOut,
            model,
            multichannel,
            numerals,
            profanity_filter: profanityFilter,
            punctuate,
            redact,
            replace,
            sample_rate: sampleRate,
            search,
            smart_format: smartFormat,
            tag,
            utterance_end_ms: utteranceEndMs,
            vad_events: vadEvents,
            version,
            headers,
            debug,
            reconnectAttempts,
        } = args;

        // Build query params (same as original)
        const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
        if (callback != null) _queryParams.callback = callback;
        if (callbackMethod != null) _queryParams.callback_method = callbackMethod;
        if (channels != null) _queryParams.channels = channels;
        if (diarize != null) _queryParams.diarize = diarize;
        if (dictation != null) _queryParams.dictation = dictation;
        if (encoding != null) _queryParams.encoding = encoding;
        if (endpointing != null) _queryParams.endpointing = endpointing;
        if (extra != null) _queryParams.extra = extra;
        if (interimResults != null) _queryParams.interim_results = interimResults;
        if (keyterm != null) _queryParams.keyterm = keyterm;
        if (keywords != null) _queryParams.keywords = keywords;
        if (language != null) _queryParams.language = language;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        _queryParams.model = model;
        if (multichannel != null) _queryParams.multichannel = multichannel;
        if (numerals != null) _queryParams.numerals = numerals;
        if (profanityFilter != null) _queryParams.profanity_filter = profanityFilter;
        if (punctuate != null) _queryParams.punctuate = punctuate;
        if (redact != null) _queryParams.redact = redact;
        if (replace != null) _queryParams.replace = replace;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;
        if (search != null) _queryParams.search = search;
        if (smartFormat != null) _queryParams.smart_format = smartFormat;
        if (tag != null) _queryParams.tag = tag;
        if (utteranceEndMs != null) _queryParams.utterance_end_ms = utteranceEndMs;
        if (vadEvents != null) _queryParams.vad_events = vadEvents;
        if (version != null) _queryParams.version = version;

        // Use shared connection helper
        const socket = await createWebSocketConnection({
            options: this._options,
            urlPath: "/v1/listen",
            environmentKey: 'production',
            queryParams: _queryParams,
            headers,
            debug,
            reconnectAttempts,
        });

        return new WrappedListenV1Socket({ socket });
    }
}

/**
 * Wrapper for Listen V1Socket that handles binary messages correctly.
 *
 * This wrapper ensures that both text (JSON) and binary WebSocket messages are
 * handled properly. The auto-generated socket class may not handle binary data
 * correctly, so we override the message handling to support both formats.
 * This is critical for audio and other binary data streaming.
 */
class WrappedListenV1Socket extends ListenV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: ListenV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        this.binaryAwareHandler = setupBinaryHandling(this.socket, (this as any).eventHandlers);
    }

    public connect(): WrappedListenV1Socket {
        resetSocketConnectionState(this.socket);
        super.connect();
        this.setupBinaryHandling();
        return this;
    }
}

/**
 * Wrapper for Listen V2Client that overrides connect to use custom websocket.
 *
 * This wrapper ensures that the connect() method uses our custom ReconnectingWebSocket
 * implementation instead of any auto-generated WebSocket handling. This guarantees
 * consistent behavior across Fern regenerations and allows us to customize
 * connection setup, authentication, and header handling.
 */
class WrappedListenV2Client extends ListenV2Client {
    public async connect(args: Omit<ListenV2Client.ConnectArgs, "Authorization"> & { Authorization?: string }): Promise<ListenV2Socket> {
        const {
            model,
            encoding,
            sample_rate: sampleRate,
            eager_eot_threshold: eagerEotThreshold,
            eot_threshold: eotThreshold,
            eot_timeout_ms: eotTimeoutMs,
            keyterm,
            mip_opt_out: mipOptOut,
            tag,
            headers,
            debug,
            reconnectAttempts,
        } = args;

        const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
        _queryParams.model = model;
        if (encoding != null) _queryParams.encoding = encoding;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;
        if (eagerEotThreshold != null) _queryParams.eager_eot_threshold = eagerEotThreshold;
        if (eotThreshold != null) _queryParams.eot_threshold = eotThreshold;
        if (eotTimeoutMs != null) _queryParams.eot_timeout_ms = eotTimeoutMs;
        if (keyterm != null) _queryParams.keyterm = keyterm;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        if (tag != null) _queryParams.tag = tag;

        // Use shared connection helper
        const socket = await createWebSocketConnection({
            options: this._options,
            urlPath: "/v2/listen",
            environmentKey: 'production',
            queryParams: _queryParams,
            headers,
            debug,
            reconnectAttempts,
        });

        return new WrappedListenV2Socket({ socket });
    }
}

/**
 * Wrapper for Listen V2Socket that handles binary messages correctly and adds ping support.
 *
 * This wrapper ensures that both text (JSON) and binary WebSocket messages are
 * handled properly. The auto-generated socket class may not handle binary data
 * correctly, so we override the message handling to support both formats.
 * Additionally, this wrapper adds a ping() method for sending WebSocket ping
 * frames to keep connections alive (Node.js only).
 */
class WrappedListenV2Socket extends ListenV2Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: ListenV2Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        this.binaryAwareHandler = setupBinaryHandling(this.socket, (this as any).eventHandlers);
    }

    public connect(): WrappedListenV2Socket {
        resetSocketConnectionState(this.socket);
        super.connect();
        this.setupBinaryHandling();
        return this;
    }

    /**
     * Send a WebSocket ping frame to keep the connection alive.
     *
     * In Node.js, this uses the native WebSocket ping() method from the 'ws' library.
     * In browsers, WebSocket ping/pong is handled automatically by the browser and
     * cannot be manually triggered, so this method will throw an error.
     *
     * @param data Optional data to send with the ping (Node.js only)
     * @throws Error if not in Node.js environment or WebSocket is not connected
     */
    public ping(data?: string | Buffer): void {
        const ws = (this.socket as any)._ws;

        if (!ws) {
            throw new Error("WebSocket is not connected. Call connect() and waitForOpen() first.");
        }

        if (ws.readyState !== ws.OPEN) {
            throw new Error("WebSocket is not in OPEN state.");
        }

        // Check if we're in Node.js and the WebSocket has a ping method (from 'ws' library)
        if (RUNTIME.type === "node" && typeof ws.ping === "function") {
            // Call the native ping method from the 'ws' library
            ws.ping(data);
        } else {
            // In browsers, WebSocket ping/pong is automatic and not exposed to JavaScript
            throw new Error(
                "WebSocket ping is not supported in browser environments. " +
                "Browser WebSocket connections handle ping/pong automatically. " +
                "If you need keepalive in the browser, consider sending periodic audio data or using a timer."
            );
        }
    }
}

/**
 * Wrapper for Speak V1Client that overrides connect to use custom websocket.
 *
 * This wrapper ensures that the connect() method uses our custom ReconnectingWebSocket
 * implementation instead of any auto-generated WebSocket handling. This guarantees
 * consistent behavior across Fern regenerations and allows us to customize
 * connection setup, authentication, and header handling.
 */
class WrappedSpeakV1Client extends SpeakV1Client {
    public async connect(args: Omit<SpeakV1Client.ConnectArgs, "Authorization"> & { Authorization?: string }): Promise<SpeakV1Socket> {
        const {
            encoding,
            mip_opt_out: mipOptOut,
            model,
            sample_rate: sampleRate,
            headers,
            debug,
            reconnectAttempts,
        } = args;

        const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
        if (encoding != null) _queryParams.encoding = encoding;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        if (model != null) _queryParams.model = model;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;

        // Use shared connection helper
        const socket = await createWebSocketConnection({
            options: this._options,
            urlPath: "/v1/speak",
            environmentKey: 'production',
            queryParams: _queryParams,
            headers,
            debug,
            reconnectAttempts,
        });

        return new WrappedSpeakV1Socket({ socket });
    }
}

/**
 * Wrapper for Speak V1Socket that handles binary messages correctly.
 *
 * This wrapper ensures that both text (JSON) and binary WebSocket messages are
 * handled properly. The auto-generated socket class may not handle binary data
 * correctly, so we override the message handling to support both formats.
 * This is critical for audio and other binary data streaming.
 */
class WrappedSpeakV1Socket extends SpeakV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: SpeakV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        this.binaryAwareHandler = setupBinaryHandling(this.socket, (this as any).eventHandlers);
    }

    public connect(): WrappedSpeakV1Socket {
        resetSocketConnectionState(this.socket);
        super.connect();
        this.setupBinaryHandling();
        return this;
    }
}
