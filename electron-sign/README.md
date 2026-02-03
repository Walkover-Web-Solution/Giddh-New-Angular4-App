# Electron Build Configuration

## Overview

This directory contains the configuration files for building, signing, and distributing the Giddh Electron application across multiple platforms (Windows, macOS, Linux). The configuration supports production releases with proper code signing and notarization.

## Configuration Files

### Build Configuration

| File | Purpose | Environment |
| --- | --- | --- |
| `electron-builder.json` | Production builds with S3 publishing | Production |

### Code Signing Files

| File | Purpose | Platform |
| --- | --- | --- |
| `custom-sign.js` | SSL.com eSigner code signing script | Windows |
| `notarize.js` | Apple notarization script | macOS |
| `default.entitlements.mas.plist` | Mac App Store entitlements | macOS |
| `default.entitlements.mas.inherit.plist` | Inherited entitlements | macOS |

## Build Configuration

### Production Build (`electron-builder.json`)

**Application Details:**
- **App ID**: `com.giddh.prod`
- **Product Name**: `Giddh`
- **Electron Version**: `29.4.6` (devDependency: `^39.2.7`)
- **Electron Builder Version**: `^26.0.19`
- **Output Directory**: `../electrongiddh-packages`
- **ASAR Packaging**: Enabled (with `**/*.node` unpacked)

**Publishing:**
```json
{
  "publish": [
    {
      "provider": "s3",
      "bucket": "app-giddh-test",
      "region": "ap-south-1",
      "path": "test/windows/latest"
    }
  ]
}
```

**Note:** The publish path in `electron-builder.json` is configured for test builds. For production builds, the path structure is:
- **Test builds**: `s3://app-giddh-test/test/{platform}/latest/`
- **Production builds**: `s3://app-giddh-test/prod/{platform}/latest/`

Where `{platform}` is `windows`, `mac`, or `linux`.

**Platform Configurations:**

#### macOS Configuration
```json
{
  "category": "public.app-category.finance",
  "target": ["dmg", "zip"],
  "identity": null,
  "icon": "icon.icns"
}
```

**DMG Configuration:**
```json
{
  "sign": false
}
```

**Mac App Store (MAS) Configuration:**
```json
{
  "entitlements": "./../../../electron-sign/default.entitlements.mas.plist",
  "entitlementsInherit": "./../../../electron-sign/default.entitlements.mas.inherit.plist",
  "provisioningProfile": "./../../../electron-sign/embedded.provisionprofile"
}
```

#### Windows Configuration
```json
{
  "target": [
    {
      "target": "nsis",
      "arch": ["x64", "ia32"]
    },
    "zip"
  ],
  "icon": "icon.ico",
  "signAndEditExecutable": true,
  "requestedExecutionLevel": "asInvoker",
  "verifyUpdateCodeSignature": false
}
```

**NSIS Installer Configuration:**
```json
{
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true,
  "createStartMenuShortcut": true,
  "menuCategory": "Accounting",
  "shortcutName": "Giddh",
  "perMachine": true,
  "installerIcon": "icon.ico",
  "uninstallerIcon": "icon.ico",
  "installerHeaderIcon": "icon.ico",
  "deleteAppDataOnUninstall": false,
  "runAfterFinish": true,
  "differentialPackage": false,
  "packElevateHelper": true,
  "allowElevation": true,
  "displayLanguageSelector": false,
  "include": "build/installer.nsh"
}
```

#### Linux Configuration
```json
{
  "icon": "icon.png",
  "maintainer": "Walkover Technologies Pvt Ltd",
  "target": ["AppImage", "snap", "zip"]
}
```

## Build Commands

### Local Development Setup

#### Initial Setup
```bash
# Install dependencies with legacy peer deps support
npm install --legacy-peer-deps

# Install configstore dependency (required for Electron)
npm install configstore --legacy-peer-deps

# If configstore installation fails, force install specific version
npm install configstore@5.0.1 --legacy-peer-deps --force
```

#### Running Electron Application Locally

**Prepare Electron Build:**
```bash
# Compile TypeScript for Electron
npm run prepare.electron.giddh

# This runs:
# 1. npm run postinstall.electron (node tools/electron/postinstall)
# 2. tsc -p apps/electron-giddh/tsconfig.json
```

