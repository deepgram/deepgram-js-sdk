/**
 * Example: Authentication with API Key
 * 
 * This example demonstrates the three ways to authenticate using an API key:
 * 1. Pass API key as first parameter
 * 2. Pass API key in options object
 * 3. Use environment variable (DEEPGRAM_API_KEY)
 */

const { createClient } = require("@deepgram/sdk");

// Method 1: Pass API key as first parameter
const deepgramClient1 = createClient(process.env.DEEPGRAM_API_KEY);

// Method 2: Pass API key in options object
const deepgramClient2 = createClient({ key: process.env.DEEPGRAM_API_KEY });

// Method 3: Use environment variable (DEEPGRAM_API_KEY)
const deepgramClient3 = createClient();

// Example usage: Get token details
async function example() {
  const { result, error } = await deepgramClient1.manage.getTokenDetails();
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Token details:", result);
}

example();

