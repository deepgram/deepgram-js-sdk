/**
 * Example: Error Handling
 *
 * Demonstrates proper error handling with the SDK.
 */

const { DeepgramClient, DeepgramError } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function exampleWithErrorHandling() {
  try {
    const data = await deepgramClient.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
    });
    console.log("Success:", data);
  } catch (err) {
    if (err instanceof DeepgramError) {
      console.error("Deepgram Error:");
      console.error("Status Code:", err.statusCode);
      console.error("Message:", err.message);
      console.error("Body:", err.body);
      console.error("Raw Response:", err.rawResponse);
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

exampleWithErrorHandling();
