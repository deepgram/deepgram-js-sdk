.PHONY: help examples example-1 example-2 example-3 example-4 example-5 example-6 example-7 example-8 example-9 example-10 example-11 example-12 example-13 example-14 example-15 example-16 example-17 example-18 example-19 example-20 example-21 example-22 example-23 example-24 example-25 example-26 example-27 test test-esm lint build browser browser-serve

# Default target
help:
	@printf "\033[1;36mDeepgram JavaScript SDK - Makefile Commands\033[0m\n"
	@echo ""
	@printf "\033[1;33mDevelopment Commands:\033[0m\n"
	@printf "  \033[1;32mmake lint\033[0m              - Run Biome linter and formatter to check code quality\n"
	@printf "  \033[1;32mmake build\033[0m             - Compile TypeScript to both CommonJS and ESM formats\n"
	@printf "  \033[1;32mmake test\033[0m              - Fix wire test imports and run the test suite\n"
	@printf "  \033[1;32mmake test-esm\033[0m          - Run ESM build validation tests\n"
	@echo ""
	@printf "\033[1;33mExample Commands:\033[0m\n"
	@printf "  \033[1;32mmake examples\033[0m          - Run all example scripts (1-26) sequentially\n"
	@printf "  \033[1;32mmake example-N\033[0m         - Run a specific example by number (e.g., make example-1)\n"
	@printf "  \033[1;32mmake browser\033[0m           - Run browser tests\n"
	@printf "  \033[1;32mmake browser-serve\033[0m     - Serve the browser examples for manual testing\n"
	@echo ""
	@printf "\033[1;33mAvailable Examples:\033[0m\n"
	@printf "  \033[36m1\033[0m  - Authentication API Key\n"
	@printf "  \033[36m2\033[0m  - Authentication Access Token\n"
	@printf "  \033[36m3\033[0m  - Authentication Proxy\n"
	@printf "  \033[36m4\033[0m  - Transcription Prerecorded URL\n"
	@printf "  \033[36m5\033[0m  - Transcription Prerecorded File\n"
	@printf "  \033[36m6\033[0m  - Transcription Prerecorded Callback\n"
	@printf "  \033[36m7\033[0m  - Transcription Live WebSocket\n"
	@printf "  \033[36m8\033[0m  - Transcription Captions\n"
	@printf "  \033[36m9\033[0m  - Voice Agent\n"
	@printf "  \033[36m10\033[0m - Text-to-Speech Single\n"
	@printf "  \033[36m11\033[0m - Text-to-Speech Streaming\n"
	@printf "  \033[36m12\033[0m - Text Intelligence\n"
	@printf "  \033[36m13\033[0m - Management Projects\n"
	@printf "  \033[36m14\033[0m - Management Keys\n"
	@printf "  \033[36m15\033[0m - Management Members\n"
	@printf "  \033[36m16\033[0m - Management Invites\n"
	@printf "  \033[36m17\033[0m - Management Usage\n"
	@printf "  \033[36m18\033[0m - Management Billing\n"
	@printf "  \033[36m19\033[0m - Management Models\n"
	@printf "  \033[36m20\033[0m - On-Premises Credentials\n"
	@printf "  \033[36m21\033[0m - Configuration Scoped\n"
	@printf "  \033[36m22\033[0m - Transcription Advanced Options\n"
	@printf "  \033[36m23\033[0m - File Upload Types\n"
	@printf "  \033[36m24\033[0m - Error Handling\n"
	@printf "  \033[36m25\033[0m - Binary Response\n"
	@printf "  \033[36m26\033[0m - Transcription Live WebSocket V2\n"
	@printf "  \033[36m27\033[0m - Deepgram Session Header\n"

