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
