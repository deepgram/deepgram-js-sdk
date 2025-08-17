/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient } = require("../../packages/core/dist/main/index");
require("dotenv").config();

const analyze = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const text = "Hello, world!";

  const { result, error } = await deepgram.read.analyzeText(
    { text },
    {
      model: "nova-3",
    }
  );

  if (error) {
    console.error(error);
  } else {
    console.dir(result, { depth: null });
  }
};

analyze();
