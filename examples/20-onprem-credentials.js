/**
 * Example: On-Prem Credentials Management
 * 
 * Examples for managing on-premises distribution credentials.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// List on-prem credentials
async function listCredentials() {
  const { result, error } = await deepgramClient.onprem.listCredentials(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Credentials:", result);
}

// Get specific credentials
async function getCredentials(credentialId) {
  const { result, error } = await deepgramClient.onprem.getCredentials(projectId, credentialId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Credentials:", result);
}

// Create credentials
async function createCredentials() {
  const { result, error } = await deepgramClient.onprem.createCredentials(projectId, {
    // Add credential creation options
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Created credentials:", result);
}

// Delete credentials
async function deleteCredentials(credentialId) {
  const { error } = await deepgramClient.onprem.deleteCredentials(projectId, credentialId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Credentials deleted successfully");
}

// Uncomment to run:
listCredentials();
getCredentials("YOUR_CREDENTIAL_ID");
createCredentials();
deleteCredentials("YOUR_CREDENTIAL_ID");