**Run Electron Application:**
```bash
# Navigate to the electron app directory
cd apps/electron-giddh/src

# Run Electron with logging enabled
npx electron . --enable-logging

# With additional debugging
npx electron . --enable-logging --inspect=9229
```

**Quick Development Workflow:**
```bash
# Prepare and run in one command
npm run prepare.electron.giddh && cd apps/electron-giddh/src && npx electron . --enable-logging
```

### Production Builds

**Note:** Production builds use `electron-builder` with the configuration in `electron-sign/electron-builder.json`.

```bash
# Build using electron-builder (from project root)
electron-builder --config electron-sign/electron-builder.json

# Platform-specific builds
electron-builder --config electron-sign/electron-builder.json --win
electron-builder --config electron-sign/electron-builder.json --mac
electron-builder --config electron-sign/electron-builder.json --linux
```

## Code Signing Setup

### macOS Code Signing

**Current Configuration:**
- **Identity**: `null` (signing disabled in current config)
- **DMG Signing**: `false`
- **Mac App Store**: Configured with entitlements and provisioning profile

**Requirements for Enabling:**
- Apple Developer Account
- Valid Developer ID Application certificate
- Update `identity` in `electron-builder.json` to your certificate name
- Set `dmg.sign` to `true` for signed DMG files

**Notarization Process:**
The `notarize.js` script handles Apple notarization using `@electron/notarize`:

```javascript
await electronNotarize.notarize({
  appBundleId: 'com.giddh.prod',
  appPath: appPath,
  appleId: process.env.NOTARIZE_EMAIL,
  appleIdPassword: process.env.NOTARIZE_PASS,
  tool: 'notarytool',
  teamId: "F3U6Z5L2EJ"
});
```

**Required Environment Variables:**
- `NOTARIZE_EMAIL`: Apple ID email
- `NOTARIZE_PASS`: App-specific password

### Windows Code Signing

**SSL.com eSigner Integration:**

The `custom-sign.js` script provides automated code signing using SSL.com's eSigner service:

**Features:**
- Signs all executables during build (main app, installer, updates)
- Uses SSL.com CodeSignTool via npx
- Automatic signature verification on Windows
- Graceful fallback for development builds

**Configuration:**
```json
{
  "signAndEditExecutable": true,
  "requestedExecutionLevel": "asInvoker",
  "verifyUpdateCodeSignature": false
}
```

**Required Environment Variables:**
- `ES_USERNAME`: SSL.com eSigner username
- `ES_PASSWORD`: SSL.com eSigner password
- `ES_CREDENTIAL_ID`: SSL.com credential ID
- `ES_TOTP_SECRET`: SSL.com TOTP secret for 2FA

**Signing Process:**
1. electron-builder calls `custom-sign.js` for each executable
2. Script checks for required environment variables
3. If present, uses `@ssl.com/codesigntool` to sign the file
4. Verifies signature using PowerShell (Windows only)
5. If variables missing, skips signing (development mode)

**Development Mode:**
If environment variables are not set, the script logs a warning and skips signing, allowing local development without certificates.

### Linux Packaging

**Supported Formats:**
- **AppImage**: Universal Linux application format
- **Snap**: Ubuntu/Snapcraft package
- **ZIP**: Portable archive

**No Code Signing Required:**
Linux builds do not require code signing for distribution.

## Entitlements Configuration

