import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, it } from "vitest";
import { clickButton, getExampleUrl, waitForSuccessOutput } from "./helpers";

describe("Browser Example: 04-transcription-prerecorded-url", () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it("should successfully transcribe audio from URL", async () => {
        // Load the HTML example
        const url = getExampleUrl("04-transcription-prerecorded-url.html");
        await page.goto(url);

        // Wait for page to load
        await page.waitForLoadState("domcontentloaded");

        // Click the run button (no API key input needed - proxy handles auth)
        await clickButton(page, "runExample");

        await waitForSuccessOutput(page);
    }, 30000);
});
