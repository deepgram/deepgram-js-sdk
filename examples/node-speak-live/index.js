const fs = require("fs");
const { createClient, LiveTTSEvents } = require("../../dist/main/index");

// Add a wav audio container header to the file if you want to play the audio
// using the AudioContext or media player like VLC, Media Player, or Apple Music
// Without this header in the Chrome browser case, the audio will not play.
// prettier-ignore
const wavHeader = [
  0x52, 0x49, 0x46, 0x46, // "RIFF"
  0x00, 0x00, 0x00, 0x00, // Placeholder for file size
  0x57, 0x41, 0x56, 0x45, // "WAVE"
  0x66, 0x6D, 0x74, 0x20, // "fmt "
  0x10, 0x00, 0x00, 0x00, // Chunk size (16)
  0x01, 0x00,             // Audio format (1 for PCM)
  0x01, 0x00,             // Number of channels (1)
  0x80, 0xBB, 0x00, 0x00, // Sample rate (48000)
  0x00, 0xEE, 0x02, 0x00, // Byte rate (48000 * 2)
  0x02, 0x00,             // Block align (2)
  0x10, 0x00,             // Bits per sample (16)
  0x64, 0x61, 0x74, 0x61, // "data"
  0x00, 0x00, 0x00, 0x00  // Placeholder for data size
];

const live = async () => {
  const text = "Hello, how can I help you today?";

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const dgConnection = deepgram.speak.live({
    model: "aura-2-thalia-en",
    encoding: "linear16",
    sample_rate: 48000,
  });

  let audioBuffer = Buffer.from(wavHeader);

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
      fs.writeFile("output.wav", audioBuffer, (err) => {
        if (err) {
          console.error("Error writing audio file:", err);
        } else {
          console.log("Audio file saved as output.wav");
        }
      });
      audioBuffer = Buffer.from(wavHeader); // Reset buffer after writing
    }
  };
};

live();
