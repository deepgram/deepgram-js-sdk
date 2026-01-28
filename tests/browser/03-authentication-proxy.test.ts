import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 03-authentication-proxy", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully authenticate through proxy", async () => {
    const url = getExampleUrl("03-authentication-proxy.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // This example doesn't use apiKey input - it uses "proxy" as hardcoded API key
    // Just click the run button directly
    await clickButton(page, "runExample");

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

