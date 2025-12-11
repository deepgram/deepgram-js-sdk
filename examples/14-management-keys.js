/**
 * Example: API Key Management
 *
 * Examples for managing API keys: list, get, create, delete.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fdf4337c-a05a-4f3c-b157-fd560c58d802";

// List all keys
async function listKeys() {
  try {
    const data = await deepgramClient.manage.v1.projects.keys.list(
      projectId,
    );
    console.log("Keys:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific key
async function getKey(keyId) {
  try {
    const data = await deepgramClient.manage.v1.projects.keys.get(
      projectId,
      keyId,
    );
    console.log("Key:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Create a new API key
async function createKey() {
  try {
    const data = await deepgramClient.manage.v1.projects.keys.create(
      projectId,
      {
        comment: "My API key",
        scopes: ["usage:write"], // Required: array of scope strings
        tags: ["production"], // Optional: array of tag strings
        time_to_live_in_seconds: 86400, // Optional: TTL in seconds
        // OR use expiration_date: "2024-12-31T23:59:59Z" // Optional: ISO date string
      },
    );
    console.log("Created key:", JSON.stringify(data, null, 2));
    // Important: Save the key value immediately, as it won't be shown again
    console.log("Key value:", data.key);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete a key
async function deleteKey(keyId) {
  try {
    await deepgramClient.manage.v1.projects.keys.delete(projectId, keyId);
    console.log("Key deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
const keys = await listKeys();
await getKey(keys.api_keys[0].api_key.api_key_id);
const newKey = await createKey();
await deleteKey(newKey.api_key_id);
})();