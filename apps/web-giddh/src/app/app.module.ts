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
// Get white label configuration from localStorage
const whiteLabelString = localStorage.getItem('whiteLabel');
let whiteLabelConfig = whiteLabelString ? JSON.parse(whiteLabelString) : null;

export function fetchWhiteLabel(): () => Promise<void> {
    return async () => {
        if (!whiteLabelConfig) {
            try {
                const response = await fetch('https://apitest.giddh.com/white-label');
                const data = await response.json();
                localStorage.setItem('whiteLabel', JSON.stringify(data));
                whiteLabelConfig = data;
            } catch (error) {
                console.error('Failed to fetch white label data:', error);
            }
        }
    };
}

const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    {
        provide: APP_BASE_HREF,
        useValue: IS_ELECTRON_WA
            ? './'
            : whiteLabelConfig?.body?.giddhWhiteLabel?.domainName
                ? `${whiteLabelConfig.body.giddhWhiteLabel.domainName}/` + APP_FOLDER
                : AppUrl + APP_FOLDER
    }
];

// tslint:disable-next-line:prefer-const
let CONDITIONAL_IMPORTS = [];
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: ['session', 'permission', 'branchConsolidated'], rehydrate: true, storage: localStorage })(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

if (!environment.production) {
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({ maxAge: 50 }));
}

// Determine giddh region from cookie and set Country-Region in localStorage
let giddhRegion = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('giddh_region='))
    ?.split('=')[1];
giddhRegion = giddhRegion?.toUpperCase();
if (whiteLabelConfig) {
    localStorage.setItem("Country-Region", "IN");
} else {
    if (giddhRegion === "UK") {
        localStorage.setItem("Country-Region", "GB");
    } else if (giddhRegion === "AE") {
        localStorage.setItem("Country-Region", "AE");
    } else if (giddhRegion === "IN") {
        localStorage.setItem("Country-Region", "IN");
    } else {
        localStorage.setItem("Country-Region", "GL");
    }
}
export function getServiceConfig(): any {
    return {
        apiUrl: whiteLabelConfig?.body?.giddhWhiteLabel?.apiDomain ? `${whiteLabelConfig.body.giddhWhiteLabel.apiDomain}/` :
            (localStorage.getItem('Country-Region') === 'GB' ? Configuration.UkApiUrl : Configuration.ApiUrl),
        ApiUrl: whiteLabelConfig?.body?.giddhWhiteLabel?.apiDomain ? `${whiteLabelConfig.body?.giddhWhiteLabel.apiDomain}/` :
            (localStorage.getItem('Country-Region') === 'GB' ? Configuration.UkApiUrl : Configuration.ApiUrl),
        appUrl: whiteLabelConfig?.body?.giddhWhiteLabel?.domainName || Configuration.AppUrl,
        AppUrl: whiteLabelConfig?.body?.giddhWhiteLabel?.domainName || Configuration.AppUrl,
        PORTAL_URL: whiteLabelConfig?.body?.giddhWhiteLabel?.portalDomain || Configuration.PORTAL_URL,
        OTP_WIDGET_ID: whiteLabelConfig?.body?.otpWidgetIdWeb || Configuration.OTP_WIDGET_ID,
        OTP_TOKEN_AUTH: whiteLabelConfig?.body?.otpWidgetTokenWeb || Configuration.OTP_TOKEN_AUTH,
        GOOGLE_CLIENT_ID: whiteLabelConfig?.body?.googleClientId || Configuration.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: whiteLabelConfig?.body?.googleClientSecret || Configuration.GOOGLE_CLIENT_SECRET,
        OTP_WIDGET_ID_NEW: whiteLabelConfig?.body?.otpWidgetIdElectron || '33686b716134333831313239',
        OTP_TOKEN_AUTH_NEW: whiteLabelConfig?.body?.otpWidgetTokenElectron || '205968TmXguUAwoD633af103P1',
        RAZORPAY_KEY: whiteLabelConfig?.body?.razorpayPaymentDetails?.keyId || Configuration.RAZORPAY_KEY,
        _
    };
}

export function getServiceConfigAfterInit(): () => Promise<any> {
    return async () => {
        await fetchWhiteLabel()();
        return getServiceConfig();
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
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: getServiceConfigAfterInit,
            multi: true,
            deps: [HttpClientModule]
        },

        {
            provide: ServiceConfig,
            useFactory: getServiceConfig
        },
        environment.ENV_PROVIDERS,
        APP_PROVIDERS,
        WindowRef,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GiddhHttpInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: ExceptionLogService
        },
        CustomPreloadingStrategy
    ]
})
export class AppModule { }
