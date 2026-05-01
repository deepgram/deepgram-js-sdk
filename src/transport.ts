/**
 * Message payloads exchanged over Deepgram streaming transports.
 *
 * A transport can carry JSON control messages as strings and audio or synthesized
 * audio as binary payloads.
 */
export type DeepgramTransportMessage = string | ArrayBuffer | Blob | ArrayBufferView;

/** Close metadata reported by a custom transport. */
export interface DeepgramTransportCloseEvent {
    code?: number;
    reason?: string;
}

/**
 * Metadata passed to a transport factory when a streaming connection is created.
 *
 * The first two factory arguments intentionally match the Python and Java SDKs:
 * `factory(url, headers)`. JavaScript also passes this third metadata object so
 * custom transports can inspect the target streaming API and connection settings.
 */
export interface DeepgramTransportRequest {
    /** Full Deepgram websocket URL including query parameters. */
    url: string;
    /** Resolved request headers including auth and session headers. */
    headers: Record<string, string>;
    /** Requested websocket subprotocols, if any. */
    protocols: string[];
    /** Deepgram websocket path (for example `/v1/listen`). */
    path: string;
    /** Streaming API being targeted. */
    service: "agent.v1" | "listen.v1" | "listen.v2" | "speak.v1";
    /** Query parameters before they are encoded into the URL. */
    queryParams: Record<string, unknown>;
    /** Whether debug logging was requested for the connection. */
    debug: boolean;
    /** Requested reconnect attempts for this connection. */
    reconnectAttempts: number;
    /** Optional connection timeout in seconds. */
    connectionTimeoutInSeconds?: number;
    /** Optional abort signal for the connection attempt. */
    abortSignal?: AbortSignal;
}

/**
 * Transport interface for replacing the SDK's default websocket transport.
 *
 * This is the seam used by SageMaker support and other non-websocket streaming
 * implementations. The SDK adapts this transport to its existing socket APIs, so
 * callers still use `client.listen.v1.createConnection()` and related methods.
 */
export interface DeepgramTransport {
    /** Send either a JSON string or binary payload to the transport. */
    send(data: DeepgramTransportMessage): void | Promise<void>;
    /** Register a listener fired once the transport is ready to exchange messages. */
    onOpen(listener: () => void): void;
    /** Register a listener for inbound text or binary messages. */
    onMessage(listener: (message: DeepgramTransportMessage) => void): void;
    /** Register a listener for transport-level errors. */
    onError(listener: (error: Error) => void): void;
    /** Register a listener for transport close events. */
    onClose(listener: (event: DeepgramTransportCloseEvent) => void): void;
    /** Returns true while the transport is open and able to send data. */
    isOpen(): boolean;
    /** Close the transport gracefully. */
    close(code?: number, reason?: string): void | Promise<void>;
    /** Optional ping hook for transports that expose an explicit keepalive primitive. */
    ping?(data?: string | ArrayBuffer | Blob | ArrayBufferView): void | Promise<void>;
}

/**
 * Factory for creating custom streaming transports.
 *
 * The first two arguments mirror the Python and Java SDKs. JavaScript also passes
 * a third metadata argument for transports that need more connection context.
 */
export type DeepgramTransportFactory = (
    url: string,
    headers: Record<string, string>,
    request: DeepgramTransportRequest,
) => DeepgramTransport | Promise<DeepgramTransport>;
