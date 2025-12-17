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
import { mergeHeaders, mergeOnlyDefinedHeaders } from "./core/headers.js";
import { fromJson } from "./core/json.js";
import * as core from "./core/index.js";
import * as environments from "./environments.js";
import { RUNTIME } from "./core/runtime/index.js";

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

/**
 * Custom wrapper around DeepgramClient that ensures the custom websocket implementation
 * from ws.ts is always used, even if the auto-generated code changes.
 */
export class CustomDeepgramClient extends DeepgramClient {
    private _customAgent: AgentClient | undefined;
    private _customListen: ListenClient | undefined;
    private _customSpeak: SpeakClient | undefined;

    constructor(options: DeepgramClient.Options = {}) {
        super(options);
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
 */
class WrappedAgentClient extends AgentClientImpl {
    public get v1() {
        return new WrappedAgentV1Client(this._options);
    }
}

/**
 * Wrapper for ListenClient that ensures custom websocket implementation is used.
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
 */
class WrappedSpeakClient extends SpeakClientImpl {
    public get v1() {
        return new WrappedSpeakV1Client(this._options);
    }
}

/**
 * Helper function to get WebSocket class and handle headers based on runtime.
 * In Node.js, use the 'ws' library which supports headers.
 * In browser, use native WebSocket (headers will be ignored but that's okay).
 */
function getWebSocketOptions(headers: Record<string, unknown>): { WebSocket?: any; headers?: Record<string, unknown> } {
    const options: { WebSocket?: any; headers?: Record<string, unknown> } = {};
    
    // In Node.js, ensure we use the 'ws' library which supports headers
    if (RUNTIME.type === "node" && NodeWebSocket) {
        options.WebSocket = NodeWebSocket;
        options.headers = headers;
    } else {
        // In browser or if ws is not available, native WebSocket doesn't support headers in constructor
        // But we still pass them - they'll be ignored, which is fine
        // The ws.ts implementation will handle this gracefully
        options.headers = headers;
    }
    
    return options;
}

/**
 * Wrapper for Agent V1Client that overrides connect to use custom websocket.
 */
class WrappedAgentV1Client extends AgentV1Client {
    public async connect(args: Omit<AgentV1Client.ConnectArgs, "Authorization"> & { Authorization?: string } = {}): Promise<AgentV1Socket> {
        const { headers, debug, reconnectAttempts } = args;
        
        // Get Authorization from authProvider (matching the working version)
        const authRequest = await this._options.authProvider?.getAuthRequest();
        const _headers: Record<string, unknown> = mergeHeaders(
            authRequest?.headers ?? {},
            headers,
        );
        
        // Get WebSocket options with proper header handling
        const wsOptions = getWebSocketOptions(_headers);
        
        // Explicitly use the custom ReconnectingWebSocket from ws.ts
        const socket = new ReconnectingWebSocket({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.DeepgramEnvironment.Production
                    ).agent,
                "/v1/agent/converse",
            ),
            protocols: [],
            queryParameters: {},
            headers: wsOptions.headers,
            options: { 
                ...wsOptions,
                debug: debug ?? false, 
                maxRetries: reconnectAttempts ?? 30,
                startClosed: true,
                connectionTimeout: 10000, // Increase timeout to 10 seconds
            },
        });
        return new WrappedAgentV1Socket({ socket });
    }
}

/**
 * Wrapper for Agent V1Socket that handles binary messages correctly.
 */
class WrappedAgentV1Socket extends AgentV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: AgentV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        // Create a binary-aware message handler
        this.binaryAwareHandler = (event: MessageEvent) => {
            // Handle both text (JSON) and binary messages
            if (typeof event.data === "string") {
                try {
                    const data = fromJson(event.data);
                    (this as any).eventHandlers.message?.(data);
                } catch (error) {
                    // If JSON parsing fails, pass the raw string
                    (this as any).eventHandlers.message?.(event.data);
                }
            } else {
                // Binary data - pass through as-is
                (this as any).eventHandlers.message?.(event.data);
            }
        };

        // Remove the original handler and add our binary-aware one
        // The original handler was added in super() constructor
        // We need to replace it
        const socketAny = this.socket as any;
        if (socketAny._listeners?.message) {
            // Remove all message listeners
            socketAny._listeners.message.forEach((listener: any) => {
                this.socket.removeEventListener("message", listener);
            });
        }
        
        // Add our binary-aware handler
        if (this.binaryAwareHandler) {
            this.socket.addEventListener("message", this.binaryAwareHandler);
        }
    }

    public connect(): WrappedAgentV1Socket {
        // Ensure socket is ready to connect - if _connectLock is stuck, force reconnect
        // by closing and reconnecting
        if (this.socket.readyState === this.socket.CLOSED) {
            // Force a fresh reconnect to ensure _connectLock is reset
            (this.socket as any)._connectLock = false;
            (this.socket as any)._shouldReconnect = true;
        }
        // Call parent connect, but then ensure our binary handler is still active
        super.connect();
        // Re-setup binary handling in case connect() re-registered handlers
        this.setupBinaryHandling();
        return this;
    }
}

