import 'core-js/es7/reflect';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
/**
 * Retrieves testbed data
 */
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    /**
     * Handles platformBrowserDynamicTesting functionality
     */
    platformBrowserDynamicTesting()
);
// Then we find all the tests.
const contextLibs = require.context('../libs', true, /\.spec\.ts$/);
// And load the modules.
contextLibs.keys().map(contextLibs);
