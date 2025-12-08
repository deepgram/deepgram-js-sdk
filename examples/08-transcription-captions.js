/**
 * Example: Convert Transcription to Captions
 *
 * Convert Deepgram transcriptions to WebVTT or SRT caption formats.
 */

const { createClient, webvtt, srt } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function generateCaptions() {
  const { result, error } =
    await deepgramClient.listen.prerecorded.transcribeUrl(
      { url: "https://dpgr.am/spacewalk.wav" },
      {
        model: "nova-3",
        punctuate: true,
        utterances: true,
      },
    );

  if (error) {
    console.error("Error:", error);
    return;
  }

  // Convert to WebVTT format
  const vttResult = webvtt(result);
  console.log("WebVTT captions:");
  console.log(vttResult);

  // Convert to SRT format
  const srtResult = srt(result);
  console.log("\nSRT captions:");
  console.log(srtResult);
}

// Uncomment to run:
generateCaptions();
