import { app, BrowserWindow as BrowserWindowElectron, ipcMain, nativeImage } from 'electron';
import * as path from 'path';
import { getAppUpdater } from './AppUpdater';
import { autoUpdater } from 'electron-updater';
import { WebContentsSignal, WindowEvent } from './electronEventSignals';
import { DEFAULT_URL, StateManager, WindowItem } from './StateManager';
import { isPackaged } from './util';
import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export const WINDOW_NAVIGATED = 'windowNavigated';

export default class WindowManager {

    private appUpdater = null;
    private stateManager = new StateManager();
    private windows: BrowserWindow[] = [];

    constructor() {
        // Setup IPC handlers for auto-updater
        this.setupAutoUpdaterIPC();

        app.on('window-all-closed', () => {
            // restore default set of windows
            this.stateManager.restoreWindows();
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform === 'darwin') {
                // reopen initial window
                // this.openWindows();
                if (this.appUpdater && this.appUpdater.getUpdateStatus().isUpdateDownloaded) {
                    autoUpdater.quitAndInstall();
                } else {
                    app.quit();
                }
            } else {
                if (this.appUpdater && this.appUpdater.getUpdateStatus().isUpdateDownloaded) {
                    setTimeout(() => {
                        autoUpdater.quitAndInstall();
                    }, 60000);
                } else {
                    app.quit();
                }
            }
        });
    }

    private setupAutoUpdaterIPC(): void {
        ipcMain.handle('check-for-updates', async () => {
            try {
                if (!this.appUpdater) {
                    this.appUpdater = getAppUpdater();
                }
                await this.appUpdater.checkForUpdates();
                return { success: true };
            } catch (error) {
                return { success: false, error: (error as Error).message };
            }
        });

        ipcMain.handle('get-update-status', () => {
            if (!this.appUpdater) {
                this.appUpdater = getAppUpdater();
            }
            return this.appUpdater.getUpdateStatus();
        });

        ipcMain.handle('quit-and-install', () => {
            if (!this.appUpdater) {
                this.appUpdater = getAppUpdater();
            }
            this.appUpdater.quitAndInstall();
        });

        ipcMain.handle('get-app-version', () => {
            return app.getVersion();
        });
    }

    public static saveWindowState(window: BrowserWindow, descriptor: WindowItem): void {
        if (window.isMaximized()) {
            delete descriptor.width;
            delete descriptor.height;
            delete descriptor.x;
            delete descriptor.y;
        } else {
            const bounds = window.getBounds();
            descriptor.width = bounds.width;
            descriptor.height = bounds.height;
            descriptor.x = bounds.x;
            descriptor.y = bounds.y;
        }
    }

    public openWindows(url: string = null): void {
        let descriptors = this.stateManager.getWindows();
        if (descriptors == null || descriptors.length === 0) {
            this.stateManager.restoreWindows();
            descriptors = this.stateManager.getWindows();
        }

        for (const descriptor of descriptors) {
            if (isUrlInvalid(descriptor.url) && isUrlInvalid(url)) {
                // was error on load
                descriptor.url = DEFAULT_URL;
            }
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
            }

            // Get correct icon for packaged vs development
            const getIcon = () => {
                const fs = require('fs');
                const isMac = process.platform === 'darwin';
                const iconExt = isMac ? 'icns' : 'ico';
                
                let iconPath: string;
                
                if (isPackaged()) {
                    // In packaged app, icon is in extraResources at process.resourcesPath/icon.ico
                    // extraResources config puts icon.ico directly in resources folder
                    iconPath = path.join(process.resourcesPath, `icon.${iconExt}`);
                    console.log(`🪟 Window icon path (packaged): ${iconPath}`);
                    console.log(`   process.resourcesPath: ${process.resourcesPath}`);
                    console.log(`   Icon exists: ${fs.existsSync(iconPath)}`);
                    
                    // Fallback: try resources subdirectory if not found at root
                    if (!fs.existsSync(iconPath)) {
                        const fallbackPath = path.join(process.resourcesPath, 'resources', `icon.${iconExt}`);
                        console.log(`   Trying fallback: ${fallbackPath}`);
                        console.log(`   Fallback exists: ${fs.existsSync(fallbackPath)}`);
                        if (fs.existsSync(fallbackPath)) {
                            iconPath = fallbackPath;
                        }
                    }
                } else {
                    // In development, use the source icon
                    iconPath = path.join(__dirname, '..', '..', '..', 'apps', 'electron-giddh', 'src', 'resources', `icon.${iconExt}`);
                    console.log(`🪟 Window icon path (development): ${iconPath}`);
                    console.log(`   Icon exists: ${fs.existsSync(iconPath)}`);
                }
                
                return fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;
            };

            // Get correct preload path
            const getPreloadPath = () => {
                if (isPackaged()) {
                    // In packaged app, preload.js is in the app.asar or extracted
                    return path.join(__dirname, 'preload.js');
                } else {
                    return path.join(__dirname, 'preload.js');
                }
            };

            const options: BrowserWindowConstructorOptions = {
                // to avoid visible maximizing
                icon: getIcon(),
                show: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    sandbox: false,
                    webSecurity: false,
                    preload: getPreloadPath()
                },
                tabbingIdentifier: 'Giddh'
            };

            let isMaximized = true;
            if (descriptor.width != null && descriptor.height != null) {
                options.width = descriptor.width;
                options.height = descriptor.height;
                isMaximized = false;
            }
            if (descriptor.x != null && descriptor.y != null) {
                options.x = descriptor.x;
                options.y = descriptor.y;
                isMaximized = false;
            }

            const window = new BrowserWindowElectron(options);
            if (isMaximized) {
                window.maximize();
            }
            setTimeout(() => {
                window.loadURL(descriptor.url);
                window.show();
                this.registerWindowEventHandlers(window, descriptor);
                this.windows.push(window);
            }, 2 * 1000);
        }

        // Initialize auto-updater after windows are created
        this.appUpdater = getAppUpdater();
    }

    public focusFirstWindow(): void {
        if (this.windows.length > 0) {
            const window = this.windows[0];
            if (window.isMinimized()) {
                window.restore();
            }
            window.focus();
        }
    }


    private registerWindowEventHandlers(window: BrowserWindow, descriptor: WindowItem): void {
        window.on('close', () => {
            WindowManager.saveWindowState(window, descriptor);
            this.stateManager.save();
        });

        window.on('closed', () => {
            const index = this.windows.indexOf(window);
            if (index >= 0) {
                this.windows.splice(index, 1);
            }
        });

        window.webContents.on('did-navigate', (event, url) => {
            descriptor.url = url;
            this.stateManager.save();
            window.webContents.send(WINDOW_NAVIGATED, url);
        });

        window.webContents.on('did-navigate-in-page', (event, url) => {
            descriptor.url = url;
            this.stateManager.save();
            window.webContents.send(WINDOW_NAVIGATED, url);
        });
    }

    public handleBeforeQuit(): void {
        if (this.appUpdater && this.appUpdater.getUpdateStatus().isUpdateDownloaded) {
            autoUpdater.quitAndInstall();
        }
    }
}

function isUrlInvalid(url: string): boolean {
    return url == null || url.length === 0;
}
