export class Event {
    public target: any;
    public type: string;
    constructor(type: string, target: any) {
        this.target = target;
        this.type = type;
    }
}

/**
 * Handshake-rejection details a Node WebSocket ("ws") handshake can surface.
 * Browsers never expose these per the Fetch/WebSocket spec, so these fields
 * stay undefined outside Node.
 */
export interface HandshakeErrorDetails {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
    requestId?: string;
}

export class ErrorEvent extends Event {
    public message: string;
    public error: Error;
    /** HTTP status code from a rejected WebSocket handshake (Node only). */
    public statusCode?: number;
    /** Response headers from a rejected WebSocket handshake (Node only). */
    public headers?: Record<string, string>;
    /** Response body from a rejected WebSocket handshake (Node only). */
    public body?: string;
    /** Value of the `dg-request-id` response header, when present. */
    public requestId?: string;
    constructor(error: Error, target: any) {
        super("error", target);
        this.message = error.message;
        this.error = error;
        const details = error as Error & Partial<HandshakeErrorDetails>;
        if (details.statusCode !== undefined) this.statusCode = details.statusCode;
        if (details.headers !== undefined) this.headers = details.headers;
        if (details.body !== undefined) this.body = details.body;
        if (details.requestId !== undefined) this.requestId = details.requestId;
    }
}

export class CloseEvent extends Event {
    public code: number;
    public reason: string;
    public wasClean = true;
    constructor(code = 1000, reason = "", target: any) {
        super("close", target);
        this.code = code;
        this.reason = reason;
    }
}
export interface WebSocketEventMap {
    close: CloseEvent;
    error: ErrorEvent;
    message: MessageEvent;
    open: Event;
}

export interface WebSocketEventListenerMap {
    close: (event: CloseEvent) => void | { handleEvent: (event: CloseEvent) => void };
    error: (event: ErrorEvent) => void | { handleEvent: (event: ErrorEvent) => void };
    message: (event: MessageEvent) => void | { handleEvent: (event: MessageEvent) => void };
    open: (event: Event) => void | { handleEvent: (event: Event) => void };
}
