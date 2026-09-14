import { type Browser, chromium, type Page } from "playwright";
import { afterAll, beforeAll, describe, it } from "vitest";
import { clickButton, getExampleUrl, waitForSuccessOutput } from "./helpers";

describe("Browser Example: 10-text-to-speech-single", () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it("should successfully generate speech", async () => {
        const url = getExampleUrl("10-text-to-speech-single.html");
        await page.goto(url);
        await page.waitForLoadState("domcontentloaded");

        // No API key input needed - proxy handles auth
        await clickButton(page, "runExample");

        await waitForSuccessOutput(page);
    }, 30000);
});
