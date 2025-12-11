/**
 * Example: Billing Management
 *
 * Examples for retrieving billing and balance information.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "YOUR_PROJECT_ID";

// Get all balances
async function getAllBalances() {
  try {
    const { data } = await deepgramClient.manage.v1.projects.billing.balances.list(
      projectId,
    );
    console.log("Balances:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific balance
async function getBalance(balanceId) {
  try {
    const { data } = await deepgramClient.manage.v1.projects.billing.balances.get(
      projectId,
      balanceId,
    );
    console.log("Balance:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run:
getAllBalances();
getBalance("YOUR_BALANCE_ID");
