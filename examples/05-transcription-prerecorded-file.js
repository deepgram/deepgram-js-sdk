/**
 * Example: Transcribe Audio from Local File
 * 
 * Transcribe audio from a local file using Deepgram's speech-to-text REST API.
 */

const { createClient } = require("@deepgram/sdk");
const { createReadStream } = require("fs");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function transcribeFile() {
  const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
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

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Transcription:", result.results?.channels?.[0]?.alternatives?.[0]?.transcript);
  console.log("Full result:", JSON.stringify(result, null, 2));
}

// Uncomment to run:
transcribeFile();

