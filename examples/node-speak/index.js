const { createClient } = require("../../dist/main/index");
const fs = require("fs");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const text = "Hello, how can I help you today?";

const getAudio = async () => {
  const response = await deepgram.speak.request({ text }, { model: "aura-asteria-en" });
  const stream = await response.getStream();
  const headers = await response.getHeaders();
  if (stream) {
    const buffer = await getAudioBuffer(stream);

    fs.writeFile("audio.wav", buffer, (err) => {
      if (err) {
        console.error("Error writing audio to file:", err);
      } else {
        console.log("Audio file written to audio.wav");
      }
    });
  } else {
    console.error("Error generating audio:", stream);
  }

  if (headers) {
    console.log("Headers:", headers);
  }
};

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

getAudio();