# Run all examples
examples:
	@printf "\033[1;36mInstalling tsx...\033[0m\n"; \
	pnpm install --save-exact --save-dev tsx; \
	printf "\033[1;36mRunning all examples...\033[0m\n\n"; \
	TOTAL=27; \
	PASS_COUNT=0; \
	FAIL_COUNT=0; \
	PASSED_LIST=""; \
	FAILED_LIST=""; \
	ERROR_DIR=/tmp/example-errors; \
	mkdir -p $$ERROR_DIR; \
	\
	run_example() { \
		NUM=$$1; \
		FILE=$$2; \
		NAME=$$3; \
		PERCENT=$$((NUM * 100 / TOTAL)); \
		BAR_LEN=25; \
		FILLED=$$((NUM * BAR_LEN / TOTAL)); \
		EMPTY=$$((BAR_LEN - FILLED)); \
		printf "\r\033[1;33m[%2d/%2d]\033[0m [" "$$NUM" "$$TOTAL"; \
		printf "\033[32m"; \
		for i in $$(seq 1 $$FILLED); do printf "█"; done; \
		printf "\033[90m"; \
		for i in $$(seq 1 $$EMPTY); do printf "░"; done; \
		printf "\033[0m] %3d%% \033[36m%s\033[0m ... " "$$PERCENT" "$$NAME"; \
		ERROR_FILE=$$ERROR_DIR/example-$$NUM.err; \
		if pnpm exec tsx "$$FILE" >$$ERROR_FILE 2>&1; then \
			rm -f $$ERROR_FILE; \
			printf "\033[1;32m✓ PASS\033[0m\n"; \
			PASS_COUNT=$$((PASS_COUNT + 1)); \
			if [ -z "$$PASSED_LIST" ]; then \
				PASSED_LIST="$$NUM - $$NAME"; \
			else \
				PASSED_LIST="$$PASSED_LIST"$$'\n'"$$NUM - $$NAME"; \
			fi; \
		else \
			printf "\033[1;31m✗ FAIL\033[0m\n"; \
			FAIL_COUNT=$$((FAIL_COUNT + 1)); \
			if [ -z "$$FAILED_LIST" ]; then \
				FAILED_LIST="$$NUM - $$NAME"; \
			else \
				FAILED_LIST="$$FAILED_LIST"$$'\n'"$$NUM - $$NAME"; \
			fi; \
		fi; \
	}; \
	\
	run_example 1 "examples/01-authentication-api-key.ts" "Authentication API Key"; \
	run_example 2 "examples/02-authentication-access-token.ts" "Authentication Access Token"; \
	run_example 3 "examples/03-authentication-proxy.ts" "Authentication Proxy"; \
	run_example 4 "examples/04-transcription-prerecorded-url.ts" "Transcription Prerecorded URL"; \
	run_example 5 "examples/05-transcription-prerecorded-file.ts" "Transcription Prerecorded File"; \
	run_example 6 "examples/06-transcription-prerecorded-callback.ts" "Transcription Prerecorded Callback"; \
	run_example 7 "examples/07-transcription-live-websocket.ts" "Transcription Live WebSocket"; \
	run_example 8 "examples/08-transcription-captions.ts" "Transcription Captions"; \
	run_example 9 "examples/09-voice-agent.ts" "Voice Agent"; \
	run_example 10 "examples/10-text-to-speech-single.ts" "Text-to-Speech Single"; \
	run_example 11 "examples/11-text-to-speech-streaming.ts" "Text-to-Speech Streaming"; \
	run_example 12 "examples/12-text-intelligence.ts" "Text Intelligence"; \
	run_example 13 "examples/13-management-projects.ts" "Management Projects"; \
	run_example 14 "examples/14-management-keys.ts" "Management Keys"; \
	run_example 15 "examples/15-management-members.ts" "Management Members"; \
	run_example 16 "examples/16-management-invites.ts" "Management Invites"; \
	run_example 17 "examples/17-management-usage.ts" "Management Usage"; \
	run_example 18 "examples/18-management-billing.ts" "Management Billing"; \
	run_example 19 "examples/19-management-models.ts" "Management Models"; \
	run_example 20 "examples/20-onprem-credentials.ts" "On-Premises Credentials"; \
	run_example 21 "examples/21-configuration-scoped.ts" "Configuration Scoped"; \
	run_example 22 "examples/22-transcription-advanced-options.ts" "Transcription Advanced Options"; \
	run_example 23 "examples/23-file-upload-types.ts" "File Upload Types"; \
	run_example 24 "examples/24-error-handling.ts" "Error Handling"; \
	run_example 25 "examples/25-binary-response.ts" "Binary Response"; \
	run_example 26 "examples/26-transcription-live-websocket-v2.ts" "Transcription Live WebSocket V2"; \
	run_example 27 "examples/27-deepgram-session-header.ts" "Deepgram Session Header"; \
	\
	printf "\n\033[1;36m=========================================\033[0m\n"; \
	printf "\033[1;36mSummary Report\033[0m\n"; \
	printf "\033[1;36m=========================================\033[0m\n\n"; \
	printf "\033[1;32mPassed: %d/%d\033[0m\n" "$$PASS_COUNT" "$$TOTAL"; \
	if [ "$$PASS_COUNT" -gt 0 ] && [ -n "$$PASSED_LIST" ]; then \
		printf "\033[1;32m  ✓ Passed examples:\033[0m\n"; \
		echo "$$PASSED_LIST" | awk '{printf "    \033[32m%s\033[0m\n", $$0}'; \
	fi; \
	printf "\n"; \
	printf "\033[1;31mFailed: %d/%d\033[0m\n" "$$FAIL_COUNT" "$$TOTAL"; \
	if [ "$$FAIL_COUNT" -gt 0 ] && [ -n "$$FAILED_LIST" ]; then \
		printf "\033[1;31m  ✗ Failed examples:\033[0m\n"; \
		echo "$$FAILED_LIST" | awk '{printf "    \033[31m%s\033[0m\n", $$0}'; \
		printf "\n\033[1;33mError Details:\033[0m\n"; \
		for err_file in $$ERROR_DIR/example-*.err; do \
			if [ -f "$$err_file" ]; then \
				NUM=$$(basename "$$err_file" | sed 's/example-\([0-9]*\)\.err/\1/'); \
				printf "\n\033[1;31m  Example %d Error:\033[0m\n" "$$NUM"; \
				printf "\033[90m  ────────────────────────────────────────\033[0m\n"; \
				sed 's/^/    /' "$$err_file" | head -20; \
				if [ $$(wc -l < "$$err_file") -gt 20 ]; then \
					printf "    \033[90m... (truncated, see %s for full output)\033[0m\n" "$$err_file"; \
				fi; \
			fi; \
		done; \
		printf "\n"; \
		rm -rf $$ERROR_DIR; \
		printf "\033[1;36mUninstalling tsx...\033[0m\n"; \
		pnpm uninstall tsx; \
		exit 1; \
	else \
		printf "\033[1;32m  All examples passed! 🎉\033[0m\n\n"; \
		rm -rf $$ERROR_DIR; \
		printf "\033[1;36mUninstalling tsx...\033[0m\n"; \
		pnpm uninstall tsx; \
		exit 0; \
	fi

