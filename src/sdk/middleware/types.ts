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
 * Middleware definition for intercepting events
 */
export interface Middleware {
  /** The event name to attach to */
  event: string;
  /** Function to run before the event is emitted to user handlers */
  before?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
  /** Function to run after the event has been emitted to user handlers */
  after?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
}
