# Electron Build Configuration

## Overview

This directory contains the configuration files for building, signing, and distributing the Giddh Electron application across multiple platforms (Windows, macOS, Linux). The configuration supports both development/test builds and production releases with proper code signing and notarization.

## Configuration Files

### Build Configurations

| File | Purpose | Environment |
| --- | --- | --- |
| `electron-builder.json` | Production builds with S3 publishing | Production |
| `electron-builder-test.json` | Test builds without publishing | Development/Testing |
| `electron-builder-ci.json` | CI/CD builds with automated publishing | CI/CD Pipeline |

### Code Signing Files

| File | Purpose | Platform |
| --- | --- | --- |
| `notarize.js` | Apple notarization script | macOS |
| `default.entitlements.mas.plist` | Mac App Store entitlements | macOS |
| `default.entitlements.mas.inherit.plist` | Inherited entitlements | macOS |

## Build Configurations

### Production Build (`electron-builder.json`)

**Application Details:**
- **App ID**: `com.giddh.prod`
- **Electron Version**: `39.2.7`
- **Output Directory**: `../electrongiddh-packages`
- **ASAR Packaging**: Enabled

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

**Platform Configurations:**

#### macOS Configuration
```json
{
  "category": "public.app-category.finance",
  "target": ["dmg", "zip"],
  "identity": "Walkover Web Solutions Private Limited (F3U6Z5L2EJ)",
  "type": "distribution",
  "hardenedRuntime": true,
  "gatekeeperAssess": false
}
```

#### Windows Configuration
```json
{
  "target": ["nsis", "nsis-web", "zip"],
  "icon": "./resources/icon.ico",
  "signAndEditExecutable": false
}
```

#### Linux Configuration
```json
{
  "target": ["AppImage", "snap", "zip"],
  "maintainer": "Walkover Technologies Pvt Ltd"
}
```

### Test Build (`electron-builder-test.json`)

**Key Differences from Production:**
- **App ID**: `com.giddh.test`
- **No S3 Publishing**: Local builds only
- **Simplified Configuration**: Reduced complexity for testing

### CI/CD Build (`electron-builder-ci.json`)

**Features:**
- **Automated Publishing**: Direct S3 upload
- **CI/CD Optimized**: Streamlined for automated builds
- **Environment Variables**: Uses CI environment configuration

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

**On Mac:**
```bash
# Build Electron application
npm run build.electron.giddh

# Run Electron with logging enabled
npx electron . --enable-logging
```

**On Windows:**
```bash
# Build Electron application
npm run build.electron.giddh

# Run Electron with logging enabled
npx electron . --enable-logging
```

**Alternative Development Commands:**
```bash
# Quick development build and run
npm run build.electron.giddh && npx electron . --enable-logging

# With additional debugging
npx electron . --enable-logging --inspect=9229

# Run with specific environment
ELECTRON_ENV=true npx electron . --enable-logging
```

### Local Development Builds

```bash
# Build Electron for test environment
npm run build.electron.giddh.test

# Package for specific platforms (test)
npm run package:windows:test
npm run package:mac:test
```

### Production Builds

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

### CI/CD Builds

```bash
# Windows CI release
npm run release:windows:ci

# macOS CI release
npm run release:mac:ci
```

## Code Signing Setup

### macOS Code Signing

**Requirements:**
- Apple Developer Account
- Valid Developer ID Application certificate
- Provisioning profile (for Mac App Store)

**Configuration:**
```json
{
  "identity": "Walkover Web Solutions Private Limited (F3U6Z5L2EJ)",
  "type": "distribution",
  "hardenedRuntime": true,
  "entitlements": "./../../../electron-sign/default.entitlements.mas.plist"
}
```

**Notarization Process:**
The `notarize.js` script handles Apple notarization:

```javascript
// Automatic notarization after signing
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  // Notarization logic...
};
```

### Windows Code Signing

**Configuration:**
- Code signing disabled by default: `"signAndEditExecutable": false`
- Can be enabled with proper certificate configuration
- Supports both EV and standard code signing certificates

### Linux Packaging

**Supported Formats:**
- **AppImage**: Universal Linux application format
- **Snap**: Ubuntu/Snapcraft package
- **ZIP**: Portable archive

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

1. **Build Application**:
   ```bash
   npm run build.electron.giddh.test
   ```

2. **Package for Platform**:
   ```bash
   npm run package:windows:test
   ```

3. **Test Installation**:
   - Install generated package
   - Verify functionality
   - Test auto-updates (if applicable)

### Production Release

1. **Pre-Release Checklist**:
   - [ ] Version number updated in `package.json`
   - [ ] Code signing certificates valid
   - [ ] S3 bucket accessible
   - [ ] All tests passing

2. **Build and Release**:
   ```bash
   npm run package:windows
   npm run package:mac
   npm run package:linux
   ```

3. **Post-Release**:
   - [ ] Verify uploads to S3
   - [ ] Test auto-update functionality
   - [ ] Monitor crash reports

## Environment Variables

### Required for Production Builds

```bash
# AWS S3 Publishing
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# macOS Code Signing
APPLE_ID=your_apple_id
APPLE_ID_PASSWORD=your_app_specific_password
APPLE_TEAM_ID=your_team_id

# Windows Code Signing (optional)
WIN_CSC_LINK=path_to_certificate.p12
WIN_CSC_KEY_PASSWORD=certificate_password
```

### CI/CD Environment Variables

```bash
# Build Configuration
ELECTRON_ENV=true
NODE_ENV=production

# Publishing
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
# Ensure Electron build is complete
npm run build.electron.giddh

# Check if main process file exists
ls -la apps/electron-giddh/src/index.js

# Run with verbose logging
npx electron . --enable-logging --verbose
```

**Error**: `ENOENT: no such file or directory` when running Electron

**Solutions**:
```bash
# Ensure you're in the correct directory
cd /path/to/your/project

# Rebuild Electron dependencies
npm run postinstall.electron

# Check package.json main entry
grep "main" package.json
```

#### 2. Platform-Specific Issues

**Windows Issues**:
```bash
# If npx electron fails on Windows
.\node_modules\.bin\electron.cmd . --enable-logging

# PowerShell execution policy issues
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Mac Issues**:
```bash
# Permission denied errors
chmod +x node_modules/.bin/electron

# Gatekeeper issues during development
sudo spctl --master-disable
```

#### 3. Code Signing Failures (macOS)

**Error**: `codesign failed with exit code 1`

**Solutions**:
```bash
# Check certificate validity
security find-identity -v -p codesigning

# Clear keychain cache
security delete-keychain login.keychain
security create-keychain login.keychain
```

#### 2. Notarization Failures

**Error**: `Notarization failed`

**Solutions**:
- Verify Apple ID credentials
- Check app-specific password
- Ensure hardened runtime is enabled
- Review entitlements configuration

#### 3. Windows Build Issues

**Error**: `Cannot find module 'electron-builder'`

**Solutions**:
```bash
# Reinstall dependencies
npm run clean
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### 4. S3 Upload Failures

**Error**: `S3 upload failed`

**Solutions**:
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure bucket exists and is accessible
- Validate AWS region configuration

### Debug Commands

```bash
# Verbose build output
DEBUG=electron-builder npm run package:windows

# Check Electron version compatibility
npx electron --version

# Validate configuration
npx electron-builder --help

# Test S3 connection
aws s3 ls s3://app-giddh-test
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
