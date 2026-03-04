/**
 * Example: Detailed Billing Management
 *
 * Demonstrates comprehensive billing features including:
 * - Account balances
 * - Billing breakdown by various dimensions
 * - Purchase history
 * - Available billing fields
 * - Filtering by date range, accessor, deployment, tag, line item
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = process.env.DEEPGRAM_PROJECT_ID;

// Example 1: Get all balances
async function getAllBalances() {
  console.log("\n=== All Account Balances ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.balances.list(
      projectId,
    );

    console.log("Account balances:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Get a specific balance
async function getSpecificBalance(balanceId) {
  console.log("\n=== Specific Balance Details ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.balances.get(
      projectId,
      balanceId,
    );

    console.log("Balance details:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Get billing breakdown by line item
async function getBillingBreakdownByLineItem() {
  console.log("\n=== Billing Breakdown by Line Item ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        // Group results by line item (e.g., streaming::nova-3)
        grouping: "line_item",
        // Optional: Filter by date range
        // start: "2024-01-01",
        // end: "2024-12-31",
      },
    );

    console.log("Billing breakdown by line item:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Get billing breakdown by accessor (API key)
async function getBillingBreakdownByAccessor() {
  console.log("\n=== Billing Breakdown by Accessor ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        // Group results by accessor (API key)
        grouping: "accessor",
      },
    );

    console.log("Billing breakdown by accessor:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Get billing breakdown by deployment type
async function getBillingBreakdownByDeployment() {
  console.log("\n=== Billing Breakdown by Deployment ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        // Group results by deployment type
        grouping: "deployment",
      },
    );

    console.log("Billing breakdown by deployment:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Get billing breakdown by tag
async function getBillingBreakdownByTag() {
  console.log("\n=== Billing Breakdown by Tag ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        // Group results by tag
        grouping: "tags",
      },
    );

    console.log("Billing breakdown by tag:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 7: Get billing breakdown with multiple groupings
async function getBillingBreakdownMultiGrouped() {
  console.log("\n=== Billing Breakdown with Multiple Groupings ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        // Group by multiple dimensions
        grouping: ["deployment", "line_item"],
      },
    );

    console.log("Billing breakdown with multiple groupings:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 8: Filter billing by specific accessor
async function getBillingForSpecificAccessor() {
  console.log("\n=== Billing for Specific Accessor ===\n");

  const accessorId = "12345678-1234-1234-1234-123456789012"; // Replace with actual accessor ID

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        accessor: accessorId,
        grouping: "line_item",
      },
    );

    console.log("Billing for specific accessor:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 9: Filter billing by specific line item
async function getBillingForSpecificLineItem() {
  console.log("\n=== Billing for Specific Line Item ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        line_item: "streaming::nova-3",
        grouping: "accessor",
      },
    );

    console.log("Billing for nova-3 streaming:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 10: Filter billing by deployment type
async function getBillingForDeployment() {
  console.log("\n=== Billing for Hosted Deployment ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        deployment: "hosted",
        grouping: "line_item",
      },
    );

    console.log("Billing for hosted deployment:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 11: Filter billing by specific tag
async function getBillingForSpecificTag() {
  console.log("\n=== Billing for Specific Tag ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        tag: "production",
        grouping: "line_item",
      },
    );

    console.log("Billing for 'production' tag:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 12: Comprehensive billing breakdown with date range
async function getDetailedBillingBreakdown() {
  console.log("\n=== Detailed Billing Breakdown ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
      projectId,
      {
        start: "2024-01-01",
        end: "2024-12-31",
        deployment: "hosted",
        grouping: ["line_item", "tags"],
      },
    );

    console.log("Detailed billing breakdown:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 13: Get purchase history
async function getPurchaseHistory() {
  console.log("\n=== Purchase History ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.purchases.list(
      projectId,
      {
        // Optional: Limit results
        limit: 10,
      },
    );

    console.log("Purchase history:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 14: Get available billing fields
async function getBillingFields() {
  console.log("\n=== Available Billing Fields ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.billing.fields.list(
      projectId,
      {
        // Optional: Filter by date range
        // start: "2024-01-01",
        // end: "2024-12-31",
      },
    );

    console.log("Available billing fields:");
    console.log(JSON.stringify(data, null, 2));
    console.log("\nUse these fields to filter your billing breakdown queries!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 15: Monthly billing summary
async function getMonthlyBillingSummary() {
  console.log("\n=== Monthly Billing Summary ===\n");

  const months = [
    { start: "2024-01-01", end: "2024-01-31", name: "January" },
    { start: "2024-02-01", end: "2024-02-29", name: "February" },
    { start: "2024-03-01", end: "2024-03-31", name: "March" },
  ];

  for (const month of months) {
    try {
      const data = await deepgramClient.manage.v1.projects.billing.breakdown.list(
        projectId,
        {
          start: month.start,
          end: month.end,
          grouping: "line_item",
        },
      );

      console.log(`\n${month.name} billing:`);
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error for ${month.name}:`, error);
    }
  }
}

// Run all examples
(async () => {
  const balances = await getAllBalances();

  if (balances?.balances?.[0]?.balance_id) {
    await getSpecificBalance(balances.balances[0].balance_id);
  }

  await getBillingBreakdownByLineItem();
  await getBillingBreakdownByAccessor();
  await getBillingBreakdownByDeployment();
  await getBillingBreakdownByTag();
  await getBillingBreakdownMultiGrouped();
  await getDetailedBillingBreakdown();
  await getPurchaseHistory();
  await getBillingFields();

  // Uncomment if you have specific accessor IDs or want monthly summaries:
  // await getBillingForSpecificAccessor();
  // await getBillingForSpecificLineItem();
  // await getBillingForDeployment();
  // await getBillingForSpecificTag();
  // await getMonthlyBillingSummary();
})();
