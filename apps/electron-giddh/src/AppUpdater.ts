import { UpdateDownloadedEvent, autoUpdater } from 'electron-updater';
import { MessageBoxOptions, dialog, app } from 'electron';

let updater;
export default class AppUpdaterV1 {
    public isUpdateDownloaded: boolean = false;
    private log: any;

    private formatReleaseNotes(releaseNotes: any): string {
        if (typeof releaseNotes === 'string') {
            return releaseNotes;
        }
        if (Array.isArray(releaseNotes)) {
            return releaseNotes.map(note => note.note || '').join('\n');
        }
        return 'No release notes available';
    }

    constructor() {
        this.log = require('electron-log');
        this.log.transports.file.level = 'debug';
        this.log.transports.console.level = 'debug';
        
        // Enhanced logging for production debugging
        this.log.info('=== AppUpdater Initialized ===');
        this.log.info('App version:', app.getVersion());
        this.log.info('Environment:', process.env.NODE_ENV);
        this.log.info('Platform:', process.platform);
        this.log.info('Auto-download disabled:', !autoUpdater.autoDownload);
        
        autoUpdater.logger = this.log;
        autoUpdater.autoDownload = false;
        
        // Setup handlers first, then check for updates
        this.setupUpdateHandlers();
        
        // Only check for updates in production environment
        if (process.env.NODE_ENV === 'production') {
            this.log.info('Starting initial update check...');
            autoUpdater.checkForUpdates();
        } else {
            this.log.info('Skipping initial update check in development mode');
        }
        
        // Check for updates every 10 minutes in production (for debugging)
        if (process.env.NODE_ENV === 'production') {
            setInterval(() => {
                this.log.info('Periodic update check triggered');
                autoUpdater.checkForUpdates();
            }, 10 * 60 * 1000); // 10 minutes
        }
    }

    private setupUpdateHandlers() {
        autoUpdater.on('error', (error) => {
            this.log.error('=== AUTO UPDATER ERROR ===');
            this.log.error('Error details:', error);
            this.log.error('Error stack:', error.stack);
        });

        autoUpdater.on('checking-for-update', () => {
            this.log.info('=== CHECKING FOR UPDATES ===');
            this.log.info('Update server URL:', autoUpdater.getFeedURL());
        });

        autoUpdater.on('update-available', (info) => {
            this.log.info('=== UPDATE AVAILABLE ===');
            this.log.info('Update info:', JSON.stringify(info, null, 2));
            this.log.info('Current version:', app.getVersion());
            this.log.info('New version:', info.version);
            this.log.info('Updater menu item available:', !!updater);
            
            if (updater) {
                this.log.info('Showing update dialog via menu item');
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Found Updates',
                    message: `New version ${info.version} is available. Current version: ${app.getVersion()}. Do you want to update now?`,
                    buttons: ['Sure', 'No'],
                    detail: this.formatReleaseNotes(info.releaseNotes)
                }).then((resp) => {
                    this.log.info('User response to update dialog:', resp.response === 0 ? 'Yes' : 'No');
                    if (resp.response === 0) {
                        this.log.info('Starting download...');
                        autoUpdater.downloadUpdate();
                        updater.label = 'Downloading updates. . . . .';
                        updater.enabled = false;
                    } else {
                        this.log.info('User declined update');
                        updater.enabled = true;
                        updater = null;
                    }
                });
            } else {
                this.log.info('Showing fallback update dialog (no menu item)');
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Update Available',
                    message: `New version ${info.version} is available. Current version: ${app.getVersion()}. Would you like to download it now?`,
                    buttons: ['Download', 'Later'],
                    detail: this.formatReleaseNotes(info.releaseNotes)
                }).then((resp) => {
                    this.log.info('User response to fallback dialog:', resp.response === 0 ? 'Download' : 'Later');
                    if (resp.response === 0) {
                        this.log.info('Starting download via fallback dialog...');
                        autoUpdater.downloadUpdate();
                    }
                });
            }
        });

        autoUpdater.on('update-not-available', (info) => {
            this.log.info('=== UPDATE NOT AVAILABLE ===');
            this.log.info('Current version is up to date:', app.getVersion());
            this.log.info('Update info:', JSON.stringify(info, null, 2));
            
            if (updater) {
                this.log.info('Showing no updates dialog');
                dialog.showMessageBox({
                    title: 'No Updates',
                    message: `Current version ${app.getVersion()} is up-to-date.`
                });
                updater.enabled = true;
                updater = null;
            }
        });

        autoUpdater.on('download-progress', (progressObj) => {
            const percent = Math.round(progressObj.percent);
            this.log.info(`Download progress: ${percent}% (${progressObj.transferred}/${progressObj.total} bytes)`);
            this.log.info(`Download speed: ${progressObj.bytesPerSecond} bytes/sec`);
            
            if (updater) {
                updater.label = `Downloading... ${percent}%`;
            }
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            this.log.info('=== UPDATE DOWNLOADED ===');
            this.log.info('Downloaded version:', event.version);
            this.log.info('Release date:', event.releaseDate);
            this.log.info('Download path:', event.downloadedFile);
            
            this.isUpdateDownloaded = true;
            
            const dialogOpts: MessageBoxOptions = {
                type: 'info',
                buttons: ['Restart Now', 'Later'],
                title: 'Application Update Downloaded',
                message: `Version ${event.version} has been downloaded successfully.`,
                detail: 'The application will restart to apply the updates. Any unsaved work will be lost.'
            };
            
            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                this.log.info('User response to restart dialog:', returnValue.response === 0 ? 'Restart Now' : 'Later');
                if (returnValue.response === 0) {
                    this.log.info('Quitting and installing update...');
                    autoUpdater.quitAndInstall();
                } else {
                    this.log.info('User chose to restart later');
                }
            });
        });
    }
}

export function checkForUpdates(menuItem, focusedWindow, event) {
    const log = require('electron-log');
    log.info('=== MANUAL UPDATE CHECK TRIGGERED ===');
    log.info('Menu item:', !!menuItem);
    
    updater = menuItem;
    if (updater) {
        updater.enabled = false;
        updater.label = 'Checking for updates...';
    }
    
    autoUpdater.checkForUpdates();
}