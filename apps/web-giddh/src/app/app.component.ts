import { NavigationEnd, NavigationStart, Router, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { isCordova } from '@giddh-workspaces/utils';
/**
 * Angular 2 decorators and services
 */
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { pick } from './lodash-optimized';
import { VersionCheckService } from './version-check.service';
import { ReplaySubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DbService } from './services/db.service';
import { reassignNavigationalArray } from './models/defaultMenus'
import { Configuration } from "./app.constant";
import { take, takeUntil } from 'rxjs/operators';
import { LoaderService } from './loader/loader.service';
import { CompanyActions } from './actions/company.actions';
import { OrganizationType } from './models/user-login-state';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app-component',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

    public sideMenu: { isopen: boolean } = { isopen: true };
    public companyMenu: { isopen: boolean } = { isopen: false };
    public isProdMode: boolean = false;
    public isElectron: boolean = false;
    public isCordova: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public IAmLoaded: boolean = false;
    private newVersionAvailableForWebApp: boolean = false;

    constructor(private store: Store<AppState>,
        private router: Router,
        private _generalService: GeneralService,
        private _cdr: ChangeDetectorRef,
        private _versionCheckService: VersionCheckService,
        private breakpointObserver: BreakpointObserver,
        private dbServices: DbService,
        private loadingService: LoaderService,
        private companyActions: CompanyActions
    ) {
        this.isProdMode = PRODUCTION_ENV;
        this.isElectron = isElectron;
        this.isCordova = isCordova();

        this.store.pipe(select(s => s.session), takeUntil(this.destroyed$)).subscribe(ss => {
            if (ss.user && ss.user.session && ss.user.session.id) {
                let a = pick(ss.user, ['isNewUser']);
                a.isNewUser = true;
                this._generalService.user = { ...ss.user.user, ...a };
                if (ss.user.statusCode !== 'AUTHENTICATE_TWO_WAY') {
                    this._generalService.sessionId = ss.user.session.id;
                }
            } else {
                this._generalService.user = null;
                this._generalService.sessionId = null;
            }
            this._generalService.companyUniqueName = ss.companyUniqueName;
        });

        if (!(this._generalService.user && this._generalService.sessionId)) {
            if (!window.location.href.includes('login') && !window.location.href.includes('token-verify') && !window.location.href.includes('download')) {
                if (PRODUCTION_ENV && !(isElectron || this.isCordova)) {
                    window.location.href = 'https://stage.giddh.com/login/';
                } else if (this.isCordova) {
                    this._generalService.invokeEvent.next('logoutCordova');
                    this.router.navigate(['login']);
                } else {
                    window.location.href = AppUrl + 'login';
                }
            }
        }

        this._generalService.IAmLoaded.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.IAmLoaded = s;
        });

        if (isCordova()) {
            document.addEventListener("deviceready", function () {
                if ((window as any).StatusBar) {
                    (window as any).StatusBar.overlaysWebView(false);
                    (window as any).StatusBar.styleLightContent();
                }
            }, false);
        }

        if (Configuration.isElectron) {
            // electronOauth2
            const { ipcRenderer } = (window as any).require("electron");
            // google
            const t = ipcRenderer.send("take-server-environment", {
                STAGING_ENV,
                LOCAL_ENV,
                TEST_ENV,
                PRODUCTION_ENV,
                AppUrl,
                APP_FOLDER
            });
        }
    }

    public sidebarStatusChange(event) {
        this.sideMenu.isopen = event;
    }

    public sideBarStateChange(event: boolean) {
        this.sideMenu.isopen = event;
    }

    private changeOnMobileView(isMobile) {
        if (isMobile) {
            if (!localStorage.getItem('isMobileSiteGiddh') || !JSON.parse(localStorage.getItem('isMobileSiteGiddh'))) {
                localStorage.setItem('isMobileSiteGiddh', 'true');
            }
            this.dbServices.clearAllData();
        } else {
            localStorage.setItem('isMobileSiteGiddh', 'false');
        }
        let branches = [];
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            branches = response || [];
        });
        reassignNavigationalArray(isMobile, this._generalService.currentOrganizationType === OrganizationType.Company && branches.length > 1, []);
        this._generalService.setIsMobileView(isMobile);
    }

    public ngOnInit() {
        this.breakpointObserver.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.changeOnMobileView(result.matches);
        });
        this.sideBarStateChange(true);
        this.subscribeToLazyRouteLoading();

        if(this._generalService.companyUniqueName && !window.location.href.includes('login') && !window.location.href.includes('token-verify')) {
            this.store.dispatch(this.companyActions.RefreshCompanies());
        }
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
        this._cdr.detectChanges();
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((evt) => {
            if ((evt instanceof NavigationStart) && this.newVersionAvailableForWebApp && !(isElectron || isCordova())) {
                // need to save last state
                const redirectState = this.getLastStateFromUrl(evt.url);
                localStorage.setItem('lastState', redirectState);
                window.location.reload();
                return;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

        const lastState = localStorage.getItem('lastState');

        if (lastState) {
            localStorage.removeItem('lastState');
            return this.router.navigate([lastState]);
        }

        if (location.href.includes('returnUrl')) {
            let tUrl = location.href.split('returnUrl=');
            if (tUrl[1]) {
                if (!(isElectron || isCordova())) {
                    this.router.navigate(['pages/' + tUrl[1]]);
                }
            }
        }

        if (!LOCAL_ENV && !(isElectron || isCordova())) {
            this._versionCheckService.initVersionCheck(AppUrl + '/version.json');

            this._versionCheckService.onVersionChange$.pipe(takeUntil(this.destroyed$)).subscribe((isChanged: boolean) => {
                if (isChanged) {
                    this.newVersionAvailableForWebApp = _.clone(isChanged);
                }
            });
        }
    }

    private getLastStateFromUrl(url: string): string {
        if (url) {
            if (url.includes('/pages/')) {
                return url.substr(url.lastIndexOf('/') + 1, url.length);
            } else if (url.includes('/ledger/') || url.includes('/invoice/')) {
                return url;
            }
        }

        return 'home';
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Listens to the loading of lazy routes to show loader
     *
     * @private
     * @memberof AppComponent
     */
    private subscribeToLazyRouteLoading(): void {
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loadingService.show();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loadingService.hide();
            }
        })
    }
}
