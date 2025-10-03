import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog, BrowserWindow } from 'electron';

let updater;
let isManualCheck = false;
let isCheckingForUpdates = false;
let downloadProgressWindow = null;
let userDeclinedUpdate = false;
let declinedVersion = null;

// Function to create progress window
function createProgressWindow() {
    if (downloadProgressWindow) {
        downloadProgressWindow.close();
    }
    
    downloadProgressWindow = new BrowserWindow({
        width: 400,
        height: 200,
        resizable: false,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: true,
        center: true,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    
    // Create HTML content for progress window
    const progressHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Downloading Update</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 160px;
                }
                .container { text-align: center; }
                .title { font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #333; }
                .progress-bar { 
                    width: 100%; 
                    height: 8px; 
                    background: #e0e0e0; 
                    border-radius: 4px; 
                    overflow: hidden;
                    margin-bottom: 10px;
                }
                .progress-fill { 
                    height: 100%; 
                    background: #007AFF; 
                    width: 0%; 
                    transition: width 0.3s ease;
                }
                .progress-text { font-size: 14px; color: #666; margin-bottom: 5px; }
                .speed-text { font-size: 12px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title">Downloading Update</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">Preparing download...</div>
                <div class="speed-text" id="speedText"></div>
            </div>
        </body>
        </html>
    `;
    
    downloadProgressWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(progressHTML)}`);
    
    downloadProgressWindow.once('ready-to-show', () => {
        downloadProgressWindow.show();
    });
    
    downloadProgressWindow.on('closed', () => {
        downloadProgressWindow = null;
    });
    
    return downloadProgressWindow;
}

// Function to update progress window
function updateProgressWindow(percent, transferred, total, speed) {
    if (downloadProgressWindow && !downloadProgressWindow.isDestroyed()) {
        downloadProgressWindow.webContents.executeJavaScript(`
            document.getElementById('progressFill').style.width = '${percent}%';
            document.getElementById('progressText').textContent = '${percent}% (${transferred}MB / ${total}MB)';
            document.getElementById('speedText').textContent = 'Speed: ${speed} KB/s';
        `);
    }
}

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
        autoUpdater.on('update-available', (info) => {
            console.log('Update available detected. isManualCheck:', isManualCheck, 'updater:', !!updater, 'isCheckingForUpdates:', isCheckingForUpdates);
            console.log('Update info:', {
                version: info.version,
                releaseDate: info.releaseDate,
                downloadSize: info.files?.[0]?.size ? `${Math.round(info.files[0].size / 1024 / 1024)}MB` : 'Unknown'
            });
            
            // Reset declined flags if this is a newer version than what was declined
            if (userDeclinedUpdate && declinedVersion && info.version !== declinedVersion) {
                console.log(`New version ${info.version} detected, resetting declined status for old version ${declinedVersion}`);
                userDeclinedUpdate = false;
                declinedVersion = null;
            }
            
            // Check if update is already downloaded
            if (this.isUpdateDownloaded) {
                console.log('Update already downloaded, showing restart dialog instead');
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Ready',
                    message: `Update v${info.version} is ready to install`,
                    detail: 'Restart the application to apply the downloaded update.',
                    buttons: ['Restart Now', 'Later']
                }).then((result) => {
                    if (result.response === 0) {
                        autoUpdater.quitAndInstall();
                    }
                });
                return;
            }
            
            // Check if user already declined this version
            if (userDeclinedUpdate && declinedVersion === info.version) {
                console.log(`User already declined update v${info.version}, skipping popup`);
                return;
            }
            
            // Prevent multiple simultaneous dialogs
            if (isCheckingForUpdates) {
                console.log('Already checking for updates, ignoring duplicate event');
                return;
            }
            
            isCheckingForUpdates = true;
            
            if (isManualCheck || updater) {
                // MANUAL UPDATE FLOW - Show dialog and let user choose
                console.log('Showing manual update dialog');
                const currentVersion = require('./package.json').version;
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Available',
                    message: `New version v${info.version} is available!`,
                    detail: `Current version: v${currentVersion}\nNew version: v${info.version}\n\nWould you like to download and install the update now?`,
                    buttons: ['Download Now', 'Later']
                }).then((resp) => {
                    console.log('Manual dialog response:', resp.response);
                    if (resp.response === 0) {
                        // User clicked "Sure"
                        console.log('Starting manual download...');
                        
                        // Show simple download notification
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'Downloading Update',
                            message: 'Update is being downloaded in the background...',
                            detail: 'You will be notified when the download is complete.',
                            buttons: ['OK']
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
                        
                        // Show simple download notification
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'Downloading Update',
                            message: 'Update is being downloaded in the background...',
                            detail: 'You will be notified when the download is complete.',
                            buttons: ['OK']
                        });
                        
                        try {
                            autoUpdater.downloadUpdate();
                            console.log('Automatic download initiated successfully');
                        } catch (downloadError) {
                            console.error('Failed to start automatic download:', downloadError);
                        }
                    } else {
                        // User clicked "Download Later" - remember this choice
                        console.log('User chose to download update later');
                        userDeclinedUpdate = true;
                        declinedVersion = info.version;
                        console.log(`Marked version ${info.version} as declined`);
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
            
            // Reset all update-related flags when no updates are available
            // This handles the case where app was updated and restarted
            this.isUpdateDownloaded = false;
            userDeclinedUpdate = false;
            declinedVersion = null;
            console.log('Reset all update flags - app is up-to-date');
            
            if (isManualCheck || updater) {
                // MANUAL CHECK - Show "no updates" message with version info
                const currentVersion = require('./package.json').version;
                dialog.showMessageBox({
                    title: 'No Updates Available',
                    message: `You are running the latest version!`,
                    detail: `Current version: v${currentVersion}\n\nYour application is up-to-date.`
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
            console.log('Current app version:', require('./package.json').version);
            console.log('Update server URL: S3 bucket giddh-app-builds');
        });

        // Add periodic update checking (every 3 minutes)
        setInterval(() => {
            if (!isCheckingForUpdates && !isManualCheck) {
                console.log('Periodic update check...');
                autoUpdater.checkForUpdates();
            }
        }, 3 * 60 * 1000); // 3 minutes

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
            
            // Progress is logged to console for debugging
        });

        // Handle download errors
        autoUpdater.on('error', (error) => {
            console.error('Update error:', error);
            
            // Reset download state on error
            
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
            console.log('Downloaded version:', event.version);
            console.log('Current version:', require('./package.json').version);
            
            // Mark update as downloaded to prevent showing "update available" again
            this.isUpdateDownloaded = true;
            
            // Reset declined flags since download completed
            userDeclinedUpdate = false;
            declinedVersion = null;
            
            // Re-enable menu item and reset label
            if (updater) {
                updater.label = 'Check For Latest Update';
                updater.enabled = true;
            }
            
            // Reset checking flags
            isManualCheck = false;
            isCheckingForUpdates = false;
            
            const currentVersion = require('./package.json').version;
            const newVersion = event.version;
            
            // Show notification that app will restart automatically
            dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: 'Update Downloaded Successfully',
                message: `Giddh has been updated from v${currentVersion} to v${newVersion}`,
                detail: 'The application will restart automatically in 3 seconds to apply the updates.'
            }).then(() => {
                // Auto-restart after 3 seconds
                console.log('Auto-restarting application in 3 seconds...');
                setTimeout(() => {
                    console.log('Restarting application with new update...');
                    autoUpdater.quitAndInstall();
                }, 3000);
            }).catch((error) => {
                console.error('Update downloaded dialog error:', error);
                // Fallback: restart immediately if dialog fails
                console.log('Dialog failed, restarting immediately...');
                autoUpdater.quitAndInstall();
            });
        });

        // Check for updates once on initialization (after 3 seconds delay for app to be ready)
        setTimeout(() => {
            console.log('Checking for updates on app initialization...');
            console.log('AppUpdater configuration:');
            console.log('- autoDownload:', autoUpdater.autoDownload);
            console.log('- Feed URL configured for S3 bucket: giddh-app-builds');
            console.log('- electron-updater version: 6.3.4');
            console.log('- Current app version:', require('./package.json').version);
            
            // Test network connectivity before checking updates
            console.log('Testing network connectivity...');
            autoUpdater.checkForUpdates().catch((error) => {
                console.error('Initial update check failed:', error);
                console.log('Will retry in 5 minutes...');
                setTimeout(() => {
                    console.log('Retrying update check...');
                    autoUpdater.checkForUpdates();
                }, 5 * 60 * 1000); // 5 minutes
            });
        }, 3000);
    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    isManualCheck = true; // Set flag to indicate this is a manual check
    autoUpdater.checkForUpdates();
}