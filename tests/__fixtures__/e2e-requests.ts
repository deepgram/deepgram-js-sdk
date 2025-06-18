/**
 * Common request fixtures for e2e tests
 * This reduces duplication and centralizes test input data
 */

/**
 * Common transcription options used across multiple tests
 */
export const commonTranscriptionOptions = {
  model: "nova-3",
  smart_format: true,
  punctuate: true,
} as const;

/**
 * Test audio URLs for different scenarios
 */
export const testAudioUrls = {
  spacewalk: "https://dpgr.am/spacewalk.wav",
} as const;

/**
 * URL source objects for transcribeUrl tests
 */
export const urlSources = {
  spacewalk: {
    url: testAudioUrls.spacewalk,
  },
} as const;

/**
 * File paths for test audio files
 */
export const testAudioFiles = {
  spacewalk: "spacewalk.wav",
} as const;

/**
 * Alternative transcription options for different test scenarios
 */
export const transcriptionOptions = {
  basic: {
    model: "nova-3",
  },
  enhanced: {
    model: "nova-3",
    smart_format: true,
    punctuate: true,
    diarize: true,
  },
  withKeyterms: {
    model: "nova-3",
    smart_format: true,
    punctuate: true,
    keyterm: ["spacewalk"],
  },
} as const;

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
