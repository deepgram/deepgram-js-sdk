import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 02-authentication-access-token", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully authenticate with access token", async () => {
    const url = getExampleUrl("02-authentication-access-token.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    await clickButton(page, "runExample");

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

