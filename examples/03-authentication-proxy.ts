/**
 * Example: Proxy Authentication
 *
 * For browser environments or custom proxy setups.
 * Pass "proxy" as the API key.
 *
 * Important: Your proxy must set the Authorization: token DEEPGRAM_API_KEY header
 * and forward requests to Deepgram's API.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: "proxy",
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});

// Example usage
async function example() {
  try {
    const { data } = await deepgramClient.manage.v1.projects.list();
    console.log("Authentication successful! Projects:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Cannot run this right now, don't have a proxy.
// example();
