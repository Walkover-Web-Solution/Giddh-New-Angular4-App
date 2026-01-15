# Tray Icon Fix Instructions

## Problem
The tray icon is not showing because the path resolution is incorrect for packaged apps.

## Solution
Replace the `createTray()` function in `apps/electron-giddh/src/index.ts` with the following improved version:

```typescript
function createTray(): void {
    try {
        const path = require('path');
        
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

        console.log('🔍 Attempting to load tray icon from possible paths:');
        console.log('process.resourcesPath:', process.resourcesPath);
        console.log('__dirname:', __dirname);
        console.log('app.isPackaged:', app.isPackaged);

        let trayIconPath: string | null = null;
        const fs = require('fs');
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
            console.log('Testing path:', testPath);
            if (fs.existsSync(testPath)) {
                trayIconPath = testPath;
                console.log('✅ Found tray icon at:', testPath);
                break;
            }
        }

        if (!trayIconPath) {
            console.error('❌ Tray icon not found in any of the expected locations');
            console.log('Searched paths:', possiblePaths);
            return;
        }

        const image = nativeImage.createFromPath(trayIconPath);
        if (image.isEmpty()) {
            console.error('❌ Tray icon loaded but image is empty:', trayIconPath);
            return;
        }

        console.log('📐 Original image size:', image.getSize());
        
        // Resize to 16x16 for Windows tray
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
                click: () => {
                    console.log('About Giddh clicked');
                }
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

## Additional Changes Needed

### 1. Update electron-builder.json to unpack tray icons from ASAR

Add the tray icon path to `asarUnpack`:

```json
"asarUnpack": [
    "**/*.node",
    "**/build/icons/*.png"
]
```

### 2. Add cleanup handlers

Add these event handlers after the `createTray()` call in the `app.on("ready")` section:

```typescript
// Cleanup when app is quitting
app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
        tray = null;
    }
});

// Keep app running when all windows are closed (for tray functionality)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // On Windows, keep running if tray exists
        if (!tray) {
            app.quit();
        }
    }
});
```

## Why This Fix Works

1. **Multiple Path Attempts**: Tries several possible locations where the icon might be
2. **File Existence Check**: Verifies the file exists before trying to load it
3. **Detailed Logging**: Helps debug path issues by logging all attempts
4. **ASAR Unpacking**: Ensures PNG files are extracted from ASAR archive
5. **Proper Fallback**: Falls back to smaller icon if main icon not found

## Testing

After making these changes:
1. Rebuild the app
2. Check the console logs to see which path was used
3. Verify the tray icon appears in the system tray
