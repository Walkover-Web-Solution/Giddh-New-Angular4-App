# Electron Branch-Based Environment Configuration

This document explains how to automatically configure Electron builds based on your current Git branch, ensuring you always use the correct environment credentials.

## 🎯 Overview

The system automatically detects your current Git branch and maps it to the appropriate environment configuration:

- **`giddh-2.0` branch** → Uses `.env.local` (local development credentials)
- **`production` branch** → Uses `.env.prod` (production credentials)
- **`master`/`main` branch** → Uses `.env.prod` (production credentials)
- **`stage`/`staging` branch** → Uses `.env.stage` (staging credentials)
- **`develop`/`dev` branch** → Uses `.env.local` (local development credentials)
- **`feature/*` branches** → Uses `.env.local` (local development credentials)

## 🚀 Quick Start

### Method 1: NPM Scripts (Recommended)

```bash
# Auto-detect branch and build Electron
npm run electron:auto

# Test configuration without building
npm run electron:auto:dry-run

# Force specific environment
npm run electron:force-local
npm run electron:force-prod

# Just detect current branch/environment
npm run electron:detect-branch
```

### Method 2: Shell Script

```bash
# Auto-detect and build
./scripts/electron-branch-builder.sh

# Test without building
./scripts/electron-branch-builder.sh --dry-run

# Force production environment
./scripts/electron-branch-builder.sh --force-env=prod

# Show help
./scripts/electron-branch-builder.sh --help
```

### Method 3: Direct Node.js Scripts

```bash
# Detect branch and environment
node scripts/detect-branch-env.js

# Build with auto-detection
node scripts/build-electron-env.js

# Build with forced environment
node scripts/build-electron-env.js --force-env=prod
```

## 📁 Environment Files

Make sure you have the following environment files in your project root:

- `.env.local` - Local development credentials
- `.env.stage` - Staging environment credentials  
- `.env.prod` - Production environment credentials
- `.env.electron` - Electron-specific configuration (optional)

### Example `.env.local`:
```env
# Local Development Environment
APP_URL=http://localhost:3000/
API_URL=https://apitest.giddh.com/
GOOGLE_CLIENT_ID=your-dev-client-id
GOOGLE_CLIENT_SECRET=your-dev-client-secret
RAZORPAY_KEY=rzp_test_your-test-key
```

### Example `.env.prod`:
```env
# Production Environment
APP_URL=https://books.giddh.com
API_URL=https://api.giddh.com/
GOOGLE_CLIENT_ID=your-prod-client-id
GOOGLE_CLIENT_SECRET=your-prod-client-secret
RAZORPAY_KEY=rzp_live_your-live-key
```

## 🔧 How It Works

1. **Branch Detection**: The system detects your current Git branch using `git rev-parse --abbrev-ref HEAD`

2. **Environment Mapping**: Maps the branch to an environment based on predefined rules

3. **Configuration Loading**: Loads the appropriate `.env` file for that environment

4. **Electron Update**: Updates Electron configuration files with the correct credentials:
   - `apps/electron-giddh/src/index.ts` - Main process environment flags
   - `apps/electron-giddh/src/main-auth.config.ts` - OAuth credentials

5. **Build Process**: Builds the Angular app and Electron with the correct environment

## 🛠️ Configuration Files Updated

The system automatically updates these files based on your branch:

### `apps/electron-giddh/src/index.ts`
```typescript
let STAGING_ENV = false;    // true if stage branch
let TEST_ENV = false;       // true if test branch  
let LOCAL_ENV = true;       // true if local branch
let PRODUCTION_ENV = false; // true if production branch
let APP_URL = 'http://localhost:3000/'; // from .env file
```

### `apps/electron-giddh/src/main-auth.config.ts`
```typescript
export const GoogleLoginElectronConfig = {
    clientId: 'your-google-client-id',     // from .env file
    clientSecret: 'your-google-secret',    // from .env file
};
```

## 🔍 Troubleshooting

### Branch Not Detected
```bash
# Check if you're in a Git repository
git status

# Check current branch manually
git branch --show-current
```

### Environment File Missing
```bash
# Check which files exist
ls -la .env*

# Create missing environment file
cp .env.example .env.local
```

### Build Fails
```bash
# Test configuration without building
npm run electron:auto:dry-run

# Check what environment would be used
npm run electron:detect-branch

# Force a specific environment
npm run electron:force-local
```

## 📋 Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run electron:auto` | Auto-detect branch and build Electron |
| `npm run electron:auto:dry-run` | Test configuration without building |
| `npm run electron:force-local` | Force local environment build |
| `npm run electron:force-prod` | Force production environment build |
| `npm run electron:detect-branch` | Show current branch and environment mapping |
| `npm run build:electron` | Build Angular app for Electron |
| `npm run electron:build` | Build Electron main process |

## 🔒 Security Notes

- **Never commit production credentials** to your repository
- Production builds should use server environment variables when possible
- The `.env.prod` file should only contain placeholder values in the repository
- Actual production credentials should be set as server environment variables

## 🎛️ Advanced Usage

### Custom Branch Mapping

Edit `scripts/detect-branch-env.js` to customize branch-to-environment mapping:

```javascript
const branchMappings = {
    'your-custom-branch': 'stage',
    'another-branch': 'local',
    // Add your custom mappings here
};
```

### Environment-Specific Builds

```bash
# Build for specific environment regardless of branch
node scripts/build-electron-env.js --force-env=stage

# Simulate different branch
node scripts/build-electron-env.js --branch=production

# Verbose output for debugging
node scripts/build-electron-env.js --verbose
```

## ✅ Verification

After running the build, verify the configuration:

1. Check the console output for environment detection
2. Verify the correct `.env` file was loaded
3. Check that Electron configuration files were updated
4. Test the built Electron app with the expected environment

## 🚨 Important Notes

- Always test with `--dry-run` first when trying new configurations
- The system preserves your original configuration files as backups
- Environment detection runs every time you build
- Branch switching automatically changes the environment on next build

This system ensures you never accidentally use wrong credentials when building Electron for different environments!