# Individual example targets
example-1:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/01-authentication-api-key.ts
	pnpm uninstall tsx

example-2:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/02-authentication-access-token.ts
	pnpm uninstall tsx

example-3:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/03-authentication-proxy.ts
	pnpm uninstall tsx

example-4:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/04-transcription-prerecorded-url.ts
	pnpm uninstall tsx

example-5:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/05-transcription-prerecorded-file.ts
	pnpm uninstall tsx

example-6:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/06-transcription-prerecorded-callback.ts
	pnpm uninstall tsx

example-7:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/07-transcription-live-websocket.ts
	pnpm uninstall tsx

example-8:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/08-transcription-captions.ts
	pnpm uninstall tsx

example-9:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/09-voice-agent.ts
	pnpm uninstall tsx

example-10:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/10-text-to-speech-single.ts
	pnpm uninstall tsx

example-11:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/11-text-to-speech-streaming.ts
	pnpm uninstall tsx

example-12:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/12-text-intelligence.ts
	pnpm uninstall tsx

example-13:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/13-management-projects.ts
	pnpm uninstall tsx

example-14:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/14-management-keys.ts
	pnpm uninstall tsx

example-15:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/15-management-members.ts
	pnpm uninstall tsx

example-16:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/16-management-invites.ts
	pnpm uninstall tsx

