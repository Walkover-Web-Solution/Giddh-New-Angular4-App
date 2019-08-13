import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

import { checkForUpdates } from './AppUpdater';
import WindowManager from './WindowManager';

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
