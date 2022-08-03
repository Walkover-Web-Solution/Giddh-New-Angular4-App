import { NavigationEnd, NavigationStart, Router, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { pick } from './lodash-optimized';
import { VersionCheckService } from './version-check.service';
import { ReplaySubject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DbService } from './services/db.service';
import { reassignNavigationalArray } from './models/defaultMenus'
import { Configuration } from "./app.constant";
import { filter, take, takeUntil } from 'rxjs/operators';
import { LoaderService } from './loader/loader.service';
import { CompanyActions } from './actions/company.actions';
import { OrganizationType } from './models/user-login-state';
import { CommonActions } from './actions/common.actions';
import { MatDialog } from '@angular/material/dialog';
import { BsModalService } from 'ngx-bootstrap/modal';

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
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public IAmLoaded: boolean = false;
    private newVersionAvailableForWebApp: boolean = false;
    /** This holds the active locale */
    public activeLocale: string = "";

    constructor(private store: Store<AppState>,
        private router: Router,
        private _generalService: GeneralService,
        private _cdr: ChangeDetectorRef,
        private _versionCheckService: VersionCheckService,
        private breakpointObserver: BreakpointObserver,
        private dbServices: DbService,
        private loadingService: LoaderService,
        private companyActions: CompanyActions,
        private commonActions: CommonActions,
        public dialog: MatDialog,
        private modalService: BsModalService
    ) {
        this.isProdMode = PRODUCTION_ENV;
        this.isElectron = isElectron;

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
                if (PRODUCTION_ENV && !isElectron) {
                    window.location.href = 'https://stage.giddh.com/login/';
                } else {
                    this.router.navigate(['/login']);
                }
            }
        }

        this._generalService.IAmLoaded.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.IAmLoaded = s;
        });

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

        /** This will be use for dialog close on route event */
        this.router.events.pipe(filter(event => event instanceof NavigationStart), takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event) {
                this.dialog?.closeAll();
                for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
                    this.modalService.hide(i);
                }
            }
        });
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

        if (this._generalService.companyUniqueName && !window.location.href.includes('login') && !window.location.href.includes('token-verify')) {
            this.store.dispatch(this.companyActions.RefreshCompanies());
        }

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.activeLocale !== response?.value) {
                    this.activeLocale = response?.value;
                    this.store.dispatch(this.commonActions.getCommonLocaleData(response.value));
                }
            } else {
                let supportedLocales = this._generalService.getSupportedLocales();
                this.store.dispatch(this.commonActions.setActiveLocale(supportedLocales[0]));
            }
        });

        this.store.pipe(select(state => state.session.activeTheme), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.value) {
                document.querySelector("body")?.classList?.remove("dark-theme");
                document.querySelector("body")?.classList?.remove("default-theme");
                document.querySelector("body")?.classList?.add(response?.value);
            }
        });

        this.breakpointObserver.observe(['(prefers-color-scheme: light)']).subscribe((state: BreakpointState) => {
            let availableThemes = this._generalService.getAvailableThemes();
            if (state?.matches) {
                document.querySelector("body")?.classList?.add("default-theme");
                document.querySelector("body")?.classList?.remove("dark-theme");
                this.store.dispatch(this.commonActions.setActiveTheme(availableThemes[0]));
            } else {
                document.querySelector("body")?.classList?.add("dark-theme");
                document.querySelector("body")?.classList?.remove("default-theme");
                this.store.dispatch(this.commonActions.setActiveTheme(availableThemes[1]));
            }
        });
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
        this._cdr.detectChanges();
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((evt) => {
            if ((evt instanceof NavigationStart) && this.newVersionAvailableForWebApp && !isElectron) {
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
                if (!isElectron) {
                    this.router.navigate(['pages/' + tUrl[1]]);
                }
            }
        }

        if (!LOCAL_ENV && !isElectron) {
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