### Mac App Store Entitlements (`default.entitlements.mas.plist`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <!-- Additional entitlements -->
</dict>
</plist>
```

### Inherited Entitlements (`default.entitlements.mas.inherit.plist`)

Contains entitlements that are inherited by child processes and helper applications.

## Distribution Workflow

### Development/Testing

1. **Prepare Electron Build**:
   ```bash
   npm run prepare.electron.giddh
   ```

2. **Test Locally**:
   ```bash
   cd apps/electron-giddh/src
   npx electron . --enable-logging
   ```

3. **Verify Functionality**:
   - Test all features
   - Check console for errors
   - Verify OAuth flows (Google authentication)
   - Test tray icon functionality

### Production Release

1. **Pre-Release Checklist**:
   - [ ] Version number updated in root `package.json`
   - [ ] Electron TypeScript compiled (`npm run prepare.electron.giddh`)
   - [ ] Code signing environment variables configured
   - [ ] AWS S3 credentials configured
   - [ ] All tests passing

2. **Build and Release**:
   ```bash
   # From project root
   electron-builder --config electron-sign/electron-builder.json --win --mac --linux
   ```

   Or platform-specific:
   ```bash
   # Windows only
   electron-builder --config electron-sign/electron-builder.json --win
   
   # macOS only
   electron-builder --config electron-sign/electron-builder.json --mac
   
   # Linux only
   electron-builder --config electron-sign/electron-builder.json --linux
   ```

3. **Post-Release**:
   - [ ] Verify uploads to S3 bucket:
     - Test builds: `app-giddh-test/test/{platform}/latest/`
     - Production builds: `app-giddh-test/prod/{platform}/latest/`
   - [ ] Verify file names:
     - Test builds: `giddh-test-setup.exe` / `giddh-test-setup.dmg`
     - Production builds: `giddh-setup.exe` / `giddh-setup.dmg`
   - [ ] Test auto-update functionality
   - [ ] Verify code signatures (Windows: PowerShell, macOS: codesign)
   - [ ] Monitor crash reports and logs

## Environment Variables

### Required for Production Builds

**AWS S3 Publishing:**
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**macOS Code Signing & Notarization:**
```bash
NOTARIZE_EMAIL=your_apple_id@example.com
NOTARIZE_PASS=your_app_specific_password
```

**Windows Code Signing (SSL.com eSigner):**
```bash
ES_USERNAME=your_sslcom_username
ES_PASSWORD=your_sslcom_password
ES_CREDENTIAL_ID=your_credential_id
ES_TOTP_SECRET=your_totp_secret
```

### Optional Environment Variables

**Build Configuration:**
```bash
ELECTRON_ENV=true
NODE_ENV=production
```

**Publishing Override:**
```bash
PUBLISH_PROVIDER=s3
S3_BUCKET=app-giddh-test
```

## Troubleshooting

### Common Issues

#### 1. Electron Development Setup Issues

**Error**: `Cannot find module 'configstore'`

**Solutions**:
```bash
# Install with legacy peer deps
npm install configstore --legacy-peer-deps

# If still failing, force install specific version
npm install configstore@5.0.1 --legacy-peer-deps --force
```

**Error**: `Electron failed to start`

**Solutions**:
```bash
# Compile TypeScript first
npm run prepare.electron.giddh

# Check if main process file exists
ls -la apps/electron-giddh/src/index.js

# Navigate to correct directory
cd apps/electron-giddh/src

# Run with verbose logging
npx electron . --enable-logging --verbose
```

**Error**: `ENOENT: no such file or directory` when running Electron

**Solutions**:
```bash
# Ensure TypeScript is compiled
npm run prepare.electron.giddh

# Verify you're in the electron app directory
cd apps/electron-giddh/src

# Check if index.js exists
ls -la index.js

# Rebuild Electron dependencies if needed
npm run postinstall.electron
```

**Error**: `Tray icon not found`

**Solutions**:
```bash
# Ensure build/icons directory exists with tray.png
ls -la apps/electron-giddh/src/build/icons/

# For packaged app, ensure extraResources are configured correctly
# Check electron-builder.json extraResources section
```

#### 2. Code Signing Issues

**Windows Signing Errors**:

**Error**: `Missing environment variables for signing`

**Solution**:
```bash
# Set SSL.com eSigner environment variables
export ES_USERNAME="your_username"
export ES_PASSWORD="your_password"
export ES_CREDENTIAL_ID="your_credential_id"
export ES_TOTP_SECRET="your_totp_secret"

# Or create a .env file (not committed to git)
echo "ES_USERNAME=your_username" >> .env
echo "ES_PASSWORD=your_password" >> .env
echo "ES_CREDENTIAL_ID=your_credential_id" >> .env
echo "ES_TOTP_SECRET=your_totp_secret" >> .env
```

**Error**: `@ssl.com/codesigntool not found`

**Solution**:
```bash
# The tool is installed via npx automatically
# Ensure you have internet connection during build
# Or pre-install globally:
npm install -g @ssl.com/codesigntool
```

**macOS Signing Errors**:

**Error**: `No identity found`

**Solution**:
```bash
# List available identities
security find-identity -v -p codesigning

