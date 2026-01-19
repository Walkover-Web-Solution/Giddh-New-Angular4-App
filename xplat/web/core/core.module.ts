import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';

// libs
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { throwIfAlreadyLoaded } from '@giddh-workspaces/utils';
import {
    CoreModule,
    PlatformLanguageToken,
    PlatformWindowToken
} from '@giddh-workspaces/core';

// bring in custom web services here...

// factories
export function winFactory() {
    return window;
}

export function platformLangFactory() {
    const browserLang = window.navigator.language || 'en'; // fallback English
    // browser language has 2 codes, ex: 'en-US'
    return browserLang.split('-')[0];
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        BrowserModule,
        // HttpClientModule, // Replaced with provideHttpClient() for Angular 21
        CoreModule.forRoot([
            {
                provide: PlatformLanguageToken,
                useFactory: platformLangFactory
            },
            {
                provide: PlatformWindowToken,
                useFactory: winFactory
            }
        ]),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        /**
         * Handles provideHttpClient functionality
         */
        provideHttpClient()
    ]
})
/**
 * FooCoreModule module
 * Implements FooCoreModule functionality
 */
export class FooCoreModule {
    /**
     * Creates an instance of module
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: FooCoreModule
    ) {
        /**
         * Handles throwIfAlreadyLoaded functionality
         */
        throwIfAlreadyLoaded(parentModule, 'FooCoreModule');
    }
}
