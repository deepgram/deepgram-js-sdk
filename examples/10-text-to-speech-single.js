/**
 * Example: Text-to-Speech Single Request
 *
 * Convert text into speech using the REST API.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function textToSpeech() {
  const text = "Hello, this is a test of Deepgram's text-to-speech API.";

  try {
    const data = await deepgramClient.speak.v1.audio.generate({
      text,
      model: "aura-2-thalia-en",
      encoding: "linear16",
      container: "wav",
      // Add more options as needed
    });

    console.log("Audio generated successfully", data);
    // data contains the audio data
    // You can save it to a file or play it
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
textToSpeech();