example-17:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/17-management-usage.ts
	pnpm uninstall tsx

example-18:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/18-management-billing.ts
	pnpm uninstall tsx

example-19:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/19-management-models.ts
	pnpm uninstall tsx

example-20:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/20-onprem-credentials.ts
	pnpm uninstall tsx

example-21:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/21-configuration-scoped.ts
	pnpm uninstall tsx

example-22:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/22-transcription-advanced-options.ts
	pnpm uninstall tsx

example-23:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/23-file-upload-types.ts
	pnpm uninstall tsx

example-24:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/24-error-handling.ts
	pnpm uninstall tsx

example-25:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/25-binary-response.ts
	pnpm uninstall tsx

example-26:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/26-transcription-live-websocket-v2.ts
	pnpm uninstall tsx

example-27:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/27-deepgram-session-header.ts
	pnpm uninstall tsx

lint:
	pnpm exec biome lint --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none
	pnpm exec biome format --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none

build:
	pnpm --package=typescript --package=tsup dlx tsup src/index.ts --out-dir dist/browser --format iife --global-name Deepgram --clean --platform browser
	pnpm exec tsc --project ./tsconfig.cjs.json
	pnpm exec tsc --project ./tsconfig.esm.json
	node scripts/rename-to-esm-files.js dist/esm
	node scripts/validate-esm-build.mjs

test:
	node scripts/fix-wire-test-imports.js
	pnpm exec vitest --project unit --run
	pnpm exec vitest --project wire --run
	node scripts/revert-wire-test-imports.js

test-esm:
	@printf "\033[1;36mRunning ESM build tests...\033[0m\n"
	pnpm exec vitest run tests/esm-build.test.ts

