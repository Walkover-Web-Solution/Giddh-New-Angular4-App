/**
 * Angular 21 Polyfills - Optimized for modern browsers
 * This file includes only essential polyfills needed by Angular 21
 */

/***************************************************************************************************
 * ESSENTIAL POLYFILLS FOR ANGULAR 21
 */

// Angular Localization support
import '@angular/localize/init';

// Global window reference for Node.js compatibility
(window as any)['global'] = window;

