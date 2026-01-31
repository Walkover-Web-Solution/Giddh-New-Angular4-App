# Electron Auto-Updater Implementation Guide

## Overview
This guide provides step-by-step instructions to implement auto-updater functionality in your Giddh Electron application.

## Changes Made

### 1. GitHub Actions Workflow (`/.github/workflows/windows-release.yml`)
**Updated sections:**
- ✅ Changed build step to use `--publish always` to generate `latest.yml` metadata
- ✅ Added step to find and verify `latest.yml` file
- ✅ Added step to update `latest.yml` with signed installer information
- ✅ Updated S3 upload to include `releases/` path structure
- ✅ Added public ACL permissions for auto-updater access
- ✅ Added GitHub release creation with auto-updater support

### 2. Electron-Builder Configuration (`/electron-sign/electron-builder.json`)
**Updated properties:**
- ✅ Added `region` and `path` to S3 publish configuration
- ✅ Changed `differentialPackage` to `true` for faster updates

## Implementation Steps

### Step 1: Update AppUpdater.ts
Replace the content of `/apps/electron-giddh/src/AppUpdater.ts` with:

```typescript
import { UpdateDownloadedEvent, autoUpdater, UpdateInfo } from 'electron-updater';
import { MessageBoxOptions, dialog, app } from 'electron';
import * as log from 'electron-log';

export default class AppUpdater {
    private isUpdateDownloaded: boolean = false;
    private updateInfo: UpdateInfo | null = null;

    constructor() {
        this.configureUpdater();
        this.setupEventListeners();
    }

    private configureUpdater(): void {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;

        // Configure S3 update server
        autoUpdater.setFeedURL({
            provider: 's3',
            bucket: 'app-giddh-test',
            region: 'ap-south-1',
            path: 'test/windows/latest'
        });

        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.allowPrerelease = false;
        autoUpdater.allowDowngrade = false;

        // Check every 4 hours
        autoUpdater.checkForUpdatesAndNotify();
        setInterval(() => {
            if (!app.isPackaged) return;
            autoUpdater.checkForUpdatesAndNotify();
        }, 4 * 60 * 60 * 1000);
    }

    private setupEventListeners(): void {
        autoUpdater.on('checking-for-update', () => {
            log.info('Checking for update...');
        });

        autoUpdater.on('update-available', (info: UpdateInfo) => {
            log.info('Update available:', info);
            this.updateInfo = info;
            this.showUpdateAvailableDialog(info);
        });

        autoUpdater.on('update-not-available', (info: UpdateInfo) => {
            log.info('Update not available:', info);
            this.showNoUpdateDialog();
        });

        autoUpdater.on('error', (err: Error) => {
            log.error('Error in auto-updater:', err);
            this.showUpdateErrorDialog(err);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            const logMessage = \`Download speed: \${progressObj.bytesPerSecond} - Downloaded \${progressObj.percent}% (\${progressObj.transferred}/\${progressObj.total})\`;
            log.info(logMessage);
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            log.info('Update downloaded');
            this.isUpdateDownloaded = true;
            this.showUpdateDownloadedDialog(event);
        });
    }

    public async checkForUpdates(): Promise<void> {
        try {
            if (!app.isPackaged) {
                this.showDevelopmentModeDialog();
                return;
            }
            log.info('Manual update check initiated');
            await autoUpdater.checkForUpdates();
        } catch (error) {
            log.error('Error checking for updates:', error);
            this.showUpdateErrorDialog(error as Error);
        }
    }

    private showUpdateAvailableDialog(info: UpdateInfo): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'Update Available',
            message: \`A new version (\${info.version}) is available!\`,
            detail: \`Current version: \${app.getVersion()}\\nNew version: \${info.version}\\n\\nWould you like to download it now?\`,
            buttons: ['Download Now', 'Later'],
            defaultId: 0,
            cancelId: 1
        };

        dialog.showMessageBox(options).then((result) => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        });
    }

    private showNoUpdateDialog(): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'No Updates',
            message: 'You are running the latest version!',
            detail: \`Current version: \${app.getVersion()}\`,
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    private showUpdateDownloadedDialog(event: UpdateDownloadedEvent): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'Update Ready',
            message: 'Update downloaded successfully!',
            detail: \`Version \${event.version} has been downloaded and is ready to install.\\n\\nThe application will restart to apply the update.\`,
            buttons: ['Restart Now', 'Later'],
            defaultId: 0,
            cancelId: 1
        };

        dialog.showMessageBox(options).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    }

    private showUpdateErrorDialog(error: Error): void {
        const options: MessageBoxOptions = {
            type: 'error',
            title: 'Update Error',
            message: 'Failed to check for updates',
            detail: \`Error: \${error.message}\\n\\nPlease try again later.\`,
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    private showDevelopmentModeDialog(): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'Development Mode',
            message: 'Auto-updater is disabled in development mode',
            detail: 'Updates are only available in the packaged application.',
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    public getUpdateStatus(): { isUpdateDownloaded: boolean; updateInfo: UpdateInfo | null } {
        return {
            isUpdateDownloaded: this.isUpdateDownloaded,
            updateInfo: this.updateInfo
        };
    }

    public quitAndInstall(): void {
        if (this.isUpdateDownloaded) {
            autoUpdater.quitAndInstall();
        }
    }
}

let updaterInstance: AppUpdater | null = null;

export function getAppUpdater(): AppUpdater {
    if (!updaterInstance) {
        updaterInstance = new AppUpdater();
    }
    return updaterInstance;
}

export function checkForUpdates(): void {
    getAppUpdater().checkForUpdates();
}
```

