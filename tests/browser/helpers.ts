import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Load an HTML example file and return its content as a data URL
 */
export function loadExampleAsDataUrl(examplePath: string): string {
  const fullPath = resolve(__dirname, "../../examples/browser", examplePath);
  const htmlContent = readFileSync(fullPath, "utf-8");
  // Convert to data URL
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}

/**
 * Wait for an element to appear in the page
 */
export async function waitForElement(
  page: any,
  selector: string,
  timeout = 5000
): Promise<any> {
  return page.waitForSelector(selector, { timeout });
}

/**
 * Fill API key input field
 */
export async function fillApiKey(page: any, apiKey: string): Promise<void> {
  const apiKeyInput = await waitForElement(page, "#apiKey");
  await apiKeyInput.fill(apiKey);
}

/**
 * Click a button by ID
 */
export async function clickButton(page: any, buttonId: string): Promise<void> {
  const button = await waitForElement(page, `#${buttonId}`);
  await button.click();
}

/**
 * Wait for output to appear (indicating the example ran)
 */
export async function waitForOutput(page: any, timeout = 30000): Promise<void> {
  await waitForElement(page, "#output", timeout);
  // Wait a bit more for content to appear
  await page.waitForTimeout(500);
}

/**
 * Get output content
 */
export async function getOutputContent(page: any): Promise<string> {
  const output = await waitForElement(page, "#output");
  const content = await output.textContent();
  return content || "";
}

/**
 * Check if output contains success message
 */
export async function hasSuccessOutput(page: any): Promise<boolean> {
  const content = await getOutputContent(page);
  return content.includes("✓") || content.includes("success");
}

/**
 * Check if output contains error message
 */
export async function hasErrorOutput(page: any): Promise<boolean> {
  const content = await getOutputContent(page);
  return content.includes("✗") || content.includes("Error");
}

