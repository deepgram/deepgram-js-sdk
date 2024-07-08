const fs = require("fs");
const { createClient, LiveTTSEvents } = require("../../dist/main/index");

const live = async () => {
  const text = "Hello, how can I help you today?";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const dgConnection = deepgram.speak.live({ model: "aura-asteria-en" });

  let audioBuffer = Buffer.alloc(0);

  dgConnection.on(LiveTTSEvents.Open, () => {
    console.log("Connection opened");

    // Send text data for TTS synthesis
    dgConnection.sendText(text);

    // Send Flush message to the server after sending the text
    dgConnection.flush();

    dgConnection.on(LiveTTSEvents.Close, () => {
      console.log("Connection closed");
    });

    dgConnection.on(LiveTTSEvents.Metadata, (data) => {
      console.dir(data, { depth: null });
    });

    dgConnection.on(LiveTTSEvents.Audio, (data) => {
      console.log("Deepgram audio data received");
      // Concatenate the audio chunks into a single buffer
      const buffer = Buffer.from(data);
      audioBuffer = Buffer.concat([audioBuffer, buffer]);
    });

    dgConnection.on(LiveTTSEvents.Flushed, () => {
      console.log("Deepgram Flushed");
      // Write the buffered audio data to a file when the flush event is received
      writeFile();
    });

    dgConnection.on(LiveTTSEvents.Error, (err) => {
      console.error(err);
    });
  });

  const writeFile = () => {
    if (audioBuffer.length > 0) {
      fs.writeFile("output.mp3", audioBuffer, (err) => {
        if (err) {
          console.error("Error writing audio file:", err);
        } else {
          console.log("Audio file saved as output.mp3");
        }
      });
      audioBuffer = Buffer.alloc(0); // Reset buffer after writing
    }
  };
};

live();
