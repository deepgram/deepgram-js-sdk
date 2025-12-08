/**
 * Example: Authentication with Access Token
 *
 * Access tokens are temporary (30-second TTL) and must be obtained using an API key.
 * Uses Bearer scheme in Authorization header.
 */

const { createClient } = require("@deepgram/sdk");

// Must use accessToken property in options object
const deepgramClient = createClient({
  accessToken: process.env.DEEPGRAM_ACCESS_TOKEN,
});

// Or use environment variable (DEEPGRAM_ACCESS_TOKEN)
const deepgramClientFromEnv = createClient();

// Example: Generate an access token first, then use it
async function example() {
  // First, create a client with API key to generate access token
  const apiKeyClient = createClient(process.env.DEEPGRAM_API_KEY);

  // Generate temporary access token
  const { result, error } = await apiKeyClient.auth.grantToken();

  if (error) {
    console.error("Error generating token:", error);
    return;
  }

  console.log("Access token:", result.access_token);
  console.log("Expires in:", result.expires_in, "seconds");

  // Use the access token in a new client instance
  const tempClient = createClient({ accessToken: result.access_token });

  // Now use the temporary client
  const { result: tokenDetails, error: tokenError } =
    await tempClient.manage.getTokenDetails();

  if (tokenError) {
    console.error("Error:", tokenError);
    return;
  }

  console.log("Token details:", tokenDetails);
}

example();
