# Angular 21 Environment Variable Setup

This document explains the clean, Angular 21-compatible build-time environment variable flow implemented for the Giddh application.

## Overview

The application now uses a secure, build-time environment variable system that:
- ✅ Loads variables via dotenv at build time only
- ✅ Injects via webpack.DefinePlugin as global constants
- ✅ NO runtime process.env access in Angular code
- ✅ Supports multiple environments (.env.local, .env.stage, .env.prod)
- ✅ Angular 21 compatible with NgModule + Standalone architecture
- ✅ Type-safe with TypeScript declarations

## Architecture

### Build-Time Flow
```
.env files → dotenv → webpack.DefinePlugin → Global Constants → Angular Code
```

### Key Files
- `webpack.env.js` - Main webpack configuration for environment handling
- `.env.local` - Local development environment variables
- `.env.stage` - Staging environment variables  
- `.env.prod` - Production environment variables
- `src/environments/globals.d.ts` - TypeScript declarations for global constants
- `src/environments/environment.ts` - Updated to use global constants

## Environment Files

### .env.local (Development)
```bash
# Local Development Environment Variables
APP_URL=http://localhost:3000/
API_URL=https://apitest.giddh.com/
GOOGLE_CLIENT_ID=your-dev-google-client-id
RAZORPAY_KEY=your-dev-razorpay-key
# ... other development keys
```

### .env.stage (Staging)
```bash
# Staging Environment Variables
APP_URL=https://stage.giddh.com
API_URL=https://apistage.giddh.com/
GOOGLE_CLIENT_ID=your-staging-google-client-id
RAZORPAY_KEY=your-staging-razorpay-key
# ... other staging keys
```

### .env.prod (Production)
```bash
# Production Environment Variables
APP_URL=https://books.giddh.com
API_URL=https://api.giddh.com/
GOOGLE_CLIENT_ID=REPLACE_WITH_ACTUAL_PRODUCTION_GOOGLE_CLIENT_ID
RAZORPAY_KEY=REPLACE_WITH_ACTUAL_PRODUCTION_RAZORPAY_KEY
# ... other production keys
```

## Usage in Angular Code

### ❌ OLD WAY (Deprecated)
```typescript
// DON'T DO THIS - Runtime process.env access
const apiUrl = process.env.API_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
```

### ✅ NEW WAY (Angular 21 Compatible)
```typescript
// Global constants injected at build time
declare const ApiUrl: string;
declare const GOOGLE_CLIENT_ID: string;

export const environment: Environment = {
    ApiUrl: ApiUrl,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
    // ... other constants
};
```

## Build Commands

### Development
```bash
npm run start                    # Uses .env.local
ng build web-giddh --configuration=local
```

### Staging
```bash
ng build web-giddh --configuration=stage  # Uses .env.stage
```

### Production
```bash
ng build web-giddh --configuration=prod   # Uses .env.prod
```

## Security Features

### ✅ Secure Patterns
- Environment variables loaded at build time only
- No runtime process.env exposure
- Global constants replaced with actual values
- Type-safe declarations
- Separate files for different environments

### ❌ Removed Unsafe Patterns
- No runtime process.env.* access
- No client-side environment variable exposure
- No dynamic configuration loading
- No JIT compiler usage

## Angular 21 Compatibility

### Updated Features
- Uses `@angular-builders/custom-webpack:browser`
- Removed deprecated options: `aot`, `buildOptimizer`, `namedChunks`
- Compatible with NgModule + Standalone hybrid architecture
- Modern TypeScript ES2022 target
- No JIT compiler dependencies

### Webpack Configuration
```javascript
// webpack.env.js automatically:
// 1. Detects build configuration (local/stage/prod)
// 2. Loads appropriate .env file
// 3. Injects as global constants via DefinePlugin
// 4. Provides build-time logging
```

## Type Safety

Global constants are fully typed via `src/environments/globals.d.ts`:

```typescript
declare const GOOGLE_CLIENT_ID: string;
declare const RAZORPAY_KEY: string;
declare const PRODUCTION_ENV: boolean;
// ... all other constants
```

## Migration Notes

### From Legacy Setup
1. ✅ Replaced webpack.partial.js with webpack.env.js
2. ✅ Updated angular.json to use custom webpack builder
3. ✅ Created .env files for each environment
4. ✅ Updated environment.ts files to use global constants
5. ✅ Added TypeScript declarations for type safety
6. ✅ Removed deprecated Angular options

### Breaking Changes
- `process.env.*` access no longer works in Angular code
- Must use global constants declared in globals.d.ts
- Environment variables must be defined in appropriate .env files

## Troubleshooting

### Build Errors
1. **"Cannot find name 'GOOGLE_CLIENT_ID'"**
   - Ensure globals.d.ts is included in tsconfig.app.json
   - Check that the constant is declared in globals.d.ts

2. **"Environment file not found"**
   - Ensure .env.local, .env.stage, .env.prod exist in project root
   - Check webpack.env.js console output for file loading status

3. **"Undefined environment values"**
   - Check that variables are defined in the correct .env file
   - Verify webpack.env.js is mapping variables correctly

### Development Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your development API keys
3. Run `npm start` to use local environment

## Production Deployment

### Security Checklist
- ✅ Never commit actual production secrets to version control
- ✅ Use CI/CD environment variables for production builds
- ✅ Replace placeholder values in .env.prod with actual keys
- ✅ Verify no process.env usage remains in Angular code
- ✅ Test build with all environment configurations

### CI/CD Integration
```bash
# Example CI/CD script
export GOOGLE_CLIENT_ID="actual-prod-key"
export RAZORPAY_KEY="actual-prod-key"
ng build web-giddh --configuration=prod
```

## Benefits

1. **Security**: No runtime environment variable exposure
2. **Performance**: Build-time constant replacement
3. **Type Safety**: Full TypeScript support
4. **Angular 21**: Compatible with latest Angular features
5. **Maintainability**: Clean separation of environments
6. **Developer Experience**: Clear documentation and error handling
