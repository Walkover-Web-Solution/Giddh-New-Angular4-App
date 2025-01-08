import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';


import { environment } from './environments/environment';
import { EnvironmentService } from './app/services/enviroment.service';
// Initialize the environment service before bootstrapping the app
const environmentService = new EnvironmentService();
environmentService.initializeEnvironment().then(() => {
    console.log(';');

    if (environment.production) {
        enableProdMode();
    }

    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch(err => console.log(err));
}).catch(err => {
    console.error('Environment initialization failed:', err);
});
