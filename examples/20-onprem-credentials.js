/**
 * Example: On-Prem Credentials Management
 *
 * Examples for managing on-premises distribution credentials.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fd061152-cd91-44df-99e5-dd0c9b5de14b";

// List on-prem credentials
async function listCredentials() {
  try {
    const data = await deepgramClient.selfHosted.v1.distributionCredentials.list(
      projectId,
    );
    console.log("Credentials:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get specific credentials
async function getCredentials(credentialId) {
  try {
    const data = await deepgramClient.selfHosted.v1.distributionCredentials.get(
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
    const data = await deepgramClient.selfHosted.v1.distributionCredentials.create(
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

// Listing credentials works, but cannot test the others as I don't have on-prem credentials.
(async () => {
  const credentials = await listCredentials();
  await getCredentials(credentials.credentials[0].credential_id);
  await createCredentials();
  // await deleteCredentials(credentials.credentials[0].credential_id);
})();
