import { app, BrowserWindow as BrowserWindowElectron, ipcMain } from 'electron';
import { WebContentsSignal, WindowEvent } from './electronEventSignals';
import { DEFAULT_URL, StateManager, WindowItem } from './StateManager';
import BrowserWindow = Electron.BrowserWindow;
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export const WINDOW_NAVIGATED = 'windowNavigated';

export default class WindowManager {

    private stateManager = new StateManager();
    private windows: BrowserWindow[] = [];

    constructor() { }

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

            const options: BrowserWindowConstructorOptions = {
                // to avoid visible maximizing
                icon: __dirname + '/assets/icon/favicon.ico',
                show: false,
                webPreferences: {
                    nodeIntegration: true
                },
                tabbingIdentifier: 'giddh',
                fullscreen: true
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
        window.on('closed', (event: WindowEvent) => {
            const index = this.windows.indexOf(event.sender);
            console.assert(index >= 0);
            this.windows.splice(index, 1);
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
