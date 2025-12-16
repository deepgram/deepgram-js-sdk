.PHONY: help examples example-1 example-2 example-3 example-4 example-5 example-6 example-7 example-8 example-9 example-10 example-11 example-12 example-13 example-14 example-15 example-16 example-17 example-18 example-19 example-20 example-21 example-22 example-23 example-24 example-25 example-26

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
	pnpm run examples

# Individual example targets
example-1:
	pnpm run examples:1

example-2:
	pnpm run examples:2

example-3:
	pnpm run examples:3

example-4:
	pnpm run examples:4

example-5:
	pnpm run examples:5

example-6:
	pnpm run examples:6

example-7:
	pnpm run examples:7

example-8:
	pnpm run examples:8

example-9:
	pnpm run examples:9

example-10:
	pnpm run examples:10

example-11:
	pnpm run examples:11

example-12:
	pnpm run examples:12

example-13:
	pnpm run examples:13

example-14:
	pnpm run examples:14

example-15:
	pnpm run examples:15

example-16:
	pnpm run examples:16

example-17:
	pnpm run examples:17

example-18:
	pnpm run examples:18

example-19:
	pnpm run examples:19

example-20:
	pnpm run examples:20

example-21:
	pnpm run examples:21

example-22:
	pnpm run examples:22

example-23:
	pnpm run examples:23

example-24:
	pnpm run examples:24

example-25:
	pnpm run examples:25

example-26:
	pnpm run examples:26

