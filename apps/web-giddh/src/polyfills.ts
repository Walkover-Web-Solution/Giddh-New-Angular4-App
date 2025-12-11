/**
 * This file includes polyfills needed by Angular 21 and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * Angular 21 targets modern browsers only. Legacy IE polyfills have been removed.
 * Supports: Chrome >=109, Firefox >=115, Safari >=16.4, Edge >=109
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Angular 21 requires minimal polyfills for modern browsers
// Most ES2022 features are natively supported

// Only include specific polyfills if you need to support older browsers
// or specific features not available in your target browsers

import '@angular/localize/init';

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

/*
* in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
* with the following flag, it will bypass `zone.js` patch for IE/Edge
*/
// (window as any).__Zone_enable_cross_context_check = true;

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included for Angular 21 compatibility

// Global polyfill for Node.js compatibility in browser environment
(window as any)['global'] = window;

/***************************************************************************************************
 * APPLICATION IMPORTS
 */

