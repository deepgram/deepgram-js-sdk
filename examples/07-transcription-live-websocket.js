/**
 * Example: Live Transcription via WebSocket
 *
 * Connect to Deepgram's websocket and transcribe live streaming audio.
 */

const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const { createReadStream } = require("fs");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

function liveTranscription() {
  const deepgramConnection = deepgramClient.listen.live({
    model: "nova-3",
    language: "en",
    punctuate: true,
    interim_results: true,
    // Add more options as needed
  });

  deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened");

    deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.log("Transcript:", data);
    });

    deepgramConnection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log("Metadata:", data);
    });

    deepgramConnection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error("Error:", error);
    });

    deepgramConnection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed");
    });

    // Example: Send audio data from a file stream
    const audioStream = createReadStream("./examples/spacewalk.wav");
    audioStream.on("data", (chunk) => {
      deepgramConnection.send(chunk);
    });

    audioStream.on("end", () => {
      deepgramConnection.finish();
    });
  });
}

// Uncomment to run:
liveTranscription();
