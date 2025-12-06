import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions } from 'electron';
import { checkForUpdates } from './AppUpdater';
import WindowManager from './WindowManager';
import * as fs from 'fs';
import * as path from 'path';

function getAppVersion(): string {
    try {
        const packagePath = path.join(__dirname, '../../../package.json');
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        return packageJson.version;
    } catch (error) {
        console.error('Failed to read version from package.json:', error);
        return '0.0.0'; // fallback version
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
                click: (item: any, focusedWindow: any, event) => {
                    //
                    checkForUpdates(item, focusedWindow, event);
                }
            },
            {
                label: `About Giddh v${getAppVersion()}`,
                click: async () => {
                    console.log('About menu clicked'); // Debug log
                    try {
                        console.log('Attempting to show dialog...');
                        const result = await dialog.showMessageBox({
                            type: 'info',
                            title: 'About Giddh',
                            message: 'Giddh - Accounting Software',
                            detail: `Version: ${getAppVersion()}\nElectron: ${process.versions.electron}\n\nBuilt with ❤️ by Walkover Technologies`,
                            buttons: ['OK']
                        });
                        console.log('Dialog result:', result);
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
                    click: (item: any, focusedWindow: any) => {
                        if (focusedWindow != null) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Enter Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click: (item: any, focusedWindow: any) => {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
                {
                    label: 'Open Dev Tool',
                    accelerator: 'Command+I',
                    click: (item: any, focusedWindow: any) => {
                        if (focusedWindow != null) {
                            focusedWindow.webContents.openDevTools();
                        }
                    }
                }
            ]
        },
        windowsMenu
    ];
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
