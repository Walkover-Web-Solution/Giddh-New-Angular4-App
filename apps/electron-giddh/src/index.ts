import { app, ipcMain } from "electron";
import setMenu from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import { GoogleLoginElectronConfig } from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
import { startServer } from "./offline-api/app";

let windowManager: WindowManager = null;
let STAGING_ENV = false;
let TEST_ENV = false;
let LOCAL_ENV = false;
let PRODUCTION_ENV = false;
let APP_URL = '';
let APP_FOLDER = '';

app.on("ready", () => {
    ipcMain.on("log.error", (event: any, arg: any) => {
        log(arg);
    });

    setMenu();
    windowManager = new WindowManager();
    windowManager.openWindows();
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


        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['email'],
            {
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://stage.giddh.com/app-login-success',
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );

        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                event.returnValue = token;
                if (event.reply) {
                    event.reply('take-your-gmail-token', token);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', token);
                }
                // use your token.access_token
            });
    }
});
ipcMain.on("authenticate-send-email", (event, arg) => {
    if (arg === "google") {
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['https://www.googleapis.com/auth/gmail.send'],
            {
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://stage.giddh.com/app-login-success',
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );
        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                event.returnValue = token;
                if (event.reply) {
                    event.reply('take-your-gmail-token', token);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', token);
                }
                // use your token.access_token
            });
    }
});

startServer();