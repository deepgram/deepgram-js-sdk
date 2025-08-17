# Deepgram JavaScript SDK Monorepo

## Overview

The Deepgram JavaScript SDK is structured as an Nx-powered monorepo designed for scalability and maintainability. This architecture supports multiple packages while providing efficient build caching, parallel execution, and automated release management.

## Architecture

The monorepo uses Nx as the build system orchestrator with PNPM for package management. The core SDK package maintains the `@deepgram/sdk` name for backward compatibility while being positioned for future architectural expansion.

## Directory Structure

```
deepgram-js-sdk/
├── packages/
│   └── core/                    # Main SDK package (@deepgram/sdk)
│       ├── src/                 # Source code
│       ├── tests/               # Test files
│       ├── dist/                # Build outputs
│       ├── package.json         # Package configuration
│       ├── tsconfig.json        # TypeScript config
│       ├── webpack.config.js    # UMD build config
│       ├── jest.config.js       # Test configuration
│       └── project.json         # Nx project configuration
├── examples/                    # Usage examples
├── docs/                        # Documentation
├── nx.json                      # Nx workspace configuration
├── pnpm-workspace.yaml         # PNPM workspace configuration
├── jest.preset.js              # Jest preset for monorepo
├── .release-please-config.json # Release Please configuration
├── .release-please-manifest.json # Release Please manifest
└── package.json                # Root package configuration
```

## Package Structure

### Core Package (`packages/core/`)

The core package contains the main Deepgram SDK functionality:

- **Package Name**: `@deepgram/sdk`
- **Build Outputs**: CommonJS (`dist/main/`), ESM (`dist/module/`), UMD (`dist/umd/`)
- **Entry Points**:
  - Main: `dist/main/index.js`
  - Module: `dist/module/index.js`
  - Types: `dist/module/index.d.ts`
  - UMD: `dist/umd/deepgram.js`

## Build System

### Nx Configuration

The workspace uses Nx for:

- **Build Caching**: Intelligent caching of build artifacts
- **Parallel Execution**: Multiple tasks run simultaneously
- **Dependency Management**: Automatic detection of package dependencies
- **Target Defaults**: Consistent build behavior across packages

### Build Targets

Each package defines standard targets in `project.json`:

- `build`: Complete build process (TypeScript compilation + bundling)
- `test`: Run Jest test suite
- `lint`: ESLint code quality checks
- `clean`: Remove build artifacts

## Development Workflow

### Installation

```bash
# Install all dependencies
pnpm install
```

### Building

```bash
# Build all packages
pnpm run build

# Build specific package
nx build core
```

### Testing

```bash
# Test all packages
pnpm run test

# Test specific package
nx test core

# Run tests with coverage
nx test core --coverage
```

### Linting

```bash
# Lint all packages
pnpm run lint:packages

# Lint specific package
nx lint core
```

### Development Commands

```bash
# Format code
pnpm run format

# Generate documentation
pnpm run docs

# Clean all build artifacts
pnpm run clean
```

## Release Management

### Release Please Configuration

The monorepo uses Release Please in manifest mode for automated releases:

- **Configuration**: `.release-please-config.json`
- **Manifest**: `.release-please-manifest.json`
- **Tag Format**: `@deepgram/sdk@{version}`
- **Release Strategy**: Node.js semantic versioning

### Release Process

1. **Automated PRs**: Release Please creates pull requests for version bumps
2. **Manual Trigger**: Releases can be triggered via GitHub Actions workflow dispatch
3. **Publishing**: Automatic NPM publishing on release creation
4. **Changelog**: Auto-generated changelogs based on conventional commits

## Package Management

### PNPM Workspace

The monorepo uses PNPM workspaces defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
```

### Dependency Management

- **Root Dependencies**: Shared development tools (Nx, TypeScript, Jest, etc.)
- **Package Dependencies**: Each package manages its own runtime dependencies
- **Hoisting**: PNPM automatically hoists shared dependencies

## Examples Integration

All examples are updated to reference the monorepo structure:

- **Node.js Examples**: Import from `../../packages/core/dist/main/index`
- **Browser Examples**: Reference `../../packages/core/dist/umd/deepgram.js`
- **Functionality**: All examples maintain original functionality

## Configuration Files

### Root Level

- `nx.json`: Nx workspace configuration and build caching
- `jest.config.js`: Root Jest configuration using Nx preset
- `tsconfig.json`: Root TypeScript configuration with project references
- `pnpm-workspace.yaml`: PNPM workspace definition

### Package Level

Each package contains:

- `package.json`: Package metadata and dependencies
- `project.json`: Nx project configuration
- `tsconfig.json`: TypeScript compilation settings
- `jest.config.js`: Jest test configuration
- `webpack.config.js`: UMD bundle configuration (if applicable)

## Scaling the Monorepo

### Adding New Packages

1. Create new directory in `packages/`
2. Add `package.json` with package metadata
3. Create `project.json` with Nx targets
4. Configure TypeScript and build tools
5. Update workspace references if needed

### Shared Libraries

Common utilities can be extracted to shared packages:

- Create in `packages/shared/` or similar
- Define as dependency in consuming packages
- Use Nx dependency graph for build ordering

## Performance Features

### Build Caching

Nx caches build outputs based on:

- Source code changes
- Dependency changes
- Configuration changes
- Environment variables

### Parallel Execution

Multiple packages can be built/tested simultaneously:

- Automatic detection of parallelizable tasks
- Respects inter-package dependencies
- Configurable concurrency limits

### Incremental Builds

Only affected packages are rebuilt:

- Git-based change detection
- Dependency graph analysis
- Smart rebuild strategies

## Troubleshooting

### Common Issues

1. **Cache Issues**: Clear Nx cache with `nx reset`
2. **Dependency Conflicts**: Run `pnpm install --force`
3. **Build Failures**: Check individual package configurations
4. **Test Issues**: Verify Jest configuration inheritance

### Debug Commands

```bash
# Show dependency graph
nx graph

# Show affected packages
nx show projects --affected

# Show build cache info
nx show projects --with-target=build

# Reset Nx cache
nx reset
```

## Benefits

- **Scalability**: Easy addition of new packages and features
- **Performance**: Parallel builds with intelligent caching
- **Consistency**: Standardized build and test processes
- **Automation**: Automated releases and dependency management
- **Developer Experience**: Enhanced tooling and workflow efficiency
