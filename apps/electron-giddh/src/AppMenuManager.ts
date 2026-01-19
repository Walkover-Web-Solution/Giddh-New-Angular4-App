import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions } from 'electron';
import { checkForUpdates } from './AppUpdater';
import WindowManager from './WindowManager';

function getAppVersion(): string {
    try {
        // Use Electron's app.getVersion() which reads from package.json automatically
        return app.getVersion();
    } catch (error) {
        return '0.0.0'; // fallback to current version
    }
}

export default function setMenu() {
    const windowsMenu: MenuItemConstructorOptions = {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'New Window',
                accelerator: 'CmdOrCtrl+N',
                /**
                 * Handles click functionality
                 */
                click: (menuItem, browserWindow: BrowserWindow, event) => {
                    const windowManager = new WindowManager();
                    windowManager.openWindows();
                }
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: 'Check For Update',
                accelerator: 'CmdOrCtrl+U',
                /**
                 * Handles click functionality
                 */
                click: (item: any, focusedWindow: any, event) => {
                    //
                    /**
                     * Handles checkForUpdates functionality
                     */
                    checkForUpdates(item, focusedWindow, event);
                }
            },
            {
                label: `About Giddh v${getAppVersion()}`,
                /**
                 * Handles click functionality
                 */
                click: async () => {
                    try {
                        const result = await dialog.showMessageBox({
                            type: 'info',
                            title: 'About Giddh',
                            message: 'Giddh - Accounting Software',
                            detail: `Version: ${getAppVersion()}\nElectron: ${process.versions.electron}\n\nBuilt with ❤️ by Walkover Technologies`,
                            buttons: ['OK']
                        });
                    } catch (error) {
                        console.error('Dialog failed:', error);
                    }
                }
            }
        ]
    };

    const name = app.getName();
    const template: MenuItemConstructorOptions[] = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectAll'
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    /**
                     * Handles click functionality
                     */
                    click: (item: any, focusedWindow: any) => {
                        /**
                         * Handles if functionality
                         */
                        if (focusedWindow != null) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Enter Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    /**
                     * Handles click functionality
                     */
                    click: (item: any, focusedWindow: any) => {
                        /**
                         * Handles if functionality
                         */
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
                {
                    label: 'Open Dev Tool',
                    accelerator: 'Command+I',
                    /**
                     * Handles click functionality
                     */
                    click: (item: any, focusedWindow: any) => {
                        /**
                         * Handles if functionality
                         */
                        if (focusedWindow != null) {
                            focusedWindow.webContents.openDevTools();
                        }
                    }
                }
            ]
        },
        windowsMenu
    ];
    /**
     * Handles if functionality
     */
    if (process.platform === 'darwin') {
        template.unshift({
            label: name,
            submenu: [
                {
                    label: 'About ' + name,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + name,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideOthers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    /**
                     * Handles click functionality
                     */
                    click: () => {
                        app.quit();
                    }
                }
            ]
        });

        ((windowsMenu.submenu) as MenuItemConstructorOptions[]).push(
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            });
    }

    const appMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(appMenu);
}
