import { autoUpdater } from 'electron-updater';

let updater;
export default class AppUpdaterV1 {
  public isUpdateDownloaded: boolean = false;

  constructor() {
    const log = require('electron-log');
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.on('update-available', () => {
      if (updater) {
        updater.label = 'Downloading updates. . . . .';
        updater.enabled = false;
      }
      autoUpdater.downloadUpdate();
    });
    autoUpdater.on('update-not-available', () => {
      if (updater) {
        updater.enabled = true;
        updater = null;
      }
    });

    autoUpdater.on('update-downloaded', () => {
      setTimeout(() => {
        this.isUpdateDownloaded = true;
      }, 60000);

    });

  }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdates();
}
