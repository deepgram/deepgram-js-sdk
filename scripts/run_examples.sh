#!/bin/bash

# Check for DEEPGRAM_API_KEY in environment or .env file
if [ -z "$DEEPGRAM_API_KEY" ] && [ ! -f .env ] || ([ -f .env ] && ! grep -q "DEEPGRAM_API_KEY" .env); then
    echo "❌ DEEPGRAM_API_KEY not found in environment variables or .env file"
    echo "Please set up your Deepgram API key before running manual tests"
    echo "You can:"
    echo "  1. Export it: export DEEPGRAM_API_KEY=your_key_here"
    echo "  2. Add it to a .env file: echo 'DEEPGRAM_API_KEY=your_key_here' > .env"
    exit 1
fi

echo "✅ DEEPGRAM_API_KEY found, proceeding with manual tests..."
echo ""

# Check if SDK is built
if [ ! -d "dist/cjs" ]; then
    echo "⚠️  SDK not built, building now..."
    yarn build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed, exiting..."
        exit 1
    fi
    echo "✅ SDK built successfully"
    echo ""
fi

# Function to run a test file
run_test() {
    local test_file=$1
    local test_name=$(echo $test_file | sed 's/tests\/manual\///')
    echo "Running $test_name"
    node "$test_file"
    if [ $? -ne 0 ]; then
        echo "❌ Test failed: $test_name"
        exit 1
    fi
    echo ""
}

echo "✨✨✨✨ Running agent/v1/settings/think/models/ tests ✨✨✨✨"
# run_test "tests/manual/agent/v1/settings/think/models/list/main.js"
echo "skipping because of generated ERROR"

echo "✨✨✨✨ Running auth/v1/tokens/ tests ✨✨✨✨"
run_test "tests/manual/auth/v1/tokens/grant/main.js"

echo "✨✨✨✨ Running manage/v1/models/ tests ✨✨✨✨"
run_test "tests/manual/manage/v1/models/list/main.js"
run_test "tests/manual/manage/v1/models/get/main.js"

echo "✨✨✨✨ Running manage/v1/projects/ tests ✨✨✨✨"
run_test "tests/manual/manage/v1/projects/list/main.js"
# run_test "tests/manual/manage/v1/projects/get/main.js"
# run_test "tests/manual/manage/v1/projects/delete/main.js"
# run_test "tests/manual/manage/v1/projects/update/main.js"
# run_test "tests/manual/manage/v1/projects/leave/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/keys/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/keys/list/main.js"
# run_test "tests/manual/manage/v1/projects/keys/create/main.js"
# run_test "tests/manual/manage/v1/projects/keys/get/main.js"
# run_test "tests/manual/manage/v1/projects/keys/delete/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/members/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/members/list/main.js"
# run_test "tests/manual/manage/v1/projects/members/delete/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/models/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/models/list/main.js"
# run_test "tests/manual/manage/v1/projects/models/get/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/requests/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/requests/list/main.js"
# run_test "tests/manual/manage/v1/projects/requests/get/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/usage/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/usage/get/main.js"
# run_test "tests/manual/manage/v1/projects/usage/breakdown/get/main.js"
# run_test "tests/manual/manage/v1/projects/usage/fields/list/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/billing/balances/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/billing/balances/list/main.js"
# run_test "tests/manual/manage/v1/projects/billing/balances/get/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/billing/breakdown/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/billing/breakdown/list/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/billing/fields/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/billing/fields/list/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/billing/purchases/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/billing/purchases/list/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/members/invites/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/members/invites/list/main.js"
# run_test "tests/manual/manage/v1/projects/members/invites/create/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running manage/v1/projects/members/scopes/ tests ✨✨✨✨"
# run_test "tests/manual/manage/v1/projects/members/scopes/list/main.js"
# run_test "tests/manual/manage/v1/projects/members/scopes/update/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running selfHosted/v1/distributionCredentials/ tests ✨✨✨✨"
# run_test "tests/manual/selfHosted/v1/distributionCredentials/list/main.js"
# run_test "tests/manual/selfHosted/v1/distributionCredentials/create/main.js"
# run_test "tests/manual/selfHosted/v1/distributionCredentials/get/main.js"
# run_test "tests/manual/selfHosted/v1/distributionCredentials/delete/main.js"
echo "skipping specific or destructive"

echo "✨✨✨✨ Running read/v1/text/analyze/ tests ✨✨✨✨"
run_test "tests/manual/read/v1/text/analyze/main.js"

echo "✨✨✨✨ Running speak/v1/audio/generate/ tests ✨✨✨✨"
run_test "tests/manual/speak/v1/audio/generate/main.js"

echo "✅ All manual tests completed!"