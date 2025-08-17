/**
 * Test fixtures for Speak (Text-to-Speech) API
 */

/**
 * Common TTS options used across multiple tests
 */
export const commonTTSOptions = {
  model: "aura-2-thalia-en",
  encoding: "mp3",
} as const;

/**
 * Test text sources for TTS scenarios
 */
export const testTextSources = {
  greeting: { text: "Hello, how can I help you today?" },
  longText: {
    text: "This is a longer text sample for testing text-to-speech functionality with multiple sentences. It should demonstrate how the API handles longer content.",
  },
  multiline: { text: "Line one.\nLine two.\nLine three with more content." },
} as const;

/**
 * Alternative TTS options for different test scenarios
 */
export const ttsOptions = {
  basic: {
    model: "aura-2-thalia-en",
  },
  highQuality: {
    model: "aura-2-thalia-en",
    encoding: "linear16",
    sample_rate: 48000,
  },
  compressed: {
    model: "aura-2-thalia-en",
    encoding: "mp3",
    bit_rate: 128000,
  },
} as const;
