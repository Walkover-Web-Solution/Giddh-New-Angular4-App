import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog } from 'electron';

let updater;
let isManualCheck = false;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;

    constructor() {
        const log = require('electron-log');
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;

        // Handle update available - different behavior for manual vs automatic
        autoUpdater.on('update-available', () => {
            if (isManualCheck || updater) {
                // MANUAL UPDATE FLOW - Show dialog and let user choose
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found new updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then((resp) => {
                    if (resp.response === 0) {
                        autoUpdater.downloadUpdate();
                        if (updater) {
                            updater.label = 'Downloading updates. . . . .';
                            updater.enabled = false;
                        }
                    } else {
                        if (updater) {
                            updater.enabled = true;
                            updater = null;
                        }
                    }
                    isManualCheck = false; // Reset flag after handling
                }).catch((error) => {
                    console.error('Manual update dialog error:', error);
                    // Fallback: automatically download update if dialog fails
                    autoUpdater.downloadUpdate();
                    isManualCheck = false; // Reset flag after handling
                });
            } else {
                // AUTOMATIC UPDATE FLOW - Show notification dialog and auto-download
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Available',
                    message: 'A new version is available and will be downloaded automatically.',
                    buttons: ['OK', 'Download Later']
                }).then((resp) => {
                    if (resp.response === 0) {
                        // User clicked OK - download immediately
                        autoUpdater.downloadUpdate();
                    } else {
                        // User clicked "Download Later" - skip for now
                        console.log('User chose to download update later');
                    }
                }).catch((error) => {
                    console.error('Automatic update dialog error:', error);
                    // Fallback: download silently if dialog fails
                    autoUpdater.downloadUpdate();
                });
            }
        });

        // Handle no updates available - only show dialog for manual checks
        autoUpdater.on('update-not-available', () => {
            if (isManualCheck || updater) {
                // MANUAL CHECK - Show "no updates" message
                dialog.showMessageBox({
                    title: 'No Updates',
                    message: 'Current version is up-to-date.'
                });
                if (updater) {
                    updater.enabled = true;
                    updater = null;
                }
            } else {
                // AUTOMATIC CHECK - Silent, no dialog needed
                console.log('Automatic check: No updates available');
            }
            isManualCheck = false; // Reset flag after handling
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
                // Fallback: use another message box to confirm restart
                dialog.showMessageBox({
                    type: 'question',
                    buttons: ['Restart', 'Later'],
                    defaultId: 0,
                    cancelId: 1,
                    title: 'Application Update',
                    message: 'A new version has been downloaded. Restart now?'
                }).then((res) => {
                    if (res.response === 0) {
                        autoUpdater.quitAndInstall();
                    }
                }).catch((fallbackErr) => {
                    console.error('Fallback restart dialog error:', fallbackErr);
                });
            });
        });

        // Check for updates once on initialization (after 3 seconds delay for app to be ready)
        setTimeout(() => {
            console.log('Checking for updates on app initialization...');
            autoUpdater.checkForUpdates();
        }, 3000);
    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    isManualCheck = true; // Set flag to indicate this is a manual check
    autoUpdater.checkForUpdates();
}