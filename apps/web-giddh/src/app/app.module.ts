import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LaddaModule } from 'angular2-ladda';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { Daterangepicker } from 'apps/web-giddh/src/app/theme/ng2-daterangepicker/daterangepicker.module';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { ActionModule } from './actions/action.module';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success';
import { AppComponent } from './app.component';
import { IS_ELECTRON_WA } from './app.constant';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { BrowserDetectComponent } from './browser-support/browserDetect.component';
import { DecoratorsModule } from './decorators/decorators.module';
import { DummyComponent } from './dummy.component';
import { TokenVerifyComponent } from './login/token-verify.component';
import { MobileHomeSidebarComponent } from './mobile-home/mobile-home-sidebar/mobile-home-sidebar.component';
import { MobileHomeComponent } from './mobile-home/mobile-home.component';
import { MobileSearchCompanyComponent } from './mobile-home/mobile-search-company/mobile-search-company.component';
import { MobileSearchBranchComponent } from './mobile-home/mobile-search-branch/mobile-search-branch.component';
import { NewUserComponent } from './newUser.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { PageComponent } from './page.component';
import { PublicPageHandlerComponent } from './public-page-handler.component';
import { ExceptionLogService } from './services/exception-log.service';
import { GiddhHttpInterceptor } from './services/http.interceptor';
import { CustomPreloadingStrategy } from './services/lazy-preloading.service';
import { ServiceModule } from './services/service.module';
import { WindowRef } from './shared/helpers/window.object';
import { SharedModule } from './shared/shared.module';
import { SocialLoginCallbackComponent } from './social-login-callback.component';
import { reducers } from './store';
import { ShSelectModule } from './theme/ng-virtual-select/sh-select.module';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';
import { DownloadComponent } from './download/download.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarModule } from './theme/snackbar/snackbar.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';

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
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        PageComponent,
        AppLoginSuccessComponent,
        PublicPageHandlerComponent,
        TokenVerifyComponent,
        DummyComponent,
        NewUserComponent,
        BrowserDetectComponent,
        OnboardingComponent,
        SocialLoginCallbackComponent,
        MobileHomeComponent,
        MobileHomeSidebarComponent,
        MobileSearchCompanyComponent,
        MobileSearchBranchComponent,
        DownloadComponent,
        MobileRestrictedComponent
    ],
    /**
     * Import Angular's modules.
     */
    imports: [
        BrowserModule,
        Daterangepicker,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        PaginationModule.forRoot(),
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        SharedModule.forRoot(),
        ServiceModule.forRoot(),
        ActionModule.forRoot(),
        DecoratorsModule.forRoot(),
        ShSelectModule,
        ToastrModule.forRoot({ preventDuplicates: true, maxOpened: 3 }),
        StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: false, strictActionImmutability: false } }),
        PerfectScrollbarModule,
        RouterModule.forRoot(ROUTES, {
            useHash: IS_ELECTRON_WA,
            onSameUrlNavigation: 'reload',
            preloadingStrategy: QuicklinkStrategy,
            relativeLinkResolution: 'corrected'
        }),
        QuicklinkModule,
        MatSnackBarModule,
        SnackBarModule,
        MatDialogModule,
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
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: ServiceConfig,
            useValue: { apiUrl: Configuration.ApiUrl, appUrl: Configuration.AppUrl, _ }
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
