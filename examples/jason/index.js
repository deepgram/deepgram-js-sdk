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
  const text = [
    "Ok. That's Malarone 250-100 Milligram Tablet at 880 Washington Avenue Se. . Say yes to cancel this prescription.",
  ];

  // Create a write stream immediately when the script starts
  const outputFile = "output.wav";
  const fileStream = fs.createWriteStream(outputFile);

  // Write the WAV header immediately
  fileStream.write(Buffer.from(wavHeader));

  // Keep track of audio data size for updating the header later
  let audioDataSize = 0;

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const dgConnection = deepgram.speak.live({
    model: "aura-2-thalia-en",
    encoding: "linear16",
    sample_rate: 48000,
  });

  dgConnection.on(LiveTTSEvents.Open, () => {
    console.log("Connection opened");

    // Send each text item sequentially
    (async () => {
      for (const item of text) {
        console.log(`Sending text: "${item}"`);
        dgConnection.sendText(item);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Sleep for half a second
      }
    })();

    // Send Flush message after sending all text items
    // dgConnection.flush();

    dgConnection.on(LiveTTSEvents.Close, () => {
      console.log("Connection closed");
      // Update the WAV header with the final file size
      updateWavHeader(fileStream, audioDataSize);
      fileStream.end();
    });

    dgConnection.on(LiveTTSEvents.Metadata, (data) => {
      console.dir(data, { depth: null });
    });

    dgConnection.on(LiveTTSEvents.Audio, (data) => {
      console.log("Deepgram audio data received");
      // Write audio data to file immediately as it's received
      const buffer = Buffer.from(data);
      fileStream.write(buffer);
      audioDataSize += buffer.length;
    });

    dgConnection.on(LiveTTSEvents.Flushed, () => {
      console.log("Deepgram Flushed");
      // Update the WAV header with the final file size
      updateWavHeader(fileStream, audioDataSize);
      fileStream.end();
      console.log(`Audio file saved as ${outputFile}`);
    });

    dgConnection.on(LiveTTSEvents.Error, (err) => {
      console.error(err);
      // Try to update the header and close the file even on error
      updateWavHeader(fileStream, audioDataSize);
      fileStream.end();
    });
  });

  // Function to update the WAV header with the correct file size
  const updateWavHeader = (stream, dataSize) => {
    // Create a buffer for the file size (RIFF chunk size)
    const fileSizeBuffer = Buffer.alloc(4);
    // File size = total size - 8 bytes (for the RIFF identifier and size field)
    const fileSize = dataSize + 36; // 36 = size of WAV header - 8
    fileSizeBuffer.writeUInt32LE(fileSize, 0);

    // Create a buffer for the data size
    const dataSizeBuffer = Buffer.alloc(4);
    dataSizeBuffer.writeUInt32LE(dataSize, 0);

    // Update the RIFF chunk size (offset 4)
    stream.write(fileSizeBuffer, 0, 4, 4, () => {
      // Update the data chunk size (offset 40)
      stream.write(dataSizeBuffer, 0, 4, 40);
    });
  };
};

live();
