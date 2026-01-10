/**
 * Example: Transcribe Audio from Local File
 *
 * Transcribe audio from a local file using Deepgram's speech-to-text REST API.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const { createReadStream } = require("fs");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function transcribeFile() {
  try {
    const data = await deepgramClient.listen.v1.media.transcribeFile(
      createReadStream("./examples/spacewalk.wav"),
      {
        model: "nova-3",
        language: "en",
        punctuate: true,
        paragraphs: true,
        utterances: true,
        smart_format: true,
        // Add more options as needed
      }
    );

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

// WORKS!
transcribeFile();