browser:
	pnpm install --save-exact --save-dev playwright
	@if [ -n "$$CI" ]; then \
		echo "CI detected: Installing Playwright browsers without system dependencies"; \
		pnpm exec playwright install chromium; \
	else \
		echo "Local environment: Attempting to install with system dependencies (may prompt for sudo)"; \
		pnpm exec playwright install chromium --with-deps 2>/dev/null || \
		{ echo "Failed with --with-deps, trying without..."; pnpm exec playwright install chromium; }; \
	fi
	@printf "\033[1;36mRunning browser tests...\033[0m\n\n"; \
	pnpm exec vitest --project browser --run --reporter=json --reporter=verbose --outputFile=/tmp/browser-test-results.json > /tmp/browser-test-output.txt 2>&1; \
	TEST_EXIT_CODE=$$?; \
	printf "\n\033[1;36m=========================================\033[0m\n"; \
	printf "\033[1;36mSummary Report\033[0m\n"; \
	printf "\033[1;36m=========================================\033[0m\n\n"; \
	if [ -f /tmp/browser-test-results.json ] && command -v node >/dev/null 2>&1; then \
		printf 'const fs = require("fs");\n' > /tmp/browser-summary.js; \
		printf 'try {\n' >> /tmp/browser-summary.js; \
		printf '  const rawData = fs.readFileSync("/tmp/browser-test-results.json", "utf8");\n' >> /tmp/browser-summary.js; \
		printf '  const data = JSON.parse(rawData);\n' >> /tmp/browser-summary.js; \
		printf '  const testResults = data.testResults || [];\n' >> /tmp/browser-summary.js; \
		printf '  let passCount = 0;\n' >> /tmp/browser-summary.js; \
		printf '  let failCount = 0;\n' >> /tmp/browser-summary.js; \
		printf '  const passed = [];\n' >> /tmp/browser-summary.js; \
		printf '  const failed = [];\n' >> /tmp/browser-summary.js; \
		printf '  const errors = [];\n' >> /tmp/browser-summary.js; \
		printf '  testResults.forEach((result, idx) => {\n' >> /tmp/browser-summary.js; \
		printf '    const num = idx + 1;\n' >> /tmp/browser-summary.js; \
		printf '    const filePath = result.name || "";\n' >> /tmp/browser-summary.js; \
		printf '    let fileName = filePath.split("/").pop();\n' >> /tmp/browser-summary.js; \
		printf '    if (fileName.endsWith(".test.ts")) {\n' >> /tmp/browser-summary.js; \
		printf '      fileName = fileName.slice(0, -8);\n' >> /tmp/browser-summary.js; \
		printf '    }\n' >> /tmp/browser-summary.js; \
		printf '    const match = fileName.match(/^(\\d+)-(.+)/);\n' >> /tmp/browser-summary.js; \
		printf '    const name = match ? match[2].replace(/-/g, " ") : fileName;\n' >> /tmp/browser-summary.js; \
		printf '    const hasFailures = result.status === "failed";\n' >> /tmp/browser-summary.js; \
		printf '    if (hasFailures) {\n' >> /tmp/browser-summary.js; \
		printf '      failCount++;\n' >> /tmp/browser-summary.js; \
		printf '      failed.push(num + " - " + name);\n' >> /tmp/browser-summary.js; \
		printf '      const testCases = result.assertionResults || [];\n' >> /tmp/browser-summary.js; \
		printf '      const failedTests = testCases.filter(t => t.status === "failed");\n' >> /tmp/browser-summary.js; \
		printf '      if (failedTests.length > 0) {\n' >> /tmp/browser-summary.js; \
		printf '        const errorMessages = failedTests.map(t => {\n' >> /tmp/browser-summary.js; \
		printf '          const title = t.title || "Unknown test";\n' >> /tmp/browser-summary.js; \
		printf '          const failureMessages = t.failureMessages || [];\n' >> /tmp/browser-summary.js; \
		printf '          const errorText = failureMessages.length > 0 ? failureMessages[0] : "No error message available";\n' >> /tmp/browser-summary.js; \
		printf '          return { num, name, title, error: errorText };\n' >> /tmp/browser-summary.js; \
		printf '        });\n' >> /tmp/browser-summary.js; \
		printf '        errors.push(...errorMessages);\n' >> /tmp/browser-summary.js; \
		printf '      } else if (result.failureMessage) {\n' >> /tmp/browser-summary.js; \
		printf '        errors.push({ num, name, title: "Test suite", error: result.failureMessage });\n' >> /tmp/browser-summary.js; \
		printf '      }\n' >> /tmp/browser-summary.js; \
		printf '    } else {\n' >> /tmp/browser-summary.js; \
		printf '      passCount++;\n' >> /tmp/browser-summary.js; \
		printf '      passed.push(num + " - " + name);\n' >> /tmp/browser-summary.js; \
		printf '    }\n' >> /tmp/browser-summary.js; \
		printf '  });\n' >> /tmp/browser-summary.js; \
		printf '  console.log("\\033[1;32mPassed: " + passCount + "/" + testResults.length + "\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '  if (passed.length > 0) {\n' >> /tmp/browser-summary.js; \
		printf '    console.log("\\033[1;32m  ✓ Passed tests:\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '    passed.forEach(p => console.log("    \\033[32m" + p + "\\033[0m"));\n' >> /tmp/browser-summary.js; \
		printf '  }\n' >> /tmp/browser-summary.js; \
		printf '  console.log("");\n' >> /tmp/browser-summary.js; \
		printf '  console.log("\\033[1;31mFailed: " + failCount + "/" + testResults.length + "\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '  if (failed.length > 0) {\n' >> /tmp/browser-summary.js; \
		printf '    console.log("\\033[1;31m  ✗ Failed tests:\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '    failed.forEach(f => console.log("    \\033[31m" + f + "\\033[0m"));\n' >> /tmp/browser-summary.js; \
		printf '    console.log("");\n' >> /tmp/browser-summary.js; \
		printf '    if (errors.length > 0) {\n' >> /tmp/browser-summary.js; \
		printf '      console.log("\\033[1;33mError Details:\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '      errors.forEach(err => {\n' >> /tmp/browser-summary.js; \
		printf '        console.log("");\n' >> /tmp/browser-summary.js; \
		printf '        console.log("\\033[1;31m  Test " + err.num + " - " + err.name + "\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '        console.log("\\033[1;33m    " + err.title + "\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '        console.log("\\033[90m    ────────────────────────────────────────\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '        const errorLines = err.error.split("\\n").slice(0, 15);\n' >> /tmp/browser-summary.js; \
		printf '        errorLines.forEach(line => console.log("    " + line));\n' >> /tmp/browser-summary.js; \
		printf '        if (err.error.split("\\n").length > 15) {\n' >> /tmp/browser-summary.js; \
		printf '          console.log("    \\033[90m... (truncated, see /tmp/browser-test-output.txt for full output)\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '        }\n' >> /tmp/browser-summary.js; \
		printf '      });\n' >> /tmp/browser-summary.js; \
		printf '      console.log("");\n' >> /tmp/browser-summary.js; \
		printf '    }\n' >> /tmp/browser-summary.js; \
		printf '  } else {\n' >> /tmp/browser-summary.js; \
		printf '    console.log("\\033[1;32m  All tests passed! 🎉\\033[0m\\n");\n' >> /tmp/browser-summary.js; \
		printf '  }\n' >> /tmp/browser-summary.js; \
		printf '} catch (e) {\n' >> /tmp/browser-summary.js; \
		printf '  console.log("\\033[1;33mCould not parse test results: " + e.message + "\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '  console.log("\\033[90mFull test output available at /tmp/browser-test-output.txt\\033[0m");\n' >> /tmp/browser-summary.js; \
		printf '}\n' >> /tmp/browser-summary.js; \
		node /tmp/browser-summary.js; \
	fi; \
	pnpm uninstall playwright; \
	exit $$TEST_EXIT_CODE

browser-serve:
	@rm -f examples/browser/deepgram.js || true
	@cp dist/browser/index.global.js examples/browser/deepgram.js
	@echo "" >> examples/browser/deepgram.js
	@echo "// Expose Deepgram as global for browser compatibility" >> examples/browser/deepgram.js
	@echo "if (typeof window !== 'undefined') {" >> examples/browser/deepgram.js
	@echo "  window.Deepgram = Deepgram;" >> examples/browser/deepgram.js
	@echo "  window.deepgram = Deepgram;" >> examples/browser/deepgram.js
	@echo "}" >> examples/browser/deepgram.js
	@echo "Starting proxy server on port 8001..."
	@node scripts/proxy-server.js & \
	PROXY_PID=$$!; \
	echo "Starting http-server on port 8000..."; \
	pnpx http-server -p 8000 examples/browser & \
	HTTP_SERVER_PID=$$!; \
	trap "kill $$PROXY_PID $$HTTP_SERVER_PID 2>/dev/null; exit" EXIT INT TERM; \
	echo "Servers started. Proxy: http://localhost:8001, Examples: http://localhost:8000"; \
	echo "Press CTRL-C to stop both servers"; \
	wait $$PROXY_PID $$HTTP_SERVER_PID