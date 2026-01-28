#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

/**
 * Script to replace Client.ts imports with index.ts imports in wire test files.
 * This is needed because the SDK generator creates imports from Client.ts,
 * but we need them to use the custom wrapper from index.ts instead.
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

    // Pattern to match imports from Client that import DeepgramClient
    // Matches various patterns:
    // - from "../../../../../../src/Client"
    // - from "../../../../../../src/Client.js"
    // - from "../../../../../../src/Client.ts"
    // - from "@/src/Client"
    // - from "@deepgram/Client"
    // Only replaces if the import statement contains "DeepgramClient"
    const clientImportRegex = /(import\s+(?:\{[^}]*DeepgramClient[^}]*\}|\*\s+as\s+\w+)\s+from\s+['"])([^'"]*\/)Client(?:\.(ts|js|mjs|mts))?(['"])/g;
    
    newContent = newContent.replace(clientImportRegex, (match, importStart, pathPrefix, extension, quote) => {
        updated = true;
        const ext = extension ? `.${extension}` : "";
        return `${importStart}${pathPrefix}index${ext}${quote}`;
    });

    // Also handle cases where Client might be at the start (alias imports)
    // e.g., from "@/Client" or from "@deepgram/Client" (though less likely)
    const clientImportRegexAlias = /(import\s+(?:\{[^}]*DeepgramClient[^}]*\}|\*\s+as\s+\w+)\s+from\s+['"])([^'"]*\/)?Client(?:\.(ts|js|mjs|mts))?(['"])/g;
    
    // Only apply this if the first regex didn't match (to avoid double replacement)
    if (!updated) {
        newContent = newContent.replace(clientImportRegexAlias, (match, importStart, pathPrefix, extension, quote) => {
            // Only replace if it's actually Client (not something like SomeClient)
            if (!pathPrefix || pathPrefix.endsWith("/")) {
                updated = true;
                const ext = extension ? `.${extension}` : "";
                const prefix = pathPrefix || "";
                return `${importStart}${prefix}index${ext}${quote}`;
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
            console.log(`Updated: ${file}`);
        }
    }

    console.log(`\nUpdated imports in ${updatedCount} out of ${files.length} files.`);
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
            console.log("\n✅ Done! Wire test imports have been updated.");
        } else {
            console.log("\n✅ Done! No imports needed updating.");
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();

