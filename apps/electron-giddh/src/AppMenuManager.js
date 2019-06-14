"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var AppUpdater_1 = require("./AppUpdater");
var WindowManager_1 = __importDefault(require("./WindowManager"));
function setMenu() {
    var windowsMenu = {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'New Window',
                accelerator: 'CmdOrCtrl+N',
                click: function (menuItem, browserWindow, event) {
                    var windowManager = new WindowManager_1.default();
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
                click: function (item, focusedWindow, event) {
                    //
                    AppUpdater_1.checkForUpdates(item, focusedWindow, event);
                }
            },
        ]
    };
    var name = electron_1.app.getName();
    var template = [
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
                    role: 'selectall'
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function (item, focusedWindow) {
                        if (focusedWindow != null) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Enter Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click: function (item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
                {
                    label: 'Open Dev Tool',
                    accelerator: 'Command+I',
                    click: function (item, focusedWindow) {
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
                    role: 'hideothers'
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
                    click: function () {
                        electron_1.app.quit();
                    }
                }
            ]
        });
        (windowsMenu.submenu).push({
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        });
    }
    var appMenu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(appMenu);
}
exports.default = setMenu;
//# sourceMappingURL=AppMenuManager.js.map