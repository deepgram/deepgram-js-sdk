/**
 * Example: Text-to-Speech Single Request
 * 
 * Convert text into speech using the REST API.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function textToSpeech() {
  const text = "Hello, this is a test of Deepgram's text-to-speech API.";

  const { result, error } = await deepgramClient.speak.request(
    { text },
    {
      model: "aura-2-thalia-en",
      encoding: "linear16",
      container: "wav",
      // Add more options as needed
    }
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Audio generated successfully");
  // result contains the audio data
  // You can save it to a file or play it
}

// Uncomment to run:
textToSpeech();

