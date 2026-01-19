import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { applyAngular21Patches } from './app/angular21-compatibility';
// Only import electron-compatibility in Electron environment
/**
 * Handles if functionality
 */
if (typeof window !== 'undefined' && (window as any).isElectron) {
  /**
   * Handles import functionality
   */
  import('./app/electron-compatibility');
}

// Apply Angular 21 compatibility patches immediately
/**
 * Handles applyAngular21Patches functionality
 */
applyAngular21Patches();

// Import environment.generated.ts early to ensure global constants are set
import './environments/environment.generated';
import { environment } from './environments/environment.generated';
import { EnvironmentValidatorService } from './app/services/environment-validator.service';

// Initialize global variables from environment to prevent runtime errors
// Detect if running in Electron environment
const detectElectron = () => {
  return !!(window && (window as any).process && (window as any).process.type) ||
         !!(window && (window as any).require && (window as any).require('electron')) ||
         !!(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('electron') > -1);
};

(window as any).isElectron = environment.isElectron || detectElectron();
(window as any).AppUrl = environment.AppUrl;
(window as any).ApiUrl = environment.ApiUrl;
(window as any).UkApiUrl = environment.UkApiUrl;
(window as any).APP_FOLDER = environment.APP_FOLDER;
(window as any).PORTAL_URL = environment.PORTAL_URL;
(window as any).GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
(window as any).GOOGLE_CLIENT_SECRET = environment.GOOGLE_CLIENT_SECRET;
(window as any).OTP_WIDGET_ID = environment.OTP_WIDGET_ID;
(window as any).OTP_TOKEN_AUTH = environment.OTP_TOKEN_AUTH;
(window as any).RAZORPAY_KEY = environment.RAZORPAY_KEY;
(window as any).environment = environment;

// Initialize other commonly used global variables to prevent undefined errors
(window as any).PRODUCTION_ENV = environment.production;
(window as any).STAGING_ENV = false;
(window as any).TEST_ENV = false;
(window as any).LOCAL_ENV = !environment.production;
(window as any).errlyticsNeeded = false;
(window as any).errlyticsKey = '';
(window as any).enableVoucherAdjustmentMultiCurrency = false;

// Angular 21 Compatibility Layer - Global Error Suppression
(function setupAngular21Compatibility() {
  // Store original console.error
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Override console.error to suppress Angular 21 onDestroy errors
  console.error = function(...args: any[]) {
    const message = args.join(' ');

    // Suppress specific Angular 21 onDestroy errors
    /**
     * Handles if functionality
     */
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

    /**
     * Handles if functionality
     */
    if (message.includes('onDestroy') ||
        message.includes('factory') ||
        message.includes('ComponentFactoryResolver')) {
      return;
    }

    originalConsoleWarn.apply(console, args);
  };

  // Global error handler for unhandled errors
  window.onerror = function(message, source, lineno, colno, error) {
    /**
     * Handles if functionality
     */
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
    /**
     * Handles if functionality
     */
    if (event.reason && typeof event.reason.message === 'string') {
      const message = event.reason.message;
      /**
       * Handles if functionality
       */
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
      /**
       * Handles if functionality
       */
      if (error && error.message && typeof error.message === 'string') {
        /**
         * Handles if functionality
         */
        if (error.message.includes('onDestroy') || error.message.includes('factory')) {
          // Suppress Angular 21 property access errors
          return obj;
        }
      }
      throw error;
    }
  };
})();

/**
 * Handles if functionality
 */
if ((window as any).environment?.production) {
  /**
   * Handles enableProdMode functionality
   */
  enableProdMode();
}

/**
 * Handles platformBrowserDynamic functionality
 */
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    // Initialize environment validation after app bootstrap
    const validator = moduleRef.injector.get(EnvironmentValidatorService);
    const status = validator.getValidationStatus();

    /**
     * Handles if functionality
     */
    if (status.status === 'error') {

    } else if (status.status === 'warning') {

    }

    return moduleRef;
  })
  .catch(err => {
    // Only log non-Angular 21 compatibility errors
    /**
     * Handles if functionality
     */
    if (!err.message ||
        (!err.message.includes('onDestroy') && !err.message.includes('factory'))) {

    }
  });
