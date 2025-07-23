type Provider = { type: string } & Record<string, unknown>;

type SpeakProvider = {
  provider: Provider;
  endpoint?: {
    url: string;
    headers?: Record<string, string>;
  };
};

import type { HistoryConversationText } from "./HistoryConversationText";
import type { HistoryFunctionCall } from "./HistoryFunctionCall";

/**
 * @see https://developers.deepgram.com/docs/configure-voice-agent
 */
interface AgentLiveSchema extends Record<string, unknown> {
  /**
   * Set to true to enable experimental features.
   * @default false
   */
  experimental?: boolean;
  /**
   * @see https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program
   * To opt out of Deepgram Model Improvement Program.
   * @default false
   */
  mips_opt_out?: boolean;

  /**
   * Configuration flags for agent features
   */
  flags?: {
    /**
     * @see https://developers.deepgram.com/docs/configure-voice-agent#agentcontext
     * Enable or disable history message reporting
     * @default true
     */
    history?: boolean;
  };

  audio: {
    input?: {
      /**
       * @default "linear16"
       */
      encoding: string;
      /**
       * @default 16000
       */
      sample_rate: number;
    };
    /**
     * @see https://developers.deepgram.com/docs/tts-media-output-settings#audio-format-combinations
     */
    output?: {
      encoding?: string;
      sample_rate?: number;
      bitrate?: number;
      /**
       * @default "none"
       */
      container?: string;
    };
  };
  agent: {
    /**
     * ISO 639-1 language code for agent language.
     * @default "en"
     */
    language?: string;

    /**
     * Conversation context including the history of messages and function calls
     */
    context?: {
      /**
       * Conversation history as a list of messages and function calls
       */
      messages?: (HistoryConversationText | HistoryFunctionCall)[];
    };

    listen?: {
      provider: Provider;
    };
    speak?: SpeakProvider | SpeakProvider[];
    /**
     * @see https://developers.deepgram.com/docs/voice-agent-tts-models
     */
    think?: {
      provider: Provider;
      /**
       * Optional ONLY if LLM provider is OpenAI or Anthropic.
       */
      endpoint?: {
        url: string;
        headers?: Record<string, string>;
      };
      functions?: {
        name?: string;
        description?: string;
        parameters?: Record<string, unknown>;
        endpoint?: {
          url?: string;
          method?: string;
          headers?: Record<string, string>;
        };
      }[];
      prompt?: string;
      context_length?: number | "max";
    };
    /**
     * Optional message the agent will say at the start of the connection.
     */
    greeting?: string;
  };
}

export type { AgentLiveSchema, SpeakProvider };
