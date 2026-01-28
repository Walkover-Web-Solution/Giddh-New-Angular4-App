# Windows Code Signing Setup for Electron Auto-Updates

## Problem Statement

Windows SmartScreen blocks auto-updates when the app executable is not properly signed. The previous workflow only signed the installer **after** electron-builder completed, leaving the app executable (`Giddh.exe` in `win-unpacked`) and update packages unsigned.

## Root Cause

```
❌ OLD WORKFLOW (BROKEN):
1. electron-builder builds app → Giddh.exe is UNSIGNED
2. electron-builder creates installer → Installer is UNSIGNED
3. GitHub Action signs installer → Only installer is SIGNED
4. Upload to S3 → App exe in update packages is UNSIGNED
5. User installs → Works (installer is signed)
6. Auto-update downloads → Windows blocks (app exe is unsigned)
```

## Solution

Sign **DURING** the build process, not after. This ensures every executable (app, installer, update packages) is signed.

```
✅ NEW WORKFLOW (FIXED):
1. electron-builder builds app → custom-sign.js signs Giddh.exe ✅
2. electron-builder creates installer → custom-sign.js signs installer ✅
3. Verify signatures → Both are SIGNED ✅
4. Upload to S3 → All executables are SIGNED ✅
5. Auto-update downloads → Windows trusts (app exe is signed) ✅
```

## Implementation

### 1. electron-builder Configuration

**File**: `/electron-sign/electron-builder.json`

```json
{
  "win": {
    "signAndEditExecutable": true,
    "certificateSubjectName": "Walkover Web Solutions Private Limited",
    "publisherName": "Walkover Web Solutions Private Limited",
    "signingHashAlgorithms": ["sha256"],
    "sign": "./custom-sign.js"  // ← Custom signing script
  },
  "nsis": {
    "perMachine": true,           // ← Install to Program Files (more trusted)
    "differentialPackage": false  // ← Disable to prevent unsigned rebuilds
  }
}
```

**Key Changes:**
- `sign`: Points to custom signing script that integrates with SSL.com eSigner
- `certificateSubjectName`: Matches your code signing certificate
- `perMachine: true`: Installs to Program Files instead of AppData (more trusted by Windows)
- `differentialPackage: false`: Prevents electron-builder from creating differential updates that might be unsigned

### 2. Custom Signing Script

**File**: `/electron-sign/custom-sign.js`

This script is called by electron-builder for **every** executable that needs signing:
- Main app executable (`Giddh.exe` in `win-unpacked`)
- Installer executable (`Giddh Setup.exe`)
- Update packages

The script:
1. Receives file path from electron-builder
2. Uses SSL.com CodeSignTool to sign the file
3. Verifies the signature
4. Returns signed file to electron-builder

### 3. GitHub Actions Workflow

**File**: `/.github/workflows/windows-release.yml`

**Environment Variables Added to Build Step:**
```yaml
- name: Build Windows Electron App
  env:
    ELECTRON_ENV: true
    ES_USERNAME: ${{ secrets.ES_USERNAME }}
    ES_PASSWORD: ${{ secrets.ES_PASSWORD }}
    ES_CREDENTIAL_ID: ${{ secrets.ES_CREDENTIAL_ID }}
    ES_TOTP_SECRET: ${{ secrets.ES_TOTP_SECRET }}
```

These credentials allow `custom-sign.js` to authenticate with SSL.com eSigner during the build.

**Verification Added:**
```powershell
# Verify app executable signature (critical for auto-updates)
$appExePath = Get-ChildItem -Filter "Giddh.exe" -Recurse | 
  Where-Object { $_.Directory.Name -eq "win-unpacked" }
$sig = Get-AuthenticodeSignature $appExePath.FullName
if ($sig.Status -ne "Valid") {
  Write-Host "❌ ERROR: App executable is NOT SIGNED!"
  exit 1
}
```

