# Giddh Environment Configuration Guide

## Overview

This project uses a dynamic environment generation system that supports multiple deployment environments (local, test, staging, production) for both web and Electron applications. The system is built with Angular 21 compatibility and includes security features for production deployments.

## 🏗️ Architecture

### Environment Generation System

- **Dynamic Configuration**: Uses `scripts/build-env.js` to generate `environment.generated.ts` at build time
- **Security First**: Production builds prioritize server environment variables over `.env` files
- **Multi-Platform**: Supports both web and Electron applications
- **Angular 21 Compatible**: Updated for latest Angular architecture

### File Structure

```text
├── scripts/
│   └── build-env.js                    # Environment generation script
├── apps/web-giddh/src/environments/
│   ├── environment.ts                  # Base environment file
│   ├── environment.generated.ts        # Auto-generated (DO NOT EDIT)
│   └── model.ts                        # Environment interface
├── .env.local                          # Local development (optional)
├── .env.stage                          # Staging environment (optional)
├── .env.prod                           # Production environment (optional)
├── .env.test                           # Test environment (optional)
└── .env.electron                       # Electron-specific (optional)
```

## 🌍 Environment Configurations

### Supported Environments

| Environment | Description | Web URL | API URL |
|-------------|-------------|---------|---------|
| **local** | Local development | `http://localhost:3000/` | `https://apitest.giddh.com/` |
| **test** | Test environment | `https://test.giddh.com` | `https://apitest.giddh.com/` |
| **stage** | Staging environment | `https://stage.giddh.com` | `https://apistage.giddh.com/` |
| **prod** | Production environment | `https://books.giddh.com` | `https://api.giddh.com/` |
| **electron** | Electron application | `./` (relative) | Configurable |

### Environment Variables

#### Core Configuration
```env
# Application URLs
APP_URL=https://books.giddh.com
API_URL=https://api.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
PORTAL_URL=https://portal.giddh.com/

# Environment Flags
IS_ELECTRON=false
ERRLYTIC_NEEDED=true
ERRLYTIC_KEY=your_errlytic_key

# Application Settings
APP_FOLDER=
ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY=true
```

#### External Service Keys
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment Gateway
RAZORPAY_KEY=rzp_live_your_key

# SMS/OTP Service
OTP_WIDGET_ID=your_widget_id
OTP_TOKEN_AUTH=your_token

# Social Login
TWITTER_CLIENT_ID=your_twitter_id
TWITTER_SECRET_KEY=your_twitter_secret
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_SECRET_KEY=your_linkedin_secret
```

## 🚀 Build Commands

### Web Application

#### Development Commands
```bash
# Start development server (local environment)
npm start

# Alternative development server command
npm run start.web.giddh

# Build for local development
npm run build
npm run build-dev
```

#### Environment-Specific Builds
```bash
# Build for test environment
npm run build-test

# Build for staging environment
npm run build-stage

# Build for production environment
npm run build-prod
```

### Electron Application

#### Development/Test Builds
```bash
# Build Electron for test environment
npm run build.electron.giddh.test

# Package Electron for test (Windows)
npm run package:windows:test

# Package Electron for test (Mac)
npm run package:mac:test
```

#### Production Builds
```bash
# Build Electron for production
npm run build.electron.giddh

# Package for specific platforms
npm run package:windows      # Windows (ia32 + x64)
npm run package:mac          # macOS (x64)
npm run package:linux        # Linux (x64)

# Package for all platforms
npm run package
```

#### Automated Electron Builds
```bash
# Auto-detect environment and build
npm run electron:auto

# Force specific environment
npm run electron:force-local
npm run electron:force-prod

# Dry run (test configuration without building)
npm run electron:auto:dry-run

# Detect branch-based environment
npm run electron:detect-branch
```

#### CI/CD Builds
```bash
# Windows CI release
npm run release:windows:ci

# macOS CI release
npm run release:mac:ci
```

## ⚙️ Setup Instructions

### 1. Basic Setup
```bash
# Install dependencies
npm install

# Prepare web environment
npm run postinstall.web

