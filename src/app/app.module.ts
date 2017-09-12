import { AppState } from './store/roots';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { rootReducer } from './store';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { PageComponent } from './page.component';
import { NoContentComponent } from './no-content/no-content.component';
import { SharedModule } from './shared/shared.module';
import { ServiceModule } from './services/service.module';
import { ToastrModule } from 'ngx-toastr';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DummyComponent } from './dummy.component';
import { WindowRef } from './shared/helpers/window.object';
import { NewUserComponent } from './newUser.component';
import { SocialLoginCallbackComponent } from './social-login-callback.component';
import 'rxjs/add/operator/take';
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  { provide: APP_BASE_HREF, useValue: '/' }
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
    NoContentComponent,
    DummyComponent,
    NewUserComponent,
    SocialLoginCallbackComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule.forRoot(),
    ServiceModule.forRoot(),
    ToastrModule.forRoot(),
    StoreModule.provideStore(rootReducer),
    RouterStoreModule.connectRouter(),
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    ...CONDITIONAL_IMPORTS,
    ...CONDITIONAL_IMPORTS,
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   * enableTracing: true,
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    WindowRef
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public _store: Store<AppState>
  ) {
  }

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