/**
 * Wrapper for Listen V1Client that overrides connect to use custom websocket.
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

        // Get Authorization from authProvider (matching the working version)
        const authRequest = await this._options.authProvider.getAuthRequest();
        const _headers: Record<string, unknown> = mergeHeaders(
            authRequest.headers,
            headers,
        );
        
        // Get WebSocket options with proper header handling
        const wsOptions = getWebSocketOptions(_headers);
        
        // Explicitly use the custom ReconnectingWebSocket from ws.ts
        const socket = new ReconnectingWebSocket({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.DeepgramEnvironment.Production
                    ).production,
                "/v1/listen",
            ),
            protocols: [],
            queryParameters: _queryParams,
            headers: wsOptions.headers,
            options: { 
                ...wsOptions,
                debug: debug ?? false, 
                maxRetries: reconnectAttempts ?? 30,
                startClosed: true,
                connectionTimeout: 10000, // Increase timeout to 10 seconds
            },
        });
        return new WrappedListenV1Socket({ socket });
    }
}

/**
 * Wrapper for Listen V1Socket that handles binary messages correctly.
 */
class WrappedListenV1Socket extends ListenV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: ListenV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        // Create a binary-aware message handler
        this.binaryAwareHandler = (event: MessageEvent) => {
            // Handle both text (JSON) and binary messages
            if (typeof event.data === "string") {
                try {
                    const data = fromJson(event.data);
                    (this as any).eventHandlers.message?.(data);
                } catch (error) {
                    // If JSON parsing fails, pass the raw string
                    (this as any).eventHandlers.message?.(event.data);
                }
            } else {
                // Binary data - pass through as-is
                (this as any).eventHandlers.message?.(event.data);
            }
        };

        // Remove the original handler and add our binary-aware one
        const socketAny = this.socket as any;
        if (socketAny._listeners?.message) {
            socketAny._listeners.message.forEach((listener: any) => {
                this.socket.removeEventListener("message", listener);
            });
        }
        
        if (this.binaryAwareHandler) {
            this.socket.addEventListener("message", this.binaryAwareHandler);
        }
    }

    public connect(): WrappedListenV1Socket {
        // Ensure socket is ready to connect - if _connectLock is stuck, force reconnect
        if (this.socket.readyState === this.socket.CLOSED) {
            // Force a fresh reconnect to ensure _connectLock is reset
            (this.socket as any)._connectLock = false;
            (this.socket as any)._shouldReconnect = true;
        }
        super.connect();
        this.setupBinaryHandling();
        return this;
    }
}

/**
 * Wrapper for Listen V2Client that overrides connect to use custom websocket.
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

        // Get Authorization from authProvider (matching the working version)
        const authRequest = await this._options.authProvider?.getAuthRequest();
        const _headers: Record<string, unknown> = mergeHeaders(
            authRequest?.headers ?? {},
            headers,
        );
        
        // Get WebSocket options with proper header handling
        const wsOptions = getWebSocketOptions(_headers);
        
        // Explicitly use the custom ReconnectingWebSocket from ws.ts
        const socket = new ReconnectingWebSocket({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.DeepgramEnvironment.Production
                    ).production,
                "/v2/listen",
            ),
            protocols: [],
            queryParameters: _queryParams,
            headers: wsOptions.headers,
            options: { 
                ...wsOptions,
                debug: debug ?? false, 
                maxRetries: reconnectAttempts ?? 30,
                startClosed: true,
                connectionTimeout: 10000, // Increase timeout to 10 seconds
            },
        });
        return new WrappedListenV2Socket({ socket });
    }
}

/**
 * Wrapper for Listen V2Socket that handles binary messages correctly.
 */
