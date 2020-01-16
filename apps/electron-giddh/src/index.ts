import { app, ipcMain } from "electron";
import setMenu from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import {
    AdditionalGoogleLoginParams,
    AdditionalLinkedinLoginParams,
    GoogleLoginElectronConfig,
    LinkedinLoginElectronConfig
} from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';
// import ElectronLinkedInOAuth2 from "./sampleLinkedin";

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
        console.log(GoogleLoginElectronConfig.clientId);
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/gmail.send'],
            {
                successRedirectURL: "http://locahost:3000/appsuccesslogin",
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
                console.log(JSON.stringify(token));
                // use your token.access_token
            });
    } if (arg === "linkedin") {
        // const myApiOauth = new ElectronLinkedInOAuth2(LinkedinLoginElectronConfig.clientId,
        //     LinkedinLoginElectronConfig.clientSecret,"http://127.0.0.1:45589/callback",
        //     AdditionalLinkedinLoginParams.scope,
        //     {
        //         successRedirectURL: "http://localhost:3000/",
        //         loopbackInterfaceRedirectionPort: 45587,
        //         refocusAfterSuccess: true,
        //     }
        // );
        //
        // myApiOauth.openAuthWindowAndGetTokens()
        //     .then(token => {
        //         event.returnValue = token;
        //         if (event.reply) {
        //             event.reply('take-your-gmail-token', token);
        //         } else if (event.sender.send) {
        //             event.sender.send('take-your-gmail-token', token);
        //         }
        //         console.log(JSON.stringify(token));
        //         // use your token.access_token
        //     });
    } else {
        // const electronOauth2 = require("electron-oauth");
        // let config = {};
        // let bodyParams = {};
        // if (arg === "google") {
        //     // google
        //     config = GoogleLoginElectronConfig;
        //     bodyParams = AdditionalGoogleLoginParams;
        // } else {
        //     // linked in
        //     config = LinkedinLoginElectronConfig;
        //     bodyParams = AdditionalLinkedinLoginParams;
        // }
        // try {
        //     const myApiOauth = electronOauth2(config, {
        //         alwaysOnTop: true,
        //         autoHideMenuBar: true,
        //         webPreferences: {
        //             devTools: true,
        //             partition: "oauth2",
        //             nodeIntegration: false
        //         }
        //     });
        //     const token = myApiOauth.getAccessToken(bodyParams);
        //     if (arg === "google") {
        //         // google
        //         event.returnValue = token.access_token;
        //         // this.store.dispatch(this.loginAction.signupWithGoogle(token.access_token));
        //     } else {
        //         // linked in
        //         event.returnValue = token.access_token;
        //         // this.store.dispatch(this.loginAction.LinkedInElectronLogin(token.access_token));
        //     }
        // } catch (e) {
        //     //
        // }
    }
});
