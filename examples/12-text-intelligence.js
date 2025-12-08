/**
 * Example: Text Intelligence
 *
 * Analyze text using Deepgram's intelligence AI features.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

async function analyzeText() {
  const text = `The history of the phrase 'The quick brown fox jumps over the lazy dog'. 
The earliest known appearance of the phrase was in The Boston Journal. 
This phrase is commonly used for typing practice and testing keyboards.`;

  const { result, error } = await deepgramClient.read.analyzeText(
    { text },
    {
      language: "en",
      // Add more text intelligence options as needed
    },
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Analysis result:", JSON.stringify(result, null, 2));
}

// Uncomment to run:
analyzeText();
