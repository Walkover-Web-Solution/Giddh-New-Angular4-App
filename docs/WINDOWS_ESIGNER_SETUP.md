# Windows Code Signing with SSL.com eSigner for Auto-Updates

## Overview

This document explains the correct architecture for Windows code signing using **SSL.com eSigner** (cloud-based HSM) to enable seamless Electron auto-updates.

## Critical Understanding: eSigner vs File-Based Certificates

### eSigner (Cloud HSM) - What We Use ✅
- Certificate stored in **SSL.com cloud HSM**
- Signing happens via **API calls** to SSL.com
- **No .pfx file** to download
- Requires: Username, Password, Credential ID, TOTP Secret
- Signing tool: `SSLcom/esigner-codesign` GitHub Action

### File-Based Certificate (CSC_LINK) - What We DON'T Use ❌
- Certificate stored as **.pfx file** on disk
- Signing happens **locally** via signtool.exe
- Requires: Base64-encoded PFX, password
- Method: `CSC_LINK` environment variable
- **This does NOT work with eSigner**

## Why Both Installer AND App Executable Must Be Signed

For Windows auto-updates to work:

1. **Installer EXE** - Users download this for initial installation
2. **App Executable** (`win-unpacked/Giddh.exe`) - **CRITICAL for auto-updates**

### The Auto-Update Flow

```
User installs app from signed installer
        ↓
App runs (Giddh.exe in win-unpacked)
        ↓
App checks for updates (reads latest.yml from S3)
        ↓
Downloads update package
        ↓
Windows validates signature of update
        ↓
If signature matches installed app → Silent update ✅
If signature mismatch → SmartScreen blocks ❌
```

**Key Point:** electron-updater validates that the **update signature matches the installed app signature**. If `Giddh.exe` is unsigned, updates will always fail.

## Architecture

### ❌ WRONG: Sign During Build (Doesn't Work with eSigner)

```yaml
# This FAILS because eSigner is cloud-based, not file-based
env:
  CSC_LINK: ${{ secrets.WIN_CSC_LINK }}  # ❌ No PFX file exists
  CSC_KEY_PASSWORD: ${{ secrets.PASSWORD }}
run: |
  npx electron-builder --win  # Tries to find PFX, fails
```

### ✅ CORRECT: Build Unsigned → Sign with eSigner → Recalculate Hashes

```yaml
1. Build app (unsigned)
   npx electron-builder --win
   
2. Sign installer with eSigner
   SSLcom/esigner-codesign → installer.exe
   
3. Sign app executable with eSigner (CRITICAL)
   SSLcom/esigner-codesign → win-unpacked/Giddh.exe
   
4. Recalculate SHA512 hashes
   Update latest.yml with new hashes
   
5. Upload to S3
   Signed installer + updated latest.yml
```

## electron-builder Configuration

**File:** `electron-sign/electron-builder.json`

```json
{
  "win": {
    "signAndEditExecutable": false,  // ✅ Disable - eSigner signs after build
    "verifyUpdateCodeSignature": false,  // ✅ Disable - we handle verification
    "artifactName": "giddh-test-setup-${version}.${ext}"
  }
}
```

**Why `signAndEditExecutable: false`?**
- electron-builder expects a local PFX file for signing
- eSigner is cloud-based, so electron-builder can't sign
- We sign after build using eSigner API

## GitHub Actions Workflow

### Step 1: Build Unsigned App

```yaml
- name: Build Windows Electron App
  env:
    ELECTRON_ENV: true
  run: |
    npm run prepare.electron.giddh
    node scripts/build-env.js test
    npx ng build electron-giddh --configuration=test
    cd dist/apps/web-giddh
    npm install --production --no-optional
    npx electron-builder build --config ./../../../electron-sign/electron-builder.json --win
```

