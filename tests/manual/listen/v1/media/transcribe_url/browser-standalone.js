const path = require("path");
const { runBrowserTest } = require("../../../../browser-test-utils.js");

/**
 * Browser test for transcribeUrl method
 * 
 * Tests the SDK's ability to transcribe audio from a URL in a browser environment.
 * Uses webpack to create a browser-compatible bundle and Playwright for testing.
 */

(async () => {
    await runBrowserTest({
        testDir: __dirname,
        port: 8765,
        timeout: 30000,
    });
})();