# Update electron-builder.json with correct identity
# Change "identity": null to "identity": "Your Certificate Name"
```

**Error**: `Notarization failed`

**Solution**:
```bash
# Verify environment variables are set
echo $NOTARIZE_EMAIL
echo $NOTARIZE_PASS

# Ensure app-specific password is generated from Apple ID
# Visit: https://appleid.apple.com/account/manage
```

#### 3. Platform-Specific Issues


**Error**: `NSIS installer fails to build`

**Solution**:
```bash
# Ensure build/installer.nsh exists
ls -la apps/electron-giddh/src/build/installer.nsh

# Check NSIS configuration in electron-builder.json
# Verify all icon files exist (icon.ico)
```

**Error**: `Code signature verification failed`

**Solution**:
```bash
# On Windows, verify signature manually:
powershell -Command "Get-AuthenticodeSignature 'path/to/Giddh.exe' | Select-Object -ExpandProperty Status"

# Should return: Valid
# If not, check SSL.com credentials and try re-signing
```

**Error**: `npx electron fails on Windows`

**Solution**:
```bash
# Use full path to electron
.\node_modules\.bin\electron.cmd . --enable-logging

# PowerShell execution policy issues
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS Issues**:

**Error**: `DMG creation failed`

**Solution**:
```bash
# Ensure icon.icns exists
ls -la apps/electron-giddh/src/icon.icns

# Check disk space
df -h

# Try building without DMG first
electron-builder --config electron-sign/electron-builder.json --mac --dir
```

**Error**: `Permission denied errors`

**Solution**:
```bash
# Fix electron binary permissions
chmod +x node_modules/.bin/electron

# Gatekeeper issues during development
sudo spctl --master-disable
```

**Linux Issues**:

**Error**: `AppImage build failed`

**Solution**:
```bash
# Install required dependencies
sudo apt-get install fuse libfuse2

# Ensure icon.png exists
ls -la apps/electron-giddh/src/icon.png
```

#### 4. Publishing Issues

**Error**: `S3 upload failed`

**Solution**:
```bash
# Verify AWS credentials
aws s3 ls s3://app-giddh-test/

# Check environment variables
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Test S3 access for test builds
aws s3 ls s3://app-giddh-test/test/windows/latest/

# Test S3 access for production builds
aws s3 ls s3://app-giddh-test/prod/windows/latest/
```

**Error**: `Access denied to S3 bucket`

**Solution**:
```bash
# Verify IAM permissions include:
# - s3:PutObject
# - s3:PutObjectAcl
# - s3:GetObject
# For bucket: app-giddh-test

# Test with AWS CLI (test environment)
aws s3 cp test.txt s3://app-giddh-test/test/windows/

# Test with AWS CLI (production environment)
aws s3 cp test.txt s3://app-giddh-test/prod/windows/
```

### Debug Commands

```bash
# Verbose build output
DEBUG=electron-builder electron-builder --config electron-sign/electron-builder.json

# Check Electron version compatibility
npx electron --version

# Validate electron-builder configuration
npx electron-builder --help

# Test S3 connection
aws s3 ls s3://app-giddh-test

# Verify code signing setup (Windows)
powershell -Command "Get-AuthenticodeSignature 'path/to/file.exe'"

# Verify code signing setup (macOS)
codesign --verify --deep --strict --verbose=2 path/to/Giddh.app
```

## S3 Bucket Structure & Environment Detection

### Dynamic Path Structure

The application uses a dynamic S3 path structure based on the environment:

```
s3://app-giddh-test/
├── test/
│   ├── windows/latest/
│   │   ├── giddh-test-setup.exe
│   │   ├── latest.yml
│   │   └── [other build artifacts]
│   ├── mac/latest/
│   │   ├── giddh-test-setup.dmg
│   │   ├── latest-mac.yml
│   │   └── [other build artifacts]
│   └── linux/latest/
│       └── [build artifacts]
└── prod/
    ├── windows/latest/
    │   ├── giddh-setup.exe
    │   ├── latest.yml
    │   └── [other build artifacts]
    ├── mac/latest/
    │   ├── giddh-setup.dmg
    │   ├── latest-mac.yml
    │   └── [other build artifacts]
    └── linux/latest/
        └── [build artifacts]
```

