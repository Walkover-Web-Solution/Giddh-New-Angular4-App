import { app, ipcMain } from "electron";
import setMenu from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import { AdditionalGoogleLoginParams, AdditionalLinkedinLoginParams, GoogleLoginElectronConfig, LinkedinLoginElectronConfig } from "./main-auth.config";

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


ipcMain.on("authenticate", async function(event, arg) {

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
    const token = await myApiOauth.getAccessToken(bodyParams);
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
});
