import type { AbstractLiveClient } from "../../core/packages/AbstractLiveClient";
import type {
  ListenV2Middleware,
  MiddlewareContext,
  SessionPlugin,
  SessionPluginAPI,
} from "../middleware/types";
import { MiddlewareRegistry } from "../middleware/registry";
import { turnCounting, reconnection, builtinMiddlewares } from "../middleware/plugins";

/**
 * Supervisor that enhances Listen v2 sessions with turn counting, reconnection, and middleware support
 */
export class ListenV2Supervisor {
  private static registry = new MiddlewareRegistry();

  /**
   * Attach supervision to a Listen v2 session
   */
  static attach(session: AbstractLiveClient): void {
    // Register built-in middlewares globally (only once)
    if (!this.hasRegisteredBuiltins) {
      this.registerBuiltinMiddlewares();
      this.hasRegisteredBuiltins = true;
    }

    // Wrap session event emission to run middlewares
    this.wrapEventEmission(session);

    // Add built-in plugins
    this.attachBuiltinPlugins(session);

    // Add instance-level middleware registration method
    this.addInstanceMiddlewareSupport(session);
  }

  private static hasRegisteredBuiltins = false;

  /**
   * Register built-in middlewares that apply to all Listen v2 sessions
   */
  private static registerBuiltinMiddlewares(): void {
    builtinMiddlewares.forEach((middleware) => {
      MiddlewareRegistry.use(middleware);
    });
  }

  /**
   * Attach built-in plugins (turn counting, reconnection) to the session
   */
  private static attachBuiltinPlugins(session: AbstractLiveClient): void {
    const api: SessionPluginAPI = {
      on: (event: string, handler: Function) =>
        session.on(event, handler as (...args: any[]) => void),
      emit: (event: string, data?: any) => session.emit(event, data),
      getOptions: () => (session as any).options || {},
      setReconnectOptions: (updater: (options: any) => any) => {
        // Store the updater function for use during reconnection
        (session as any)._reconnectOptionsUpdater = updater;
      },
    };

    // Attach turn counting plugin
    const turnCountingPlugin = turnCounting({
      userStartEvent: "SpeechStarted",
      userEndEvent: "UtteranceEnd",
      // v2 might have agent events too
      agentStartEvent: "AgentStartedSpeaking",
      agentEndEvent: "AgentAudioDone",
    });
    turnCountingPlugin.attach(session, api);

    // Attach reconnection plugin
    const reconnectionPlugin = reconnection({
      maxAttempts: 5,
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      jitter: true,
      getResumeContext: (metadata) => ({
        headers: {
          ...(metadata.session_id && { "X-Session-ID": metadata.session_id }),
          ...(metadata.request_id && { "X-Request-ID": metadata.request_id }),
        },
        query: {
          ...(metadata.sequence && { resume_sequence: metadata.sequence.toString() }),
        },
      }),
    });
    reconnectionPlugin.attach(session, api);

    // Store plugins for cleanup
    (session as any)._plugins = [turnCountingPlugin, reconnectionPlugin];
  }

  /**
   * Add instance-level middleware registration support
   */
  private static addInstanceMiddlewareSupport(session: AbstractLiveClient): void {
    (session as any).use = (middleware: ListenV2Middleware) => {
      this.registry.addInstanceMiddleware(session, middleware);
      return session; // Enable chaining
    };

    // Add cleanup on disconnect
    const originalDisconnect = session.disconnect.bind(session);
    session.disconnect = (...args: any[]) => {
      this.cleanup(session);
      return originalDisconnect(...args);
    };
  }

  /**
   * Wrap the session's emit method to run middlewares
   */
  private static wrapEventEmission(session: AbstractLiveClient): void {
    const originalEmit = session.emit.bind(session);

    (session as any).emit = (event: string, ...args: any[]) => {
      const payload = args[0];
      const ctx: MiddlewareContext = {
        session,
        turnCount: (session as any)._turnCount?.() || 0,
        connectionAttempt: (session as any)._connectionAttempt || 0,
        metadata: (session as any)._lastMetadata,
        resumeContext: (session as any)._resumeContext,
      };

      // Execute middlewares asynchronously but don't block the event emission
      this.executeMiddlewares(session, event, payload, ctx, originalEmit, args);

      // Return the original emission result immediately
      return originalEmit(event, ...args);
    };
  }

  /**
   * Execute middlewares asynchronously without blocking event emission
   */
  private static async executeMiddlewares(
    session: AbstractLiveClient,
    event: string,
    payload: any,
    ctx: MiddlewareContext,
    originalEmit: Function,
    args: any[]
  ): Promise<void> {
    try {
      // Execute before middlewares
      await this.registry.executeBefore(session, event, payload, ctx);

      // After middlewares run after the original event has been processed
      await this.registry.executeAfter(session, event, payload, ctx);
    } catch (error) {
      // Emit middleware error but don't break the event chain
      originalEmit("middleware_error", { event, error, payload });
    }
  }

  /**
   * Clean up resources when session is disposed
   */
  private static cleanup(session: AbstractLiveClient): void {
    // Clean up middleware registry
    this.registry.dispose(session);

    // Clean up plugins
    const plugins = (session as any)._plugins as SessionPlugin[];
    if (plugins) {
      plugins.forEach((plugin) => plugin.dispose?.());
    }
  }
}

/**
 * Global middleware registration for Listen v2
 */
export const ListenV2 = {
  /**
   * Register a middleware that applies to all Listen v2 sessions
   */
  use: (middleware: ListenV2Middleware) => {
    MiddlewareRegistry.use(middleware);
  },
};
