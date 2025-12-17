/**
 * Example: Transcribe with Callback (Async)
 *
 * Use the Callback version of transcribeUrl/transcribeFile for async processing.
 * Deepgram will POST results to your callback URL when transcription is complete.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function transcribeWithCallback() {
  try {
    const data = await deepgramClient.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      callback: "dpgr.am/callback", // SDK handles encoding automatically
      callback_method: "POST",
      model: "nova-3",
      language: "en",
      punctuate: true,
      // Add more options as needed
    });

    console.log("Callback request sent:", data);
    // Deepgram will POST results to your callback URL when ready
  } catch (error) {
    console.error("Error:", error);
  }
}

// Think this doesn't work because we don't have a legitimate callback URL.
// transcribeWithCallback();