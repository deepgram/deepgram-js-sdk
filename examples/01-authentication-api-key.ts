/**
 * Example: Authentication with API Key
 *
 * This example demonstrates the three ways to authenticate using an API key:
 * 1. Pass API key as first parameter
 * 2. Pass API key in options object
 * 3. Use environment variable (DEEPGRAM_API_KEY)
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

// Method 1: Pass API key in options object
const deepgramClient1 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Method 2: Use environment variable (DEEPGRAM_API_KEY)
const deepgramClient2 = new DeepgramClient();

// Example usage: Verify authentication by listing projects
async function example() {
  try {
    const data = await deepgramClient1.manage.v1.projects.list();
    if (data) {
      console.log("Authentication successful! Projects:", JSON.stringify(data, null, 2));
    } else {
      console.error("No data returned from the API");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const data = await deepgramClient2.manage.v1.projects.list();
    if (data) {
      console.log("Authentication successful! Projects:", JSON.stringify(data, null, 2));
    } else {
      console.error("No data returned from the API");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

example();
