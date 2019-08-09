import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// libs
import { environment } from '@giddh-workspaces/core';

// app
import { AppElectronModule } from './app/app.electron.module';
// @ts-ignore
// let jQuery = ($ as any) = window['$'] = window['jQuery'] = require('jquery');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppElectronModule)
  .catch(err => console.log(err));
