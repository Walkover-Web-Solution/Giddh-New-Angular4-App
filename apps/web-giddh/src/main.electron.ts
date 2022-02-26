import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// libs

// app
import { AppElectronModule } from './app/app.electron.module';
import { environment } from './environments/environment';
// @ts-ignore
// let jQuery = ($ as any) = window['$'] = window['jQuery'] = require('jquery');
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppElectronModule)
    .catch(err => console.log(err));
