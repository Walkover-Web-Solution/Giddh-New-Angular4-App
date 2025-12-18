import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { applyAngular21CompatibilityPatches } from './app/angular21-compatibility';

// Import environment.generated.ts early to ensure global constants are set
import './environments/environment.generated';

// Apply Angular 21 compatibility patches before bootstrap
applyAngular21CompatibilityPatches();

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
