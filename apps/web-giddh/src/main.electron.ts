import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.generated';
import './app/angular21-compatibility';
import './app/electron-compatibility';
import { AppElectronModule } from './app/app.electron.module';

// Force Electron environment detection
const detectElectron = () => {
  return !!(window && (window as any).process && (window as any).process.type) ||
         !!(window && (window as any).require && (window as any).require('electron')) ||
         !!(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('electron') > -1);
};

// Set Electron-specific global variables with error handling
try {
    (window as any).isElectron = true; // Force Electron mode
    (window as any).AppUrl = './';
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
} catch (e) {
    console.warn('Some window properties are read-only in secure Electron context:', e);
}

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

// Add comprehensive error handling and debugging
console.log('🚀 Starting Electron Angular Bootstrap...');
console.log('Environment:', environment);
console.log('Window globals:', {
    isElectron: (window as any).isElectron,
    AppUrl: (window as any).AppUrl,
    ApiUrl: (window as any).ApiUrl
});

platformBrowserDynamic()
    .bootstrapModule(AppElectronModule)
    .then(moduleRef => {
        console.log('✅ Angular bootstrap successful!');
        console.log('Module:', moduleRef);
    })
    .catch(err => {
        console.error('❌ Angular bootstrap failed:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });

        // Try fallback bootstrap with regular AppModule
        console.log('🔄 Attempting fallback bootstrap with AppModule...');
        return platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .then(moduleRef => {
                console.log('✅ Fallback bootstrap successful!');
            })
            .catch(fallbackErr => {
                console.error('❌ Fallback bootstrap also failed:', fallbackErr);

                // Show user-friendly error
                document.body.innerHTML = `
                    <div style="padding: 20px; font-family: Arial, sans-serif;">
                        <h2>Angular Bootstrap Error</h2>
                        <p><strong>Primary Error:</strong> ${err.message}</p>
                        <p><strong>Fallback Error:</strong> ${fallbackErr.message}</p>
                        <p>Please check the console for detailed error information.</p>
                    </div>
                `;
            });
    });
