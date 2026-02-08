SHELL := /bin/bash

.PHONY: help examples example-1 example-2 example-3 example-4 example-5 example-6 example-7 example-8 example-9 example-10 example-11 example-12 example-13 example-14 example-15 example-16 example-17 example-18 example-19 example-20 example-21 example-22 example-23 example-24 example-25 example-26 example-27 example-28 example-29 example-30 example-31 example-32 example-33 example-34 example-35 test test-esm lint build browser browser-serve middleware

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
	@printf "  \033[1;32mmake examples\033[0m          - Run all example scripts (1-35) sequentially\n"
	@printf "  \033[1;32mmake example-N\033[0m         - Run a specific example by number (e.g., make example-1)\n"
	@printf "  \033[1;32mmake browser\033[0m           - Run browser tests\n"
	@printf "  \033[1;32mmake browser-serve\033[0m     - Serve the browser examples for manual testing\n"
	@printf "\033[1;32mmake middleware\033[0m       - Run all middleware server examples simultaneously\n"
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
	@printf "  \033[36m28\033[0m - Text Intelligence Advanced\n"
	@printf "  \033[36m29\033[0m - Management Usage Breakdown\n"
	@printf "  \033[36m30\033[0m - Management Billing Detailed\n"
	@printf "  \033[36m31\033[0m - Management Member Permissions\n"
	@printf "  \033[36m32\033[0m - Management Project Models\n"
	@printf "  \033[36m33\033[0m - Configuration EU Endpoint\n"
	@printf "  \033[36m34\033[0m - Agent Custom Providers\n"
	@printf "  \033[36m35\033[0m - Agent Provider Combinations\n"
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

example-28:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/28-text-intelligence-advanced.ts
	pnpm uninstall tsx

example-29:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/29-management-usage-breakdown.ts
	pnpm uninstall tsx

example-30:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/30-management-billing-detailed.ts
	pnpm uninstall tsx

example-31:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/31-management-member-permissions.ts
	pnpm uninstall tsx

example-32:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/32-management-project-models.ts
	pnpm uninstall tsx

example-33:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/33-configuration-eu-endpoint.ts
	pnpm uninstall tsx

example-34:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/34-agent-custom-providers.ts
	pnpm uninstall tsx

example-35:
	pnpm install --save-exact --save-dev tsx
	pnpm exec tsx examples/35-agent-provider-combinations.ts
	pnpm uninstall tsx

# Build the SDK (compile TypeScript to both CommonJS and ESM)
build:
	@printf "\033[1;36mBuilding SDK...\033[0m\n"
	@source ~/.nvm/nvm.sh && pnpm build

# Run middleware examples simultaneously on different ports
middleware: build
	@printf "\033[1;36mSetting up middleware examples...\033[0m\n"
	@source ~/.nvm/nvm.sh && cd examples/middleware && pnpm install --ignore-workspace
	@printf "\033[1;36mCopying browser SDK bundle...\033[0m\n"
	@cp examples/browser/deepgram.js examples/middleware/deepgram.js
	@printf "\n\033[1;36mStarting all middleware servers...\033[0m\n"
	@printf "\033[33mPress CTRL-C to stop all servers\033[0m\n\n"
	@(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3001 pnpm run http) & \
	HTTP_PID=$$!; \
	(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3002 pnpm run express) & \
	EXPRESS_PID=$$!; \
	(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3003 pnpm run fastify) & \
	FASTIFY_PID=$$!; \
	(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3004 pnpm run token-auth-http) & \
	TOKEN_HTTP_PID=$$!; \
	(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3005 pnpm run token-auth-express) & \
	TOKEN_EXPRESS_PID=$$!; \
	(source ~/.nvm/nvm.sh && cd examples/middleware && PORT=3006 pnpm run token-auth-fastify) & \
	TOKEN_FASTIFY_PID=$$!; \
	python3 -m http.server 8000 --directory examples/middleware & \
	TEST_SERVER_PID=$$!; \
	trap "echo '\n\033[1;31mShutting down all servers...\033[0m'; kill $$HTTP_PID $$EXPRESS_PID $$FASTIFY_PID $$TOKEN_HTTP_PID $$TOKEN_EXPRESS_PID $$TOKEN_FASTIFY_PID $$TEST_SERVER_PID 2>/dev/null; exit" EXIT INT TERM; \
	sleep 2; \
	printf "\033[1;32m✓ HTTP Server:             \033[0mhttp://localhost:3001/api/deepgram\n"; \
	printf "\033[1;32m✓ Express Server:          \033[0mhttp://localhost:3002/api/deepgram\n"; \
	printf "\033[1;32m✓ Fastify Server:          \033[0mhttp://localhost:3003/api/deepgram\n"; \
	printf "\033[1;32m✓ Token Auth (HTTP):       \033[0mhttp://localhost:3004/api/deepgram\n"; \
	printf "\033[1;32m✓ Token Auth (Express):    \033[0mhttp://localhost:3005/api/deepgram\n"; \
	printf "\033[1;32m✓ Token Auth (Fastify):    \033[0mhttp://localhost:3006/api/deepgram\n"; \
	printf "\033[1;32m✓ Test Suite:              \033[0mhttp://localhost:8000/test.html\n"; \
	printf "\n\033[1;36mAll servers running! Open http://localhost:8000/test.html to test.\033[0m\n"; \
	printf "\033[33mPress CTRL-C to stop all servers.\033[0m\n\n"; \
	wait $$HTTP_PID $$EXPRESS_PID $$FASTIFY_PID $$TOKEN_HTTP_PID $$TOKEN_EXPRESS_PID $$TOKEN_FASTIFY_PID $$TEST_SERVER_PID
