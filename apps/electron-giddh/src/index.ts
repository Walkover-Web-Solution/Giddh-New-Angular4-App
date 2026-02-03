import { app, ipcMain, Tray, Menu, nativeImage } from "electron";
import AppMenuManager from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import { GoogleLoginElectronConfig } from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import { getAppUpdater } from "./AppUpdater";

let windowManager: WindowManager = null;
let STAGING_ENV = false;
let TEST_ENV = false;
let LOCAL_ENV = true;
let PRODUCTION_ENV = false;
let APP_URL = 'file://' + __dirname + '/index.html';
let APP_FOLDER = '';
let WHITE_LABEL: any = null;
let tray: Tray | null = null;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
process.env.NODE_ENV = 'development';

app.on("ready", () => {
    ipcMain.on("log.error", (event: any, arg: any) => {
        log(arg);
    });

    windowManager = new WindowManager();
    const menuManager = new AppMenuManager(windowManager);
    menuManager.setApplicationMenu();
    windowManager.openWindows();
    createTray();
});
app.on('before-quit', () => {
    if (tray) {
        tray.destroy();
        tray = null;
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (!tray) {
            app.quit();
        }
    }
});
ipcMain.on("open-url", (event, arg) => {
    windowManager.openWindows(arg);
});
ipcMain.on("take-server-environment", (event, arg) => {
    process.env.STAGING_ENV = arg.STAGING_ENV;
    STAGING_ENV = arg.STAGING_ENV;
    process.env.TEST_ENV = arg.TEST_ENV;
    TEST_ENV = arg.TEST_ENV;
    process.env.LOCAL_ENV = arg.LOCAL_ENV;
    LOCAL_ENV = arg.LOCAL_ENV;
    process.env.PRODUCTION_ENV = arg.PRODUCTION_ENV;
    PRODUCTION_ENV = arg.PRODUCTION_ENV;
    process.env.AppUrl = arg.AppUrl;
    APP_URL = arg.AppUrl;
    process.env.APP_FOLDER = arg.APP_FOLDER;
    APP_FOLDER = arg.APP_FOLDER;
    if (arg.WHITE_LABEL) {
        WHITE_LABEL = arg.WHITE_LABEL;
        process.env.WHITE_LABEL = JSON.stringify(arg.WHITE_LABEL);
    }
});

ipcMain.on("authenticate", (event, arg) => {
    if (arg === "google") {
        // Create custom OAuth with prompt=select_account by modifying the internal URL
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['email', 'profile'],
            {
                successRedirectURL: `${WHITE_LABEL?.body?.giddhWhiteLabel?.baseDomain || (!app.isPackaged ? 'https://test.giddh.com' : 'https://books.giddh.com')}/app-login-success`,
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );

        // Force account selection by overriding the internal auth URL generation
        const originalMethod = (myApiOauth as any).getAuthUrl || (myApiOauth as any).buildAuthUrl;
        if (originalMethod) {
            (myApiOauth as any).getAuthUrl = function() {
                let url = originalMethod.call(this);
                if (url && !url.includes('prompt=')) {
                    const separator = url.includes('?') ? '&' : '?';
                    url += separator + 'prompt=select_account';
                }
                return url;
            };
            (myApiOauth as any).buildAuthUrl = function() {
                let url = originalMethod.call(this);
                if (url && !url.includes('prompt=')) {
                    const separator = url.includes('?') ? '&' : '?';
                    url += separator + 'prompt=select_account';
                }
                return url;
            };
        }

        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {

                // Validate token structure
                if (!token) {
                    const errorResponse = { error: 'No token received from Google OAuth' };
                    event.returnValue = errorResponse;
                    if (event.reply) {
                        event.reply('take-your-gmail-token', errorResponse);
                    } else if (event.sender.send) {
                        event.sender.send('take-your-gmail-token', errorResponse);
                    }
                    return;
                }

                // Check if token has access_token property
                const tokenAny = token as any;
                if (!token.access_token && !tokenAny.accessToken) {
                    const errorResponse = { error: 'Invalid token format - missing access_token' };
                    event.returnValue = errorResponse;
                    if (event.reply) {
                        event.reply('take-your-gmail-token', errorResponse);
                    } else if (event.sender.send) {
                        event.sender.send('take-your-gmail-token', errorResponse);
                    }
                    return;
                }

                // Normalize token format
                const normalizedToken = {
                    access_token: token.access_token || tokenAny.accessToken,
                    refresh_token: token.refresh_token || tokenAny.refreshToken,
                    token_type: token.token_type || tokenAny.tokenType || 'Bearer',
                    expires_in: tokenAny.expires_in || tokenAny.expiresIn,
                    scope: tokenAny.scope || token.scope
                };

                event.returnValue = normalizedToken;
                if (event.reply) {
                    event.reply('take-your-gmail-token', normalizedToken);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', normalizedToken);
                }
            })
            .catch(error => {
                const errorResponse = { error: error.message || 'Google authentication failed' };
                event.returnValue = errorResponse;
                if (event.reply) {
                    event.reply('take-your-gmail-token', errorResponse);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', errorResponse);
                }
            });
    }
});

