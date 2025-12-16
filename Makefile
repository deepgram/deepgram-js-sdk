.PHONY: help examples example-1 example-2 example-3 example-4 example-5 example-6 example-7 example-8 example-9 example-10 example-11 example-12 example-13 example-14 example-15 example-16 example-17 example-18 example-19 example-20 example-21 example-22 example-23 example-24 example-25 example-26 test lint build

# Default target
help:
	@echo "Deepgram JavaScript SDK Examples"
	@echo ""
	@echo "Available targets:"
	@echo "  make examples          - Run all examples (1-25)"
	@echo "  make example-N         - Run a specific example (e.g., make example-1)"
	@echo ""
	@echo "Individual examples:"
	@echo "  1  - Authentication API Key"
	@echo "  2  - Authentication Access Token"
	@echo "  3  - Authentication Proxy"
	@echo "  4  - Transcription Prerecorded URL"
	@echo "  5  - Transcription Prerecorded File"
	@echo "  6  - Transcription Prerecorded Callback"
	@echo "  7  - Transcription Live WebSocket"
	@echo "  8  - Transcription Captions"
	@echo "  9  - Voice Agent"
	@echo "  10 - Text-to-Speech Single"
	@echo "  11 - Text-to-Speech Streaming"
	@echo "  12 - Text Intelligence"
	@echo "  13 - Management Projects"
	@echo "  14 - Management Keys"
	@echo "  15 - Management Members"
	@echo "  16 - Management Invites"
	@echo "  17 - Management Usage"
	@echo "  18 - Management Billing"
	@echo "  19 - Management Models"
	@echo "  20 - On-Premises Credentials"
	@echo "  21 - Configuration Scoped"
	@echo "  22 - Transcription Advanced Options"
	@echo "  23 - File Upload Types"
	@echo "  24 - Error Handling"
	@echo "  25 - Binary Response"
	@echo "  26 - Transcription Live WebSocket V2"

# Run all examples
examples:
	@echo "Running all examples..."
	node examples/01-authentication-api-key.js && node examples/02-authentication-access-token.js && node examples/03-authentication-proxy.js && node examples/04-transcription-prerecorded-url.js && node examples/05-transcription-prerecorded-file.js && node examples/06-transcription-prerecorded-callback.js && node examples/07-transcription-live-websocket.js && node examples/08-transcription-captions.js && node examples/09-voice-agent.js && node examples/10-text-to-speech-single.js && node examples/11-text-to-speech-streaming.js && node examples/12-text-intelligence.js && node examples/13-management-projects.js && node examples/14-management-keys.js && node examples/15-management-members.js && node examples/16-management-invites.js && node examples/17-management-usage.js && node examples/18-management-billing.js && node examples/19-management-models.js && node examples/20-onprem-credentials.js && node examples/21-configuration-scoped.js && node examples/22-transcription-advanced-options.js && node examples/23-file-upload-types.js && node examples/24-error-handling.js && node examples/25-binary-response.js && node examples/26-transcription-live-websocket-v2.js

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

lint:
	biome lint --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none
	biome format --skip-parse-errors --no-errors-on-unmatched --max-diagnostics=none

build:
	tsc --project ./tsconfig.cjs.json
	tsc --project ./tsconfig.esm.json
	node scripts/rename-to-esm-files.js dist/esm

test:
	node scripts/fix-wire-test-imports.js && pnpm test
