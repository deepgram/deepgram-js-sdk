import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { clickButton, getExampleUrl, getOutputContent } from "./helpers";

describe("Browser Example: 08-transcription-captions", () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it("should successfully generate captions", async () => {
        const url = getExampleUrl("08-transcription-captions.html");
        await page.goto(url);
        await page.waitForLoadState("domcontentloaded");

        // No API key input needed - proxy handles auth
        await clickButton(page, "runExample");

        // The page writes "Generating transcription..." immediately, before the API response.
        const deadline = Date.now() + 30000;
        let output = "";
        while (Date.now() < deadline) {
            output = await getOutputContent(page);
            if (output.includes("✗ Error:") || output.includes("✗ No data returned")) {
                throw new Error(`Caption generation failed:\n${output}`);
            }
            if (output.includes("✓ Transcription result:") && output.includes('"results"')) {
                break;
            }
            await page.waitForTimeout(500);
        }

        expect(output, `Timed out waiting for caption source data. Last page output:\n${output}`).toContain(
            "✓ Transcription result:",
        );
        expect(output).toContain('"results"');
    }, 30000);
});