ipcMain.on("authenticate-send-email", (event, arg) => {
    if (arg === "google") {
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['https://www.googleapis.com/auth/gmail.send'],
            {
                successRedirectURL: `${WHITE_LABEL?.body?.giddhWhiteLabel?.baseDomain || (!app.isPackaged ? 'https://test.giddh.com' : 'https://books.giddh.com')}/app-login-success`,
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );
        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                if (!token) {
                    const errorResponse = { error: 'No token received from Google OAuth' };
                    event.returnValue = errorResponse;
                    if (event.reply) {
                        event.reply('take-your-gmail-token-send-email', errorResponse);
                    } else if (event.sender.send) {
                        event.sender.send('take-your-gmail-token-send-email', errorResponse);
                    }
                    return;
                }

                const tokenAny = token as any;
                if (!token.access_token && !tokenAny.accessToken) {
                    const errorResponse = { error: 'Invalid token format - missing access_token' };
                    event.returnValue = errorResponse;
                    if (event.reply) {
                        event.reply('take-your-gmail-token-send-email', errorResponse);
                    } else if (event.sender.send) {
                        event.sender.send('take-your-gmail-token-send-email', errorResponse);
                    }
                    return;
                }

                const normalizedToken = {
                    access_token: token.access_token || tokenAny.accessToken,
                    refresh_token: token.refresh_token || tokenAny.refreshToken,
                    token_type: token.token_type || tokenAny.tokenType || 'Bearer',
                    expires_in: tokenAny.expires_in || tokenAny.expiresIn,
                    scope: tokenAny.scope || token.scope
                };

                event.returnValue = normalizedToken;
                if (event.reply) {
                    event.reply('take-your-gmail-token-send-email', normalizedToken);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token-send-email', normalizedToken);
                }
            })
            .catch(error => {
                const errorResponse = { error: error.message || 'Google authentication failed' };
                event.returnValue = errorResponse;
                if (event.reply) {
                    event.reply('take-your-gmail-token-send-email', errorResponse);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token-send-email', errorResponse);
                }
            });
    }
});

ipcMain.on('check-for-updates', () => {
    const updater = getAppUpdater();
    updater.checkForUpdates();
});

ipcMain.on('install-update', () => {
    const updater = getAppUpdater();
    updater.quitAndInstall();
});

function createTray(): void {
    try {
        const path = require('path');
        const fs = require('fs');
        
        // Determine tray icon path based on environment
        let trayIconPath: string;
        
        if (app.isPackaged) {
            // In packaged app, tray icons are in extraResources
            trayIconPath = path.join(process.resourcesPath, 'build', 'icons', 'tray.png');
            console.log('🔍 Tray icon path (packaged):', trayIconPath);
        } else {
            // In development
            trayIconPath = path.join(__dirname, 'build', 'icons', 'tray.png');
            console.log('🔍 Tray icon path (development):', trayIconPath);
        }

        console.log('  process.resourcesPath:', process.resourcesPath);
        console.log('  __dirname:', __dirname);
        console.log('  Icon exists:', fs.existsSync(trayIconPath));

        if (!fs.existsSync(trayIconPath)) {
            console.error('❌ Tray icon not found at:', trayIconPath);
            // Try fallback to smaller icon
            const fallbackPath = app.isPackaged 
                ? path.join(process.resourcesPath, 'build', 'icons', 'tray-small.png')
                : path.join(__dirname, 'build', 'icons', 'tray-small.png');
            
            if (fs.existsSync(fallbackPath)) {
                trayIconPath = fallbackPath;
                console.log('  ✅ Using fallback icon:', fallbackPath);
            } else {
                console.error('❌ No tray icon found, skipping tray creation');
                return;
            }
        }

        const image = nativeImage.createFromPath(trayIconPath);
        if (image.isEmpty()) {
            console.error('❌ Tray icon image is empty');
            return;
        }

        console.log('📐 Image size:', image.getSize());
        
        const resizedImage = image.resize({ width: 16, height: 16 });
        resizedImage.setTemplateImage(false);
        
        tray = new Tray(resizedImage);
        tray.setToolTip('Giddh - Accounting Software');

        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'Open Giddh', 
                click: () => {
                    if (windowManager) {
                        windowManager.openWindows();
                        windowManager.focusFirstWindow();
                    }
                }
            },
            { type: 'separator' },
            { 
                label: 'About Giddh', 
                click: () => console.log('About Giddh')
            },
            { type: 'separator' },
            { 
                label: 'Quit', 
                click: () => app.quit() 
            }
        ]);

        tray.setContextMenu(contextMenu);
        
        tray.on('click', () => {
            if (windowManager) {
                windowManager.focusFirstWindow();
            }
        });
        
        tray.on('double-click', () => {
            if (windowManager) {
                windowManager.openWindows();
                windowManager.focusFirstWindow();
            }
        });

        console.log('✅ Tray icon created successfully');
    } catch (error) {
        console.error('❌ Error creating tray:', error);
    }
}


