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
import { NotFoundComponent } from './404/404-component';
import { ActionModule } from './actions/action.module';
import { AppLoginSuccessComponent } from './app-login-success/app-login-success';
import { AppComponent } from './app.component';
import { IS_ELECTRON_WA } from './app.constant';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { BillingDetailComponent } from './billing-details/billingDetail.component';
import { BrowserDetectComponent } from './browser-support/browserDetect.component';
import { DecoratorsModule } from './decorators/decorators.module';
import { DummyComponent } from './dummy.component';
import { TokenVerifyComponent } from './login/token-verify.component';
import { MobileHomeSidebarComponent } from './mobile-home/mobile-home-sidebar/mobile-home-sidebar.component';
import { MobileHomeComponent } from './mobile-home/mobile-home.component';
import { MobileSearchCompanyComponent } from './mobile-home/mobile-search-company/mobile-search-company.component';
import { NewUserComponent } from './newUser.component';
import { NoContentComponent } from './no-content/no-content.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { PageComponent } from './page.component';
import { PublicPageHandlerComponent } from './public-page-handler.component';
import { SelectPlanComponent } from './selectPlan/selectPlan.component';
import { ExceptionLogService } from './services/exception-log.service';
import { GiddhHttpInterceptor } from './services/http.interceptor';
import { CustomPreloadingStrategy } from './services/lazy-preloading.service';
import { ServiceModule } from './services/service.module';
import { WindowRef } from './shared/helpers/window.object';
import { SharedModule } from './shared/shared.module';
import { SocialLoginCallbackComponent } from './social-login-callback.component';
import { reducers } from './store';
import { ShSelectModule } from './theme/ng-virtual-select/sh-select.module';
import { UniversalListModule } from './theme/universal-list/universal.list.module';

// import { SuccessComponent } from './settings/linked-accounts/success.component';
/*
 * Platform and Environment providers/pipes/pipes
 */
// App is our top level component
//import {StoreRouterConnectingModule} from '@ngrx/router-store';
// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    {provide: APP_BASE_HREF, useValue: IS_ELECTRON_WA ? './' : AppUrl + APP_FOLDER}
    // { provide: APP_BASE_HREF, useValue: './' }
];

interface InternalStateType {
    [key: string]: any;
}

interface StoreType {
    state: InternalStateType;
    rootState: InternalStateType;
    restoreInputValues: () => void;
    disposeOldHosts: () => void;
}

// tslint:disable-next-line:prefer-const
let CONDITIONAL_IMPORTS = [];

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    // return localStorageSync({ keys: ['session', 'permission'], rehydrate: true, storage: IS_ELECTRON_WA ? sessionStorage : localStorage })(reducer);
    return localStorageSync({keys: ['session', 'permission'], rehydrate: true, storage: localStorage})(reducer);
    // return localStorageSync({ keys: ['session', 'permission'], rehydrate: true, storage: sessionStorage })(reducer);
}

let metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
if (!environment.production) {
    // metaReducers.push(storeFreeze);
    CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrument({maxAge: 50}));
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
        NoContentComponent,
        AppLoginSuccessComponent,
        PublicPageHandlerComponent,
        NotFoundComponent,
        TokenVerifyComponent,
        DummyComponent,
        BillingDetailComponent,

        // SuccessComponent,
        NewUserComponent,
        BrowserDetectComponent,
        OnboardingComponent,
        SocialLoginCallbackComponent,
        SelectPlanComponent,
        MobileHomeComponent,
        MobileHomeSidebarComponent,
        MobileSearchCompanyComponent
        // SignupComponent
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
        ShSelectModule.forRoot(),
        UniversalListModule.forRoot(),
        ToastrModule.forRoot({preventDuplicates: true, maxOpened: 3}),
        StoreModule.forRoot(reducers, {metaReducers}),
        PerfectScrollbarModule,
        RouterModule.forRoot(ROUTES, {
            useHash: IS_ELECTRON_WA,
            preloadingStrategy: CustomPreloadingStrategy,
            onSameUrlNavigation: 'reload'
        }),
        //StoreRouterConnectingModule,
        ...CONDITIONAL_IMPORTS,

        /**
         * This section will import the `DevModuleModule` only in certain build types.
         * When the module is not imported it will get tree shaked.
         * This is a simple example, a big app should probably implement some logic
         */
        // ...environment.showDevModule ? [DevModuleModule] : [],
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
            useValue: {apiUrl: Configuration.ApiUrl, appUrl: Configuration.AppUrl, _}
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GiddhHttpInterceptor,
            multi: true
        },{
            provide: ErrorHandler,
            useClass: ExceptionLogService
        },
        CustomPreloadingStrategy
    ]
})
export class AppModule {
}
