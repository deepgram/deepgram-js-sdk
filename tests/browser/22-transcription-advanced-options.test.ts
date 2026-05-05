import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 22-transcription-advanced-options", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully transcribe with advanced options", async () => {
    const url = getExampleUrl("22-transcription-advanced-options.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    await clickButton(page, "runExample");

    // Wait for output to appear (advanced transcription can take time)
    await waitForOutput(page, 30000);

    // The example logs a "starting" message immediately, so wait for the
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
