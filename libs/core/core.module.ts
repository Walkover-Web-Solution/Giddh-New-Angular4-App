import {
    ModuleWithProviders,
    NgModule,
    Optional,
    SkipSelf,
    Inject
} from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';

// libs
import { TranslateService } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from '@giddh-workspaces/utils';

// app
import { environment } from './environments/environment';
import { CORE_PROVIDERS, PlatformLanguageToken } from './services';
import { LogService } from './services/log.service';

/**
 * DEBUGGING
 */
LogService.DEBUG.LEVEL_4 = !environment.production;

export const BASE_PROVIDERS: any[] = [
    ...CORE_PROVIDERS
    // APP_BASE_HREF removed - handled by main app.module.ts
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [CommonModule]
})
/**
 * CoreModule module
 * Implements CoreModule functionality
 */
export class CoreModule {
    // configuredProviders: *required to configure WindowService and others per platform
    /**
     * Handles forRoot functionality
     */
    static forRoot(configuredProviders: Array<any>): ModuleWithProviders<any> {
        return {
            ngModule: CoreModule,
            providers: [...BASE_PROVIDERS, ...configuredProviders]
        };
    }

    /**
     * Creates an instance of module
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule,
        @Inject(PlatformLanguageToken) lang: string,
        translate: TranslateService
    ) {
        /**
         * Handles throwIfAlreadyLoaded functionality
         */
        throwIfAlreadyLoaded(parentModule, 'CoreModule');

        // ensure default platform language is set
        translate.use(lang);
    }
}