**Output:**
- ❌ Unsigned installer: `giddh-test-setup-10.0.14.exe`
- ❌ Unsigned app exe: `win-unpacked/Giddh.exe`
- ✅ Update metadata: `latest.yml` (with wrong hashes - will fix later)

### Step 2: Find Artifacts

```yaml
- name: Find artifacts and prepare for signing
  shell: pwsh
  run: |
    # Find unsigned installer
    $installer = Get-ChildItem -Path "dist/apps/electrongiddh-packages" -Filter "*.exe" |
      Where-Object { $_.Directory.Name -ne "win-unpacked" } |
      Select-Object -First 1
    
    "INSTALLER_PATH=$($installer.FullName)" | Out-File -FilePath $env:GITHUB_ENV -Append
    
    # Find app executable (CRITICAL for auto-updates)
    $appExe = Get-ChildItem -Path "dist/apps/electrongiddh-packages" -Filter "Giddh.exe" |
      Where-Object { $_.Directory.Name -eq "win-unpacked" } |
      Select-Object -First 1
    
    "APP_EXE_PATH=$($appExe.FullName)" | Out-File -FilePath $env:GITHUB_ENV -Append
```

### Step 3: Sign Installer with eSigner

```yaml
- name: Sign installer with SSL.com eSigner
  uses: SSLcom/esigner-codesign@v1.3.2
  with:
    command: sign
    username: ${{ secrets.ES_USERNAME }}
    password: ${{ secrets.ES_PASSWORD }}
    credential_id: ${{ secrets.ES_CREDENTIAL_ID }}
    totp_secret: ${{ secrets.ES_TOTP_SECRET }}
    file_path: ${{ env.INSTALLER_PATH }}
    output_path: artifacts/signed
    malware_block: false
    environment_name: PROD
    override: true
```

### Step 4: Sign App Executable with eSigner (CRITICAL)

```yaml
- name: Sign app executable with SSL.com eSigner (CRITICAL for auto-updates)
  uses: SSLcom/esigner-codesign@v1.3.2
  with:
    command: sign
    username: ${{ secrets.ES_USERNAME }}
    password: ${{ secrets.ES_PASSWORD }}
    credential_id: ${{ secrets.ES_CREDENTIAL_ID }}
    totp_secret: ${{ secrets.ES_TOTP_SECRET }}
    file_path: ${{ env.APP_EXE_PATH }}
    output_path: artifacts/signed-app
    malware_block: false
    environment_name: PROD
    override: true
```

**Why This Step is Critical:**
- Without this, `Giddh.exe` remains unsigned
- Windows will block auto-updates with SmartScreen
- Users will see "Unknown Publisher" warnings
- Auto-updates will fail signature validation

### Step 5: Verify Signatures

```yaml
- name: Verify signatures and prepare final artifacts
  shell: pwsh
  run: |
    # Verify installer signature
    $signedInstaller = Get-ChildItem -Path "artifacts/signed" -Filter "*.exe" | Select-Object -First 1
    $installerSig = Get-AuthenticodeSignature $signedInstaller.FullName
    
    if ($installerSig.Status -ne "Valid") {
      throw "Installer signature verification failed"
    }
    Write-Host "✅ Installer is SIGNED"
    
    # Verify app executable signature (CRITICAL)
    $signedAppExe = Get-ChildItem -Path "artifacts/signed-app" -Filter "Giddh.exe" | Select-Object -First 1
    $appSig = Get-AuthenticodeSignature $signedAppExe.FullName
    
    if ($appSig.Status -ne "Valid") {
      throw "App executable signature verification failed"
    }
    Write-Host "✅ App executable is SIGNED (auto-updates will work)"
    
    # Copy signed app executable back to win-unpacked
    $winUnpackedDir = Split-Path -Parent $env:APP_EXE_PATH
    Copy-Item $signedAppExe.FullName $winUnpackedDir -Force
```

### Step 6: Recalculate SHA512 Hashes

**Why This is Required:**
- Signing changes the file size and content
- `latest.yml` contains SHA512 hash of the installer
- electron-updater validates this hash
- If hash doesn't match → update fails

