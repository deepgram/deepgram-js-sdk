import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

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

    // Wait for output to appear (transcription can take time)
    await waitForOutput(page, 30000);
    
    // Wait a bit more for transcription to complete
    await page.waitForTimeout(2000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