**Fallback Signing:**
The workflow still includes post-build signing as a fallback, but it only runs if signing during build failed:
```yaml
- name: Sign installer with SSL.com eSigner (fallback if not signed during build)
  if: env.INSTALLER_ALREADY_SIGNED == 'false'
```

## Verification Checklist

After the build completes, verify these signatures:

### ✅ Critical Files That MUST Be Signed:

1. **App Executable** (for auto-updates):
   ```
   dist/apps/electrongiddh-packages/win-unpacked/Giddh.exe
   ```
   - **Why**: This is the file that gets downloaded during auto-updates
   - **Impact if unsigned**: Windows SmartScreen blocks the update

2. **Installer** (for manual installation):
   ```
   dist/apps/electrongiddh-packages/Giddh Setup X.X.X.exe
   ```
   - **Why**: Users download this for fresh installs
   - **Impact if unsigned**: Windows SmartScreen warning during installation

3. **ZIP Package** (for auto-updates):
   ```
   dist/apps/electrongiddh-packages/Giddh-X.X.X-win.zip
   ```
   - **Why**: Contains the signed app executable for updates
   - **Impact if unsigned**: Update will fail signature verification

### Verification Commands:

**PowerShell:**
```powershell
# Check app executable
Get-AuthenticodeSignature "dist/apps/electrongiddh-packages/win-unpacked/Giddh.exe"

# Check installer
Get-AuthenticodeSignature "dist/apps/electrongiddh-packages/Giddh Setup X.X.X.exe"
```

**Expected Output:**
```
Status        : Valid
SignerCertificate : CN=Walkover Web Solutions Private Limited, ...
```

## Benefits of This Approach

### 1. **Immediate Trust**
- App executable is signed from the moment it's built
- No gap between build and signing
- Update packages contain signed executables

### 2. **Consistent Signing**
- All executables signed with same certificate
- Same signing process for app and installer
- No manual signing steps

### 3. **SmartScreen Compatibility**
- Windows recognizes signed executables
- Auto-updates work without SmartScreen warnings
- Better user experience

### 4. **Production Ready**
- `perMachine: true` installs to Program Files (more trusted)
- Differential packages disabled (prevents unsigned rebuilds)
- Proper certificate subject name matching

## Troubleshooting

### Issue: "App executable is NOT SIGNED"

**Cause**: Custom signing script failed during build

**Solution**:
1. Check that all SSL.com credentials are set in GitHub Secrets
2. Verify `custom-sign.js` has correct permissions
3. Check build logs for signing errors

### Issue: "Auto-update downloads but Windows blocks it"

**Cause**: App executable in update package is unsigned

**Solution**:
1. Verify `win-unpacked/Giddh.exe` is signed after build
2. Check that `differentialPackage: false` is set
3. Ensure signing happens BEFORE packaging

### Issue: "Signing takes too long"

**Cause**: SSL.com eSigner API latency

**Solution**:
- This is expected (cloud-based signing)
- Each executable takes ~30-60 seconds to sign
- Total build time increases by 2-5 minutes

## Best Practices

### 1. **Use EV Code Signing Certificate**
- Immediate trust, no SmartScreen reputation building required
- Recommended for production applications
- Current setup uses SSL.com eSigner (cloud-based EV cert)

### 2. **Install to Program Files**
- Set `perMachine: true` in NSIS config
- More trusted by Windows than AppData
- Requires admin elevation during install

### 3. **Disable Differential Updates**
- Set `differentialPackage: false`
- Prevents unsigned differential packages
- Slightly larger update downloads but guaranteed signed

### 4. **Verify Before Upload**
- Always check signatures in CI before uploading to S3
- Fail the build if any executable is unsigned
- Prevents distributing unsigned updates

## References

- [electron-builder Code Signing](https://www.electron.build/code-signing)
- [Windows Code Signing Best Practices](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [SSL.com eSigner Documentation](https://www.ssl.com/esigner/)
