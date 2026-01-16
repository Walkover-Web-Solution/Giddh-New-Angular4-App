# Electron Build Workflows Documentation

## Overview

This project uses **two independent GitHub Actions workflows** to build and distribute Electron applications for Windows and macOS platforms. Each workflow runs completely independently, ensuring that failures in one platform don't affect the other.

## Architecture Support

### Windows Build
- **Architecture**: x64 (64-bit Intel/AMD)
- **Output**: `giddh Setup X.X.X.exe` (NSIS installer)
- **Signing**: SSL.com eSigner (cloud-based code signing)
- **Auto-update file**: `latest.yml`

### macOS Build
- **Architecture**: Universal (Intel x86_64 + Apple Silicon ARM64)
- **Output**: `giddh-X.X.X.dmg` (disk image)
- **Signing**: Unsigned (no Apple Developer certificate required)
- **Auto-update file**: `latest-mac.yml`

## Universal Binary Explained

The macOS build creates a **Universal Binary** that contains code for both architectures:

- **Intel Macs (x86_64)**: Runs natively on older Intel-based Macs
- **Apple Silicon Macs (M1/M2/M3)**: Runs natively on newer ARM-based Macs
- **Rosetta 2**: Not required - native code for both architectures included

This ensures optimal performance on all Mac hardware without requiring separate builds.

## Workflow Files

### 1. Windows Workflow
**File**: `.github/workflows/windows-release.yml`

**Triggers**:
- Git tags matching `v*.*.*` (e.g., `v9.1.5`)
- Push to `test-electron-build-gh-action` branch

**Steps**:
1. Auto-increment version (patch +1)
2. Commit version changes
3. Build Electron app (unpacked)
4. Build installer from unpacked app
5. Sign installer with SSL.com eSigner
6. Verify signature
7. Upload to S3 (versioned + latest)

**Configuration**: `electron-sign/electron-builder.json`

### 2. macOS Workflow
**File**: `.github/workflows/macos-release.yml`

**Triggers**:
- Git tags matching `v*.*.*` (e.g., `v9.1.5`)
- Push to `test-electron-build-gh-action` branch

**Steps**:
1. Auto-increment version (patch +1)
2. Commit version changes
3. Build Universal macOS app
4. Create DMG installer
5. Upload to S3 (versioned + latest)

**Configuration**: `electron-sign/electron-builder-mac-unsigned.json`

## Independent Execution

Both workflows are designed to run **completely independently**:

### Separate Concurrency Groups
```yaml
# Windows
concurrency:
  group: windows-release-${{ github.ref_name }}

# macOS
concurrency:
  group: macos-release-${{ github.ref_name }}
```

### Separate Job Names
- Windows: `build_sign_upload`
- macOS: `build_upload`

### Separate Runners
- Windows: `runs-on: windows-latest`
- macOS: `runs-on: macos-latest`

### Error Isolation
- If Windows build fails, macOS build continues
- If macOS build fails, Windows build continues
- Each workflow has its own success/failure status

## Version Management

Both workflows use **automatic version incrementing**:

1. Read current version from `package.json`
2. Increment patch version by 1 (e.g., 9.1.4 → 9.1.5)
3. Update both:
   - `/package.json`
   - `/apps/electron-giddh/src/package.json`
4. Commit changes with `[skip ci]` tag to prevent infinite loops
5. Build with new version

## S3 Upload Structure

### Windows
```
s3://giddh-app-builds/
  └── releases/
      └── windows/
          ├── 9.1.5/
          │   ├── giddh Setup 9.1.5.exe
          │   └── latest.yml
          └── latest/
              ├── giddh Setup 9.1.5.exe
              └── latest.yml
```

### macOS
```
s3://giddh-app-builds/
  └── releases/
      └── mac/
          ├── 9.1.5/
          │   ├── giddh-9.1.5.dmg
          │   └── latest-mac.yml
          └── latest/
              ├── giddh-9.1.5.dmg
              └── latest-mac.yml
```

## Required GitHub Secrets

### Common Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `S3_BUCKET` - AWS S3 bucket name (e.g., `giddh-app-builds`)
- `AWS_REGION` - AWS region (e.g., `us-east-1`)

