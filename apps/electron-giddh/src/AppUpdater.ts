import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog } from 'electron';

let updater;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;

    constructor() {
        const log = require('electron-log');
        console.log('log',log);
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;
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
                }).catch((error) => {
                    console.error('Dialog error:', error);
                    // Fallback: automatically download update if dialog fails
                    autoUpdater.downloadUpdate();
                });

            } else {
                // Fallback dialog when updater is null
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then((resp) => {
                    if (resp.response === 0) {
                        autoUpdater.downloadUpdate();
                    }
                }).catch((error) => {
                    console.error('Fallback dialog error:', error);
                    // If fallback dialog also fails, automatically download
                    autoUpdater.downloadUpdate();
                });
            }
        });
        autoUpdater.on('update-not-available', () => {
            if (updater) {
                dialog.showMessageBox({
                    title: 'No Updates',
                    message: 'Current version is up-to-date.'
                });
                updater.enabled = true
                updater = null
            }
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? (typeof event.releaseNotes === 'object' ? event.releaseNotes.join(",") : event.releaseNotes) : event.releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            }
            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            }).catch((error) => {
                console.error('Update downloaded dialog error:', error);
                // Fallback: show simple confirmation
                const confirmed = confirm('A new version has been downloaded. Restart now?');
                if (confirmed) {
                    autoUpdater.quitAndInstall();
                }
            });
        });

        autoUpdater.checkForUpdatesAndNotify();
        
        // Set up interval to check for updates every 5 minutes
        setInterval(() => {
            console.log('Checking for updates (5-minute interval)...');
            autoUpdater.checkForUpdatesAndNotify();
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    autoUpdater.checkForUpdates();
}