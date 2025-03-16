type AudioFormat =
  | {
      encoding: "linear16";
      container: "wav" | "none";
      sampleRate: 8000 | 16000 | 24000 | 32000 | 48000;
    }
  | {
      encoding: "mulaw";
      container: "wav" | "none";
      sampleRate: 8000 | 16000;
    }
  | {
      encoding: "alaw";
      container: "wav" | "none";
      sampleRate: 8000 | 16000;
    };

type AudioEncoding =
  | "linear16"
  | "flac"
  | "mulaw"
  | "amr-nb"
  | "amr-wb"
  | "Opus"
  | "speex"
  | "g729"
  | string;

type ListenModel =
  | "nova-3"
  | "nova-3-general"
  | "nova-3-medical"
  | "nova-2"
  | "nova-2-meeting"
  | "nova-2-phonecall"
  | "nova-2-voicemail"
  | "nova-2-finance"
  | "nova-2-conversational"
  | "nova-2-video"
  | "nova-2-medical"
  | "nova-2-drivethru"
  | "nova-2-automotive"
  | "nova-2-atc"
  | "nova"
  | "nova-phonecall"
  | "enhanced"
  | "enhanced-meeting"
  | "enhanced-phonecall"
  | "enhanced-finance"
  | "base"
  | "base-meeting"
  | "base-phonecall"
  | "base-voicemail"
  | "base-finance"
  | "base-conversational"
  | "base-video"
  | "whisper-tiny"
  | "whisper"
  | "whisper-small"
  | "whisper-medium"
  | "whisper-large"
  | string;

type SpeakModel =
  | "aura-asteria-en"
  | "aura-luna-en"
  | "aura-stella-en"
  | "aura-athena-en"
  | "aura-hera-en"
  | "aura-orion-en"
  | "aura-arcas-en"
  | "aura-perseus-en"
  | "aura-angus-en"
  | "aura-orpheus-en"
  | "aura-helios-en"
  | "aura-zeus-en"
  | string;

interface ThinkModelFunction {
  name: string;
  description: string;
  url: string;
  headers: [
    {
      key: "authorization";
      value: string;
    }
  ];
  method: "POST";
  parameters: {
    type: string;
    properties: Record<
      string,
      {
        type: string;
        description: string;
      }
    >;
  };
}

type ThinkModel =
  | {
      provider: {
        type: "open_ai";
      };
      model: "gpt-4o-mini";
      instructions?: string;
      functions?: ThinkModelFunction[];
    }
  | {
      provider: {
        type: "anthropic";
      };
      model: "claude-3-haiku-20240307";
      instructions?: string;
      functions?: ThinkModelFunction[];
    }
  | {
      provider: {
        type: "groq";
      };
      model: "";
      instructions?: string;
      functions?: ThinkModelFunction[];
    }
  | {
      provider: {
        type: "custom";
        url: string;
        key: string;
      };
      model: string;
      instructions?: string;
      functions?: ThinkModelFunction[];
    };

/**
 * @see https://developers.deepgram.com/reference/voicebot-api-phase-preview#settingsconfiguration
 */
interface AgentLiveSchema extends Record<string, unknown> {
  audio: {
    input?: {
      /**
       * @default 1
       */
      channels?: number;
      encoding: AudioEncoding;
      /**
       * @default false
       */
      multichannel?: boolean;
      sampleRate: number;
    };
    /**
     * @see https://developers.deepgram.com/docs/tts-media-output-settings#audio-format-combinations
     */
    output?: AudioFormat;
  };
  agent: {
    listen: {
      /**
       * @see https://developers.deepgram.com/docs/model
       */
      model: ListenModel;
      /**
       * @see https://developers.deepgram.com/docs/keyterm
       */
      keyterms?: string[];
    };
    speak: {
      /**
       * @see https://developers.deepgram.com/docs/tts-models
       */
      model: SpeakModel;
    };
    /**
     * @see https://developers.deepgram.com/reference/voicebot-api-phase-preview#supported-llm-providers-and-models
     */
    think: ThinkModel;
  };
  context?: {
    /**
     * LLM message history (e.g. to restore existing conversation if websocket disconnects)
     */
    messages: { role: "user" | "assistant"; content: string }[];
    /**
     * Whether to replay the last message, if it is an assistant message.
     */
    replay: boolean;
  };
}

export type { AgentLiveSchema, SpeakModel };
