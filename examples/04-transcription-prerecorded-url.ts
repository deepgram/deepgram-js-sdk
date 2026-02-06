/**
 * Example: Transcribe Audio from URL
 *
 * Transcribe audio from a remote URL using Deepgram's speech-to-text REST API.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function transcribeUrl() {
  try {
    const data = await deepgramClient.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
      language: "en",
      punctuate: true,
      paragraphs: true,
      utterances: true,
      // Add more options as needed
    });

    if (data) {
      console.log(
        "Transcription:",
        data.results?.channels?.[0]?.alternatives?.[0]?.transcript,
      );
      console.log("Full result:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

transcribeUrl();
