# Security Guide - Environment Variables

## 🔒 CRITICAL SECURITY IMPLEMENTATION

This project now implements a **secure environment variable system** that prevents credentials from being exposed in public repositories while supporting both local development and production deployments.

## 🏗️ Architecture Overview

### Local Development
- Uses `.env.local` file for development credentials
- File is **gitignored** and never committed to repository
- Developers must create their own `.env.local` from `.env.example`

### Production/Staging/CI
- **NEVER uses .env files** - only server environment variables
- Build script automatically detects production/CI environment
- Credentials are loaded from server environment variables only

## 🚫 What's Protected

### Files Never Committed to Repository
```
.env
.env.local
.env.stage  
.env.prod
.env.test
.env.*.local
apps/web-giddh/src/environments/environment.generated.ts
```

### Sensitive Variables Protected
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `RAZORPAY_KEY`
- `FROALA_EDITOR_KEY` 
- `OTP_WIDGET_ID` / `OTP_TOKEN_AUTH`
- `ERRLYTIC_KEY`

## 🛠️ Setup Instructions

### For Developers (Local Development)

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your development credentials:**
   ```bash
   # Edit .env.local with your actual development keys
   GOOGLE_CLIENT_ID=your-actual-dev-key
   RAZORPAY_KEY=your-actual-dev-key
   # ... other keys
   ```

3. **Build locally:**
   ```bash
   npm run build        # Uses .env.local
   npm start           # Uses .env.local
   ```

### For Production Deployment

1. **Set server environment variables:**
   ```bash
   # In your server/CI environment
   export GOOGLE_CLIENT_ID="actual-production-key"
   export RAZORPAY_KEY="actual-production-key"
   export FROALA_EDITOR_KEY="actual-production-key"
   # ... other production keys
   ```

2. **Build for production:**
   ```bash
   npm run build-prod   # Automatically uses server environment variables
   ```

## 🔍 How It Works

### Build Process Detection
```javascript
// scripts/build-env.js automatically detects:
const isProduction = environment === 'prod';
const isCI = process.env.CI === 'true' || process.env.NODE_ENV === 'production';

if (isProduction || isCI) {
    // Use server environment variables only
    console.log('🔒 Production/CI environment detected - using server environment variables');
} else {
    // Load .env.local for development
    console.log('📁 Development environment - loading from: .env.local');
}
```

### Environment Variable Priority
1. **Production/CI**: Server environment variables ONLY
2. **Development**: `.env.local` file (if exists), fallback to server environment variables
3. **Fallback**: Empty strings (safe defaults)

## 🚨 Security Warnings

### ❌ NEVER DO THIS
```bash
# DON'T commit real credentials to repository
git add .env.local     # ❌ BLOCKED by .gitignore
git add .env.prod      # ❌ BLOCKED by .gitignore

# DON'T hardcode credentials in code
const apiKey = "actual-secret-key";  # ❌ NEVER DO THIS
```

### ✅ ALWAYS DO THIS
```bash
# ✅ Use server environment variables in production
export GOOGLE_CLIENT_ID="actual-key"

# ✅ Use .env.local for development only
echo "GOOGLE_CLIENT_ID=dev-key" >> .env.local

# ✅ Keep .env files gitignored
git status  # Should show .env files as ignored
```

## 🔧 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build Production
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build production
        env:
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          RAZORPAY_KEY: ${{ secrets.RAZORPAY_KEY }}
          FROALA_EDITOR_KEY: ${{ secrets.FROALA_EDITOR_KEY }}
          OTP_WIDGET_ID: ${{ secrets.OTP_WIDGET_ID }}
          OTP_TOKEN_AUTH: ${{ secrets.OTP_TOKEN_AUTH }}
        run: npm run build-prod
```

### Docker Example
```dockerfile
# Dockerfile
FROM node:18-alpine

# Build arguments for secrets (passed at build time)
ARG GOOGLE_CLIENT_ID
ARG RAZORPAY_KEY
ARG FROALA_EDITOR_KEY

# Set environment variables
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV RAZORPAY_KEY=$RAZORPAY_KEY
ENV FROALA_EDITOR_KEY=$FROALA_EDITOR_KEY

# Build application
COPY . .
RUN npm ci
RUN npm run build-prod
```

## 🧪 Testing Security

### Verify .env files are gitignored
```bash
git status
# Should NOT show .env files as untracked

git check-ignore .env.local
# Should output: .env.local (confirming it's ignored)
```

### Test production build without .env files
```bash
# Remove .env files temporarily
mv .env.local .env.local.backup

# Set server environment variables
export GOOGLE_CLIENT_ID="test-key"
export RAZORPAY_KEY="test-key"

# Build should work with server variables only
npm run build-prod

# Restore .env file
mv .env.local.backup .env.local
```

## 📋 Security Checklist

### Before Committing Code
- [ ] No `.env*` files in git status
- [ ] No hardcoded credentials in source code
- [ ] All sensitive variables use server environment variables in production
- [ ] `.env.example` contains no real credentials

### Before Production Deployment
- [ ] All production environment variables set on server
- [ ] Production build tested without `.env` files
- [ ] No `.env` files deployed to production server
- [ ] Credentials rotated if previously exposed

### Regular Security Maintenance
- [ ] Rotate credentials periodically
- [ ] Audit environment variable usage
- [ ] Review `.gitignore` effectiveness
- [ ] Monitor for accidental credential commits

## 🆘 Emergency Response

### If Credentials Are Accidentally Committed
1. **Immediately rotate all exposed credentials**
2. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.local' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push to remove from remote:**
   ```bash
   git push origin --force --all
   ```
4. **Update all deployment environments with new credentials**

## 📞 Support

For security concerns or questions about environment variable setup, please:
1. Check this guide first
2. Review the build logs for environment detection
3. Test locally with the security verification steps
4. Contact the development team for production credential access

---

**Remember: Security is everyone's responsibility. When in doubt, ask!**
