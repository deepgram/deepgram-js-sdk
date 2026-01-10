import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 25-binary-response", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully handle binary response", async () => {
    const url = getExampleUrl("25-binary-response.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    // This example has multiple buttons - click the first one (streamButton)
    await clickButton(page, "streamButton");

    // Wait for output to appear (binary response can take time)
    await waitForOutput(page, 30000);
    
    // Wait a bit more for response
    await page.waitForTimeout(2000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

