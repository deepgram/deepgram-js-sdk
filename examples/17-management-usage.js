/**
 * Example: Usage Management
 * 
 * Examples for retrieving usage statistics and request information.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// Get all requests
async function getAllRequests() {
  const { result, error } = await deepgramClient.manage.getProjectUsageRequests(projectId, {
    // Add filter options as needed
    // start: "2024-01-01T00:00:00Z",
    // end: "2024-12-31T23:59:59Z",
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Requests:", result);
}

// Get a specific request
async function getRequest(requestId) {
  const { result, error } = await deepgramClient.manage.getProjectUsageRequest(
    projectId,
    requestId
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Request:", result);
}

// Get usage summary
async function getUsageSummary() {
  const { result, error } = await deepgramClient.manage.getProjectUsageSummary(projectId, {
    // Add filter options as needed
    // start: "2024-01-01T00:00:00Z",
    // end: "2024-12-31T23:59:59Z",
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Usage summary:", result);
}

// Get usage fields
async function getUsageFields() {
  const { result, error } = await deepgramClient.manage.getProjectUsageFields(projectId, {
    // Add filter options as needed
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Usage fields:", result);
}

// Uncomment to run:
getAllRequests();
getRequest("YOUR_REQUEST_ID");
getUsageSummary();
getUsageFields();

