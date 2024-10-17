import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
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
    return localStorageSync({ keys: ['session', 'permission'], rehydrate: true, storage: localStorage })(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
if (!environment.production) {
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({ maxAge: 50 }));
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
            provide: ServiceConfig,
            useValue: { apiUrl: localStorage.getItem('Country-Region') === 'GB' ? Configuration.UkApiUrl : Configuration.ApiUrl, appUrl: Configuration.AppUrl, _ }
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
