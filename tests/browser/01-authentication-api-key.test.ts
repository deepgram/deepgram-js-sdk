import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  loadExampleAsDataUrl,
  fillApiKey,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 01-authentication-api-key", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should load the page and authenticate successfully", async () => {
    const apiKey = getApiKey();

    // Load the HTML example
    const dataUrl = loadExampleAsDataUrl("01-authentication-api-key.html");
    await page.goto(dataUrl);

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Fill in API key
    await fillApiKey(page, apiKey);

    // Click the run button
    await clickButton(page, "runExample");

    // Wait for output
    await waitForOutput(page, 30000);

    // Check for success
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  });
});

