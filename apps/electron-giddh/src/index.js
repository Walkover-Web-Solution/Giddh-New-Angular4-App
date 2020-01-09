"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var AppMenuManager_1 = tslib_1.__importDefault(require("./AppMenuManager"));
var util_1 = require("./util");
var WindowManager_1 = tslib_1.__importDefault(require("./WindowManager"));
var main_auth_config_1 = require("./main-auth.config");
var electron_google_oauth2_1 = tslib_1.__importDefault(require("@getstation/electron-google-oauth2"));
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
        var myApiOauth = new electron_google_oauth2_1.default(main_auth_config_1.GoogleLoginElectronConfig.clientId, main_auth_config_1.GoogleLoginElectronConfig.clientSecret, ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/gmail.send'], {
            successRedirectURL: "http://localapp.giddh.com:3000/",
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
    else {
        var electronOauth2 = require("electron-oauth");
        var config = {};
        var bodyParams = {};
        if (arg === "google") {
            // google
            config = main_auth_config_1.GoogleLoginElectronConfig;
            bodyParams = main_auth_config_1.AdditionalGoogleLoginParams;
        }
        else {
            // linked in
            config = main_auth_config_1.LinkedinLoginElectronConfig;
            bodyParams = main_auth_config_1.AdditionalLinkedinLoginParams;
        }
        try {
            var myApiOauth = electronOauth2(config, {
                alwaysOnTop: true,
                autoHideMenuBar: true,
                webPreferences: {
                    devTools: true,
                    partition: "oauth2",
                    nodeIntegration: false
                }
            });
            var token = myApiOauth.getAccessToken(bodyParams);
            if (arg === "google") {
                // google
                event.returnValue = token.access_token;
                // this.store.dispatch(this.loginAction.signupWithGoogle(token.access_token));
            }
            else {
                // linked in
                event.returnValue = token.access_token;
                // this.store.dispatch(this.loginAction.LinkedInElectronLogin(token.access_token));
            }
        }
        catch (e) {
            //
        }
    }
});
//# sourceMappingURL=index.js.map