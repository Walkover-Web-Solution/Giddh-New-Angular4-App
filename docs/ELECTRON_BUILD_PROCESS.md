# Electron Build Process Documentation

## Overview

This document explains how Giddh's Electron desktop application is built and distributed using GitHub Actions for both Windows (signed) and macOS (unsigned) platforms.

---

## How to Create New Build

### Test Build Steps
1. Checkout to build branch:
   ```bash
   git checkout test-electron-build-gh-action
   ```
2. Pull latest from test branch:
   ```bash
   git pull origin giddh-2.0
   ```
3. Update version in `apps/electron-giddh/src/package.json`:
   ```json
   {
     "version": "X.Y.Z"
   }
   ```
4. Commit and push:
   ```bash
   git add apps/electron-giddh/src/package.json
   git commit -m "chore: bump version to X.Y.Z"
   git push
   ```
5. GitHub Action will automatically build and upload to S3
6. Download test build from: **[https://web.giddh.com/](https://web.giddh.com/#:~:text=Desktop%20Apps)** (Desktop Apps section)

### Production Build Steps
1. Checkout to build branch:
   ```bash
   git checkout prod-electron-build-gh-action
   ```
2. Pull latest from production branch:
   ```bash
   git pull origin books-production
   ```
3. Update version in `apps/electron-giddh/src/package.json`:
   ```json
   {
     "version": "X.Y.Z"
   }
   ```
4. Commit and push:
   ```bash
   git add apps/electron-giddh/src/package.json
   git commit -m "chore: bump version to X.Y.Z"
   git push
   ```
5. GitHub Action will automatically build and upload to S3
6. Download production build from: **[https://giddh.com/](https://giddh.com/#:~:text=Desktop%20Apps)** (Desktop Apps section)

---

## Trigger Mechanisms

### Automated Triggers
- **Git Tags**: Any tag matching `v*.*.*` (e.g., `v1.2.3`)
- **Branch Push**: 
  - `test-electron-build-gh-action` → Test builds
  - `prod-electron-build-gh-action` → Production builds

### Skip CI
Add `[skip ci]` to commit message to bypass builds.

---

## Build Environment Detection

### Windows & macOS Logic
```
Branch: prod-electron-build-gh-action
  → BUILD_ENV=prod
  → S3_PATH_PREFIX=prod
  → Product Name: "Giddh"
  → Installer: giddh-setup.exe / Giddh.dmg

Branch: test-electron-build-gh-action (or others)
  → BUILD_ENV=test
  → S3_PATH_PREFIX=test
  → Product Name: "Giddh-Test"
  → Installer: giddh-test-setup.exe / Giddh-Test.dmg
```

---

## Windows Build Process (Signed)

### 1. Build Phase
```
npm install
→ Clean old builds
→ Prepare Electron environment
→ Build Angular app (ng build electron-giddh)
→ Inject environment variables
→ Copy resources (icons, NSIS scripts, tray icons)
→ Set product name (Giddh/Giddh-Test)
→ Install production dependencies
→ electron-builder (--dir target)
```

### 2. Signing Phase (eSigner Cloud)
**Critical for Auto-Updates**: Both app executable AND installer must be signed.

#### App Executable Signing
```
Find: Giddh.exe in win-unpacked/
→ Upload to eSigner cloud
→ Sign with certificate
→ Download signed executable
→ Replace unsigned with signed
```

#### Installer Creation & Signing
```
electron-builder (--win nsis)
→ Creates: giddh-setup-VERSION.exe
→ Upload installer to eSigner cloud
→ Sign installer
→ Download signed installer
→ Rename to final name (giddh-setup.exe or giddh-test-setup.exe)
```

**eSigner Configuration**:
- Username: `$\{\{ secrets.ESIGNER_USERNAME \}\}`
- Password: `$\{\{ secrets.ESIGNER_PASSWORD \}\}`
- Credential ID: `$\{\{ secrets.ESIGNER_CREDENTIAL_ID \}\}`
- TOTP Secret: `$\{\{ secrets.ESIGNER_TOTP_SECRET \}\}`

### 3. Upload Phase
```
AWS S3 Structure:
s3://BUCKET/prod/windows/VERSION/giddh-setup.exe
s3://BUCKET/prod/windows/latest/giddh-setup.exe

s3://BUCKET/test/windows/VERSION/giddh-test-setup.exe
s3://BUCKET/test/windows/latest/giddh-test-setup.exe
```

**Files Uploaded**:
- Signed installer (`.exe`)
- `latest.yml` (auto-update metadata)

---

## macOS Build Process (Unsigned)

### 1. Build Phase
```
npm install
→ Clean old builds
→ Prepare Electron environment
→ Build Angular app (ng build electron-giddh)
→ Inject environment variables
→ Copy resources (icons, tray icons)
→ Set product name (Giddh/Giddh-Test)
→ Install production dependencies
→ electron-builder (--mac dmg)
```

### 2. DMG Creation
```
electron-builder creates:
→ Giddh-VERSION.dmg (prod)
→ Giddh-Test-VERSION.dmg (test)

Renamed to:
→ Giddh.dmg (prod)
→ Giddh-Test.dmg (test)
```

**Note**: macOS builds are currently **unsigned** (no code signing applied).

### 3. Upload Phase
```
AWS S3 Structure:
s3://BUCKET/prod/mac/VERSION/Giddh.dmg
s3://BUCKET/prod/mac/latest/Giddh.dmg

s3://BUCKET/test/mac/VERSION/Giddh-Test.dmg
s3://BUCKET/test/mac/latest/Giddh-Test.dmg
```

**Files Uploaded**:
- DMG installer
- `latest-mac.yml` (auto-update metadata)

---

## Version & Path Flow

### Version Detection
```javascript
apps/electron-giddh/src/package.json → version: "X.Y.Z"
→ Used in artifact names
→ Used in S3 paths
→ Used in latest.yml metadata
```

**Important**: The version is controlled by `apps/electron-giddh/src/package.json`, **NOT** the root `package.json`.

### S3 Path Structure
```
s3://BUCKET/
├── prod/
│   ├── windows/
│   │   ├── VERSION/
│   │   │   ├── giddh-setup.exe
│   │   │   └── latest.yml
│   │   └── latest/
│   │       ├── giddh-setup.exe
│   │       └── latest.yml
│   └── mac/
│       ├── VERSION/
│       │   ├── Giddh.dmg
│       │   └── latest-mac.yml
│       └── latest/
│           ├── Giddh.dmg
│           └── latest-mac.yml
└── test/
    ├── windows/
    │   ├── VERSION/
    │   │   ├── giddh-test-setup.exe
    │   │   └── latest.yml
    │   └── latest/
    │       ├── giddh-test-setup.exe
    │       └── latest.yml
    └── mac/
        ├── VERSION/
        │   ├── Giddh-Test.dmg
        │   └── latest-mac.yml
        └── latest/
            ├── Giddh-Test.dmg
            └── latest-mac.yml
```

---

## Auto-Update Mechanism

### Windows
```
App checks: s3://BUCKET/ENV/windows/latest/latest.yml
→ Compares version
→ Downloads signed installer if newer
→ Prompts user to update
```

**Critical**: Both `Giddh.exe` and installer must be signed for auto-updates to work.

### macOS
```
App checks: s3://BUCKET/ENV/mac/latest/latest-mac.yml
→ Compares version
→ Downloads DMG if newer
→ Prompts user to update
```

**Note**: Unsigned builds may show security warnings on macOS.

---

## Key Configuration Files

### electron-builder.json
```json
{
  "appId": "com.walkover.giddh",
  "productName": "Giddh", // Set dynamically
  "win": {
    "target": "nsis",
    "artifactName": "giddh-setup-${version}.${ext}",
    "icon": "icon.ico"
  },
  "mac": {
    "target": "dmg",
    "icon": "icon.icns"
  },
  "nsis": {
    "include": "build/installer.nsh"
  }
}
```

### package.json (Electron app)
```json
{
  "name": "Giddh", // or "Giddh-Test"
  "productName": "Giddh", // or "Giddh-Test"
  "version": "X.Y.Z",
  "main": "index.js"
}
```

---

## Environment Variables

### Required Secrets
- `ESIGNER_USERNAME` - eSigner cloud username
- `ESIGNER_PASSWORD` - eSigner cloud password
- `ESIGNER_CREDENTIAL_ID` - Certificate credential ID
- `ESIGNER_TOTP_SECRET` - TOTP secret for 2FA
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- `S3_BUCKET` - S3 bucket name
- `AWS_REGION` - AWS region (e.g., us-east-1)

---

## Build Artifacts

### Windows
- **Signed App**: `Giddh.exe` (in win-unpacked/)
- **Signed Installer**: `giddh-setup.exe` or `giddh-test-setup.exe`
- **Metadata**: `latest.yml`

### macOS
- **DMG**: `Giddh.dmg` or `Giddh-Test.dmg`
- **Metadata**: `latest-mac.yml`

---

## Important Notes

### Windows Signing
- **Why sign both?** Auto-updates require the app executable to be signed. The installer must also be signed for user trust.
- **eSigner Cloud**: Uses cloud-based HSM for code signing (no local certificates needed).
- **Verification**: Icon embedding and signature verification performed post-signing.

### macOS Unsigned
- **Current State**: No code signing applied (future enhancement needed).
- **Impact**: Users see "unidentified developer" warnings.
- **Workaround**: Users must right-click → Open to bypass Gatekeeper.

### Version Management
- **Single Source**: `package.json` version is the single source of truth.
- **Dual Paths**: Both `VERSION/` and `latest/` paths ensure version history and easy updates.

### Concurrency
- **Windows**: `cancel-in-progress: false` - Ensures signing completes.
- **macOS**: `cancel-in-progress: false` - Prevents build interruptions.

---

## Troubleshooting

### Build Fails
1. Check Node.js version (requires v20)
2. Verify all secrets are configured
3. Check branch name matches trigger conditions

### Signing Fails (Windows)
1. Verify eSigner credentials are valid
2. Check TOTP secret is current
3. Ensure certificate hasn't expired

### Upload Fails
1. Verify AWS credentials
2. Check S3 bucket permissions
3. Ensure bucket exists in specified region

### Auto-Update Not Working
1. Verify `latest.yml` exists in S3
2. Check app is signed (Windows)
3. Verify S3 URLs are accessible
4. Check version comparison logic

---

## Future Enhancements

- [ ] Add macOS code signing (Apple Developer certificate)
- [ ] Implement notarization for macOS
- [ ] Add Linux build support
- [ ] Implement delta updates for faster downloads
- [ ] Add build caching for faster CI/CD

---

**Last Updated**: January 2026  
**Author**: Divyanshu Shrivastava
