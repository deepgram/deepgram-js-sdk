/**
 * Example: Proxy Authentication
 * 
 * For browser environments or custom proxy setups.
 * Pass "proxy" as the API key.
 * 
 * Important: Your proxy must set the Authorization: token DEEPGRAM_API_KEY header
 * and forward requests to Deepgram's API.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient("proxy", {
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});

// Example usage
async function example() {
  const { result, error } = await deepgramClient.manage.getTokenDetails();
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Token details:", result);
}

example()

