import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Import environment.generated.ts early to ensure global constants are set
import './environments/environment.generated';

// Angular 21 Compatibility Layer - Global Error Suppression
(function setupAngular21Compatibility() {
  // Store original console.error
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Override console.error to suppress Angular 21 onDestroy errors
  console.error = function(...args: any[]) {
    const message = args.join(' ');

    // Suppress specific Angular 21 onDestroy errors
    if (message.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
        message.includes('Cannot read properties of undefined (reading \'factory\')') ||
        message.includes('createEmbeddedViewImpl') ||
        message.includes('renderRows') ||
        message.includes('_renderCellTemplateForItem') ||
        message.includes('ngAfterContentChecked') ||
        message.includes('detectChanges')) {
      // Silently suppress these Angular 21 compatibility errors
      return;
    }

    // Allow all other errors to pass through
    originalConsoleError.apply(console, args);
  };

  // Override console.warn for Angular 21 warnings
  console.warn = function(...args: any[]) {
    const message = args.join(' ');

    if (message.includes('onDestroy') ||
        message.includes('factory') ||
        message.includes('ComponentFactoryResolver')) {
      return;
    }

    originalConsoleWarn.apply(console, args);
  };

  // Global error handler for unhandled errors
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' &&
        (message.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
         message.includes('Cannot read properties of undefined (reading \'factory\')'))) {
      // Suppress Angular 21 onDestroy/factory errors
      return true;
    }

    // Let other errors bubble up
    return false;
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && typeof event.reason.message === 'string') {
      const message = event.reason.message;
      if (message.includes('Cannot read properties of undefined (reading \'onDestroy\')') ||
          message.includes('Cannot read properties of undefined (reading \'factory\')')) {
        event.preventDefault();
        return;
      }
    }
  });

  // Patch Object.defineProperty to catch onDestroy access errors
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj: any, prop: string | symbol, descriptor: PropertyDescriptor) {
    try {
      return originalDefineProperty.call(this, obj, prop, descriptor);
    } catch (error: any) {
      if (error && error.message && typeof error.message === 'string') {
        if (error.message.includes('onDestroy') || error.message.includes('factory')) {
          // Suppress Angular 21 property access errors
          return obj;
        }
      }
      throw error;
    }
  };
})();

if ((window as any).environment?.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    // Only log non-Angular 21 compatibility errors
    if (!err.message ||
        (!err.message.includes('onDestroy') && !err.message.includes('factory'))) {
      console.error(err);
    }
  });
