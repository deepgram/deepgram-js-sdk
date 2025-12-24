#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

/**
 * Script to revert index.ts imports back to Client.ts imports in wire test files.
 * This undoes the changes made by fix-wire-test-imports.js.
 */

async function findTestFiles(rootPath) {
    const files = [];

    async function scan(directory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                if (entry.name !== "node_modules" && !entry.name.startsWith(".")) {
                    await scan(fullPath);
                }
            } else if (entry.isFile()) {
                // Only process TypeScript test files
                if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
                    files.push(fullPath);
                }
            }
        }
    }

    await scan(rootPath);
    return files;
}

async function updateFileContents(file) {
    const content = await fs.readFile(file, "utf8");

    let newContent = content;
    let updated = false;

    // Pattern to match imports from index that import DeepgramClient
    // Matches various patterns:
    // - from "../../../../../../src/index"
    // - from "../../../../../../src/index.js"
    // - from "../../../../../../src/index.ts"
    // - from "@/src/index"
    // - from "@deepgram/index"
    // NOTE: Does NOT match api/index - that should remain unchanged
    // Matches both named imports with DeepgramClient and namespace imports (* as Deepgram)
    const indexImportRegex = /(import\s+(?:\{[^}]*DeepgramClient[^}]*\}|\*\s+as\s+\w+)\s+from\s+['"])([^'"]*\/)index(?:\.(ts|js|mjs|mts))?(['"])/g;
    
    newContent = newContent.replace(indexImportRegex, (match, importStart, pathPrefix, extension, quote) => {
        // Skip if this is api/index - we don't want to revert those
        if (pathPrefix.endsWith("/api/")) {
            return match;
        }
        updated = true;
        const ext = extension ? `.${extension}` : "";
        return `${importStart}${pathPrefix}Client${ext}${quote}`;
    });

    // Also handle cases where index might be at the start (alias imports)
    // e.g., from "@/index" or from "@deepgram/index" (though less likely)
    const indexImportRegexAlias = /(import\s+(?:\{[^}]*DeepgramClient[^}]*\}|\*\s+as\s+\w+)\s+from\s+['"])([^'"]*\/)?index(?:\.(ts|js|mjs|mts))?(['"])/g;
    
    // Only apply this if the first regex didn't match (to avoid double replacement)
    if (!updated) {
        newContent = newContent.replace(indexImportRegexAlias, (match, importStart, pathPrefix, extension, quote) => {
            // Skip if this is api/index - we don't want to revert those
            if (pathPrefix && pathPrefix.endsWith("/api/")) {
                return match;
            }
            // Only replace if it's actually index (not something like someIndex)
            if (!pathPrefix || pathPrefix.endsWith("/")) {
                updated = true;
                const ext = extension ? `.${extension}` : "";
                const prefix = pathPrefix || "";
                return `${importStart}${prefix}Client${ext}${quote}`;
            }
            return match;
        });
    }

    if (updated && content !== newContent) {
        await fs.writeFile(file, newContent, "utf8");
        return true;
    }
    return false;
}

async function updateFiles(files) {
    let updatedCount = 0;
    for (const file of files) {
        const updated = await updateFileContents(file);
        if (updated) {
            updatedCount++;
            console.log(`Reverted: ${file}`);
        }
    }

    console.log(`\nReverted imports in ${updatedCount} out of ${files.length} files.`);
    return updatedCount;
}

async function main() {
    try {
        // Default to tests/wire directory if no argument provided
        const targetDir = process.argv[2] || path.join(__dirname, "..", "tests", "wire");
        const targetPath = path.resolve(targetDir);
        
        let targetStats;
        try {
            targetStats = await fs.stat(targetPath);
        } catch (error) {
            console.error(`Error: The provided path does not exist: ${targetPath}`);
            process.exit(1);
        }

        if (!targetStats.isDirectory()) {
            console.error("Error: The provided path is not a directory");
            process.exit(1);
        }

        console.log(`Scanning directory: ${targetPath}`);

        const files = await findTestFiles(targetPath);

        if (files.length === 0) {
            console.log("No test files found.");
            process.exit(0);
        }

        console.log(`Found ${files.length} test files.`);
        const updatedCount = await updateFiles(files);
        
        if (updatedCount > 0) {
            console.log("\n✅ Done! Wire test imports have been reverted.");
        } else {
            console.log("\n✅ Done! No imports needed reverting.");
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();

