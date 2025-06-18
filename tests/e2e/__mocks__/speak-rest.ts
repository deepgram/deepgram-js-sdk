/**
 * Mock response for TTS REST API endpoint
 * Based on actual Deepgram TTS API response structure
 * Since TTS returns binary audio data, we'll simulate this with a mock buffer
 */

// Create a mock audio buffer that simulates MP3 data
// This is just a minimal mock - real MP3 data would be much larger
export const mockAudioBuffer = Buffer.from([
  // MP3 header bytes (simplified mock)
  0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // Some mock audio data
  0x4c, 0x41, 0x4d, 0x45, 0x33, 0x2e, 0x31, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // Add some more bytes to make it more realistic
  0x55, 0x55, 0x55, 0x55, 0xaa, 0xaa, 0xaa, 0xaa,
]);

/**
 * Mock headers that would be returned by the TTS API
 */
export const mockTTSHeaders = {
  "content-type": "audio/mpeg",
  "content-length": mockAudioBuffer.length.toString(),
  "x-dg-model": "aura-2-thalia-en",
  "x-dg-request-id": "mock-tts-request-id-1234",
} as const;
