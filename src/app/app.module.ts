import { AppState } from './store/roots';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LaddaModule } from 'angular2-ladda';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { NgModule, ApplicationRef } from '@angular/core';
import { AuthService, AppGlobals } from 'angular2-google-login';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { EffectsModule } from '@ngrx/effects';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/*
 * Platform and Environment providers/directives/pipes
 */
import { AuthProviders } from './app.constant';
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { rootReducer } from './store';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

import { PageComponent } from './page.component';
import { AboutModule } from './about';
import { HomeModule } from './home';
import { LoginModule } from './login';

import '../styles/styles.scss';
import '../styles/headings.css';
import { ServiceModule } from './services/service.module';
import { NoContentComponent } from './no-content/no-content.component';
import { SharedModule } from './shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  { provide: APP_BASE_HREF, useValue: '/' },
  AuthService
];

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {

};

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

if (ENV === 'development') {
  console.log('loading react devtools');
  CONDITIONAL_IMPORTS.push(StoreDevtoolsModule.instrumentOnlyWithExtension());
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    PageComponent,
    NoContentComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AboutModule,
    HomeModule,
    LoginModule,
    SharedModule.forRoot(),
    ServiceModule.forRoot(),
    StoreModule.provideStore(rootReducer),
    RouterStoreModule.connectRouter(),
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
        ...CONDITIONAL_IMPORTS,
    Ng2UiAuthModule.forRoot(AuthProviders),
    ...CONDITIONAL_IMPORTS
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public _store: Store<AppState>
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.rootState) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    if (store.rootState) {
      this._store.dispatch({
        type: 'SET_ROOT_STATE',
        payload: store.rootState
      });
    }
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      // tslint:disable-next-line:prefer-const
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    Object.keys(store).forEach((prop) => delete store[prop]);
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    this._store.take(1).subscribe((s) => store.rootState = s);
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
