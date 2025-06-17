import { UrlSource, PrerecordedSchema } from "../../src/lib/types";
import { AUDIO_SOURCES } from "./audio";

// URL source fixtures
export const URL_SOURCES: Record<string, UrlSource> = {
  SPACEWALK: {
    url: AUDIO_SOURCES.SPACEWALK_WAV,
  },

  EMPTY_URL: {
    url: "",
  },
};

// Transcription options fixtures
export const TRANSCRIPTION_OPTIONS: Record<string, PrerecordedSchema> = {
  // Basic transcription with Nova-2 model
  BASIC_NOVA2: {
    model: "nova-2",
  },

  // Enhanced transcription with multiple features
  ENHANCED: {
    model: "nova-3",
    smart_format: true,
    punctuate: true,
    diarize: true,
    language: "en-US",
    topics: true,
    intents: true,
    sentiment: true,
    summarize: "v2",
  },
};
