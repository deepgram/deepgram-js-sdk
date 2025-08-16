import type { AbstractLiveClient } from "../../core/packages/AbstractLiveClient";
import type { SessionPlugin, SessionPluginAPI, ListenV2Middleware } from "./types";

/**
 * Turn counting plugin for Listen v2 sessions
 */
export const turnCounting = (options?: {
  userStartEvent?: string;
  userEndEvent?: string;
  agentStartEvent?: string;
  agentEndEvent?: string;
}): SessionPlugin => {
  const opts = {
    userStartEvent: "SpeechStarted",
    userEndEvent: "UtteranceEnd",
    agentStartEvent: "AgentStartedSpeaking",
    agentEndEvent: "AgentAudioDone",
    ...options,
  };

  return {
    attach(session: AbstractLiveClient, api: SessionPluginAPI) {
      let turnCount = 0;
      let currentSpeaker: "user" | "agent" | null = null;

      // Track user turns
      if (opts.userStartEvent) {
        api.on(opts.userStartEvent, () => {
          if (currentSpeaker !== "user") {
            turnCount++;
            currentSpeaker = "user";
            api.emit("turn_started", { turn: turnCount, speaker: "user" });
          }
        });
      }

      // Track agent turns
      if (opts.agentStartEvent) {
        api.on(opts.agentStartEvent, () => {
          if (currentSpeaker !== "agent") {
            turnCount++;
            currentSpeaker = "agent";
            api.emit("turn_started", { turn: turnCount, speaker: "agent" });
          }
        });
      }

      // Store turn count on session for access
      (session as any)._turnCount = () => turnCount;
      (session as any)._currentSpeaker = () => currentSpeaker;
    },
  };
};

/**
 * Reconnection plugin with exponential backoff
 */
export const reconnection = (options?: {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  getResumeContext?: (metadata: any) => {
    headers?: Record<string, string>;
    query?: Record<string, string>;
  };
}): SessionPlugin => {
  const opts = {
    maxAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    jitter: true,
    ...options,
  };

  return {
    attach(session: AbstractLiveClient, api: SessionPluginAPI) {
      let reconnectAttempts = 0;
      let resumeContext: any = {};
      let reconnectTimer: NodeJS.Timeout | null = null;

      // Extract resume context from metadata
      api.on("Metadata", (metadata: any) => {
        if (opts.getResumeContext) {
          resumeContext = opts.getResumeContext(metadata);
        } else {
          // Default context extraction
          resumeContext = {
            headers: {},
            query: {},
          };

          if (metadata.session_id) {
            resumeContext.headers["X-Session-ID"] = metadata.session_id;
          }
          if (metadata.request_id) {
            resumeContext.headers["X-Request-ID"] = metadata.request_id;
          }
        }
      });

      // Handle connection loss
      api.on("close", async (closeEvent: any) => {
        if (closeEvent.code === 1000) {
          // Normal closure, don't reconnect
          return;
        }

        if (reconnectAttempts >= opts.maxAttempts) {
          api.emit("reconnect_failed", { attempts: reconnectAttempts, lastError: closeEvent });
          return;
        }

        // Calculate delay with exponential backoff
        const baseDelay = Math.min(
          opts.baseDelayMs * Math.pow(2, reconnectAttempts),
          opts.maxDelayMs
        );
        const delay = opts.jitter ? baseDelay * (0.5 + Math.random() * 0.5) : baseDelay;

        reconnectAttempts++;

        api.emit("reconnecting", { attempt: reconnectAttempts, delay });

        reconnectTimer = setTimeout(async () => {
          try {
            // Update reconnection options with resume context
            api.setReconnectOptions((currentOptions) => ({
              ...currentOptions,
              ...resumeContext.query,
              headers: {
                ...currentOptions.headers,
                ...resumeContext.headers,
              },
            }));

            // Attempt reconnection using the existing reconnect method
            session.reconnect(api.getOptions());

            // Reset attempts on successful reconnection
            api.on("open", () => {
              if (reconnectAttempts > 0) {
                api.emit("reconnected", { attempts: reconnectAttempts });
                reconnectAttempts = 0;
              }
            });
          } catch (error) {
            api.emit("reconnect_error", { attempt: reconnectAttempts, error });

            // Try again if we haven't hit max attempts
            if (reconnectAttempts < opts.maxAttempts) {
              api.on("close", arguments.callee); // Retry on next close
            }
          }
        }, delay);
      });

      // Handle connection errors
      api.on("error", (error: any) => {
        api.emit("reconnect_error", { attempt: reconnectAttempts, error });
      });
    },

    dispose() {
      // Cleanup is handled in the attach method's closure
    },
  };
};

/**
 * Built-in middlewares for Listen v2
 */
export const builtinMiddlewares: ListenV2Middleware[] = [
  {
    event: "Metadata",
    before: (metadata, ctx) => {
      // Store metadata in context for other middlewares
      ctx.metadata = metadata;

      // Update resume context
      if (metadata.session_id || metadata.request_id) {
        ctx.resumeContext = {
          sessionId: metadata.session_id,
          requestId: metadata.request_id,
          lastSequence: metadata.sequence,
        };

        // Store on session for access
        (ctx.session as any)._resumeContext = ctx.resumeContext;
      }
    },
  },
];
