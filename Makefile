.PHONY: help examples example-1 example-2 example-3 example-4 example-5 example-6 example-7 example-8 example-9 example-10 example-11 example-12 example-13 example-14 example-15 example-16 example-17 example-18 example-19 example-20 example-21 example-22 example-23 example-24 example-25 example-26 test lint build browser

# Default target
help:
	@printf "\033[1;36mDeepgram JavaScript SDK - Makefile Commands\033[0m\n"
	@echo ""
	@printf "\033[1;33mDevelopment Commands:\033[0m\n"
	@printf "  \033[1;32mmake lint\033[0m              - Run Biome linter and formatter to check code quality\n"
	@printf "  \033[1;32mmake build\033[0m             - Compile TypeScript to both CommonJS and ESM formats\n"
	@printf "  \033[1;32mmake test\033[0m              - Fix wire test imports and run the test suite\n"
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
	@printf "\033[1;36mRunning all examples...\033[0m\n\n"; \
	TOTAL=27; \
	PASS_COUNT=0; \
	FAIL_COUNT=0; \
	PASSED_LIST=""; \
	FAILED_LIST=""; \
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
		if node "$$FILE" >/dev/null 2>&1; then \
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
	run_example 1 "examples/01-authentication-api-key.js" "Authentication API Key"; \
	run_example 2 "examples/02-authentication-access-token.js" "Authentication Access Token"; \
	run_example 3 "examples/03-authentication-proxy.js" "Authentication Proxy"; \
	run_example 4 "examples/04-transcription-prerecorded-url.js" "Transcription Prerecorded URL"; \
	run_example 5 "examples/05-transcription-prerecorded-file.js" "Transcription Prerecorded File"; \
	run_example 6 "examples/06-transcription-prerecorded-callback.js" "Transcription Prerecorded Callback"; \
	run_example 7 "examples/07-transcription-live-websocket.js" "Transcription Live WebSocket"; \
	run_example 8 "examples/08-transcription-captions.js" "Transcription Captions"; \
	run_example 9 "examples/09-voice-agent.js" "Voice Agent"; \
	run_example 10 "examples/10-text-to-speech-single.js" "Text-to-Speech Single"; \
	run_example 11 "examples/11-text-to-speech-streaming.js" "Text-to-Speech Streaming"; \
	run_example 12 "examples/12-text-intelligence.js" "Text Intelligence"; \
	run_example 13 "examples/13-management-projects.js" "Management Projects"; \
	run_example 14 "examples/14-management-keys.js" "Management Keys"; \
	run_example 15 "examples/15-management-members.js" "Management Members"; \
	run_example 16 "examples/16-management-invites.js" "Management Invites"; \
	run_example 17 "examples/17-management-usage.js" "Management Usage"; \
	run_example 18 "examples/18-management-billing.js" "Management Billing"; \
	run_example 19 "examples/19-management-models.js" "Management Models"; \
	run_example 20 "examples/20-onprem-credentials.js" "On-Premises Credentials"; \
	run_example 21 "examples/21-configuration-scoped.js" "Configuration Scoped"; \
	run_example 22 "examples/22-transcription-advanced-options.js" "Transcription Advanced Options"; \
	run_example 23 "examples/23-file-upload-types.js" "File Upload Types"; \
	run_example 24 "examples/24-error-handling.js" "Error Handling"; \
	run_example 25 "examples/25-binary-response.js" "Binary Response"; \
	run_example 26 "examples/26-transcription-live-websocket-v2.js" "Transcription Live WebSocket V2"; \
	run_example 27 "examples/27-deepgram-session-header.js" "Deepgram Session Header"; \
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
		printf "\n"; \
		exit 1; \
	else \
		printf "\033[1;32m  All examples passed! 🎉\033[0m\n\n"; \
		exit 0; \
	fi

# Individual example targets
example-1:
	node examples/01-authentication-api-key.js

example-2:
	node examples/02-authentication-access-token.js

example-3:
	node examples/03-authentication-proxy.js

example-4:
	node examples/04-transcription-prerecorded-url.js

example-5:
	node examples/05-transcription-prerecorded-file.js

example-6:
	node examples/06-transcription-prerecorded-callback.js

example-7:
	node examples/07-transcription-live-websocket.js

example-8:
	node examples/08-transcription-captions.js

example-9:
	node examples/09-voice-agent.js

example-10:
	node examples/10-text-to-speech-single.js

example-11:
	node examples/11-text-to-speech-streaming.js

example-12:
	node examples/12-text-intelligence.js

example-13:
	node examples/13-management-projects.js

example-14:
	node examples/14-management-keys.js

example-15:
	node examples/15-management-members.js

example-16:
	node examples/16-management-invites.js

example-17:
	node examples/17-management-usage.js

example-18:
	node examples/18-management-billing.js

example-19:
	node examples/19-management-models.js

example-20:
	node examples/20-onprem-credentials.js

example-21:
	node examples/21-configuration-scoped.js

example-22:
	node examples/22-transcription-advanced-options.js

example-23:
	node examples/23-file-upload-types.js

example-24:
	node examples/24-error-handling.js

example-25:
	node examples/25-binary-response.js

example-26:
	node examples/26-transcription-live-websocket-v2.js

example-27:
	node examples/27-deepgram-session-header.js

lint:
	pnpm exec biome lint --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none
	pnpm exec biome format --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none

build:
	pnpm --package=typescript --package=tsup dlx tsup src/index.ts --out-dir dist/browser --format iife --global-name Deepgram --clean --platform browser
	pnpm exec tsc --project ./tsconfig.cjs.json
	pnpm exec tsc --project ./tsconfig.esm.json
	node scripts/rename-to-esm-files.js dist/esm

test:
	node scripts/fix-wire-test-imports.js
	pnpm exec vitest --project unit --run
	pnpm exec vitest --project wire --run
	node scripts/revert-wire-test-imports.js

browser:
	pnpm install --save-exact --save-dev playwright
	@if [ -n "$$CI" ]; then \
		echo "CI detected: Installing Playwright browsers without system dependencies"; \
		pnpm exec playwright install chromium; \
	else \
		echo "Local environment: Attempting to install with system dependencies (may prompt for sudo)"; \
		pnpm exec playwright install chromium --with-deps || (echo "Failed with --with-deps, trying without..." && pnpm exec playwright install chromium); \
	fi
	pnpm exec vitest --project browser --run; \
	TEST_EXIT_CODE=$$?; \
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