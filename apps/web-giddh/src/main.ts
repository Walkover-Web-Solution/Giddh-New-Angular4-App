import 'zone.js'; // ✅ MUST be first

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import environment.generated.ts early to ensure global constants are set
import './environments/environment.generated';
window.onerror = function (msg, url, line, col, error) {
    console.error('GLOBAL ERROR:', error?.stack);
    return false;
};
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
