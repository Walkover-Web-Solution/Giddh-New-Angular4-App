import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@giddh-workspaces/utils';
import { ELECTRON_PROVIDERS } from './services';

/**
 * Handles NgModule functionality
 */
@NgModule({
    providers: [...ELECTRON_PROVIDERS]
})
/**
 * FooElectronCoreModule module
 * Implements FooElectronCoreModule functionality
 */
export class FooElectronCoreModule {
    /**
     * Creates an instance of module
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: FooElectronCoreModule
    ) {
        /**
         * Handles throwIfAlreadyLoaded functionality
         */
        throwIfAlreadyLoaded(parentModule, 'FooElectronCoreModule');
    }
}
