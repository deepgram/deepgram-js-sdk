import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    globals: true,
                    name: "unit",
                    environment: "node",
                    root: ".",
                    include: ["tests/**/*.test.{js,ts,jsx,tsx}"],
                    exclude: ["tests/wire/**", "tests/browser/**"],
                    setupFiles: ["./tests/setup.ts"],
                },
            },
            {
                test: {
                    globals: true,
                    name: "wire",
                    environment: "node",
                    root: ".",
                    include: ["tests/wire/**/*.test.{js,ts,jsx,tsx}"],
                    setupFiles: ["./tests/setup.ts", "./tests/mock-server/setup.ts"],
                },
            },
            {
                test: {
                    globals: true,
                    name: "browser",
                    environment: "node",
                    root: "./tests/browser",
                    include: ["**/*.test.{js,ts,jsx,tsx}"],
                    setupFiles: ["./setup.ts"],
                    globalSetup: ["./global-setup.ts"],
                    testTimeout: 60000, // 60 second timeout per test
                },
            },
        ],
        passWithNoTests: true,
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            reportsDirectory: "./coverage",
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
