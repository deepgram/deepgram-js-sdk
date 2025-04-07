const { createClient } = require("../../dist/main/index");
const fs = require("fs");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const text = "Hello, how can I help you today?";

const getAudio = async () => {
  const { result } = await deepgram.speak.request({ text }, { model: "aura-2-thalia-en" });

  if (!result.ok) {
    throw new Error(`HTTP error! Status: ${result}`);
  }

  const fileStream = fs.createWriteStream("audio.wav");
  await streamPipeline(result.body, fileStream);
};

getAudio();
