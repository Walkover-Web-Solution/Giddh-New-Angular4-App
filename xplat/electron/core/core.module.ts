import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from '@giddh-workspaces/utils';
import { ELECTRON_PROVIDERS } from './services';

@NgModule({
    providers: [...ELECTRON_PROVIDERS]
})
export class FooElectronCoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: FooElectronCoreModule
    ) {
        throwIfAlreadyLoaded(parentModule, 'FooElectronCoreModule');
    }
}
