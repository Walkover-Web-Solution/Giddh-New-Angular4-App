import { UpdateDownloadedEvent, autoUpdater, UpdateInfo } from 'electron-updater';
import { MessageBoxOptions, dialog, app } from 'electron';
import * as log from 'electron-log';
import { S3Options } from 'builder-util-runtime';

export default class AppUpdater {
    private isUpdateDownloaded: boolean = false;
    private updateInfo: UpdateInfo | null = null;
    private updateCheckInterval: NodeJS.Timeout | null = null;

    constructor() {
        log.info(`App packaged status: ${app.isPackaged}`);
        log.info(`App version: ${app.getVersion()}`);
        log.info(`Platform: ${process.platform}`);
        
        if (app.isPackaged) {
            this.configureUpdater();
            this.setupEventListeners();
            setTimeout(() => {
                this.checkForUpdatesQuietly();
            }, 10000);
        } else {
            log.info('Auto-updater disabled in development mode');
        }
    }

    private configureUpdater(): void {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;

        const platform = process.platform === 'darwin' ? 'mac' : 'windows';
        const feedConfig: S3Options = {
            provider: 's3',
            bucket: 'app-giddh-test',
            region: 'ap-south-1',
            path: `test/${platform}/latest`
        };
        
        log.info('Configuring auto-updater with feed:', feedConfig);
        autoUpdater.setFeedURL(feedConfig);

        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.allowPrerelease = false;
        autoUpdater.allowDowngrade = false;
        
        log.info('Auto-updater configured successfully');

        this.updateCheckInterval = setInterval(() => {
            this.checkForUpdatesQuietly();
        }, 4 * 60 * 60 * 1000);
    }

    private setupEventListeners(): void {
        log.info('Setting up auto-updater event listeners');
        
        autoUpdater.on('checking-for-update', () => {
            log.info('🔍 Checking for update...');
        });

        autoUpdater.on('update-available', (info: UpdateInfo) => {
            log.info('✅ Update available:', JSON.stringify(info, null, 2));
            this.updateInfo = info;
            this.showUpdateAvailableDialog(info);
        });

        autoUpdater.on('update-not-available', (info: UpdateInfo) => {
            log.info('ℹ️ Update not available. Current version is latest:', JSON.stringify(info, null, 2));
        });

        autoUpdater.on('error', (err: Error) => {
            log.error('❌ Error in auto-updater:', err.message);
            log.error('Error details:', err);
            log.error('Error stack:', err.stack);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            const logMessage = `📥 Download progress: ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total} bytes) - Speed: ${progressObj.bytesPerSecond} B/s`;
            log.info(logMessage);
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            log.info('✅ Update downloaded successfully');
            this.isUpdateDownloaded = true;
            this.showUpdateDownloadedDialog(event);
        });
        log.info('Event listeners setup complete');
    }

    // Quiet check (no user notification if no update)
    private async checkForUpdatesQuietly(): Promise<void> {
        try {
            if (!app.isPackaged) return;
            await autoUpdater.checkForUpdates();
        } catch (error) {
            log.error('Error checking for updates (quiet):', error);
        }
    }

    public async checkForUpdates(): Promise<void> {
        try {
            log.info('=== Manual update check initiated ===');
            log.info(`App packaged: ${app.isPackaged}`);
            log.info(`Current version: ${app.getVersion()}`);
            
            if (!app.isPackaged) {
                log.warn('App is not packaged - showing development mode dialog');
                this.showDevelopmentModeDialog();
                return;
            }
            
            log.info('Checking for updates...');
            const result = await autoUpdater.checkForUpdates();
            log.info('Check for updates result:', result);
            
            setTimeout(() => {
                if (!this.updateInfo) {
                    log.info('No update available');
                    this.showNoUpdateDialog();
                }
            }, 2000);
        } catch (error) {
            log.error('Error checking for updates:', error);
            log.error('Error stack:', (error as Error).stack);
            this.showUpdateErrorDialog(error as Error);
        }
    }

    private showUpdateAvailableDialog(info: UpdateInfo): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'Update Available',
            message: `A new version (${info.version}) is available!`,
            detail: `Current version: ${app.getVersion()}\nNew version: ${info.version}\n\nWould you like to download it now?`,
            buttons: ['Download Now', 'Later'],
            defaultId: 0,
            cancelId: 1
        };

        dialog.showMessageBox(options).then((result) => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        });
    }

    private showNoUpdateDialog(): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'No Updates',
            message: 'You are running the latest version!',
            detail: `Current version: ${app.getVersion()}`,
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    private showUpdateDownloadedDialog(event: UpdateDownloadedEvent): void {
        const dialogOpts: MessageBoxOptions = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            defaultId: 0,
            cancelId: 1,
            title: 'Application Update',
            message: process.platform === 'win32' ? (typeof event.releaseNotes === 'object' ? event.releaseNotes.join(",") : event.releaseNotes) : event.releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) {
                autoUpdater.quitAndInstall();
            } else {
                log.info('User chose to install update later');
            }
        }).catch((error) => {
            log.error('Error showing update dialog:', error);
        });
    }

    private showUpdateErrorDialog(error: Error): void {
        const options: MessageBoxOptions = {
            type: 'error',
            title: 'Update Error',
            message: 'Failed to check for updates',
            detail: `Error: ${error.message}\n\nPlease try again later.`,
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    private showDevelopmentModeDialog(): void {
        const options: MessageBoxOptions = {
            type: 'info',
            title: 'Development Mode',
            message: 'Auto-updater is disabled in development mode',
            detail: 'Updates are only available in the packaged application.',
            buttons: ['OK']
        };
        dialog.showMessageBox(options);
    }

    public getUpdateStatus(): { isUpdateDownloaded: boolean; updateInfo: UpdateInfo | null } {
        return {
            isUpdateDownloaded: this.isUpdateDownloaded,
            updateInfo: this.updateInfo
        };
    }

    public quitAndInstall(): void {
        if (this.isUpdateDownloaded) {
            autoUpdater.quitAndInstall();
        }
    }

    public cleanup(): void {
        if (this.updateCheckInterval) {
            clearInterval(this.updateCheckInterval);
        }
    }
}

let updaterInstance: AppUpdater | null = null;

export function getAppUpdater(): AppUpdater {
    if (!updaterInstance) {
        updaterInstance = new AppUpdater();
    }
    return updaterInstance;
}

export function checkForUpdates(): void {
    getAppUpdater().checkForUpdates();
}
