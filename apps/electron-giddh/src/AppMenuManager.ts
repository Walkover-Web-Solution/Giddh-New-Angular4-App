import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions } from 'electron';
import { checkForUpdates } from './AppUpdater';
import WindowManager from './WindowManager';

function getAppVersion(): string {
    return app.getVersion();
}

export default class AppMenuManager {
    private windowManager: WindowManager;

    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager;
    }

    public buildMenu(): Menu {
        const template: MenuItemConstructorOptions[] = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New Window',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => {
                            this.windowManager.openWindows();
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Quit',
                        accelerator: 'CmdOrCtrl+Q',
                        click: () => {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'selectAll' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'zoom' },
                    { type: 'separator' },
                    {
                        label: 'Check for Updates',
                        enabled: true,
                        click: () => {
                            checkForUpdates();
                        }
                    },
                    { type: 'separator' },
                    { role: 'close' }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About',
                        click: () => {
                            dialog.showMessageBox({
                                type: 'info',
                                title: 'About Giddh',
                                message: `Giddh Desktop v${getAppVersion()}`,
                                detail: 'Accounting software for modern businesses',
                                buttons: ['OK']
                            });
                        }
                    },
                    {
                        label: 'Learn More',
                        click: async () => {
                            const { shell } = require('electron');
                            await shell.openExternal('https://giddh.com');
                        }
                    }
                ]
            }
        ];

        // Add macOS specific menu items
        if (process.platform === 'darwin') {
            template.unshift({
                label: app.name,
                submenu: [
                    {
                        label: `About ${app.name}`,
                        click: () => {
                            dialog.showMessageBox({
                                type: 'info',
                                title: `About ${app.name}`,
                                message: `${app.name} v${getAppVersion()}`,
                                detail: 'Accounting software for modern businesses',
                                buttons: ['OK']
                            });
                        }
                    },
                    { type: 'separator' },
                    {
                        label: 'Check for Updates',
                        enabled: true,
                        click: () => {
                            checkForUpdates();
                        }
                    },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            });
        }

        return Menu.buildFromTemplate(template);
    }

    public setApplicationMenu(): void {
        const menu = this.buildMenu();
        Menu.setApplicationMenu(menu);
    }
}