class WrappedListenV2Socket extends ListenV2Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: ListenV2Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        // Create a binary-aware message handler
        this.binaryAwareHandler = (event: MessageEvent) => {
            // Handle both text (JSON) and binary messages
            if (typeof event.data === "string") {
                try {
                    const data = fromJson(event.data);
                    (this as any).eventHandlers.message?.(data);
                } catch (error) {
                    // If JSON parsing fails, pass the raw string
                    (this as any).eventHandlers.message?.(event.data);
                }
            } else {
                // Binary data - pass through as-is
                (this as any).eventHandlers.message?.(event.data);
            }
        };

        // Remove the original handler and add our binary-aware one
        const socketAny = this.socket as any;
        if (socketAny._listeners?.message) {
            socketAny._listeners.message.forEach((listener: any) => {
                this.socket.removeEventListener("message", listener);
            });
        }
        
        if (this.binaryAwareHandler) {
            this.socket.addEventListener("message", this.binaryAwareHandler);
        }
    }

    public connect(): WrappedListenV2Socket {
        // Ensure socket is ready to connect - if _connectLock is stuck, force reconnect
        if (this.socket.readyState === this.socket.CLOSED) {
            // Force a fresh reconnect to ensure _connectLock is reset
            (this.socket as any)._connectLock = false;
            (this.socket as any)._shouldReconnect = true;
        }
        super.connect();
        this.setupBinaryHandling();
        return this;
    }
}

/**
 * Wrapper for Speak V1Client that overrides connect to use custom websocket.
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

        // Get Authorization from authProvider (matching the working version)
        const authRequest = await this._options.authProvider.getAuthRequest();
        const _headers: Record<string, unknown> = mergeHeaders(
            authRequest.headers,
            headers,
        );
        
        // Get WebSocket options with proper header handling
        const wsOptions = getWebSocketOptions(_headers);
        
        // Explicitly use the custom ReconnectingWebSocket from ws.ts
        const socket = new ReconnectingWebSocket({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.DeepgramEnvironment.Production
                    ).production,
                "/v1/speak",
            ),
            protocols: [],
            queryParameters: _queryParams,
            headers: wsOptions.headers,
            options: { 
                ...wsOptions,
                debug: debug ?? false, 
                maxRetries: reconnectAttempts ?? 30,
                startClosed: true,
                connectionTimeout: 10000, // Increase timeout to 10 seconds
            },
        });
        return new WrappedSpeakV1Socket({ socket });
    }
}

/**
 * Wrapper for Speak V1Socket that handles binary messages correctly.
 */
class WrappedSpeakV1Socket extends SpeakV1Socket {
    private binaryAwareHandler?: (event: MessageEvent) => void;

    constructor(args: SpeakV1Socket.Args) {
        super(args);
        this.setupBinaryHandling();
    }

    private setupBinaryHandling() {
        // Create a binary-aware message handler
        this.binaryAwareHandler = (event: MessageEvent) => {
            // Handle both text (JSON) and binary messages
            if (typeof event.data === "string") {
                try {
                    const data = fromJson(event.data);
                    (this as any).eventHandlers.message?.(data);
                } catch (error) {
                    // If JSON parsing fails, pass the raw string
                    (this as any).eventHandlers.message?.(event.data);
                }
            } else {
                // Binary data - pass through as-is
                (this as any).eventHandlers.message?.(event.data);
            }
        };

        // Remove the original handler and add our binary-aware one
        const socketAny = this.socket as any;
        if (socketAny._listeners?.message) {
            socketAny._listeners.message.forEach((listener: any) => {
                this.socket.removeEventListener("message", listener);
            });
        }
        
        if (this.binaryAwareHandler) {
            this.socket.addEventListener("message", this.binaryAwareHandler);
        }
    }

    public connect(): WrappedSpeakV1Socket {
        // Ensure socket is ready to connect - if _connectLock is stuck, force reconnect
        if (this.socket.readyState === this.socket.CLOSED) {
            // Force a fresh reconnect to ensure _connectLock is reset
            (this.socket as any)._connectLock = false;
            (this.socket as any)._shouldReconnect = true;
        }
        super.connect();
        this.setupBinaryHandling();
        return this;
    }
}
