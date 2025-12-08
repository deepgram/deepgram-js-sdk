/**
 * Example: Text-to-Speech Streaming (WebSocket)
 * 
 * Connect to Deepgram's websocket and send a continuous text stream to generate speech.
 */

const { createClient, LiveTTSEvents } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

function textToSpeechStreaming() {
  const deepgramConnection = deepgramClient.speak.live({
    model: "aura-2-thalia-en",
    encoding: "linear16",
    container: "wav",
    // Add more options as needed
  });

  deepgramConnection.on(LiveTTSEvents.Open, () => {
    console.log("Connection opened");

    const text = "Hello, this is a test of Deepgram's streaming text-to-speech API.";

    // Send text data for TTS synthesis
    deepgramConnection.sendText(text);

    // Send Flush message to the server after sending the text
    deepgramConnection.flush();

    deepgramConnection.on(LiveTTSEvents.Audio, (data) => {
      console.log("Audio received:", data);
      // Process audio data
    });

    deepgramConnection.on(LiveTTSEvents.Error, (error) => {
      console.error("Error:", error);
    });

    deepgramConnection.on(LiveTTSEvents.Close, () => {
      console.log("Connection closed");
    });
  });
}

// Uncomment to run:
textToSpeechStreaming();

