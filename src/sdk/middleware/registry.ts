import type { AbstractLiveClient } from "../../core/packages/AbstractLiveClient";
import type { Middleware, MiddlewareContext } from "./types";

/**
 * Registry for managing middlewares at global and instance levels
 */
export class MiddlewareRegistry {
  /** Global middlewares that apply to all sessions */
  private static globalMiddlewares: Middleware[] = [];

  /** Instance-specific middlewares per session */
  private instanceMiddlewares = new Map<AbstractLiveClient, Middleware[]>();

  /**
   * Register a global middleware that applies to all sessions
   */
  static use(middleware: Middleware): void {
    this.globalMiddlewares.push(middleware);
  }

  /**
   * Register a middleware that applies to sessions using this registry instance
   */
  use(middleware: Middleware): void {
    // For now, add to global middlewares, but this could be made registry-specific
    MiddlewareRegistry.globalMiddlewares.push(middleware);
  }

  /**
   * Add middleware specific to a session instance
   */
  addInstanceMiddleware(session: AbstractLiveClient, middleware: Middleware): void {
    if (!this.instanceMiddlewares.has(session)) {
      this.instanceMiddlewares.set(session, []);
    }
    this.instanceMiddlewares.get(session)!.push(middleware);
  }

  /**
   * Get all middlewares (global + instance) for a specific session and event
   */
  getMiddlewares(session: AbstractLiveClient, event: string): Middleware[] {
    const global = MiddlewareRegistry.globalMiddlewares.filter((mw) => mw.event === event);
    const instance =
      this.instanceMiddlewares.get(session)?.filter((mw) => mw.event === event) || [];
    return [...global, ...instance];
  }

  /**
   * Clean up instance middlewares when a session is disposed
   */
  dispose(session: AbstractLiveClient): void {
    this.instanceMiddlewares.delete(session);
  }

  /**
   * Execute before middlewares for an event
   */
  async executeBefore(
    session: AbstractLiveClient,
    event: string,
    payload: any,
    ctx: MiddlewareContext
  ): Promise<void> {
    const middlewares = this.getMiddlewares(session, event);
    for (const middleware of middlewares) {
      if (middleware.before) {
        await middleware.before(payload, ctx);
      }
    }
  }

  /**
   * Execute after middlewares for an event
   */
  async executeAfter(
    session: AbstractLiveClient,
    event: string,
    payload: any,
    ctx: MiddlewareContext
  ): Promise<void> {
    const middlewares = this.getMiddlewares(session, event);
    for (const middleware of middlewares) {
      if (middleware.after) {
        await middleware.after(payload, ctx);
      }
    }
  }
}
