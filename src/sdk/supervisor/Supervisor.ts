import type { AbstractLiveClient } from "../../core/packages/AbstractLiveClient";
import type { MiddlewareContext } from "../middleware/types";
import { MiddlewareRegistry } from "../middleware/registry";

/**
 * Configuration for different client types and their supervision needs
 */
export interface SupervisorConfig {
  /** The client type/namespace (e.g., "listen", "agent", "speak") */
  clientType: string;
  /** Version of the client (e.g., "v2") */
  version: string;
  /** Middlewares to register for this client type */
  middlewares?: Array<{
    /** The event name to attach to */
    event: string;
    /** Function to run before the event is emitted to user handlers */
    before?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
    /** Function to run after the event has been emitted to user handlers */
    after?: (payload: any, ctx: MiddlewareContext) => void | Promise<void>;
  }>;
  /** Events that should be tracked for turn counting */
  turnCountingEvents?: {
    userStartEvent?: string;
    userEndEvent?: string;
    agentStartEvent?: string;
    agentEndEvent?: string;
  };
  /** Reconnection configuration */
  reconnectionConfig?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    jitter?: boolean;
    getResumeContext?: (metadata: any) => {
      headers?: Record<string, string>;
      query?: Record<string, string>;
    };
  };
}

/**
 * Central supervisor that can be configured for different client types
 */
export class Supervisor {
  private static registries = new Map<string, MiddlewareRegistry>();
  private static registeredBuiltins = new Set<string>();

  /**
   * Attach supervision to a session with the given configuration
   */
  static attach(session: AbstractLiveClient, config: SupervisorConfig): void {
    const registryKey = `${config.clientType}-${config.version}`;

    // Get or create registry for this client type/version
    if (!this.registries.has(registryKey)) {
      this.registries.set(registryKey, new MiddlewareRegistry());
    }
    const registry = this.registries.get(registryKey)!;

    // Register middlewares globally (only once per client type/version)
    if (!this.registeredBuiltins.has(registryKey)) {
      this.registerMiddlewares(registry, config);
      this.registeredBuiltins.add(registryKey);
    }

    // Wrap session event emission to run middlewares
    this.wrapEventEmission(session, registry);

    // Add instance-level middleware registration method
    this.addInstanceMiddlewareSupport(session, registry);

    // Store the registry key on the session for cleanup
    (session as any)._supervisorRegistryKey = registryKey;
  }

  /**
   * Register middlewares for a specific client type/version
   */
  private static registerMiddlewares(registry: MiddlewareRegistry, config: SupervisorConfig): void {
    if (config.middlewares) {
      config.middlewares.forEach((middleware) => {
        MiddlewareRegistry.use(middleware);
      });
    }
  }

  /**
   * Add instance-level middleware registration support
   */
  private static addInstanceMiddlewareSupport(
    session: AbstractLiveClient,
    registry: MiddlewareRegistry
  ): void {
    (session as any).use = (middleware: any) => {
      registry.addInstanceMiddleware(session, middleware);
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
  private static wrapEventEmission(
    session: AbstractLiveClient,
    registry: MiddlewareRegistry
  ): void {
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
      this.executeMiddlewares(session, event, payload, ctx, originalEmit, registry);

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
    registry: MiddlewareRegistry
  ): Promise<void> {
    try {
      // Execute before middlewares
      await registry.executeBefore(session, event, payload, ctx);

      // After middlewares run after the original event has been processed
      await registry.executeAfter(session, event, payload, ctx);
    } catch (error) {
      // Emit middleware error but don't break the event chain
      originalEmit("middleware_error", { event, error, payload });
    }
  }

  /**
   * Clean up resources when session is disposed
   */
  private static cleanup(session: AbstractLiveClient): void {
    const registryKey = (session as any)._supervisorRegistryKey;
    if (registryKey) {
      const registry = this.registries.get(registryKey);
      if (registry) {
        registry.dispose(session);
      }
    }
  }

  /**
   * Get the middleware registry for a specific client type/version
   * This allows external registration of global middlewares
   */
  static getRegistry(clientType: string, version: string): MiddlewareRegistry {
    const registryKey = `${clientType}-${version}`;
    if (!this.registries.has(registryKey)) {
      this.registries.set(registryKey, new MiddlewareRegistry());
    }
    return this.registries.get(registryKey)!;
  }

  /**
   * Register a global middleware for a specific client type/version
   */
  static use(clientType: string, version: string, middleware: any): void {
    const registry = this.getRegistry(clientType, version);
    registry.use(middleware);
  }
}
