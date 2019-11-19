import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// libs
import { environment } from '@giddh-workspaces/core';

// app
import { AppCordovaModule } from './app/app.cordova.module';
// @ts-ignore
// let jQuery = ($ as any) = window['$'] = window['jQuery'] = require('jquery');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppCordovaModule)
  .catch(err => console.log(err));
