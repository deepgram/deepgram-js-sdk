import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

describe("ESM Build Tests", () => {
    const distPath = join(process.cwd(), "dist", "esm");

    it("should have ESM build output", () => {
        expect(existsSync(distPath)).toBe(true);
    });

    it("should have .mjs extensions in all ESM files", () => {
        const customClientPath = join(distPath, "CustomClient.mjs");
        expect(existsSync(customClientPath)).toBe(true);

        const content = readFileSync(customClientPath, "utf8");

        // Check that all relative imports have .mjs extensions
        const importRegex = /import\s+.*?\s+from\s+["'](\.\.?\/[^"']+)["']/g;
        const exportRegex = /export\s+.*?\s+from\s+["'](\.\.?\/[^"']+)["']/g;

        let match;
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            expect(importPath).toMatch(/\.mjs$/);
        }

        while ((match = exportRegex.exec(content)) !== null) {
            const exportPath = match[1];
            expect(exportPath).toMatch(/\.mjs$/);
        }
    });

    it("should have corresponding .d.mts files for type definitions", () => {
        const customClientTypesPath = join(distPath, "CustomClient.d.mts");
        expect(existsSync(customClientTypesPath)).toBe(true);
    });

    it("should successfully import DeepgramClient from ESM build", async () => {
        // This test creates a temporary ESM module that imports the SDK
        const testModulePath = join(process.cwd(), "test-esm-import.mjs");
        const testContent = `
import { DeepgramClient } from './dist/esm/index.mjs';

// Test that we can instantiate a client
const client = new DeepgramClient();
console.log('ESM import successful');
`;

        // Write temporary test file
        const fs = await import("fs/promises");
        await fs.writeFile(testModulePath, testContent);

        try {
            // Try to run the module with Node.js
            execSync(`node ${testModulePath}`, { stdio: "pipe" });

            // If we get here, the import worked
            expect(true).toBe(true);
        } finally {
            // Clean up
            await fs.unlink(testModulePath);
        }
    });

    it("should not have bare imports without extensions in CustomClient.mjs", () => {
        const customClientPath = join(distPath, "CustomClient.mjs");
        const content = readFileSync(customClientPath, "utf8");

        // Check specifically for the problematic import
        expect(content).not.toContain('from "./Client"');
        expect(content).toContain('from "./Client.mjs"');
    });
});