/**
 * Example: Convert Transcription to Captions
 *
 * Convert Deepgram transcriptions to WebVTT or SRT caption formats.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function generateCaptions() {
  try {
    const data = await deepgramClient.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
      punctuate: true,
      utterances: true,
    });

    if (data) {
      // Note: webvtt and srt utilities are not included in the new SDK
      // You can use the @deepgram/node-captions package or implement your own
      // For now, we'll just show the result structure
      console.log("Transcription result:", JSON.stringify(data, null, 2));
      console.log("\nTo convert to captions, use @deepgram/node-captions package");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
generateCaptions();
