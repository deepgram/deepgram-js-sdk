/**
 * Example: Usage Management
 *
 * Examples for retrieving usage statistics and request information.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fd061152-cd91-44df-99e5-dd0c9b5de14b";

// Get all requests
async function getAllRequests() {
  try {
    const data = await deepgramClient.manage.v1.projects.requests.list(
      projectId,
      {
        // Add filter options as needed
        // start: "2024-01-01T00:00:00Z",
        // end: "2024-12-31T23:59:59Z",
      },
    );
    console.log("Requests:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific request
async function getRequest(requestId) {
  try {
    const data = await deepgramClient.manage.v1.projects.requests.get(
      projectId,
      requestId,
    );
    console.log("Request:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get usage summary
async function getUsageSummary() {
  try {
    const data = await deepgramClient.manage.v1.projects.usage.get(
      projectId,
      {
        // Add filter options as needed
        // start: "2024-01-01T00:00:00Z",
        // end: "2024-12-31T23:59:59Z",
      },
    );
    console.log("Usage summary:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get usage fields
async function getUsageFields() {
  try {
    const data = await deepgramClient.manage.v1.projects.usage.fields.list(
      projectId,
      {
        // Add filter options as needed
      },
    );
    console.log("Usage fields:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
const requests = await getAllRequests();
getRequest(requests.requests[0].request_id);
  getUsageSummary();
  getUsageFields();
})();
