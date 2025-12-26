import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// libs
import { environment } from './environments/environment';

// app
import { AppElectronModule } from './app/app.electron.module';

// Force Electron environment detection
const detectElectron = () => {
  return !!(window && (window as any).process && (window as any).process.type) ||
         !!(window && (window as any).require && (window as any).require('electron')) ||
         !!(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('electron') > -1);
};

// Set Electron-specific global variables
(window as any).isElectron = true; // Force Electron mode
(window as any).AppUrl = '';
(window as any).ApiUrl = environment.ApiUrl;
(window as any).UkApiUrl = environment.UkApiUrl;
(window as any).APP_FOLDER = '';
(window as any).PORTAL_URL = environment.PORTAL_URL;
(window as any).GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
(window as any).GOOGLE_CLIENT_SECRET = environment.GOOGLE_CLIENT_SECRET;
(window as any).OTP_WIDGET_ID = environment.OTP_WIDGET_ID;
(window as any).OTP_TOKEN_AUTH = environment.OTP_TOKEN_AUTH;
(window as any).RAZORPAY_KEY = environment.RAZORPAY_KEY;
(window as any).environment = environment;

// Initialize other commonly used global variables
(window as any).PRODUCTION_ENV = environment.production;
(window as any).STAGING_ENV = false;
(window as any).TEST_ENV = false;
(window as any).LOCAL_ENV = !environment.production;
(window as any).errlyticsNeeded = false;
(window as any).errlyticsKey = '';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppElectronModule)
    .catch(err => console.log(err));
