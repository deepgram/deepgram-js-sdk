/**
 * Example: Transcribe Audio from URL
 *
 * Transcribe audio from a remote URL using Deepgram's speech-to-text REST API.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function transcribeUrl() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        language: "en",
        punctuate: true,
        paragraphs: true,
        utterances: true,
        // Add more options as needed
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(
    "Transcription:",
    result.results?.channels?.[0]?.alternatives?.[0]?.transcript,
  );
  console.log("Full result:", JSON.stringify(result, null, 2));
}

// Uncomment to run:
transcribeUrl();
