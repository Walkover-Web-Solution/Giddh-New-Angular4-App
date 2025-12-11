import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { environment } from './environments/environment';

console.log('🔍 DEBUG: main.ts - Starting Angular bootstrap');
console.log('🔍 DEBUG: Environment:', environment);

if (environment.production) {
    console.log('🔍 DEBUG: Enabling production mode');
    enableProdMode();
}

console.log('🔍 DEBUG: Starting platformBrowserDynamic bootstrap');

// Ensure DOM is ready before bootstrap
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DEBUG: DOM Content Loaded - Starting Angular bootstrap');

    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        console.log('🔍 DEBUG: Attempting Angular bootstrap after DOM ready');

        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .then(moduleRef => {
                console.log('🔍 DEBUG: Angular bootstrap successful');
                console.log('🔍 DEBUG: Module reference:', moduleRef);
            })
            .catch(err => {
                console.error('🔍 DEBUG: Angular bootstrap failed');
                console.error('🔍 DEBUG: Bootstrap error:', err);
            });
    }, 100);
});
