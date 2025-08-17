#!/bin/bash

echo "🧪 Deepgram SDK Monorepo Release Dry Run"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "nx.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

echo "📋 Current Configuration:"
echo "  - Draft releases: $(cat .release-please-config.json | jq -r .draft)"
echo "  - Package: $(cat .release-please-manifest.json | jq -r '."packages/core"')"
echo "  - Core package name: $(cat packages/core/package.json | jq -r .name)"
echo ""

echo "🔨 Building packages..."
pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

echo "🧪 Testing package structure..."
cd packages/core

# Check build outputs
echo "📁 Checking build outputs:"
test -f dist/main/index.js && echo "  ✅ CommonJS: dist/main/index.js" || echo "  ❌ CommonJS missing"
test -f dist/module/index.js && echo "  ✅ ESM: dist/module/index.js" || echo "  ❌ ESM missing"  
test -f dist/umd/deepgram.js && echo "  ✅ UMD: dist/umd/deepgram.js" || echo "  ❌ UMD missing"
test -f dist/module/index.d.ts && echo "  ✅ Types: dist/module/index.d.ts" || echo "  ❌ Types missing"

echo ""
echo "📦 Package information:"
echo "  Name: $(cat package.json | jq -r .name)"
echo "  Version: $(cat package.json | jq -r .version)"
echo "  Main: $(cat package.json | jq -r .main)"
echo "  Module: $(cat package.json | jq -r .module)"
echo "  Types: $(cat package.json | jq -r .types)"

echo ""
echo "🎯 NPM Dry Run (simulates publish without actually publishing):"

PACKAGE_VERSION=$(cat package.json | jq -r .version)
echo "  Version: $PACKAGE_VERSION"

# Check if version contains prerelease identifiers (like -automated, -alpha, etc.)
if [[ "$PACKAGE_VERSION" =~ -[a-zA-Z] ]]; then
    echo "  📦 Prerelease version detected, using --tag next"
    npm publish --dry-run --access public --tag next
else
    echo "  📦 Stable version detected, using --tag latest"
    npm publish --dry-run --access public --tag latest
fi

echo ""
echo "📊 Package size analysis:"
echo "  Total dist size: $(du -sh dist | cut -f1)"
echo "  Main bundle: $(du -sh dist/main | cut -f1)"
echo "  Module bundle: $(du -sh dist/module | cut -f1)"
echo "  UMD bundle: $(du -sh dist/umd | cut -f1)"

cd ../..

echo ""
echo "🔍 Testing Release Please Configuration:"
echo ""

# Check if release-please is available
if command -v release-please &> /dev/null; then
    echo "✅ release-please CLI found"
    
    echo ""
    echo "🧪 Testing Release Please dry run (simulates PR creation):"
    echo "  This will show what Release Please would do without making changes"
    
    # Run release-please in dry-run mode
    release-please release-pr \
        --config-file=.release-please-config.json \
        --manifest-file=.release-please-manifest.json \
        --dry-run \
        --trace 2>/dev/null || echo "  ℹ️  Release Please dry-run completed (check output above)"
        
    echo ""
    echo "📋 What Release Please would do:"
    echo "  - Analyze commits since last release (v4.11.2)"
    echo "  - Determine next version based on conventional commits"
    echo "  - Update packages/core/package.json with new version"
    echo "  - Update .release-please-manifest.json"
    echo "  - Create CHANGELOG.md entries"
    echo "  - Create a release PR when run normally"
    
else
    echo "ℹ️  release-please CLI not available locally"
    echo "   Release Please testing happens in GitHub Actions"
    echo ""
    echo "🔧 To install release-please CLI for local testing:"
    echo "   npm install -g release-please"
    echo "   # or"
    echo "   pnpm add -g release-please"
fi

echo ""
echo "✅ Dry run complete!"
echo ""
echo "📝 Next steps to test release process:"
echo "  1. Create a test branch: git checkout -b test-monorepo-release"
echo "  2. Make a conventional commit: git commit -m 'feat: test monorepo release'"
echo "  3. Push branch: git push origin test-monorepo-release"
echo "  4. Check GitHub Actions for release-test workflow"
echo "  5. Or merge to main to test with draft releases enabled"
echo ""
echo "🔄 To restore production settings after testing:"
echo "  1. Set 'draft': false in .release-please-config.json"
echo "  2. Remove --dry-run from npm publish in .github/workflows/release.yml"
