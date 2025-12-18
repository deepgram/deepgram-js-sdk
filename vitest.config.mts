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
                    root: "./tests",
                    include: ["**/*.test.{js,ts,jsx,tsx}"],
                    exclude: ["wire/**", "browser/**"],
                    setupFiles: ["./setup.ts"],
                },
            },
            {
                test: {
                    globals: true,
                    name: "wire",
                    environment: "node",
                    root: "./tests/wire",
                    setupFiles: ["../setup.ts", "../mock-server/setup.ts"],
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
                },
            },
        ],
        passWithNoTests: true,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
