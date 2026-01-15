import { app, ipcMain, Tray, Menu, nativeImage } from "electron";
import setMenu from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import { GoogleLoginElectronConfig } from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';

let windowManager: WindowManager = null;
let STAGING_ENV = false;
let TEST_ENV = false;
let LOCAL_ENV = true;
let PRODUCTION_ENV = false;
let APP_URL = 'file://' + __dirname + '/index.html';  // Direct path to packaged Angular app
let APP_FOLDER = '';
let tray: Tray | null = null;

// Electron-specific configuration
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
process.env.NODE_ENV = 'development';

app.on("ready", () => {
    ipcMain.on("log.error", (event: any, arg: any) => {
        log(arg);
    });

    setMenu();
    windowManager = new WindowManager();
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
});

ipcMain.on("authenticate", (event, arg) => {
    if (arg === "google") {
        // Create custom OAuth with prompt=select_account by modifying the internal URL
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['email', 'profile'],
            {
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://test.giddh.com/app-login-success',
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
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://test.giddh.com/app-login-success',
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

function createTray(): void {
    try {
        const path = require('path');
        const fs = require('fs');
        
        // Try multiple possible locations for the tray icon
        const possiblePaths = [
            // For packaged app - extraResources
            path.join(process.resourcesPath, 'build', 'icons', 'tray.png'),
            // For packaged app - app.asar.unpacked
            path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'icons', 'tray.png'),
            // For development
            path.join(__dirname, 'build', 'icons', 'tray.png'),
            // Fallback to smaller icon
            path.join(process.resourcesPath, 'build', 'icons', 'tray-small.png'),
            path.join(__dirname, 'build', 'icons', 'tray-small.png')
        ];

        console.log('🔍 Tray icon loading - Debug info:');
        console.log('  process.resourcesPath:', process.resourcesPath);
        console.log('  __dirname:', __dirname);
        console.log('  app.isPackaged:', app.isPackaged);

        let trayIconPath: string | null = null;
        
        // Find the first path that exists
        for (const testPath of possiblePaths) {
            console.log('  Testing:', testPath);
            if (fs.existsSync(testPath)) {
                trayIconPath = testPath;
                console.log('  ✅ Found at:', testPath);
                break;
            }
        }

        if (!trayIconPath) {
            console.error('❌ Tray icon not found in any location');
            return;
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


