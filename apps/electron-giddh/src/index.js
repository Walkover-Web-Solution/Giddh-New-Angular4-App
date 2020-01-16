"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var AppMenuManager_1 = tslib_1.__importDefault(require("./AppMenuManager"));
var util_1 = require("./util");
var WindowManager_1 = tslib_1.__importDefault(require("./WindowManager"));
var main_auth_config_1 = require("./main-auth.config");
var electron_google_oauth2_1 = tslib_1.__importDefault(require("@getstation/electron-google-oauth2"));
// import ElectronLinkedInOAuth2 from "./sampleLinkedin";
var windowManager = null;
electron_1.app.on("ready", function () {
    electron_1.ipcMain.on("log.error", function (event, arg) {
        util_1.log(arg);
    });
    AppMenuManager_1.default();
    windowManager = new WindowManager_1.default();
    windowManager.openWindows();
});
electron_1.ipcMain.on("open-url", function (event, arg) {
    windowManager.openWindows(arg);
});
electron_1.ipcMain.on("authenticate", function (event, arg) {
    if (arg === "google") {
        console.log(main_auth_config_1.GoogleLoginElectronConfig.clientId);
        var myApiOauth = new electron_google_oauth2_1.default(main_auth_config_1.GoogleLoginElectronConfig.clientId, main_auth_config_1.GoogleLoginElectronConfig.clientSecret, ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/gmail.send'], {
            successRedirectURL: "http://locahost:3000/appsuccesslogin",
            loopbackInterfaceRedirectionPort: 45587,
            refocusAfterSuccess: true,
        });
        myApiOauth.openAuthWindowAndGetTokens()
            .then(function (token) {
            event.returnValue = token;
            if (event.reply) {
                event.reply('take-your-gmail-token', token);
            }
            else if (event.sender.send) {
                event.sender.send('take-your-gmail-token', token);
            }
            console.log(JSON.stringify(token));
            // use your token.access_token
        });
    }
    if (arg === "linkedin") {
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
    }
    else {
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
//# sourceMappingURL=index.js.map