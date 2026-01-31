# Artifact Naming Structure

## Overview

This document describes the standardized naming convention for Electron build artifacts across macOS and Windows platforms. The naming structure ensures consistency between versioned builds and latest builds, making it easier to manage releases and understand the S3 bucket structure.

## Naming Convention

### Pattern
All artifacts follow this naming pattern:
```
giddh-test-setup-{VERSION}.{ext}
```

Where:
- `giddh-test` = Product identifier (lowercase, hyphenated)
- `setup` = Indicates installer/setup file
- `{VERSION}` = Semantic version (e.g., 10.0.9)
- `{ext}` = File extension (dmg, exe, zip)

### Examples

**macOS:**
- Versioned DMG: `giddh-test-setup-10.0.9.dmg`
- Versioned ZIP: `giddh-test-setup-10.0.9.zip`
- Latest DMG: `giddh-test-setup.dmg`
- Latest ZIP: `giddh-test.zip`

**Windows:**
- Versioned EXE: `giddh-test-setup-10.0.9.exe`
- Latest EXE: `giddh-test-setup.exe`

## S3 Bucket Structure

### Versioned Builds
Versioned builds are stored with their version number in both the path AND filename:

```
s3://app-giddh-test/
├── test/
│   ├── mac/
│   │   ├── 10.0.9/
│   │   │   ├── giddh-test-setup-10.0.9.dmg
│   │   │   ├── giddh-test-setup-10.0.9.zip
│   │   │   └── latest-mac.yml
│   │   ├── 10.0.10/
│   │   │   ├── giddh-test-setup-10.0.10.dmg
│   │   │   ├── giddh-test-setup-10.0.10.zip
│   │   │   └── latest-mac.yml
│   │   └── latest/
│   │       ├── giddh-test-setup.dmg
│   │       ├── giddh-test.zip
│   │       └── latest-mac.yml
│   └── windows/
│       ├── 10.0.9/
│       │   ├── giddh-test-setup-10.0.9.exe
│       │   └── latest.yml
│       ├── 10.0.10/
│       │   ├── giddh-test-setup-10.0.10.exe
│       │   └── latest.yml
│       └── latest/
│           ├── giddh-test-setup.exe
│           └── latest.yml
```

### Latest Builds
Latest builds use the same naming pattern but WITHOUT the version suffix:

**macOS:**
- `test/mac/latest/giddh-test-setup.dmg`
- `test/mac/latest/giddh-test.zip`
- `test/mac/latest/latest-mac.yml`

**Windows:**
- `test/windows/latest/giddh-test-setup.exe`
- `test/windows/latest/latest.yml`

## Benefits

### 1. **Consistency**
- Same naming pattern for versioned and latest builds
- Easy to understand which version a file belongs to
- Consistent across platforms (macOS and Windows)

### 2. **Clarity**
- Version number is always in the filename for versioned builds
- No confusion between different versions
- Clear distinction between versioned and latest builds

### 3. **Predictability**
- Easy to construct URLs programmatically
- Simple to find specific versions
- Straightforward for scripts and automation

### 4. **Auto-Updater Compatibility**
- Latest folder contains fixed filenames for auto-updater
- Versioned folders preserve original filenames for reference
- YML files are modified to reference correct filenames

## Implementation Details

### electron-builder Configuration

**macOS** (`electron-builder-mac-unsigned.json`):
```json
{
  "mac": {
    "artifactName": "giddh-test-setup-${version}.${ext}"
  },
  "dmg": {
    "artifactName": "giddh-test-setup-${version}.${ext}"
  }
}
```

**Windows** (`electron-builder.json`):
```json
{
  "win": {
    "artifactName": "giddh-test-setup-${version}.${ext}"
  }
}
```

### GitHub Actions Workflow

Both macOS and Windows workflows:

1. **Extract versioned filename** from electron-builder output
2. **Upload to versioned folder** with version in filename
3. **Upload to latest folder** with fixed filename (no version)
4. **Modify YML files** to reference correct filenames

**Example (macOS):**
```bash
# Versioned upload
aws s3 cp "$ZIP_FILE" "s3://$BUCKET/test/mac/$VERSION/giddh-test-setup-$VERSION.zip"

# Latest upload (fixed name)
aws s3 cp "$ZIP_FILE" "s3://$BUCKET/test/mac/latest/giddh-test.zip"
```

