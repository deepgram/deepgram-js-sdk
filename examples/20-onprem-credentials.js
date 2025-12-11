/**
 * Example: On-Prem Credentials Management
 *
 * Examples for managing on-premises distribution credentials.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "YOUR_PROJECT_ID";

// List on-prem credentials
async function listCredentials() {
  try {
    const { data } = await deepgramClient.selfHosted.v1.distributionCredentials.list(
      projectId,
    );
    console.log("Credentials:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get specific credentials
async function getCredentials(credentialId) {
  try {
    const { data } = await deepgramClient.selfHosted.v1.distributionCredentials.get(
      projectId,
      credentialId,
    );
    console.log("Credentials:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Create credentials
async function createCredentials() {
  try {
    const { data } = await deepgramClient.selfHosted.v1.distributionCredentials.create(
      projectId,
      {
        // Add credential creation options
      },
    );
    console.log("Created credentials:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete credentials
async function deleteCredentials(credentialId) {
  try {
    await deepgramClient.selfHosted.v1.distributionCredentials.delete(
      projectId,
      credentialId,
    );
    console.log("Credentials deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
listCredentials();
getCredentials("YOUR_CREDENTIAL_ID");
createCredentials();
deleteCredentials("YOUR_CREDENTIAL_ID");