```yaml
- name: Recalculate SHA512 and update latest.yml (after signing)
  shell: pwsh
  run: |
    $signedFile = Get-ChildItem -Path "artifacts/final" -Filter "*.exe" | Select-Object -First 1
    
    # Calculate new SHA512 hash
    $hashHex = (Get-FileHash -Path $signedFile.FullName -Algorithm SHA512).Hash
    $byteArray = for ($i = 0; $i -lt $hashHex.Length; $i += 2) { 
      [Convert]::ToByte($hashHex.Substring($i, 2), 16) 
    }
    $base64Hash = [Convert]::ToBase64String($byteArray)
    
    # Get new file size
    $newSize = (Get-Item $signedFile.FullName).Length
    
    # Update latest.yml
    $ymlPath = "artifacts/final/latest.yml"
    $content = Get-Content $ymlPath -Raw
    $content = $content -replace 'sha512:\s*[A-Za-z0-9+/=]+', "sha512: $base64Hash"
    $content = $content -replace 'size:\s*\d+', "size: $newSize"
    Set-Content -Path $ymlPath -Value $content -Encoding UTF8 -NoNewline
```

### Step 7: Upload to S3

```yaml
- name: Upload installer to S3
  run: |
    # Upload to versioned path
    aws s3 cp artifacts/final/$VERSIONED_EXE_NAME \
      s3://$S3_BUCKET/test/windows/$VERSION/$VERSIONED_EXE_NAME
    
    # Upload to latest path (for auto-updater)
    aws s3 cp artifacts/final/$VERSIONED_EXE_NAME \
      s3://$S3_BUCKET/test/windows/latest/$LATEST_EXE_NAME
    
    # Upload latest.yml (with correct hashes)
    aws s3 cp artifacts/final/latest.yml \
      s3://$S3_BUCKET/test/windows/latest/latest.yml
```

## GitHub Secrets Required

Add these secrets in **Repository Settings → Secrets and variables → Actions:**

| Secret | Description | Example |
|--------|-------------|---------|
| `ES_USERNAME` | SSL.com eSigner username | `your-email@company.com` |
| `ES_PASSWORD` | SSL.com eSigner password | `your-password` |
| `ES_CREDENTIAL_ID` | Certificate credential ID | `abc123-def456-ghi789` |
| `ES_TOTP_SECRET` | TOTP secret for 2FA | `JBSWY3DPEHPK3PXP` |

**How to Get These:**
1. Log into SSL.com account
2. Navigate to eSigner dashboard
3. Find your code signing certificate
4. Copy credential ID and TOTP secret
5. Use your SSL.com account credentials for username/password

## Auto-Update Flow (How It All Works)

### Initial Installation

```
1. User downloads giddh-test-setup-10.0.14.exe from S3
2. Windows validates signature → "Walkover Web Solutions Private Limited"
3. Installer runs, extracts files including signed Giddh.exe
4. App installs to C:\Program Files\Giddh\
```

### Update Check

```
1. App starts, runs Giddh.exe (signed)
2. AppUpdater checks S3 for latest.yml
3. Reads version: 10.0.15 (newer than installed 10.0.14)
4. Reads SHA512 hash and download URL
```

### Update Download

```
1. Downloads giddh-test-setup-10.0.15.exe from S3
2. Validates SHA512 hash matches latest.yml
3. Validates signature matches installed app
4. Both checks pass → proceed with update
```

### Update Installation

```
1. electron-updater runs installer silently
2. Windows validates signature chain
3. Signature matches installed app → no SmartScreen
4. Update installs silently
5. App restarts with new version
```

## Troubleshooting

### Issue: "App executable is NOT SIGNED"

**Symptom:** Build succeeds but app executable signature verification fails

**Cause:** eSigner signing step for app executable failed or was skipped

