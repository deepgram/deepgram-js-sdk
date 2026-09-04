import { resolve } from "path";
import { defineConfig } from "vitest/config";

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
                    dir: resolve(__dirname, "./tests/browser"),
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
            // A floor, not a target. The CodeCoverageSummary action renders ✔/❌ marks
            // but never fails the build, so without these the number is a dashboard
            // rather than a ratchet. Set a few points under the measured baseline
            // (97.30 statements / 94.19 branches / 96.98 functions / 97.37 lines) so
            // normal churn doesn't turn CI red. Raise them as coverage climbs.
            //
            // Keep in sync with the `thresholds:` input on the CodeCoverageSummary
            // step in .github/workflows/ci.yml — the action defaults to 50/75, and a
            // green ✔ next to a build this gate fails is worse than no marker.
            thresholds: {
                statements: 95,
                branches: 92,
                functions: 95,
                lines: 95,
            },
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
