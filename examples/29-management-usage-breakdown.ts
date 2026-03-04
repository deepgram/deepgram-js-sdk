/**
 * Example: Usage Breakdown
 *
 * Demonstrates detailed usage analytics and breakdown features including:
 * - Basic usage summary
 * - Usage breakdown by features
 * - Filtering by date range
 * - Grouping by accessor, model, tag
 * - Feature-specific filtering (diarize, sentiment, etc.)
 * - Usage fields listing
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = process.env.DEEPGRAM_PROJECT_ID;

// Example 1: Basic usage summary
async function getBasicUsage() {
  console.log("\n=== Basic Usage Summary ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.get(
      projectId,
      {
        // Optional: Filter by date range
        // start: "2024-01-01",
        // end: "2024-12-31",
      },
    );

    console.log("Usage summary:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Detailed usage breakdown with grouping
async function getUsageBreakdownByTag() {
  console.log("\n=== Usage Breakdown by Tag ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        // Group results by tag
        grouping: "tag",
        // Optional: Filter by date range
        // start: "2024-01-01",
        // end: "2024-12-31",
      },
    );

    console.log("Usage breakdown by tag:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Usage breakdown by model
async function getUsageBreakdownByModel() {
  console.log("\n=== Usage Breakdown by Model ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        // Group results by model
        grouping: "model",
      },
    );

    console.log("Usage breakdown by model:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Usage breakdown by accessor (API key)
async function getUsageBreakdownByAccessor() {
  console.log("\n=== Usage Breakdown by Accessor ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        // Group results by accessor (API key)
        grouping: "accessor",
      },
    );

    console.log("Usage breakdown by accessor:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Filter by specific features (requests that used these features)
async function getUsageWithFeatureFilters() {
  console.log("\n=== Usage with Feature Filters ===\n");

  try {
    // Get usage for requests that used diarization and sentiment analysis
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        // Include requests that used these features (OR logic)
        diarize: true,
        sentiment: true,
        summarize: true,
        // Group by model to see which models were used
        grouping: "model",
      },
    );

    console.log("Usage for requests with diarization, sentiment, or summarization:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Filter by endpoint and method
async function getUsageByEndpoint() {
  console.log("\n=== Usage by Endpoint and Method ===\n");

  try {
    // Get usage for listen endpoint with sync method
    const listenSync = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        endpoint: "listen",
        method: "sync",
      },
    );

    console.log("Listen API (sync) usage:");
    console.log(JSON.stringify(listenSync, null, 2));

    // Get usage for speak endpoint
    const speak = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        endpoint: "speak",
      },
    );

    console.log("\nSpeak API usage:");
    console.log(JSON.stringify(speak, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 7: Comprehensive filtering with multiple parameters
async function getDetailedFilteredUsage() {
  console.log("\n=== Detailed Filtered Usage ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        // Date range
        start: "2024-01-01",
        end: "2024-12-31",
        // Endpoint and method
        endpoint: "listen",
        method: "sync",
        // Features used
        diarize: true,
        punctuate: true,
        // Deployment type
        deployment: "hosted",
        // Group by tag
        grouping: "tag",
      },
    );

    console.log("Filtered usage breakdown:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 8: Usage fields - Get available usage metrics
async function getUsageFields() {
  console.log("\n=== Available Usage Fields ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.fields.list(
      projectId,
      {
        // Optional: Filter by date range
        // start: "2024-01-01",
        // end: "2024-12-31",
      },
    );

    console.log("Available usage fields:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 9: Filter by specific tag
async function getUsageBySpecificTag() {
  console.log("\n=== Usage for Specific Tag ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        tag: "production",
        grouping: "model",
      },
    );

    console.log("Usage for 'production' tag:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 10: Filter by specific accessor (API key)
async function getUsageBySpecificAccessor() {
  console.log("\n=== Usage for Specific Accessor ===\n");

  const accessorId = "12345678-1234-1234-1234-123456789012"; // Replace with actual accessor ID

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        accessor: accessorId,
        grouping: "endpoint",
      },
    );

    console.log("Usage for specific accessor:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 11: Exclude requests with specific features (false filters)
async function getUsageExcludingFeatures() {
  console.log("\n=== Usage Excluding Specific Features ===\n");

  try {
    // Get usage for requests that did NOT use diarization or redaction
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        diarize: false,
        redact: false,
        grouping: "model",
      },
    );

    console.log("Usage for requests without diarization or redaction:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 12: Get usage for specific model
async function getUsageBySpecificModel() {
  console.log("\n=== Usage for Specific Model ===\n");

  const modelId = "6f548761-c9c0-429a-9315-11a1d28499c8"; // Replace with actual model ID

  try {
    const data = await deepgramClient.manage.v1.projects.usage.breakdown.get(
      projectId,
      {
        model: modelId,
      },
    );

    console.log("Usage for specific model:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run all examples
(async () => {
  await getBasicUsage();
  await getUsageBreakdownByTag();
  await getUsageBreakdownByModel();
  await getUsageBreakdownByAccessor();
  await getUsageWithFeatureFilters();
  await getUsageByEndpoint();
  await getDetailedFilteredUsage();
  await getUsageFields();
  await getUsageBySpecificTag();
  // Uncomment if you have specific accessor/model IDs:
  // await getUsageBySpecificAccessor();
  // await getUsageExcludingFeatures();
  // await getUsageBySpecificModel();
})();
