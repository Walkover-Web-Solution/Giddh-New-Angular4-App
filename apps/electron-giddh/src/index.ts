import {app, ipcMain} from "electron";
import setMenu from "./AppMenuManager";
import {log} from "./util";
import WindowManager from "./WindowManager";
import {
    AdditionalGoogleLoginParams,
    AdditionalLinkedinLoginParams,
    GoogleLoginElectronConfig,
    LinkedinLoginElectronConfig
} from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';

let windowManager: WindowManager = null;

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


ipcMain.on("authenticate", (event, arg) => {

    if (arg === "google") {
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/gmail.send'],
            {
                successRedirectURL: "http://localapp.giddh.com:3000/",
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );

        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                event.returnValue = token;
                event.sender.send('take-your-gmail-token', token);
                console.log(JSON.stringify(token));
                // use your token.access_token
            });
    } else {
        const electronOauth2 = require("electron-oauth");
        let config = {};
        let bodyParams = {};
        if (arg === "google") {
            // google
            config = GoogleLoginElectronConfig;
            bodyParams = AdditionalGoogleLoginParams;
        } else {
            // linked in
            config = LinkedinLoginElectronConfig;
            bodyParams = AdditionalLinkedinLoginParams;
        }
        try {
            const myApiOauth = electronOauth2(config, {
                alwaysOnTop: true,
                autoHideMenuBar: true,
                webPreferences: {
                    devTools: true,
                    partition: "oauth2",
                    nodeIntegration: false
                }
            });
            const token = myApiOauth.getAccessToken(bodyParams);
            if (arg === "google") {
                // google
                event.returnValue = token.access_token;
                // this.store.dispatch(this.loginAction.signupWithGoogle(token.access_token));
            } else {
                // linked in
                event.returnValue = token.access_token;
                // this.store.dispatch(this.loginAction.LinkedInElectronLogin(token.access_token));
            }
        } catch (e) {
            //
        }
    }
});
