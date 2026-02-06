import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
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

  it("should load the page and successfully authenticate", async () => {
    // Load the HTML example
    const url = getExampleUrl("01-authentication-api-key.html");
    await page.goto(url);

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Click the run button (no API key input needed - proxy handles auth)
    await clickButton(page, "runExample");

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

