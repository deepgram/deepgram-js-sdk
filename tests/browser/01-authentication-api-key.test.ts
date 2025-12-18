import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  fillApiKey,
  clickButton,
  hasCorsError,
  waitForElement,
  getOutputContent,
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

  it("should load the page and attempt authentication (expecting CORS error)", async () => {
    const apiKey = getApiKey();

    // Set up console message collection for CORS detection
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    // Load the HTML example
    const url = getExampleUrl("01-authentication-api-key.html");
    await page.goto(url);

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Fill in API key
    await fillApiKey(page, apiKey);

    // Click the run button
    await clickButton(page, "runExample");

    // Wait for output to appear
    try {
      await waitForElement(page, "#output", 10000);
      await page.waitForTimeout(2000);
    } catch (error) {
      // Output might not appear, but that's okay
    }

    // Check for CORS error (REST examples should get CORS errors)
    const allMessages = [...consoleMessages, ...pageErrors];
    const hasCors = await hasCorsError(page, allMessages);
    expect(hasCors).toBe(true);
  }, 10000);
});

