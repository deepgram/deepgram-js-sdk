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
	@echo "Running all examples..."
	node examples/01-authentication-api-key.js && node examples/02-authentication-access-token.js && node examples/03-authentication-proxy.js && node examples/04-transcription-prerecorded-url.js && node examples/05-transcription-prerecorded-file.js && node examples/06-transcription-prerecorded-callback.js && node examples/07-transcription-live-websocket.js && node examples/08-transcription-captions.js && node examples/09-voice-agent.js && node examples/10-text-to-speech-single.js && node examples/11-text-to-speech-streaming.js && node examples/12-text-intelligence.js && node examples/13-management-projects.js && node examples/14-management-keys.js && node examples/15-management-members.js && node examples/16-management-invites.js && node examples/17-management-usage.js && node examples/18-management-billing.js && node examples/19-management-models.js && node examples/20-onprem-credentials.js && node examples/21-configuration-scoped.js && node examples/22-transcription-advanced-options.js && node examples/23-file-upload-types.js && node examples/24-error-handling.js && node examples/25-binary-response.js && node examples/26-transcription-live-websocket-v2.js && node examples/27-deepgram-session-header.js

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
	@pnpx http-server -p 8000 examples/browser
	@open http://localhost:8000/examples/browser