### Step 2: Update WindowManager.ts
Add IPC handlers in `/apps/electron-giddh/src/WindowManager.ts`:

```typescript
import { getAppUpdater } from './AppUpdater';

// In your WindowManager constructor or initialization:
private setupAutoUpdater(): void {
    const appUpdater = getAppUpdater();

    ipcMain.handle('check-for-updates', async () => {
        try {
            await appUpdater.checkForUpdates();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-update-status', () => {
        return appUpdater.getUpdateStatus();
    });

    ipcMain.handle('quit-and-install', () => {
        appUpdater.quitAndInstall();
    });

    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });
}
```

### Step 3: Add Renderer Process Service
Create a service in your Angular app to communicate with the updater:

```typescript
// electron-updater.service.ts
export class ElectronUpdaterService {
    private isElectron: boolean;

    constructor() {
        this.isElectron = !!(window && window.process && window.process.type);
    }

    public async checkForUpdates(): Promise<{ success: boolean; error?: string }> {
        if (!this.isElectron) {
            return { success: false, error: 'Not running in Electron' };
        }

        try {
            const { ipcRenderer } = window.require('electron');
            return await ipcRenderer.invoke('check-for-updates');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    public async getAppVersion(): Promise<string> {
        if (!this.isElectron) return 'Unknown';
        
        try {
            const { ipcRenderer } = window.require('electron');
            return await ipcRenderer.invoke('get-app-version');
        } catch (error) {
            return 'Unknown';
        }
    }
}
```

### Step 4: Configure S3 Bucket
Your S3 bucket has ACLs disabled (modern best practice), so you must use a **bucket policy** for public access:

**Note:** The workflow uses `secrets.S3_BUCKET` which should be:
- **Test builds:** `app-giddh-test` with path `test/**`
- **Production builds:** `app-giddh-test` with path `prod/**`

1. **Go to AWS S3 Console** → Select your bucket (e.g., `app-giddh-test`) → **Permissions** tab

2. **Block Public Access Settings:**
   - Uncheck "Block all public access" (or at minimum, uncheck "Block public access to buckets and objects granted through new public bucket or access point policies")
   - Save changes

3. **Add Bucket Policy** (replace `app-giddh-test` with your actual bucket name):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::app-giddh-test/releases/*"
        }
    ]
}
```

**For production bucket (`app-giddh-test`), use:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::app-giddh-test/prod/*"
        }
    ]
}
```

4. **CORS Configuration** (if needed for web-based downloads):
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Testing

### 1. Build and Deploy
```bash
# Tag a new version
git tag v1.0.1
git push origin v1.0.1

# GitHub Actions will automatically:
# - Build the app
# - Sign the installer
# - Generate latest.yml
# - Upload to S3
# - Create GitHub release
```

### 2. Verify S3 Structure
Check that these files exist:
```
s3://app-giddh-test/
├── test/
│   ├── windows/latest/latest.yml
│   ├── mac/latest/latest.yml
│   │   └── giddh Setup 1.0.1.exe
│   └── v1.0.1/
│       └── giddh Setup 1.0.1.exe
```

### 3. Test Update Check
In your Electron app:
```javascript
// From renderer process
const { ipcRenderer } = require('electron');
await ipcRenderer.invoke('check-for-updates');
```

## How It Works

### Automatic Updates
1. App starts → Checks for updates every 4 hours
2. Update found → Shows dialog to download
3. User accepts → Downloads in background
4. Download complete → Shows restart dialog

### Manual Updates
1. User clicks "Check for Updates"
2. IPC call to main process
3. Main process checks S3 for `latest.yml`
4. Compares versions
5. Shows appropriate dialog

### Update Flow
```
User Opens App
     ↓
AppUpdater Initializes
     ↓
Checks S3: releases/latest.yml
     ↓
Compares Versions
     ↓
If Update Available:
  → Show Dialog
  → Download Update
  → Verify Signature
  → Show Restart Dialog
  → Install on Restart
```

## Troubleshooting

### Updates Not Working
1. **Check S3 bucket permissions** - Ensure public read access
2. **Verify latest.yml exists** - Check S3 console
3. **Check app logs** - Look in electron-log files
4. **Verify version numbers** - Ensure new version > current version

### Common Issues
- **"Update not available"** - Version in latest.yml ≤ current version
- **"Failed to check for updates"** - S3 permissions or network issue
- **"Invalid signature"** - Code signing certificate mismatch

## Summary
✅ GitHub Actions workflow updated to generate update metadata  
✅ Electron-builder configured for S3 publishing  
✅ Auto-updater code ready to implement  
✅ S3 bucket structure defined  
✅ Testing procedures documented  

The auto-updater will now work correctly once you implement the code changes in AppUpdater.ts and WindowManager.ts!
