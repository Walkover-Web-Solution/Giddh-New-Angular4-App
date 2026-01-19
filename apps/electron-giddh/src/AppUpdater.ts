import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog } from 'electron';

let updater;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        const log = require('electron-log');
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;
        autoUpdater.on('update-available', () => {
            /**
             * Handles if functionality
             */
            if (updater) {
                // Manual check from menu - show confirmation dialog
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then((resp) => {
                    /**
                     * Handles if functionality
                     */
                    if (resp.response === 0) {
                        autoUpdater.downloadUpdate();
                        updater.label = 'Downloading updates. . . . .';
                        updater.enabled = false;
                    } else {
                        updater.enabled = true;
                        updater = null;
                    }
                });
            } else {
                // Automatic check - download silently without confirmation
                autoUpdater.downloadUpdate();
            }
        });
        autoUpdater.on('update-not-available', () => {
            /**
             * Handles if functionality
             */
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
            this.isUpdateDownloaded = true;
            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                defaultId: 1,
                cancelId: 1,
                title: 'Application Update',
                message: process.platform === 'win32' ? (typeof event.releaseNotes === 'object' ? event.releaseNotes.join(",") : event.releaseNotes) : event.releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            }
            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                /**
                 * Handles if functionality
                 */
                if (returnValue.response === 0) {
                    // User clicked "Restart"
                    autoUpdater.quitAndInstall();
                } else {
                    // User clicked "Later" or closed the dialog - do nothing, keep the update downloaded
                    console.log('User chose to install update later', returnValue);
                }
                // Note: If dialog is closed without clicking any button, returnValue.response will be undefined
                // In that case, we also do nothing and keep the update downloaded
            }).catch((error) => {
                console.error('Error showing update dialog:', error);
            });
        });

        autoUpdater.checkForUpdatesAndNotify();
    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    autoUpdater.checkForUpdates();
}