### Environment Detection

**In Electron (AppUpdater.ts):**
```typescript
const appName = app.getName().toLowerCase();
const isProduction = !appName.includes('test') && !appName.includes('dev');
const envPath = isProduction ? 'prod' : 'test';
const platform = process.platform === 'darwin' ? 'mac' : 'windows';
```

**In Web Application (AuthenticationService & Components):**
```typescript
const apiUrl = this.config?.apiUrl || '';
const isProduction = apiUrl.includes('api.giddh.com') || apiUrl.includes('books.giddh.com');
const envPath = isProduction ? 'prod' : 'test';
```

### File Naming Convention

| Environment | Windows Installer | Mac Installer |
|-------------|------------------|---------------|
| **Production** | `giddh-setup.exe` | `giddh-setup.dmg` |
| **Test/Dev** | `giddh-test-setup.exe` | `giddh-test-setup.dmg` |

### Auto-Update Configuration

The auto-updater automatically detects the environment and constructs the correct S3 path:

**Production:**
- Windows: `https://s3-ap-south-1.amazonaws.com/app-giddh-test/prod/windows/latest/`
- macOS: `https://s3-ap-south-1.amazonaws.com/app-giddh-test/prod/mac/latest/`

**Test/Dev:**
- Windows: `https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/latest/`
- macOS: `https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest/`

### Download Links

Download links in the web application are dynamically generated based on the API URL:

```typescript
// Production environment (api.giddh.com or books.giddh.com)
windowsDownloadUrl = 'https://s3-ap-south-1.amazonaws.com/app-giddh-test/prod/windows/latest/giddh-setup.exe'
macDownloadUrl = 'https://s3-ap-south-1.amazonaws.com/app-giddh-test/prod/mac/latest/giddh-setup.dmg'

// Test/Dev environment
windowsDownloadUrl = 'https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/latest/giddh-test-setup.exe'
macDownloadUrl = 'https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest/giddh-test-setup.dmg'
```

## Security Considerations

### Code Signing Best Practices

1. **Certificate Management**:
   - Store certificates securely
   - Use environment variables for passwords
   - Rotate certificates before expiration

2. **Entitlements**:
   - Request minimal required permissions
   - Regularly audit entitlements
   - Test in sandboxed environment

3. **Distribution**:
   - Use HTTPS for all downloads
   - Implement checksum verification
   - Monitor for unauthorized distributions

### Build Security

```bash
# Verify build integrity
npm audit

# Check for vulnerabilities
npm run security-check

# Validate dependencies
npm ls --depth=0
```

## Performance Optimization

### Build Optimization

```json
{
  "asar": true,
  "compression": "maximum",
  "nsis": {
    "oneClick": true,
    "createDesktopShortcut": true
  }
}
```

### Bundle Size Reduction

- Enable ASAR packaging
- Exclude development dependencies
- Optimize asset compression
- Use tree-shaking for unused code

## Monitoring and Analytics

### Build Metrics

- Track build times across platforms
- Monitor package sizes
- Analyze download statistics
- Review crash reports

### Auto-Update Configuration

```json
{
  "publish": [
    {
      "provider": "s3",
      "bucket": "app-giddh-test",
      "region": "ap-south-1",
      "path": "test/windows/latest"
    }
  ]
}
```

## Support and Resources

### Internal Documentation
- [Environment Configuration](../README-ENVIRONMENT-CONFIG.md)
- [Angular 21 Migration Guide](../ANGULAR_21_MIGRATION.md)
- [Build Process Documentation](../tools/README.md)

### External Resources
- [Electron Builder Documentation](https://www.electron.build/)
- [Apple Code Signing Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Windows Code Signing](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)

---

**Build Status**: ✅ **Production Ready**

This configuration supports secure, automated builds across all major platforms with proper code signing and distribution mechanisms.
