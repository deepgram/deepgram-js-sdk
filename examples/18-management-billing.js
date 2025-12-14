/**
 * Example: Billing Management
 *
 * Examples for retrieving billing and balance information.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fd061152-cd91-44df-99e5-dd0c9b5de14b";

// Get all balances
async function getAllBalances() {
  try {
    const data = await deepgramClient.manage.v1.projects.billing.balances.list(
      projectId,
    );
    console.log("Balances:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific balance
async function getBalance(balanceId) {
  try {
    const data = await deepgramClient.manage.v1.projects.billing.balances.get(
      projectId,
      balanceId,
    );
    console.log("Balance:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
  const balances = await getAllBalances();
  getBalance(balances.balances[0].balance_id);
})();
