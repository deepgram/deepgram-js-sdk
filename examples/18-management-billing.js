/**
 * Example: Billing Management
 *
 * Examples for retrieving billing and balance information.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// Get all balances
async function getAllBalances() {
  const { result, error } =
    await deepgramClient.manage.getProjectBalances(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Balances:", result);
}

// Get a specific balance
async function getBalance(balanceId) {
  const { result, error } = await deepgramClient.manage.getProjectBalance(
    projectId,
    balanceId,
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Balance:", result);
}

// Uncomment to run:
getAllBalances();
getBalance("YOUR_BALANCE_ID");
