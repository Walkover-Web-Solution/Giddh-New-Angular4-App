import {autoUpdater} from 'electron-updater';
import {dialog} from 'electron'

let updater;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;

    constructor() {
        const log = require('electron-log');
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
        autoUpdater.on('update-available', () => {
            if (updater) {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then((resp) => {
                    if (resp.response === 0) {
                        autoUpdater.downloadUpdate();
                        updater.label = 'Downloading updates. . . . .';
                        updater.enabled = false;
                    } else {
                        updater.enabled = true;
                        updater = null;
                    }
                });

            }
            autoUpdater.downloadUpdate();
        });
        autoUpdater.on('update-not-available', () => {
            if (updater) {
                dialog.showMessageBox({
                    title: 'No Updates',
                    message: 'Current version is up-to-date.'
                })
                updater.enabled = true
                updater = null
            }
        });

        autoUpdater.on('update-downloaded', () => {
            dialog.showMessageBox({
                title: 'Install Updates',
                message: 'Updates downloaded, application will be quit for update...'
            }).then(
                () => {
                    this.isUpdateDownloaded = true;
                    setImmediate(() => autoUpdater.quitAndInstall())
                }
            );

        });
        // autoUpdater.on('error', (error) => {
        //     dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
        // })
        autoUpdater.checkForUpdatesAndNotify();

    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    autoUpdater.checkForUpdates();
}
