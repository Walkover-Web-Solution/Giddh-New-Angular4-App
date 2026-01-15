# Desktop & Tray Icon Fix Guide

## Current Status

Both the desktop shortcut icon and tray icon are showing the default Electron icon instead of the Giddh logo.

## Root Causes Identified

### 1. Desktop/Taskbar Icon Issue
The icon.ico file (101,812 bytes, 6 images) is valid and being copied correctly, but **Windows icon cache** is likely preventing the new icon from showing. Even when the icon is properly embedded in the .exe, Windows may display the cached old icon.

### 2. Tray Icon Issue  
The tray PNG files exist but the path resolution in the packaged app needs improvement with multiple fallback locations.

## Solutions

### Fix 1: Clear Windows Icon Cache (User Action Required)

After installing the new build, you MUST clear the Windows icon cache:

**Method 1: Restart Explorer**
```cmd
taskkill /f /im explorer.exe
start explorer.exe
```

**Method 2: Delete Icon Cache (More thorough)**
```cmd
taskkill /f /im explorer.exe
cd %userprofile%\AppData\Local\Microsoft\Windows\Explorer
del iconcache*.db /a
start explorer.exe
```

**Method 3: Restart Computer**
Simply restart your computer - this will clear all caches.

### Fix 2: Update Tray Code in index.ts

Replace your `createTray()` function with this improved version that has multiple fallback paths:

```typescript
function createTray(): void {
    try {
        const path = require('path');
        const fs = require('fs');
        
        // Try multiple possible locations for the tray icon
        const possiblePaths = [
            // For packaged app - extraResources
            path.join(process.resourcesPath, 'build', 'icons', 'tray.png'),
            // For packaged app - app.asar.unpacked
            path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'icons', 'tray.png'),
            // For development
            path.join(__dirname, 'build', 'icons', 'tray.png'),
            // Fallback to smaller icon
            path.join(process.resourcesPath, 'build', 'icons', 'tray-small.png'),
            path.join(__dirname, 'build', 'icons', 'tray-small.png')
        ];

        console.log('🔍 Tray icon loading - Debug info:');
        console.log('  process.resourcesPath:', process.resourcesPath);
        console.log('  __dirname:', __dirname);
        console.log('  app.isPackaged:', app.isPackaged);

        let trayIconPath: string | null = null;
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
            console.log('  Testing:', testPath);
            if (fs.existsSync(testPath)) {
                trayIconPath = testPath;
                console.log('  ✅ Found at:', testPath);
                break;
            }
        }

        if (!trayIconPath) {
            console.error('❌ Tray icon not found in any location');
            return;
        }

        const image = nativeImage.createFromPath(trayIconPath);
        if (image.isEmpty()) {
            console.error('❌ Tray icon image is empty');
            return;
        }

        console.log('📐 Image size:', image.getSize());
        
        const resizedImage = image.resize({ width: 16, height: 16 });
        resizedImage.setTemplateImage(false);
        
        tray = new Tray(resizedImage);
        tray.setToolTip('Giddh - Accounting Software');

        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'Open Giddh', 
                click: () => {
                    if (windowManager) {
                        windowManager.openWindows();
                        windowManager.focusFirstWindow();
                    }
                }
            },
            { type: 'separator' },
            { 
                label: 'About Giddh', 
                click: () => console.log('About Giddh')
            },
            { type: 'separator' },
            { 
                label: 'Quit', 
                click: () => app.quit() 
            }
        ]);

        tray.setContextMenu(contextMenu);
        
        tray.on('click', () => {
            if (windowManager) {
                windowManager.focusFirstWindow();
            }
        });
        
        tray.on('double-click', () => {
            if (windowManager) {
                windowManager.openWindows();
                windowManager.focusFirstWindow();
            }
        });

        console.log('✅ Tray icon created successfully');
    } catch (error) {
        console.error('❌ Error creating tray:', error);
    }
}
```

Add these cleanup handlers after `app.on("ready")`:

```typescript
app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
        tray = null;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (!tray) {
            app.quit();
        }
    }
});
```

## Testing Steps

1. **Update your code** with the improved tray function
2. **Commit and push** your changes
3. **Wait for build** to complete
4. **Download installer** from S3
5. **Uninstall old version** completely
6. **Clear Windows icon cache** using one of the methods above
7. **Install new version**
8. **Restart computer** (recommended)
9. **Check both icons**:
   - Desktop shortcut icon
   - System tray icon

## Debugging

If tray icon still doesn't show, check the console logs when running the app. The improved code will show:
- All paths being tested
- Which path successfully loaded the icon
- Image size information
- Any errors encountered

## Configuration Changes Made

1. ✅ Added `**/build/icons/*.png` to `asarUnpack` in electron-builder.json
2. ✅ Added verbose logging to workflow to verify icon copying
3. ✅ Added verification step to check built executable

## Important Notes

- The icon.ico file is valid (101,812 bytes with 6 embedded sizes)
- electron-builder is configured correctly
- The main issue is likely **Windows icon cache**
- You MUST clear the icon cache to see the new icon
- Tray icon will work once the path resolution code is updated
