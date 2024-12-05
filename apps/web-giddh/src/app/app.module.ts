import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { ActionModule } from './actions/action.module';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success';
import { AppComponent } from './app.component';
import { IS_ELECTRON_WA } from './app.constant';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { DecoratorsModule } from './decorators/decorators.module';
import { ExceptionLogService } from './services/exception-log.service';
import { GiddhHttpInterceptor } from './services/http.interceptor';
import { CustomPreloadingStrategy } from './services/lazy-preloading.service';
import { ServiceModule } from './services/service.module';
import { WindowRef } from './shared/helpers/window.object';
import { reducers } from './store';
import { ShSelectModule } from './theme/ng-virtual-select/sh-select.module';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarModule } from './theme/snackbar/snackbar.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';
import { LoaderModule } from './loader/loader.module';
import { PageModule } from './page/page.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsModule } from './theme/form-fields/form-fields.module';
import { VerifySubscriptionTransferOwnershipModule } from './verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.module';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    { provide: APP_BASE_HREF, useValue: IS_ELECTRON_WA ? './' : AppUrl + APP_FOLDER }
];

// tslint:disable-next-line:prefer-const
let CONDITIONAL_IMPORTS = [];

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['session', 'permission','branchConsolidated'], rehydrate: true, storage: localStorage })(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
if (!environment.production) {
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({ maxAge: 50 }));
}

let giddhRegion = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('giddh_region='))
    ?.split('=')[1];
giddhRegion = giddhRegion?.toUpperCase();

if (giddhRegion === "UK") {
    localStorage.setItem("Country-Region", "GB");
} else if (giddhRegion === "AE") {
    localStorage.setItem("Country-Region", "AE");
} else if (giddhRegion === "IN") {
    localStorage.setItem("Country-Region", "IN");
} else {
    localStorage.setItem("Country-Region", "GL");
}

// Temporary config object
const tempConfig = {
    "status": "success",
    "body": {
        "googleClientId": "641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com",
        "googleClientSecret": "8htr7iQVXfZp_n87c99-jm7a",
        "otpWidgetId": "33686b716134333831313239",
        "otpWidgetToken": "205968TmXguUAwoD633af103P1",
        "giddhWhiteLabel": {
            "companyName": "Giddh",
            "domainName": "test.giddh.com",
            "apiDomainName": "apitest.giddh.com",
            "adminDomainName": "vtest.giddh.com",
            "archiveStatus": "UNARCHIVED",
            "portalDomainName": "master.d2n1i21e52r793.amplifyapp.com",
            "supportedDomains": [
                "localhost",
                "stage.giddh.com",
                "vtest.giddh.com",
                "test.giddh.com"
            ]
        }
    }
};

// Set temporary cookie
function setTempCookie() {
    const cookieValue = encodeURIComponent(JSON.stringify(tempConfig));
    document.cookie = `giddh_config=${cookieValue}; path=/`;
}

// Simple function to get cookie config
function getCookieConfig() {
    // Set temporary cookie if it doesn't exist
    if (!document.cookie.includes('giddh_config=')) {
        setTempCookie();
    }

    try {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('giddh_config='));
        return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
    } catch (e) {
        console.error('Error parsing cookie:', e);
        return null;
    }
}

// Function to update environment variables
function initializeEnvironment(): () => void {
    return () => {
        const config = getCookieConfig()?.body;
        console.log('config',config);
        if (config) {
            // Update all environment variables at once
            const envUpdates = {
                'AppUrl': `https://${config.giddhWhiteLabel.domainName}/`,
                'ApiUrl': `https://${config.giddhWhiteLabel.apiDomainName}/`,
                'GOOGLE_CLIENT_ID': config.googleClientId,
                'GOOGLE_CLIENT_SECRET': config.googleClientSecret,
                'OTP_WIDGET_ID': config.otpWidgetId,
                'OTP_TOKEN_AUTH': config.otpWidgetToken,
                'PORTAL_URL': `https://${config.giddhWhiteLabel.portalDomainName}/`
            };

            // Update both window and process.env variables
            Object.entries(envUpdates).forEach(([key, value]) => {
                (window as any)[key] = value;
                (window as any)[`process.env.${key}`] = value;
            });
        }
    };
}

// Function to create service config
function createServiceConfig() {
    const config = getCookieConfig()?.body;
    return {
        apiUrl: config?.giddhWhiteLabel?.apiDomainName
            ? `https://${config.giddhWhiteLabel.apiDomainName}/`
            : Configuration.ApiUrl,
        appUrl: config?.giddhWhiteLabel?.domainName
            ? `https://${config.giddhWhiteLabel.domainName}/`
            : Configuration.AppUrl
    };
}
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AppLoginSuccessComponent,
        MobileRestrictedComponent,
    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldsModule,
        VerifySubscriptionTransferOwnershipModule,
        HttpClientModule,
        ModalModule.forRoot(),
        ServiceModule.forRoot(),
        ActionModule.forRoot(),
        DecoratorsModule.forRoot(),
        ShSelectModule,
        ToastrModule.forRoot({ preventDuplicates: true, maxOpened: 3 }),
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: false, strictActionImmutability: false } }),
        ScrollingModule,
        RouterModule.forRoot(ROUTES, {
            useHash: IS_ELECTRON_WA,
            onSameUrlNavigation: 'reload',
            preloadingStrategy: QuicklinkStrategy
        }),
        QuicklinkModule,
        MatSnackBarModule,
        SnackBarModule,
        MatDialogModule,
        MatButtonModule,
        LoaderModule,
        PageModule,
        ...CONDITIONAL_IMPORTS
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     * enableTracing: true,
     */
    providers: [
        environment.ENV_PROVIDERS,
        APP_PROVIDERS,
        WindowRef,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeEnvironment,
            multi: true
        },
        {
            provide: ServiceConfig,
            useFactory: createServiceConfig
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GiddhHttpInterceptor,
            multi: true
        }, {
            provide: ErrorHandler,
            useClass: ExceptionLogService
        },
        CustomPreloadingStrategy
    ]
})
export class AppModule {
}
