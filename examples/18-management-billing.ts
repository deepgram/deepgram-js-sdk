/**
 * Example: Billing Management
 *
 * Examples for retrieving billing and balance information.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = process.env.DEEPGRAM_PROJECT_ID;

function reportError(error) {
    console.error("Error:", error);
    process.exitCode = 1;
}

// Get all balances
async function getAllBalances() {
    try {
        const data = await deepgramClient.manage.v1.projects.billing.balances.list(projectId);
        console.log("Balances:", data);
        return data;
    } catch (error) {
        reportError(error);
    }
}

// Get a specific balance
async function getBalance(balanceId) {
    try {
        const data = await deepgramClient.manage.v1.projects.billing.balances.get(projectId, balanceId);
        console.log("Balance:", data);
        return data;
    } catch (error) {
        reportError(error);
    }
}

// WORKS!
(async () => {
    const balances = await getAllBalances();
    getBalance(balances.balances[0].balance_id);
})();
