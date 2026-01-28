#!/usr/bin/env node

/**
 * Validates that the ESM build can be imported and used correctly.
 * This script should be run after building the SDK.
 */

import { DeepgramClient } from "../dist/esm/index.mjs";
import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🔍 Validating ESM build...");

// Check that dist/esm exists
const esmPath = join(__dirname, "..", "dist", "esm");
if (!existsSync(esmPath)) {
    console.error("❌ Error: dist/esm directory not found. Run 'npm run build' first.");
    process.exit(1);
}

try {
    // Try to create a client instance
    const client = new DeepgramClient();

    // Check that the client has expected properties
    if (typeof client.sessionId !== "string") {
        throw new Error("Client missing sessionId property");
    }

    if (typeof client.agent !== "object") {
        throw new Error("Client missing agent property");
    }

    if (typeof client.listen !== "object") {
        throw new Error("Client missing listen property");
    }

    if (typeof client.speak !== "object") {
        throw new Error("Client missing speak property");
    }

    console.log("✅ ESM build validation successful!");
    console.log("   - DeepgramClient can be imported");
    console.log("   - Client instance created successfully");
    console.log("   - All expected properties are present");

} catch (error) {
    console.error("❌ ESM build validation failed:");
    console.error(error);
    process.exit(1);
}