import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 24-error-handling", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully demonstrate error handling", async () => {
    const url = getExampleUrl("24-error-handling.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    await clickButton(page, "runExample");

    // Wait for output to appear (API call can take time)
    await waitForOutput(page, 30000);
    
    // Wait a bit more for response
    await page.waitForTimeout(2000);

    // Check for success output (error handling example shows proper error handling)
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

