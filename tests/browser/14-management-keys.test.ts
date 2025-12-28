import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getProjectId } from "./setup";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

describe("Browser Example: 14-management-keys", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully list keys", async () => {
    const url = getExampleUrl("14-management-keys.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    const projectIdInput = await page.$("#projectId");
    if (projectIdInput) {
      const projectId = getProjectId();
      if (projectId) {
        await projectIdInput.fill(projectId);
      }
    }
    
    await clickButton(page, "listButton");

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});