### YML File Modification

The workflows automatically modify `latest.yml` / `latest-mac.yml` files to reference the correct filenames:

**For versioned folders:**
- Keep original filenames with version: `giddh-test-setup-10.0.9.exe`

**For latest folder:**
- Replace with fixed filenames: `giddh-test-setup.exe`

**Regex patterns used:**
```bash
# macOS
sed -E 's/giddh-test-setup-[0-9]+\.[0-9]+\.[0-9]+\.zip/giddh-test.zip/g'
sed -E 's/giddh-test-setup-[0-9]+\.[0-9]+\.[0-9]+\.dmg/giddh-test-setup.dmg/g'

# Windows
$ymlContent -replace 'giddh-test-setup-\d+\.\d+\.\d+\.exe', 'giddh-test-setup.exe'
```

## Download URLs

### Versioned URLs (Specific Version)

**macOS:**
```
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/10.0.9/giddh-test-setup-10.0.9.dmg
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/10.0.9/giddh-test-setup-10.0.9.zip
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/10.0.9/latest-mac.yml
```

**Windows:**
```
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/10.0.9/giddh-test-setup-10.0.9.exe
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/10.0.9/latest.yml
```

### Latest URLs (Auto-Updater)

**macOS:**
```
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest/giddh-test-setup.dmg
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest/giddh-test.zip
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest/latest-mac.yml
```

**Windows:**
```
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/latest/giddh-test-setup.exe
https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/windows/latest/latest.yml
```

## Auto-Updater Configuration

The auto-updater is configured to use the `latest` folder, which always contains fixed filenames:

**AppUpdater.ts:**
```typescript
const feedConfig = process.platform === 'darwin' 
  ? {
      provider: 'generic',
      url: 'https://s3-ap-south-1.amazonaws.com/app-giddh-test/test/mac/latest'
    }
  : {
      provider: 's3',
      bucket: 'app-giddh-test',
      region: 'ap-south-1',
      path: 'test/windows/latest'
    };
```

The auto-updater:
1. Reads `latest.yml` / `latest-mac.yml` from the latest folder
2. Downloads the file referenced in the YML (e.g., `giddh-test-setup.exe`)
3. Installs the update silently
4. Restarts the app

## Migration from Old Naming

### Old Structure (Before)
```
test/mac/10.0.9/Giddh Setup 10.0.9.dmg
test/windows/10.0.9/Giddh Setup 10.0.9.exe
```

### New Structure (After)
```
test/mac/10.0.9/giddh-test-setup-10.0.9.dmg
test/windows/10.0.9/giddh-test-setup-10.0.9.exe
```

### Changes Made
1. **Lowercase**: `Giddh` → `giddh`
2. **Hyphenated**: Spaces replaced with hyphens
3. **Consistent**: Same pattern across platforms
4. **Product name**: `Giddh` → `giddh-test` (includes environment)

## Troubleshooting

### Issue: Auto-updater can't find update

**Cause**: YML file references wrong filename

**Solution**: 
- Check that `latest.yml` / `latest-mac.yml` in the latest folder references the correct fixed filename
- Verify the file exists in S3 at the expected path
- Check auto-updater logs for the exact URL being requested

### Issue: Wrong version downloaded

**Cause**: Latest folder not updated

**Solution**:
- Ensure `UPLOAD_LATEST=true` in GitHub Actions
- Check that the workflow completed successfully
- Verify the latest folder contains the newest version

### Issue: File not found in S3

**Cause**: Upload failed or wrong path

**Solution**:
- Check GitHub Actions logs for upload errors
- Verify AWS credentials are correct
- Ensure S3 bucket permissions allow uploads
- Check that the versioned filename matches the pattern

## Summary

The standardized naming structure provides:

✅ **Consistent naming** across platforms and versions  
✅ **Clear version identification** in filenames  
✅ **Predictable URLs** for downloads  
✅ **Auto-updater compatibility** with fixed filenames  
✅ **Easy maintenance** and automation  

All new builds will automatically use this naming convention through the electron-builder configuration and GitHub Actions workflows.
