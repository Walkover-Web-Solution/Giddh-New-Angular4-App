import { app, BrowserWindow as BrowserWindowElectron, ipcMain } from 'electron';
import AppUpdaterV1 from './AppUpdater';
import { autoUpdater } from 'electron-updater';
import { WebContentsSignal, WindowEvent } from './electronEventSignals';
import { DEFAULT_URL, StateManager, WindowItem } from './StateManager';
import * as path from 'path';
import * as fs from 'fs';
import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export const WINDOW_NAVIGATED = 'windowNavigated';

function getIconPath(): string {
    // Try multiple possible icon locations
    const possiblePaths = [
        path.join(__dirname, '../../../resources/icon.ico'),
        path.join(__dirname, '../../../resources/favicon.ico'),
        path.join(process.resourcesPath, 'icon.ico'),
        path.join(process.resourcesPath, 'favicon.ico'),
        path.join(__dirname, 'assets/icon/favicon.ico')
    ];

    for (const iconPath of possiblePaths) {
        try {
            if (fs.existsSync(iconPath)) {
                console.log('Using icon from:', iconPath);
                return iconPath;
            }
        } catch (error) {
            // Continue to next path
        }
    }

    console.warn('No icon file found, using default');
    return undefined; // Let Electron use default icon
}

export default class WindowManager {

    private appUpdater: AppUpdaterV1 = null;
    private stateManager = new StateManager();
    private windows: BrowserWindow[] = [];

    constructor() {
        app.on('window-all-closed', () => {
            // restore default set of windows
            this.stateManager.restoreWindows();
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform === 'darwin') {
                // reopen initial window
                // this.openWindows();
                if (this.appUpdater && this.appUpdater.isUpdateDownloaded) {
                    autoUpdater.quitAndInstall();
                } else {
                    app.quit();
                }
            } else {
                if (this.appUpdater && this.appUpdater.isUpdateDownloaded) {
                    setTimeout(() => {
                        autoUpdater.quitAndInstall();
                    }, 60000);
                } else {
                    app.quit();
                }
            }
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

            const iconPath = getIconPath();
            const options: BrowserWindowConstructorOptions = {
                // to avoid visible maximizing
                icon: iconPath,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                },
                tabbingIdentifier: 'giddh'
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

        // tslint:disable-next-line:no-unused-expression
        this.appUpdater = new AppUpdaterV1();
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
            const url = window.webContents.getURL();
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
            }
            this.stateManager.save();
        });
        window.on('closed', () => {
            const index = this.windows.indexOf(window);
            if (index >= 0) {
                this.windows.splice(index, 1);
            }
        });

        window.on('app-command', (e: any, command: string) => {
            // navigate the window back when the user hits their mouse back button
            if (command === 'browser-backward') {
                if (window.webContents.canGoBack()) {
                    window.webContents.goBack();
                }
            } else if (command === 'browser-forward') {
                if (window.webContents.canGoForward()) {
                    window.webContents.goForward();
                }
            }
        });

        const webContents = window.webContents;
        // cannot find way to listen url change in pure JS
        new WebContentsSignal(webContents)
            .navigated((event, url) => {
                ipcMain.emit(WINDOW_NAVIGATED, event.sender, url);
                webContents.send('maybeUrlChanged', url);
            })
            .navigatedInPage((event, url) => {
                ipcMain.emit(WINDOW_NAVIGATED, event.sender, url);
                webContents.send('maybeUrlChanged', url);
            });
    }

}

function isUrlInvalid(url: string): boolean {
    return url == null || url.length === 0 || url === 'about:blank';
}
