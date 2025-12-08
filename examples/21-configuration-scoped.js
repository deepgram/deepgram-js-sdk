/**
 * Example: Scoped Configuration
 * 
 * Examples demonstrating scoped configuration for different namespaces.
 */

const { createClient } = require("@deepgram/sdk");

// Change the API url used for all SDK methods
const deepgramClient1 = createClient(process.env.DEEPGRAM_API_KEY, {
  global: { fetch: { options: { url: "https://api.beta.deepgram.com" } } },
});

// Change the API url used for the Voice Agent websocket
const deepgramClient2 = createClient(process.env.DEEPGRAM_API_KEY, {
  global: { websocket: { options: { url: "ws://localhost:8080" } } },
});

// Change the API url used for transcription only
const deepgramClient3 = createClient(process.env.DEEPGRAM_API_KEY, {
  listen: { fetch: { options: { url: "http://localhost:8080" } } },
});

// Override fetch transmitter
const yourFetch = async () => {
  return new Response("...etc");
};

const deepgramClient4 = createClient(process.env.DEEPGRAM_API_KEY, {
  global: { fetch: { client: yourFetch } },
});

// Set custom headers for fetch
const deepgramClient5 = createClient({
  global: { fetch: { options: { headers: { "x-custom-header": "foo" } } } },
});

// Example usage
async function example() {
  const { result, error } = await deepgramClient5.manage.getTokenDetails();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Token details:", result);
}

example()

