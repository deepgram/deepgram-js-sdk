/**
 * Example: API Key Management
 * 
 * Examples for managing API keys: list, get, create, delete.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// List all keys
async function listKeys() {
  const { result, error } = await deepgramClient.manage.getProjectKeys(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Keys:", result);
}

// Get a specific key
async function getKey(keyId) {
  const { result, error } = await deepgramClient.manage.getProjectKey(projectId, keyId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Key:", result);
}

// Create a new API key
async function createKey() {
  const { result, error } = await deepgramClient.manage.createProjectKey(projectId, {
    comment: "My API key",
    scopes: ["usage:write"], // Required: array of scope strings
    tags: ["production"], // Optional: array of tag strings
    time_to_live_in_seconds: 86400, // Optional: TTL in seconds
    // OR use expiration_date: "2024-12-31T23:59:59Z" // Optional: ISO date string
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Created key:", result);
  // Important: Save the key value immediately, as it won't be shown again
  console.log("Key value:", result.key);
}

// Delete a key
async function deleteKey(keyId) {
  const { error } = await deepgramClient.manage.deleteProjectKey(projectId, keyId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Key deleted successfully");
}

// Uncomment to run:
listKeys();
getKey("YOUR_KEY_ID");
createKey();
deleteKey("YOUR_KEY_ID");

