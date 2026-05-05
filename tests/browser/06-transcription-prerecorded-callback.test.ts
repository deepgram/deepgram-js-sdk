import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 06-transcription-prerecorded-callback", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully transcribe with callback", async () => {
    const url = getExampleUrl("06-transcription-prerecorded-callback.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    await clickButton(page, "runExample");

    // Wait for output to appear (callback transcription can take time)
    await waitForOutput(page, 30000);

    // The example logs a "sending" message immediately, so wait for the
    // actual success output instead of checking right away.
    const timeoutMs = 30000;
    const startTime = Date.now();
    let hasSuccess = false;
    while (Date.now() - startTime < timeoutMs) {
      if (await hasSuccessOutput(page)) {
        hasSuccess = true;
        break;
      }
      await page.waitForTimeout(250);
    }

    expect(hasSuccess).toBe(true);
  }, 30000);
});
