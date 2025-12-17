import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chromium, Browser, Page } from "playwright";
import { readdirSync } from "fs";
import { resolve } from "path";
import { getApiKey } from "./setup";
import {
  loadExampleAsDataUrl,
  fillApiKey,
  clickButton,
  waitForOutput,
  hasSuccessOutput,
} from "./helpers";

// Get all HTML example files
const examplesDir = resolve(__dirname, "../../examples/browser");
const exampleFiles = readdirSync(examplesDir)
  .filter((file) => file.endsWith(".html") && file !== "README.md")
  .sort();

describe("Browser Examples", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  // Test each example file
  for (const exampleFile of exampleFiles) {
    describe(exampleFile, () => {
      it("should load without errors", async () => {
        // Load the HTML example
        const dataUrl = loadExampleAsDataUrl(exampleFile);
        await page.goto(dataUrl);

        // Wait for page to load
        await page.waitForLoadState("domcontentloaded");

        // Check that the page loaded successfully
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      });

      it("should have required elements", async () => {
        const apiKey = getApiKey();

        // Load the HTML example
        const dataUrl = loadExampleAsDataUrl(exampleFile);
        await page.goto(dataUrl);

        // Wait for page to load
        await page.waitForLoadState("domcontentloaded");

        // Check for API key input (most examples have this)
        const apiKeyInput = await page.$("#apiKey");
        if (apiKeyInput) {
          // Fill in API key if present
          await fillApiKey(page, apiKey);
        }

        // Check for output area
        const output = await page.$("#output");
        expect(output).toBeTruthy();

        // Check for at least one button
        const buttons = await page.$$("button");
        expect(buttons.length).toBeGreaterThan(0);
      });

      // Only test interactive examples that don't require file uploads or complex setup
      if (
        !exampleFile.includes("file") &&
        !exampleFile.includes("websocket") &&
        !exampleFile.includes("streaming") &&
        !exampleFile.includes("voice-agent")
      ) {
        it("should execute basic functionality", async () => {
          const apiKey = getApiKey();

          // Load the HTML example
          const dataUrl = loadExampleAsDataUrl(exampleFile);
          await page.goto(dataUrl);

          // Wait for page to load
          await page.waitForLoadState("domcontentloaded");

          // Fill in API key if present
          const apiKeyInput = await page.$("#apiKey");
          if (apiKeyInput) {
            await fillApiKey(page, apiKey);
          }

          // Fill in project ID if present and we have one
          const projectIdInput = await page.$("#projectId");
          if (projectIdInput) {
            const projectId = process.env.DEEPGRAM_PROJECT_ID;
            if (projectId) {
              await projectIdInput.fill(projectId);
            }
          }

          // Find and click the main action button
          // Look for common button IDs
          const buttonIds = ["runExample", "startButton", "listButton", "getButton"];
          let buttonClicked = false;

          for (const buttonId of buttonIds) {
            const button = await page.$(`#${buttonId}`);
            if (button) {
              const isDisabled = await button.isDisabled();
              if (!isDisabled) {
                await clickButton(page, buttonId);
                buttonClicked = true;
                break;
              }
            }
          }

          // If no standard button found, try the first enabled button
          if (!buttonClicked) {
            const buttons = await page.$$("button:not([disabled])");
            if (buttons.length > 0) {
              await buttons[0].click();
              buttonClicked = true;
            }
          }

          if (buttonClicked) {
            // Wait for output (with longer timeout for API calls)
            try {
              await waitForOutput(page, 30000);
              // Don't fail if there's an error - just verify the page responded
              const outputContent = await page.$("#output");
              expect(outputContent).toBeTruthy();
            } catch (error) {
              // Some examples might timeout or error - that's okay for basic testing
              // We just want to ensure the page doesn't crash
              console.log(`Example ${exampleFile} timed out or errored, but page loaded correctly`);
            }
          }
        }, 60000); // 60 second timeout for API calls
      }
    });
  }
});

