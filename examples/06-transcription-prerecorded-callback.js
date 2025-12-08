/**
 * Example: Transcribe with Callback (Async)
 *
 * Use the Callback version of transcribeUrl/transcribeFile for async processing.
 * Deepgram will POST results to your callback URL when transcription is complete.
 */

const { createClient, CallbackUrl } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function transcribeWithCallback() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrlCallback(
      { url: "https://dpgr.am/spacewalk.wav" },
      new CallbackUrl("http://callback/endpoint"),
      {
        model: "nova-3",
        language: "en",
        punctuate: true,
        // Add more options as needed
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Callback request sent:", result);
  // Deepgram will POST results to your callback URL when ready
}

// Uncomment to run:
transcribeWithCallback();
