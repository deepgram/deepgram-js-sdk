/**
 * Example: Authentication with Access Token
 *
 * Access tokens are temporary (30-second TTL) and must be obtained using an API key.
 * Uses Bearer scheme in Authorization header.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

// Example: Generate an access token first, then use it
async function example() {
  // First, create a client with API key to generate access token
  const apiKeyClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
  });

  // Generate temporary access token
  try {
    const data = await apiKeyClient.auth.v1.tokens.grant();
    console.log("Access token:", data.access_token);
    console.log("Expires in:", data.expires_in, "seconds");

    // Use the access token in a new client instance
    const tempClient = new DeepgramClient({ accessToken: data.access_token });

    // Now use the temporary client to verify it works
    const projects = await tempClient.manage.v1.projects.list();
    console.log("Token verified! Projects:", projects);
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
example();
