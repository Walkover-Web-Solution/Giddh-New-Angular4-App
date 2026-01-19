// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import { keys, map  } from 'app/lodash-optimized';
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
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
