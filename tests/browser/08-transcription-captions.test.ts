import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { clickButton, getExampleUrl, waitForOutputMatching } from "./helpers";

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
        const output = await waitForOutputMatching(
            page,
            (value) => value.includes("✓ Transcription result:") && value.includes('"results"'),
        );

        expect(output).toContain("✓ Transcription result:");
        expect(output).toContain('"results"');
    }, 30000);
});