# Prepare Electron environment (if needed)
npm run postinstall.electron
```

### 2. Environment File Setup (Optional)

Create environment-specific `.env` files in the project root:

#### `.env.local` (Local Development)
```env
APP_URL=http://localhost:3000/
API_URL=https://apitest.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
IS_ELECTRON=false
GOOGLE_CLIENT_ID=641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com
RAZORPAY_KEY=rzp_test_aWNTpuTtWRMJ9u
OTP_WIDGET_ID=326a63733354393830313330
OTP_TOKEN_AUTH=205968TmXguUAwoD633af103P1
```

#### `.env.prod` (Production)
```env
APP_URL=https://books.giddh.com
API_URL=https://api.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
IS_ELECTRON=false
GOOGLE_CLIENT_ID=your_production_google_client_id
RAZORPAY_KEY=rzp_live_your_production_key
# Add other production keys...
```

#### `.env.electron` (Electron Builds)
```env
IS_ELECTRON=true
APP_URL=./
API_URL=https://api.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
GOOGLE_CLIENT_ID=your_electron_google_client_id
```

### 3. Development Workflow
```bash
# 1. Start development
npm start

# 2. Build for testing
npm run build-test

# 3. Build Electron for testing
npm run build.electron.giddh.test

# 4. Package Electron for distribution
npm run package:windows:test
```

## 🔒 Security Features

### Production Security
- **Server Environment Variables**: Production builds prioritize server environment variables
- **No .env in Production**: `.env` files are ignored in CI/production environments
- **Credential Protection**: Sensitive keys are never committed to repository

### Environment Detection
```javascript
const isProduction = environment === 'prod';
const isCI = process.env.CI === 'true' || process.env.NODE_ENV === 'production';

if (isProduction || isCI) {
    // Use server environment variables only
    console.log('🔒 Production/CI environment detected');
} else {
    // Load from .env files for development
    console.log('📁 Development environment - loading from .env');
}
```

## 🛠️ Advanced Configuration

### Memory Optimization
All build commands use `--max_old_space_size=8192` for large Angular projects:
```bash
node --max_old_space_size=8192 scripts/build-env.js local
```

### Custom Environment Generation
The build script supports custom environment mapping:
```javascript
// In scripts/build-env.js
const envFileMap = {
    'local': '.env.local',
    'stage': '.env.stage',
    'prod': '.env.prod',
    'test': '.env.test',
    'electron': '.env.electron'
};
```

### Electron-Specific Configuration
Electron builds automatically:
- Use relative paths (`./`) for assets
- Set `isElectron: true` flag
- Use ES2015 compilation target for compatibility
- Include Electron-specific preload scripts

## 🐛 Troubleshooting

### Common Issues

#### 1. Environment File Not Loading
```bash
# Check if file exists and has correct name
ls -la .env*

# Verify file permissions
chmod 644 .env.local

# Check build output for loading messages
npm start
# Look for: "✅ Successfully loaded .env.local"
```

#### 2. Build Failures
```bash
# Clear node modules and reinstall
npm run clean

# Check Node.js version (requires Node 18+)
node --version

# Increase memory if needed
export NODE_OPTIONS="--max_old_space_size=8192"
```

#### 3. Electron Build Issues
```bash
# Rebuild Electron dependencies
npm run postinstall.electron

# Check Electron configuration
npm run electron:auto:dry-run

# Fix Electron build issues
npm run electron:fix
```

#### 4. Environment Variables Not Applied
```bash
# Regenerate environment file
node scripts/build-env.js local

# Check generated file
cat apps/web-giddh/src/environments/environment.generated.ts

# Verify environment detection
npm run electron:detect-branch
```

### Debug Commands
```bash
# Check environment configuration
node scripts/build-env.js local

# Verify build configuration
npm run electron:auto:dry-run

# Check bundle analysis
npm run bundle:report

# Lint and format
npm run lint
npm run format
```

## 📋 Environment Checklist

### Before Deployment
- [ ] Environment variables configured on server
- [ ] API URLs point to correct endpoints
- [ ] SSL certificates valid for production domains
- [ ] External service keys (Google, Razorpay, etc.) configured
- [ ] Build process tested in target environment
- [ ] Electron signing certificates available (if applicable)

### Development Setup
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment files created (optional)
- [ ] Development server starts successfully
- [ ] Build process completes without errors

## 🔗 Related Documentation

- [Angular 21 Migration Guide](./ANGULAR_21_MIGRATION.md)
- [Electron Build Configuration](./electron-sign/README.md)
- [Environment Variables Audit](./ENVIRONMENT_VARIABLES_AUDIT_REPORT.md)
- [Build Process Documentation](./tools/README.md)

## 📞 Support

For issues with environment configuration:
1. Check the troubleshooting section above
2. Verify environment variables are correctly set
3. Ensure build scripts have proper permissions
4. Check Node.js and npm versions compatibility

---

**Note**: This configuration system is designed for Angular 21 and includes security best practices for production deployments. Always use server environment variables for sensitive credentials in production environments.