### AWS Authentication (choose one method)

**Option 1: OIDC (Recommended)**
- `AWS_ROLE_TO_ASSUME` - AWS IAM role ARN for OIDC

**Option 2: Access Keys**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Windows-Specific Secrets
- `ES_USERNAME` - SSL.com eSigner username
- `ES_PASSWORD` - SSL.com eSigner password
- `ES_CREDENTIAL_ID` - SSL.com credential ID
- `ES_TOTP_SECRET` - SSL.com TOTP secret for 2FA

## Electron Builder Configurations

### Windows Configuration
**File**: `electron-sign/electron-builder.json`

Key settings:
- Electron version: 32.2.6 (for Windows compatibility)
- Target: NSIS installer (x64)
- Signing: Enabled with SSL.com eSigner
- Timestamp servers: DigiCert
- Elevation: Disabled to prevent UAC issues

### macOS Configuration
**File**: `electron-sign/electron-builder-mac-unsigned.json`

Key settings:
- Electron version: 32.2.6
- Target: DMG + ZIP (universal architecture)
- Signing: Disabled (unsigned build)
- Hardened Runtime: Disabled
- Gatekeeper: Disabled

## Testing the Workflows

### Trigger Both Workflows
```bash
git add .
git commit -m "Your commit message"
git push origin test-electron-build-gh-action
```

### Monitor Execution
1. Go to GitHub repository
2. Click "Actions" tab
3. You'll see **two separate workflow runs**:
   - "Windows EXE (build → eSigner sign → S3 upload)"
   - "macOS DMG (build → unsigned → S3 upload)"
4. Each can succeed or fail independently

### Download Built Files

**Windows**:
```
https://giddh-app-builds.s3.amazonaws.com/releases/windows/latest/giddh%20Setup%209.1.5.exe
```

**macOS**:
```
https://giddh-app-builds.s3.amazonaws.com/releases/mac/latest/giddh-9.1.5.dmg
```

## Troubleshooting

### Windows Build Fails
- Check SSL.com eSigner credentials
- Verify certificate is active and not expired
- Check Windows-specific build logs

### macOS Build Fails
- Verify icon files exist in correct locations
- Check macOS-specific build logs
- Ensure universal build is supported by dependencies

### Both Builds Fail
- Check version increment logic
- Verify AWS credentials
- Check S3 bucket permissions
- Review common build dependencies

### Version Conflicts
If both workflows try to increment version simultaneously:
- Git push will fail for the second workflow
- This is expected behavior
- The workflow will retry on next push

## Production Deployment

### For Tagged Releases
```bash
git tag v9.1.5
git push origin v9.1.5
```

This will trigger both workflows and create production releases.

### For Testing
Push to `test-electron-build-gh-action` branch to test without creating a release tag.

## Best Practices

1. **Always test on test branch first** before creating release tags
2. **Monitor both workflows** to ensure both platforms build successfully
3. **Keep Electron version consistent** across both configurations
4. **Update secrets regularly** especially SSL.com credentials
5. **Test downloads** from S3 on actual Windows and macOS machines
6. **Review auto-update files** (latest.yml, latest-mac.yml) for correctness

## Future Enhancements

### Potential Improvements
- Add macOS code signing when Apple Developer certificate is available
- Add notarization for macOS builds
- Add Linux build workflow
- Implement release notes automation
- Add automated testing before builds
- Implement rollback mechanism

### macOS Signing (Future)
When you obtain an Apple Developer certificate:
1. Update `electron-builder-mac-unsigned.json` → `electron-builder-mac-signed.json`
2. Add signing configuration:
   ```json
   "mac": {
     "hardenedRuntime": true,
     "gatekeeperAssess": false,
     "entitlements": "path/to/entitlements.plist",
     "identity": "Developer ID Application: Your Name (TEAM_ID)"
   }
   ```
3. Add notarization step to workflow
4. Update workflow to use signed configuration

## Support

For issues or questions:
1. Check GitHub Actions logs for detailed error messages
2. Review this documentation
3. Check electron-builder documentation: https://www.electron.build
4. Verify AWS S3 permissions and bucket configuration
