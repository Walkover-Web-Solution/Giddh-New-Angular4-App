
import { app, ipcMain } from 'electron';
import setMenu from './AppMenuManager';
import { log } from './util';
import WindowManager from './WindowManager';
let windowManager: WindowManager = null;

app.on('ready', () => {
  ipcMain.on('log.error', (event: any, arg: any) => {
    log(arg);
  });

  setMenu();
  windowManager = new WindowManager();
  windowManager.openWindows();
});
ipcMain.on('open-url', (event, arg) => {
  windowManager.openWindows(arg);
});
