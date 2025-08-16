import type { AbstractLiveClient } from "../../core/packages/AbstractLiveClient";

/**
 * Context provided to middleware functions
 */
export interface MiddlewareContext {
  /** The live client session instance */
  session: AbstractLiveClient;
  /** Current turn count (if turn counting is enabled) */
  turnCount?: number;
  /** Current connection attempt number */
  connectionAttempt?: number;
  /** Session metadata from the last Metadata event */
  metadata?: any;
  /** Resume context for reconnection */
  resumeContext?: {
    sessionId?: string;
    requestId?: string;
    lastSequence?: number;
  };
}

/**
 * Listen v2 middleware definition
 */
export interface ListenV2Middleware {
  /** The event name to attach to */
  event: string;
  /** Function to run before the event is emitted to user handlers */
  before?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
  /** Function to run after the event has been emitted to user handlers */
  after?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
}

/**
 * Built-in middleware plugin interface
 */
export interface SessionPlugin {
  /** Attach the plugin to a session */
  attach(session: AbstractLiveClient, api: SessionPluginAPI): void;
  /** Clean up the plugin when the session is disposed */
  dispose?(): void;
}

/**
 * API provided to session plugins
 */
export interface SessionPluginAPI {
  /** Subscribe to events */
  on: (event: string, handler: Function) => void;
  /** Emit events */
  emit: (event: string, data?: any) => void;
  /** Get current client options */
  getOptions: () => any;
  /** Update reconnection options */
  setReconnectOptions: (updater: (options: any) => any) => void;
}
