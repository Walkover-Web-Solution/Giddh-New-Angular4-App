import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog, BrowserWindow } from 'electron';

let updater;
let isManualCheck = false;
let isCheckingForUpdates = false;
let downloadProgressDialog = null;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;

    constructor() {
        const log = require('electron-log');
        log.transports.file.level = 'debug';
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;
        
        // Configure update server URL
        autoUpdater.setFeedURL({
            provider: 's3',
            bucket: 'giddh-app-builds'
        });
        
        console.log('AppUpdater configured with S3 bucket: giddh-app-builds');

        // Handle update available - different behavior for manual vs automatic
        autoUpdater.on('update-available', () => {
            console.log('Update available detected. isManualCheck:', isManualCheck, 'updater:', !!updater, 'isCheckingForUpdates:', isCheckingForUpdates);
            
            // Prevent multiple simultaneous dialogs
            if (isCheckingForUpdates) {
                console.log('Already checking for updates, ignoring duplicate event');
                return;
            }
            
            isCheckingForUpdates = true;
            
            if (isManualCheck || updater) {
                // MANUAL UPDATE FLOW - Show dialog and let user choose
                console.log('Showing manual update dialog');
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found new updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }).then((resp) => {
                    console.log('Manual dialog response:', resp.response);
                    if (resp.response === 0) {
                        // User clicked "Sure"
                        console.log('Starting manual download...');
                        
                        // Show download progress dialog
                        downloadProgressDialog = dialog.showMessageBox({
                            type: 'info',
                            title: 'Downloading Update',
                            message: 'Downloading update... 0%',
                            buttons: ['Cancel'],
                            defaultId: 0
                        });
                        
                        try {
                            autoUpdater.downloadUpdate();
                            console.log('Manual download initiated successfully');
                        } catch (downloadError) {
                            console.error('Failed to start manual download:', downloadError);
                        }
                        if (updater) {
                            updater.label = 'Downloading updates. . . . .';
                            updater.enabled = false;
                        }
                    } else {
                        // User clicked "No" or closed dialog (response = 1 or undefined)
                        console.log('User declined manual update');
                        if (updater) {
                            updater.enabled = true;
                            updater = null;
                        }
                    }
                    // Always reset flags after manual check
                    isManualCheck = false;
                    isCheckingForUpdates = false;
                    console.log('Manual check completed, flags reset');
                }).catch((error) => {
                    console.error('Manual update dialog error:', error);
                    // Reset flags even on error
                    isManualCheck = false;
                    isCheckingForUpdates = false;
                    if (updater) {
                        updater.enabled = true;
                        updater = null;
                    }
                });
            } else {
                // AUTOMATIC UPDATE FLOW - Show notification dialog and auto-download
                console.log('Showing automatic update dialog');
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Available',
                    message: 'A new version is available and will be downloaded automatically.',
                    buttons: ['OK', 'Download Later']
                }).then((resp) => {
                    console.log('Automatic dialog response:', resp.response);
                    if (resp.response === 0) {
                        // User clicked OK - download immediately
                        console.log('Starting download...');
                        
                        // Show download progress dialog
                        downloadProgressDialog = dialog.showMessageBox({
                            type: 'info',
                            title: 'Downloading Update',
                            message: 'Downloading update... 0%',
                            buttons: ['Cancel'],
                            defaultId: 0
                        });
                        
                        try {
                            autoUpdater.downloadUpdate();
                            console.log('Automatic download initiated successfully');
                        } catch (downloadError) {
                            console.error('Failed to start automatic download:', downloadError);
                        }
                    } else {
                        // User clicked "Download Later" - skip for now
                        console.log('User chose to download update later');
                    }
                    isCheckingForUpdates = false;
                }).catch((error) => {
                    console.error('Automatic update dialog error:', error);
                    // Fallback: download silently if dialog fails
                    autoUpdater.downloadUpdate();
                    isCheckingForUpdates = false;
                });
            }
        });

        // Handle no updates available - only show dialog for manual checks
        autoUpdater.on('update-not-available', () => {
            console.log('No updates available. isManualCheck:', isManualCheck, 'updater:', !!updater);
            
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
            // Reset all flags after handling
            isManualCheck = false;
            isCheckingForUpdates = false;
            console.log('No updates check completed, flags reset');
        });

        // Handle checking for updates
        autoUpdater.on('checking-for-update', () => {
            console.log('Checking for update...');
        });

        // Handle download progress
        autoUpdater.on('download-progress', (progressObj) => {
            // Log when download starts (first progress event)
            if (progressObj.percent === 0) {
                console.log('Download started successfully');
            }
            const percent = Math.round(progressObj.percent);
            const speed = Math.round(progressObj.bytesPerSecond / 1024);
            const transferred = Math.round(progressObj.transferred / 1024 / 1024);
            const total = Math.round(progressObj.total / 1024 / 1024);
            
            console.log(`Download progress: ${percent}% - Speed: ${speed} KB/s - ${transferred}MB/${total}MB`);
            
            // Update menu item if available
            if (updater) {
                updater.label = `Downloading... ${percent}%`;
            }
            
            // Update progress dialog if it exists
            if (downloadProgressDialog) {
                // Note: Electron's showMessageBox doesn't support dynamic updates
                // We'll handle this in the download-started event instead
                console.log(`Progress dialog should show: ${percent}% (${transferred}MB/${total}MB) at ${speed} KB/s`);
            }
        });

        // Handle download errors
        autoUpdater.on('error', (error) => {
            console.error('Update error:', error);
            
            // Clean up progress dialog
            downloadProgressDialog = null;
            
            if (updater) {
                updater.label = 'Check For Latest Update';
                updater.enabled = true;
                updater = null;
            }
            // Show error dialog for manual checks (check before resetting flags)
            const wasManualCheck = isManualCheck;
            
            // Reset flags on error
            isManualCheck = false;
            isCheckingForUpdates = false;
            
            if (wasManualCheck || updater) {
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Update Error',
                    message: 'Failed to check for updates. Please try again later.',
                    detail: error.message
                });
            }
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            console.log('Update downloaded successfully');
            
            // Clean up progress dialog
            downloadProgressDialog = null;
            
            // Re-enable menu item and reset label
            if (updater) {
                updater.label = 'Check For Latest Update';
                updater.enabled = true;
            }
            
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
                } else {
                    // User chose "Later" - clean up updater reference
                    if (updater) {
                        updater = null;
                    }
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
                    } else {
                        // Clean up updater reference
                        if (updater) {
                            updater = null;
                        }
                    }
                }).catch((fallbackErr) => {
                    console.error('Fallback restart dialog error:', fallbackErr);
                    // Clean up updater reference even on error
                    if (updater) {
                        updater = null;
                    }
                });
            });
        });

        // Check for updates once on initialization (after 3 seconds delay for app to be ready)
        setTimeout(() => {
            console.log('Checking for updates on app initialization...');
            console.log('AppUpdater configuration:');
            console.log('- autoDownload:', autoUpdater.autoDownload);
            console.log('- Feed URL configured for S3 bucket: giddh-app-builds');
            console.log('- electron-updater version: 6.3.4');
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