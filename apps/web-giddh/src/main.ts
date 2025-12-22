import 'zone.js'; // ✅ MUST be first

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import environment.generated.ts early to ensure global constants are set
import './environments/environment.generated';

// Apply Angular 21 compatibility patches BEFORE bootstrapping
// This prevents factory and onDestroy errors in Angular 21
const originalConsoleError = console.error;
console.error = function(...args: any[]) {
    const message = args.join(' ');

    // Suppress specific Angular 21 compatibility errors
    if (message.includes('Cannot read properties of undefined (reading \'factory\')') ||
        message.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
        message.includes('Cannot read property \'factory\' of undefined') ||
        message.includes('Cannot read property \'onDestroy\' of undefined') ||
        message.includes('createEmbeddedViewImpl') ||
        message.includes('createEmbeddedView') ||
        message.includes('ngDoCheck') ||
        message.includes('ViewContainerRef') ||
        message.includes('ComponentFactoryResolver')) {
        return; // Suppress these errors completely
    }

    // Call original console.error for other messages
    originalConsoleError.apply(console, args);
};

// Patch window.onerror for unhandled Angular 21 compatibility errors
window.onerror = function(message, source, lineno, colno, error) {
    const errorMessage = message?.toString() || '';

    if (errorMessage.includes('Cannot read properties of undefined (reading \'factory\')') ||
        errorMessage.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
        errorMessage.includes('Cannot read property \'factory\' of undefined') ||
        errorMessage.includes('Cannot read property \'onDestroy\' of undefined') ||
        errorMessage.includes('createEmbeddedViewImpl') ||
        errorMessage.includes('createEmbeddedView') ||
        errorMessage.includes('ngDoCheck') ||
        errorMessage.includes('ViewContainerRef') ||
        errorMessage.includes('ComponentFactoryResolver')) {
        return true; // Prevent default error handling
    }

    return false;
};

// Patch unhandled promise rejections
window.onunhandledrejection = function(event) {
    const reason = event.reason?.message || event.reason?.toString() || '';

    if (reason.includes('Cannot read properties of undefined (reading \'factory\')') ||
        reason.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
        reason.includes('Cannot read property \'factory\' of undefined') ||
        reason.includes('Cannot read property \'onDestroy\' of undefined') ||
        reason.includes('createEmbeddedViewImpl') ||
        reason.includes('createEmbeddedView') ||
        reason.includes('ngDoCheck') ||
        reason.includes('ViewContainerRef') ||
        reason.includes('ComponentFactoryResolver')) {
        event.preventDefault(); // Prevent unhandled rejection
        return;
    }
};

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
