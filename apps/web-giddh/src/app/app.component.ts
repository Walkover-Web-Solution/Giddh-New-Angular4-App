import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {isCordova} from '@giddh-workspaces/utils';
/**
 * Angular 2 decorators and services
 */
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {Store} from '@ngrx/store';
import {AppState} from './store/roots';
import {GeneralService} from './services/general.service';
import {pick} from './lodash-optimized';
import {VersionCheckService} from './version-check.service';
import {ReplaySubject} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DbService} from './services/db.service';
import {reassignNavigationalArray} from './models/defaultMenus'
import {Configuration} from "./app.constant";

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

    public sideMenu: { isopen: boolean } = {isopen: true};
    public companyMenu: { isopen: boolean } = {isopen: false};
    public isProdMode: boolean = false;
    public isElectron: boolean = false;
    public isCordova: boolean = false;
    public tagManagerUrl: SafeUrl;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public IAmLoaded: boolean = false;
    private newVersionAvailableForWebApp: boolean = false;

    constructor(private store: Store<AppState>,
                private router: Router,
                private _generalService: GeneralService,
                private _cdr: ChangeDetectorRef,
                private _versionCheckService: VersionCheckService,
                private sanitizer: DomSanitizer,
                private breakpointObserver: BreakpointObserver,
                private dbServices: DbService
    ) {
        this.isProdMode = PRODUCTION_ENV;
        this.isElectron = isElectron;
        this.isCordova = isCordova();
        this.store.select(s => s.session).subscribe(ss => {
            if (ss.user && ss.user.session && ss.user.session.id) {
                let a = pick(ss.user, ['isNewUser']);
                a.isNewUser = true;
                this._generalService.user = {...ss.user.user, ...a};
                if (ss.user.statusCode !== 'AUTHENTICATE_TWO_WAY') {
                    this._generalService.sessionId = ss.user.session.id;
                }
            } else {
                this._generalService.user = null;
                this._generalService.sessionId = null;
            }
            this._generalService.companyUniqueName = ss.companyUniqueName;
        });
        this._generalService.IAmLoaded.subscribe(s => {
            this.IAmLoaded = s;
        });
        if (isCordova()) {
            document.addEventListener("deviceready", function () {
                if ((window as any).StatusBar) {
                    (window as any).StatusBar.overlaysWebView(false);
                    // (window as any).StatusBar.backgroundColorByName("#1a237e");
                    (window as any).StatusBar.styleLightContent();
                }
            }, false);
        }
        this.tagManagerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.googletagmanager.com/ns.html?id=GTM-K2L9QG');

        this.breakpointObserver.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.changeOnMobileView(result.matches);
        });
        if (Configuration.isElectron) {
            // electronOauth2
            const {ipcRenderer} = (window as any).require("electron");
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
            // this.router.navigate(['/pages/settings']);
        } else {
            localStorage.setItem('isMobileSiteGiddh', 'false');
        }
        reassignNavigationalArray(isMobile);
        this._generalService.setIsMobileView(isMobile);
    }

    public ngOnInit() {
        this.sideBarStateChange(true);
        // Need to implement for Web app only
        // debugger;
        if (!LOCAL_ENV && !(isElectron || isCordova())) {
            this._versionCheckService.initVersionCheck(AppUrl + '/version.json');

            this._versionCheckService.onVersionChange$.subscribe((isChanged: boolean) => {
                if (isChanged) {
                    this.newVersionAvailableForWebApp = _.clone(isChanged);
                }
            });
        }
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
        this._cdr.detectChanges();
        this.router.events.subscribe((evt) => {

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
}
