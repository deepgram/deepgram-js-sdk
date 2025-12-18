import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getApiKey } from "./setup";
import {
  getExampleUrl,
  clickButton,
  hasCorsError,
  waitForElement,
  getOutputContent,
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

  it("should attempt authentication (expecting CORS error)", async () => {
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    const networkResponses: string[] = [];
    
    page.on("console", (msg: any) => {
      consoleMessages.push(msg.text());
    });
    
    page.on("pageerror", (error: any) => {
      pageErrors.push(error.message);
    });

    page.on("response", (response: any) => {
      if (!response.ok() && response.status() >= 400) {
        networkResponses.push(`HTTP Error ${response.status()}: ${response.url()}`);
      }
    });

    const url = getExampleUrl("03-authentication-proxy.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // This example doesn't use apiKey input - it uses "proxy" as hardcoded API key
    // Just click the run button directly
    await clickButton(page, "runExample");

    try {
      await waitForElement(page, "#output", 10000);
      await page.waitForTimeout(2000);
    } catch (error) {
      // Output might not appear
    }

    const outputContent = await getOutputContent(page);
    const allMessages = [...consoleMessages, ...pageErrors, ...networkResponses, outputContent];
    const hasCors = await hasCorsError(page, allMessages);
    expect(hasCors).toBe(true);
  }, 10000);
});

