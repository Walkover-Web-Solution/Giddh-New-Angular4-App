import { app, BrowserWindow as BrowserWindowElectron, ipcMain } from 'electron';
import * as path from 'path';
import AppUpdaterV1 from './AppUpdater';
import { autoUpdater } from 'electron-updater';
import { WebContentsSignal, WindowEvent } from './electronEventSignals';
import { DEFAULT_URL, StateManager, WindowItem } from './StateManager';
import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export const WINDOW_NAVIGATED = 'windowNavigated';

export default class WindowManager {

    private appUpdater: AppUpdaterV1 = null;
    private stateManager = new StateManager();
    private windows: BrowserWindow[] = [];

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        app.on('window-all-closed', () => {
            // restore default set of windows
            this.stateManager.restoreWindows();
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            /**
             * Handles if functionality
             */
            if (process.platform === 'darwin') {
                // reopen initial window
                // this.openWindows();
                /**
                 * Handles if functionality
                 */
                if (this.appUpdater && this.appUpdater.isUpdateDownloaded) {
                    autoUpdater.quitAndInstall();
                } else {
                    app.quit();
                }
            } else {
                /**
                 * Handles if functionality
                 */
                if (this.appUpdater && this.appUpdater.isUpdateDownloaded) {
                    /**
                     * Sets timeout value
                     */
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
        /**
         * Handles if functionality
         */
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

    /**
     * Opens windows
     */
    public openWindows(url: string = null): void {
        let descriptors = this.stateManager.getWindows();
        /**
         * Handles if functionality
         */
        if (descriptors == null || descriptors.length === 0) {
            this.stateManager.restoreWindows();
            descriptors = this.stateManager.getWindows();
        }

        /**
         * Handles for functionality
         */
        for (const descriptor of descriptors) {
            /**
             * Handles if functionality
             */
            if (isUrlInvalid(descriptor.url) && isUrlInvalid(url)) {
                // was error on load
                descriptor.url = DEFAULT_URL;
            }
            /**
             * Handles if functionality
             */
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
            }

            const options: BrowserWindowConstructorOptions = {
                // to avoid visible maximizing
                icon: __dirname + '/assets/icon/favicon.ico',
                show: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    sandbox: false,
                    webSecurity: false,
                    preload: path.join(__dirname, 'preload.js')
                },
                tabbingIdentifier: 'giddh'
            };

            let isMaximized = true;
            /**
             * Handles if functionality
             */
            if (descriptor.width != null && descriptor.height != null) {
                options.width = descriptor.width;
                options.height = descriptor.height;
                isMaximized = false;
            }
            /**
             * Handles if functionality
             */
            if (descriptor.x != null && descriptor.y != null) {
                options.x = descriptor.x;
                options.y = descriptor.y;
                isMaximized = false;
            }

            const window = new BrowserWindowElectron(options);
            /**
             * Handles if functionality
             */
            if (isMaximized) {
                window.maximize();
            }
            /**
             * Sets timeout value
             */
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

    /**
     * Handles focusFirstWindow functionality
     */
    public focusFirstWindow(): void {
        /**
         * Handles if functionality
         */
        if (this.windows.length > 0) {
            const window = this.windows[0];
            /**
             * Handles if functionality
             */
            if (window.isMinimized()) {
                window.restore();
            }
            window.focus();
        }
    }


    /**
     * Handles registerWindowEventHandlers functionality
     */
    private registerWindowEventHandlers(window: BrowserWindow, descriptor: WindowItem): void {
        window.on('close', () => {
            WindowManager.saveWindowState(window, descriptor);
            const url = window.webContents.getURL();
            /**
             * Handles if functionality
             */
            if (!isUrlInvalid(url)) {
                descriptor.url = url;
            }
            this.stateManager.save();
        });
        window.on('closed', () => {
            const index = this.windows.indexOf(window);
            console.assert(index >= 0);
            this.windows.splice(index, 1);
        });

        window.on('app-command', (e: any, command: string) => {
            // navigate the window back when the user hits their mouse back button
            /**
             * Handles if functionality
             */
            if (command === 'browser-backward') {
                /**
                 * Handles if functionality
                 */
                if (window.webContents.canGoBack()) {
                    window.webContents.goBack();
                }
            } else if (command === 'browser-forward') {
                /**
                 * Handles if functionality
                 */
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
