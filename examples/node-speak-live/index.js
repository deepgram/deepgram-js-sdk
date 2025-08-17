/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient, LiveTTSEvents } = require("../../packages/core/dist/main/index");
const { writeFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config();

const speak = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const connection = deepgram.speak.live({
    model: "aura-asteria-en",
  });

  const audioChunks = [];

  connection.on(LiveTTSEvents.Open, () => {
    console.log("Connection opened.");
    connection.sendText("Hello, world! This is a live text-to-speech test.");
    connection.sendText("This is a second sentence.");
    connection.finish();
  });

  connection.on(LiveTTSEvents.Audio, (audio) => {
    console.log("Received audio chunk.");
    audioChunks.push(audio);
  });

  connection.on(LiveTTSEvents.Close, () => {
    console.log("Connection closed.");
    const buffer = Buffer.concat(audioChunks);
    const filePath = resolve(__dirname, "output.mp3");
    writeFileSync(filePath, buffer);
    console.log(`Audio file saved to ${filePath}`);
  });
};

speak();
