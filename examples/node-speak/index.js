/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient } = require("../../packages/core/dist/main/index");
const { writeFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config();

const speak = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const text = "Hello, world! This is a test of the Deepgram JS SDK.";

  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
    }
  );

  const stream = await response.getStream();
  const headers = await response.getHeaders();

  if (stream) {
    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    const filePath = resolve(__dirname, "output.mp3");
    writeFileSync(filePath, buffer);
    console.log(`Audio file saved to ${filePath}`);
  } else {
    console.error("Error: Could not get audio stream.");
  }

  if (headers) {
    console.log("Headers:", headers);
  }
};

speak();
