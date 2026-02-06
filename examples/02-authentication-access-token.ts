/**
 * Example: Authentication with Access Token
 *
 * Access tokens are temporary (30-second TTL) and must be obtained using an API key.
 * Uses Bearer scheme in Authorization header.
 *
 * This example verifies that access tokens are actually used and don't fall back
 * to the DEEPGRAM_API_KEY environment variable.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

// Example: Generate an access token first, then use it
async function example() {
  // First, create a client with API key to generate access token
  const apiKeyClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
  });

  if (!process.env.DEEPGRAM_API_KEY) {
    console.error("Error: DEEPGRAM_API_KEY environment variable is required");
    process.exit(1);
  }

  // Generate temporary access token
  try {
    const data = await apiKeyClient.auth.v1.tokens.grant({ });
    console.log("Access token:", data.access_token);
    console.log("Expires in:", data.expires_in, "seconds\n");

    // Use the access token in a new client instance
    const tempClient = new DeepgramClient({ accessToken: data.access_token });

    // Verify the access token is actually being used (Bearer scheme, not Token)
    const authRequest = await tempClient._options.authProvider.getAuthRequest();
    const authHeader = authRequest.headers.Authorization;
    
    console.log("Verifying access token is being used...");
    console.log(`Authorization header: ${authHeader.substring(0, 30)}...`);
    
    if (authHeader.startsWith("Bearer ")) {
      const tokenInHeader = authHeader.substring(7);
      if (tokenInHeader === data.access_token) {
        console.log("✓ PASS: Access token is being used (Bearer scheme)\n");
      } else {
        console.error("✗ FAIL: Access token in header doesn't match provided token");
        process.exit(1);
      }
    } else {
      console.error(`✗ FAIL: Expected Bearer scheme, got: ${authHeader.substring(0, 30)}...`);
      process.exit(1);
    }

    // Now use the temporary client to verify it works
    // Note: Access tokens from grant() have usage:write permission for voice APIs,
    // but NOT for Manage APIs. So we verify with auth.v1.tokens.get() instead.
    const text = `The history of the phrase 'The quick brown fox jumps over the lazy dog'. 
    The earliest known apperance of the phrase was in The Boston Journal. 
    This phrase is commonly used for typing practice and testing keyboards.`;
    
      try {
        const data = await tempClient.read.v1.text.analyze({
          text,
          language: "en",
          summarize: true, // Enable at least one feature
          // Add more text intelligence options as needed
        });
    
        console.log("Analysis result:", JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error:", error);
      }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// WORKS!
example();