**Solution:**
1. Check that `APP_EXE_PATH` environment variable is set correctly
2. Verify eSigner secrets are correct
3. Check eSigner action logs for errors
4. Ensure `win-unpacked/Giddh.exe` exists before signing

### Issue: "Auto-updates show SmartScreen warning"

**Symptom:** Updates download but Windows shows "Unknown Publisher"

**Cause:** App executable (`Giddh.exe`) is not signed

**Solution:**
1. Verify both signing steps completed successfully
2. Check signature of installed `Giddh.exe`: `Get-AuthenticodeSignature "C:\Program Files\Giddh\Giddh.exe"`
3. Ensure signed app exe was copied back to win-unpacked before packaging

### Issue: "Update download fails with hash mismatch"

**Symptom:** electron-updater logs show SHA512 hash mismatch

**Cause:** `latest.yml` not updated after signing

**Solution:**
1. Verify SHA512 recalculation step runs AFTER signing
2. Check that `latest.yml` contains base64-encoded SHA512 hash
3. Manually verify hash: `Get-FileHash -Algorithm SHA512 installer.exe`

### Issue: "eSigner action fails with authentication error"

**Symptom:** eSigner action logs show "Invalid credentials"

**Cause:** Incorrect eSigner secrets

**Solution:**
1. Verify `ES_USERNAME` and `ES_PASSWORD` are correct
2. Check `ES_CREDENTIAL_ID` matches your certificate
3. Verify `ES_TOTP_SECRET` is correct (regenerate if needed)
4. Ensure eSigner account has active code signing certificate

## Benefits of This Approach

✅ **Works with Cloud HSM**
- No need to manage PFX files
- Certificate stays secure in SSL.com cloud
- No risk of certificate leakage

✅ **Proper Auto-Update Support**
- Both installer and app executable are signed
- Signature chain is maintained
- Silent updates without SmartScreen

✅ **Correct Hash Validation**
- SHA512 recalculated after signing
- electron-updater validates hashes correctly
- No hash mismatch errors

✅ **Industry Standard**
- Follows Electron auto-update best practices
- Compatible with electron-updater expectations
- Reliable and well-tested

## Key Differences from File-Based Signing

| Aspect | File-Based (CSC_LINK) | eSigner (Cloud HSM) |
|--------|----------------------|---------------------|
| Certificate Storage | Local PFX file | SSL.com cloud |
| Signing Method | electron-builder during build | eSigner API after build |
| GitHub Secrets | CSC_LINK (base64 PFX), CSC_KEY_PASSWORD | ES_USERNAME, ES_PASSWORD, ES_CREDENTIAL_ID, ES_TOTP_SECRET |
| When Signing Happens | During `electron-builder` | After `electron-builder` |
| Files Signed | Automatic (all executables) | Manual (must specify each file) |
| Hash Recalculation | Automatic | Manual (required step) |

## Summary

**The Critical Steps:**

1. ✅ Build app unsigned (`signAndEditExecutable: false`)
2. ✅ Sign installer with eSigner
3. ✅ Sign app executable with eSigner (**CRITICAL for auto-updates**)
4. ✅ Recalculate SHA512 hashes
5. ✅ Update `latest.yml` with new hashes
6. ✅ Upload signed artifacts to S3

**What Makes Auto-Updates Work:**

- ✅ Installer is signed → Initial installation works
- ✅ App executable is signed → Updates validate correctly
- ✅ SHA512 hashes are correct → Downloads validate
- ✅ Signature chain matches → No SmartScreen warnings

**Common Mistakes to Avoid:**

- ❌ Using CSC_LINK with eSigner (won't work - different signing methods)
- ❌ Only signing installer (app exe must also be signed)
- ❌ Not recalculating SHA512 after signing (hashes will be wrong)
- ❌ Signing during build (eSigner requires post-build signing)

This architecture ensures reliable, silent auto-updates for Windows users without SmartScreen warnings or signature validation errors.
