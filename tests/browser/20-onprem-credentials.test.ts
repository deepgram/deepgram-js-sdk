import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { getProjectId } from "./setup";
import {
  getExampleUrl,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
  findRunButton,
} from "./helpers";

describe("Browser Example: 20-onprem-credentials", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should successfully call management API", async () => {
    const projectId = getProjectId();

    const url = getExampleUrl("20-onprem-credentials.html");
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");

    // No API key input needed - proxy handles auth
    // Fill project ID if available
    if (projectId) {
      const projectIdInput = await page.$("#projectId");
      if (projectIdInput) {
        await projectIdInput.fill(projectId);
      }
    }
    
    // Click the first available button (listButton)
    const runButtonId = await findRunButton(page);
    if (runButtonId) {
      await clickButton(page, runButtonId);
    }

    // Wait for output to appear
    await waitForOutput(page, 30000);

    // Check for success output
    const hasSuccess = await hasSuccessOutput(page);
    expect(hasSuccess).toBe(true);
  }, 30000);
});

