/**
 * Example: Text Intelligence
 *
 * Analyze text using Deepgram's intelligence AI features.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

async function analyzeText() {
  const text = `The history of the phrase 'The quick brown fox jumps over the lazy dog'. 
The earliest known apperance of the phrase was in The Boston Journal. 
This phrase is commonly used for typing practice and testing keyboards.`;

  try {
    const data = await deepgramClient.read.v1.text.analyze({
      text,
      language: "en",
      summarize: true, // Enable at least one feature
      // Add more text intelligence options as needed
    });

    console.log("Analysis result:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
analyzeText();
