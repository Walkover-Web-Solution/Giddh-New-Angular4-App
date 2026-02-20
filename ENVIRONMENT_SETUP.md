# Environment Variables Setup Guide

## 🔒 Secure Credential Management

This project now uses a **secure environment variable system** that prevents sensitive credentials from being committed to the public repository while ensuring they're properly loaded at build time.

## 📁 Environment Files Structure

```
.env.example          # Template file (committed to repo)
.env.electron         # Electron-specific credentials (NOT committed)
.env.local           # Local development credentials (NOT committed)  
.env.prod            # Production credentials (NOT committed)
.env.stage           # Staging credentials (NOT committed)
.env.test            # Test environment credentials (NOT committed)
```

## 🚀 Quick Setup

### 1. Copy Environment Template
```bash
# For Electron development
cp .env.example .env.electron

# For web development  
cp .env.example .env.local
```

### 2. Add Your Credentials
Edit the copied files and add your actual API keys and credentials:

```bash
# .env.electron
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
RAZORPAY_KEY=your-actual-razorpay-key
# ... other credentials
```

### 3. Build & Run
The build system will automatically load the correct environment file:

```bash
# Electron build (uses .env.electron)
npm run build:electron

# Web builds (uses appropriate .env file based on NODE_ENV)
npm run build-prod    # uses .env.prod
npm run build-stage   # uses .env.stage  
npm run build-test    # uses .env.test
npm run build-dev     # uses .env.local
```

## 🔧 How It Works

### Dynamic Environment Loading
1. **Build Time**: The `inject-env-vars.js` script loads credentials from the appropriate `.env` file
2. **Runtime**: Environment variables are injected into the HTML as global window variables
3. **Application**: Angular reads from `window.GOOGLE_CLIENT_ID` etc. instead of hardcoded values

### Environment File Selection Logic
- **Electron builds**: Always uses `.env.electron`
- **Web builds**: Uses file based on `NODE_ENV`:
  - `production` → `.env.prod`
  - `staging` → `.env.stage`
  - `test` → `.env.test`
  - `local` → `.env.local`

### Security Features
- ✅ No credentials hardcoded in repository
- ✅ Environment files are gitignored
- ✅ Dynamic loading at build time
- ✅ Separate credentials for different environments
- ✅ Template file for easy setup

## 📋 Required Environment Variables

### Authentication
```bash
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### Payment Integration
```bash
RAZORPAY_KEY=your-razorpay-api-key
```

### SMS/OTP Service
```bash
OTP_WIDGET_ID=your-msg91-widget-id
OTP_TOKEN_AUTH=your-msg91-auth-token
```

### Application URLs
```bash
APP_URL=http://localhost:4200/
API_URL=https://apitest.giddh.com/
UK_API_URL=https://gbapi.giddh.com/
PORTAL_URL=https://testportal.giddh.com/
```

### Environment Flags
```bash
IS_ELECTRON=true  # for Electron builds
APP_FOLDER=       # optional app folder path
```

## 🛠️ Development Workflow

### For New Developers
1. Clone the repository
2. Copy `.env.example` to appropriate environment files
3. Get credentials from team lead or environment setup
4. Add credentials to your local environment files
5. Build and run the application

### For CI/CD
Environment variables should be set as secrets in your CI/CD system:
- GitHub Actions: Repository Secrets
- GitLab CI: Variables
- Jenkins: Credentials Store

### For Production Deployment
1. Ensure production credentials are in `.env.prod`
2. Run production build: `npm run build-prod`
3. Deploy the built application

## 🔍 Troubleshooting

### "GOOGLE_CLIENT_ID is not defined" Error
This means the environment injection didn't work properly:

1. **Check environment file exists**:
   ```bash
   ls -la .env.electron  # for Electron
   ls -la .env.local     # for web dev
   ```

2. **Verify credentials are set**:
   ```bash
   cat .env.electron | grep GOOGLE_CLIENT_ID
   ```

3. **Check build logs** for environment loading messages:
   ```
   🔧 Loading environment variables from: .env.electron
   ✅ Successfully loaded environment variables from .env.electron
   ```

4. **Inspect generated HTML** for injected variables:
   ```html
   <script>
     window.GOOGLE_CLIENT_ID = "your-client-id";
   </script>
   ```

### Environment File Not Found
If you see "Warning: .env.electron not found", create the file:
```bash
cp .env.example .env.electron
# Edit .env.electron with your credentials
```

### Wrong Environment Loaded
Check the `NODE_ENV` or `ELECTRON_ENV` environment variables:
```bash
echo $NODE_ENV
echo $ELECTRON_ENV
```

## 📚 Technical Details

### Files Modified
- `apps/web-giddh/src/environments/environment.generated.ts` - Now reads from window globals
- `scripts/inject-env-vars.js` - New script for dynamic environment injection
- `package.json` - Updated build scripts to use environment injection
- `.gitignore` - Added environment files to prevent credential commits

### Build Process Flow
1. Angular build creates static files
2. `inject-env-vars.js` loads appropriate `.env` file
3. Script injects environment variables into HTML
4. Application reads from global window variables
5. No sensitive credentials in committed code

## 🔐 Security Best Practices

1. **Never commit** `.env.*` files (except `.env.example`)
2. **Use different credentials** for each environment
3. **Rotate credentials** regularly
4. **Limit API key permissions** to minimum required
5. **Monitor credential usage** in respective service dashboards

## 🆘 Support

If you encounter issues with environment setup:
1. Check this guide first
2. Verify your environment files are properly configured
3. Check build logs for error messages
4. Contact the development team for credential access
