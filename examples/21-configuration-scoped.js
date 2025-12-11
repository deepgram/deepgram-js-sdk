/**
 * Example: Scoped Configuration
 *
 * Examples demonstrating scoped configuration for different namespaces.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

// Change the API url used for all SDK methods
const deepgramClient1 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  baseUrl: "https://api.beta.deepgram.com",
});

// Change the API url used for the Voice Agent websocket
const deepgramClient2 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  // Note: WebSocket URL configuration may need to be set per-connection
});

// Change the API url used for transcription only
const deepgramClient3 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  baseUrl: "http://localhost:8080",
});

// Override fetch transmitter
const yourFetch = async () => {
  return new Response("...etc");
};

const deepgramClient4 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  fetch: yourFetch,
});

// Set custom headers for fetch
const deepgramClient5 = new DeepgramClient({
  headers: { "x-custom-header": "foo" },
});

// Example usage
async function example() {
  try {
    const { data } = await deepgramClient1.manage.v1.projects.list();
    console.log("Projects:", data);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: projects2 } = await deepgramClient2.manage.v1.projects.list();
    console.log("Projects:", projects2);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: projects3 } = await deepgramClient3.manage.v1.projects.list();
    console.log("Projects:", projects3);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: projects4 } = await deepgramClient4.manage.v1.projects.list();
    console.log("Projects:", projects4);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: projects5 } = await deepgramClient5.manage.v1.projects.list();
    console.log("Projects:", projects5);
  } catch (error) {
    console.error("Error:", error);
  }
}

example();
