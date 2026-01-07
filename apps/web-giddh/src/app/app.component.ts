/**
 * @fileoverview App component for handling user interface and interactions
 * @author Giddh Development Team
 * @since 2026
 */

import { NavigationEnd, NavigationStart, Router, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { VersionCheckService } from './version-check.service';
import { ReplaySubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DbService } from './services/db.service';
import { reassignNavigationalArray } from './models/default-menus'
import { BREAKPOINT_SCREEN_SIZE, Configuration } from "./app.constant";
import { filter, take, takeUntil } from 'rxjs/operators';
import { LoaderService } from './loader/loader.service';
import { CompanyActions } from './actions/company.actions';
import { OrganizationType } from './models/user-login-state';
import { CommonActions } from './actions/common.actions';
import { MatDialog } from '@angular/material/dialog';
import { ServiceConfig } from './services/service.config';
import { PageLeaveUtilityService } from './services/page-leave-utility.service';
import { LoginActions } from './actions/login.action';
import { InvoiceActions } from './actions/invoice/invoice.actions';
import { WarehouseActions } from './settings/warehouse/action/warehouse.action';
import { CompanyService } from './services/company.service';
import { environment } from '../environments/environment.generated';
import { clone, get, includes, pick, remove, startsWith  } from './lodash-optimized';

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
    templateUrl: './app.component.html',
    standalone: false
})
/**
 * AppComponent class - Handles appcomponent functionality
 * @export
 * @class AppComponent
 */

export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
    public sideMenu: { isopen: boolean } = { isopen: true };
    public companyMenu: { isopen: boolean } = { isopen: false };
    public isProdMode: boolean = false;
    public isElectron: boolean = Configuration.isElectron;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public IAmLoaded: boolean = false;
    private newVersionAvailableForWebApp: boolean = false;
    /** This holds the active locale */
    public activeLocale: string = "";
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Bound method reference for event listener cleanup */
    private boundHandleQueryParamsCompanySwitch: (event: any) => void;

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
        @Inject(ServiceConfig) private serviceConfig,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private loginActions: LoginActions,
        private invoiceActions: InvoiceActions,
        private warehouseActions: WarehouseActions,
        private companyService: CompanyService
    ) {
        this.isProdMode = environment.production;
        // Configuration.isElectron is already available via import

        // Bind the method for proper event listener cleanup
        this.boundHandleQueryParamsCompanySwitch = (event: any) => this.handleQueryParamsCompanySwitch(event.detail);

        this.store.pipe(select(s => s.session), takeUntil(this.destroyed$)).subscribe(ss => {
            if (ss?.user && ss.user.session && ss.user.session.id) {
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

        if (this._generalService.getUrlParameter("companyUniqueName")) {
            this._generalService.setParameterInLocalStorage("companyUniqueName", this._generalService.getUrlParameter("companyUniqueName"));
        }
        if (this._generalService.getUrlParameter("version")) {
            this._generalService.setParameterInLocalStorage("voucherApiVersion", this._generalService.getUrlParameter("version"));
        }

        if (!(this._generalService.user && this._generalService.sessionId)) {
            const href = window.location.href;
            const path = window.location.pathname || '';
            const search = window.location.search || '';
            const isLoginLike = href.includes('login') || href.includes('token-verify') || href.includes('download') || href.includes('verify-subscription-ownership') || href.includes('dns');
            // Generate returnUrl for any non-login-like path (including root path)
            if (!isLoginLike) {
                const isLocalHost = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
                if (environment.production && !Configuration.isElectron && !isLocalHost) {
                    const currentUrl = path + search;
                    let returnUrl = '';
                    if (currentUrl.startsWith('/pages/')) {
                        returnUrl = currentUrl.split('/pages/')[1] || '';
                    } else {
                        returnUrl = currentUrl.startsWith('/') ? currentUrl.substring(1) : currentUrl;
                    }
                    const regionLogin = this._generalService.getGiddhRegionUrl() + 'login';
                    const target = returnUrl && returnUrl !== 'login' && returnUrl !== 'token-verify' && returnUrl !== '' ? `${regionLogin}?returnUrl=${encodeURIComponent(returnUrl)}` : regionLogin;
                    window.location.href = target;
                } else {
                    const currentUrl = path + search;
                    let returnUrl = '';
                    if (currentUrl.startsWith('/pages/')) {
                        returnUrl = currentUrl.split('/pages/')[1] || '';
                    } else {
                        returnUrl = currentUrl.startsWith('/') ? currentUrl.substring(1) : currentUrl;
                    }
                    if (returnUrl && returnUrl !== 'login' && returnUrl !== 'token-verify' && returnUrl !== '') {
                        try { sessionStorage.setItem('returnUrl', returnUrl); } catch (_) { }
                        this.router.navigate(['/login'], { queryParams: { returnUrl } });
                    } else {
                        this.router.navigate(['/login']);
                    }
                }
            }
        }

        this._generalService.IAmLoaded.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.IAmLoaded = s;
        });

        if (Configuration.isElectron) {
            // electronOauth2 - Use secure Electron API
            try {
                const electron = (window as any).require("electron");
                if (electron && electron.ipcRenderer) {
                    const { ipcRenderer } = electron;
                    // Send server environment to main process
                    ipcRenderer.send("take-server-environment", {
                        'production': environment.production,
                        'isLocalEnv': !environment.production,
                        'AppUrl': (this.serviceConfig.AppUrl || Configuration.AppUrl),
                        'APP_FOLDER': environment.APP_FOLDER
                    });
                    // Handle app close requests
                    ipcRenderer.on('app-close-requested', () => {
                        this.pageLeaveUtilityService.confirmPageLeave((confirmed: boolean) => {
                            if (confirmed) {
                                ipcRenderer.send('force-close');
                            }
                        });
                    });
                } else if ((window as any).electronAPI) {
                    // Fallback: Use secure electronAPI if available
                    const electronAPI = (window as any).electronAPI;
                    // Send server environment to main process
                    electronAPI.send("take-server-environment", {
                        'production': environment.production,
                        'isLocalEnv': !environment.production,
                        'AppUrl': (this.serviceConfig.AppUrl || Configuration.AppUrl),
                        'APP_FOLDER': environment.APP_FOLDER
                    });
                    // Handle app close requests (note: electronAPI.on might not support this channel)
                    if (electronAPI.on) {
                        electronAPI.on('app-close-requested', () => {
                            this.pageLeaveUtilityService.confirmPageLeave((confirmed: boolean) => {
                                if (confirmed) {
                                    electronAPI.send('force-close');
                                }
                            });
                        });
                    }
                } else {

                }
            } catch (error) {

            }
        }

        /** This will be use for dialog close on route event */
        this.router.events.pipe(filter(event => event instanceof NavigationStart), takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event) {
                this.dialog?.closeAll();
            }
        });

        /* Codemirror */
        if (window['CodeMirror'] === undefined) {
            let codeMirrorScriptTag = document.createElement('script');
            codeMirrorScriptTag.src = './assets/js/codemirror.min.js';
            codeMirrorScriptTag.type = 'text/javascript';
            codeMirrorScriptTag.defer = true;
            document.body.appendChild(codeMirrorScriptTag);
        }
        /* Codemirror */
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
        } else {
            localStorage.setItem('isMobileSiteGiddh', 'false');
        }
        let branches = [];
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            branches = response || [];
        });
        reassignNavigationalArray(isMobile, (this._generalService.currentOrganizationType === OrganizationType.Company || this.isConsolidatedBranch) && branches?.length > 1, []);
        this._generalService.setIsMobileView(isMobile);
    }

    public ngOnInit() {
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
            this._cdr.detectChanges();
        });
        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.TABLET
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.changeOnMobileView(result?.breakpoints[BREAKPOINT_SCREEN_SIZE.TABLET]);
        });
        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.UNSUPPORTED
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result?.breakpoints[BREAKPOINT_SCREEN_SIZE.UNSUPPORTED]) {
                this.router.navigate(['/mobile-restricted']);
            }
        });
        this.sideBarStateChange(true);
        this.subscribeToLazyRouteLoading();

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
            if (response) {
                document.querySelector("body")?.classList?.remove("dark-theme");
                document.querySelector("body")?.classList?.remove("default-theme");
                document.querySelector("body")?.classList?.add(response?.value);
            } else {
                let availableThemes = this._generalService.getAvailableThemes();
                this.store.dispatch(this.commonActions.setActiveTheme(availableThemes[0]));
            }
        });

        // Listen for query params company/branch switch event from hybrid storage
        window.addEventListener('giddh-query-params-company-switch', this.boundHandleQueryParamsCompanySwitch);

        setTimeout(() => {
            this._generalService.addLinkTag("./assets/styles/vendors/font-awesome.css");
            this._generalService.addLinkTag("./assets/fonts/icomoon/icomoon.css");
            this._generalService.addLinkTag("./assets/styles/vendors/toastr.css");
            this._generalService.addLinkTag("./assets/styles/vendors/ladda-themeless.min.css");
            this._generalService.addLinkTag("./assets/styles/vendors/lightbox.css");

            /* RAZORPAY */
            if (window['Razorpay'] === undefined) {
                let scriptTag = document.createElement('script');
                scriptTag.src = 'https://checkout.razorpay.com/v1/checkout.js';
                scriptTag.type = 'text/javascript';
                scriptTag.defer = true;
                document.body.appendChild(scriptTag);
            }
            /* RAZORPAY */

            /* Xml */
            if (window['xmlScriptTag'] === undefined) {
                let xmlScriptTag = document.createElement('script');
                xmlScriptTag.src = './assets/js/xml.min.js';
                xmlScriptTag.type = 'text/javascript';
                xmlScriptTag.defer = true;
                document.body.appendChild(xmlScriptTag);
            }
            /* Xml */
        }, 1000);

        this._generalService.addLinkTag("./assets/styles/vendors/code-mirror.css");

        // if (this._generalService.getUrlParameter("region") === "uk") {
        //     this._generalService.setParameterInLocalStorage("X-Tenant", "GB");
        // } else {
        //     this._generalService.setParameterInLocalStorage("X-Tenant", "GL");
        // }
    }

    public ngAfterViewInit() {
        this.hideMainGiddhLoader();

        if (this._generalService.companyUniqueName && !window.location.href.includes('login') && !window.location.href.includes('token-verify')) {
            setTimeout(() => {
                this.store.dispatch(this.companyActions.RefreshCompanies());
            }, 1000);
        }

        this._generalService.IAmLoaded.next(true);
        this._cdr.detectChanges();

        // Console all global variables after Angular app is fully loaded
        setTimeout(() => {
            this.logAllGlobalVariables();
        }, 2000);
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((evt) => {
            if ((evt instanceof NavigationStart) && this.newVersionAvailableForWebApp && !Configuration.isElectron) {
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

        const search = location.search || '';
        if (this._generalService.user && this._generalService.sessionId && search) {
            const params = new URLSearchParams(search);
            const raw = params.get('returnUrl') || params.get('returnurl');
            if (raw && raw.trim()) {
                try {
                    const decoded = decodeURIComponent(raw);
                    if (!Configuration.isElectron) {
                        const target = decoded.startsWith('pages/') ? decoded : `pages/${decoded.startsWith('/') ? decoded.substring(1) : decoded}`;
                        this.router.navigateByUrl(`/${target}`);
                        return;
                    }
                } catch (_) {
                    // ignore decode issues
                }
            }
        }

        if (this._generalService.user && this._generalService.sessionId) {
            try {
                const stored = sessionStorage.getItem('returnUrl');
                if (stored && stored.trim()) {
                    const decoded = decodeURIComponent(stored);
                    const target = decoded.startsWith('pages/') ? decoded : `pages/${decoded.startsWith('/') ? decoded.substring(1) : decoded}`;
                    sessionStorage.removeItem('returnUrl');
                    this.router.navigateByUrl(`/${target}`);
                    return;
                }
            } catch (_) { }
        }

        const lastState = localStorage.getItem('lastState');

        if (lastState) {
            localStorage.removeItem('lastState');
            return this.router.navigate([lastState]);
        }

        if (environment.PRODUCTION_ENV && !Configuration.isElectron) {
            this._versionCheckService.initVersionCheck((this.serviceConfig.AppUrl || Configuration.AppUrl) + 'version.json');
            this._versionCheckService.onVersionChange$.pipe(takeUntil(this.destroyed$)).subscribe((isChanged: boolean) => {
                if (isChanged) {
                    this.newVersionAvailableForWebApp = clone(isChanged);
                }
            });
        }
    }

    /**
     * Hides main giddh loader for login/signup/token verify and shows on other pages
     *
     * @private
     * @memberof AppComponent
     */
    private hideMainGiddhLoader(): void {
        document.getElementById("main-giddh-loader")?.classList.add("d-none");
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
        // Remove event listener to prevent memory leaks
        window.removeEventListener('giddh-query-params-company-switch', this.boundHandleQueryParamsCompanySwitch);
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

    /**
     * Handles company/branch switching from query parameters, triggering same APIs as switchCompany/switchBranch
     *
     * @private
     * @param {any} detail - Event detail containing companyUniqueName, branchUniqueName, and company object
     * @memberof AppComponent
     */
    private handleQueryParamsCompanySwitch(detail: any): void {

        if (!detail || !detail.companyUniqueName || !detail.company) {

            return;
        }

        const { companyUniqueName, branchUniqueName, company } = detail;

        // Reset active company data and warehouse response (same as switchCompany)
        this.store.dispatch(this.companyActions.resetActiveCompanyData());
        this.store.dispatch(this.warehouseActions.resetWarehouseResponse());

        // Update general service properties
        this._generalService.companyUniqueName = companyUniqueName;
        this._generalService.voucherApiVersion = company?.voucherVersion || 2;
        this.store.dispatch(this.commonActions.setBranchConsolidated(false));

        // Update store with company and branch details
        this.store.dispatch(this.companyActions.setStateDetailsRequest({
            lastState: '',
            companyUniqueName: companyUniqueName,
            currentBranchUniqueName: branchUniqueName || ''
        }));

        // Set organization details
        const details = {
            branchDetails: {
                uniqueName: branchUniqueName || ''
            }
        };

        if (branchUniqueName) {
            this.setOrganizationDetails(OrganizationType.Branch, details);
            this._generalService.currentBranchUniqueName = branchUniqueName;
            // Trigger invoice settings for branch (same as switchBranch)
            this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        } else {
            this.setOrganizationDetails(OrganizationType.Company, details);
        }

        // Trigger company change (same as switchCompany)
        this.store.dispatch(this.loginActions.ChangeCompany(companyUniqueName, false));

        // Navigate to final state if branch is selected (same as switchBranch)
        if (branchUniqueName) {
            this.companyService.getStateDetails(companyUniqueName).pipe(take(1)).subscribe(response => {
                if (response && response.body) {
                    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                        this._generalService.finalNavigate(response.body.lastState);
                    });
                }
            });
        }

        this._cdr.detectChanges();
    }

    /**
     * Sets the organization details for company or branch mode
     *
     * @private
     * @param {OrganizationType} type - Type of the organization (Company or Branch)
     * @param {any} branchDetails - Branch details of an organization
     * @memberof AppComponent
     */
    private setOrganizationDetails(type: OrganizationType, branchDetails: any): void {
        const organization = {
            type, // Mode to which user is switched to
            uniqueName: this._generalService.companyUniqueName,
            details: branchDetails
        };
        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
    }

    /**
     * Logs all global variables after Angular app is fully loaded
     *
     * @private
     * @memberof AppComponent
     */
    private logAllGlobalVariables(): void {
        console.group('🌍 GLOBAL VARIABLES AFTER ANGULAR LOAD');

        try {
            // Get all global variables from window object
            const globalVars: { [key: string]: any } = {};
            const excludedKeys = ['parent', 'top', 'self', 'frames', 'frameElement']; // Avoid circular references

            // Collect all enumerable properties from window
            for (const key in window) {
                if (window.hasOwnProperty(key) && !excludedKeys.includes(key)) {
                    try {
                        const value = (window as any)[key];
                        globalVars[key] = {
                            type: typeof value,
                            value: this.getSafeValue(value),
                            constructor: value?.constructor?.name || 'Unknown'
                        };
                    } catch (error) {
                        globalVars[key] = {
                            type: 'Error',
                            value: `[Error accessing property: ${error}]`,
                            constructor: 'Error'
                        };
                    }
                }
            }

            // Log categorized global variables
            this.logCategorizedGlobals(globalVars);

            // Log Angular-specific globals
            this.logAngularGlobals();

            // Log Giddh-specific globals
            this.logGiddhGlobals();

            // Log Environment variables
            this.logEnvironmentVariables();

            // Log Browser APIs
            this.logBrowserAPIs();

            // Log Third-party libraries
            this.logThirdPartyLibraries();

        } catch (error) {
            console.error('❌ Error logging global variables:', error);
        }

        console.groupEnd();
    }

    /**
     * Gets a safe representation of a value for logging
     *
     * @private
     * @param {any} value - The value to make safe
     * @returns {any} Safe representation of the value
     * @memberof AppComponent
     */
    private getSafeValue(value: any): any {
        if (value === null) return null;
        if (value === undefined) return undefined;

        const type = typeof value;

        switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
                return value;
            case 'function':
                return `[Function: ${value.name || 'anonymous'}]`;
            case 'object':
                if (Array.isArray(value)) {
                    return `[Array(${value.length})]`;
                }
                if (value instanceof Date) {
                    return value.toISOString();
                }
                if (value instanceof Error) {
                    return `[Error: ${value.message}]`;
                }
                if (value.constructor && value.constructor.name) {
                    return `[Object: ${value.constructor.name}]`;
                }
                return '[Object]';
            default:
                return `[${type}]`;
        }
    }

    /**
     * Logs categorized global variables
     *
     * @private
     * @param {any} globalVars - Object containing all global variables
     * @memberof AppComponent
     */
    private logCategorizedGlobals(globalVars: any): void {
        const categories = {
            functions: [] as string[],
            objects: [] as string[],
            primitives: [] as string[],
            arrays: [] as string[],
            classes: [] as string[]
        };

        Object.keys(globalVars).forEach(key => {
            const item = globalVars[key];
            switch (item.type) {
                case 'function':
                    categories.functions.push(key);
                    break;
                case 'object':
                    if (item.value && typeof item.value === 'string' && item.value.includes('Array')) {
                        categories.arrays.push(key);
                    } else if (item.constructor !== 'Object') {
                        categories.classes.push(key);
                    } else {
                        categories.objects.push(key);
                    }
                    break;
                default:
                    categories.primitives.push(key);
            }
        });

        console.group('📊 CATEGORIZED GLOBALS');
        console.log('🔧 Functions:', categories.functions.sort());
        console.log('📦 Objects:', categories.objects.sort());
        console.log('🏗️ Classes/Constructors:', categories.classes.sort());
        console.log('📋 Arrays:', categories.arrays.sort());
        console.log('🔤 Primitives:', categories.primitives.sort());
        console.groupEnd();

        // Log detailed view of important globals
        console.group('🔍 DETAILED GLOBAL VARIABLES');
        Object.keys(globalVars).sort().forEach(key => {
            const item = globalVars[key];
            console.log(`${key}:`, {
                type: item.type,
                constructor: item.constructor,
                value: item.value
            });
        });
        console.groupEnd();
    }

    /**
     * Logs Angular-specific global variables
     *
     * @private
     * @memberof AppComponent
     */
    private logAngularGlobals(): void {
        console.group('🅰️ ANGULAR GLOBALS');

        const angularGlobals = [
            'ng', 'ngDevMode', 'Zone', '__zone_symbol__', 'getAllAngularRootElements',
            'getAngularTestability', 'getAllAngularTestabilities'
        ];

        angularGlobals.forEach(key => {
            if ((window as any)[key] !== undefined) {
                console.log(`${key}:`, this.getSafeValue((window as any)[key]));
            }
        });

        // Log Angular version if available
        if ((window as any).ng && (window as any).ng.version) {
            console.log('Angular Version:', (window as any).ng.version);
        }

        console.groupEnd();
    }

    /**
     * Logs Giddh-specific global variables
     *
     * @private
     * @memberof AppComponent
     */
    private logGiddhGlobals(): void {
        console.group('🏢 GIDDH GLOBALS');

        const giddhGlobals = [
            'PRODUCTION_ENV', 'AppUrl', 'isElectron', 'electronAPI', 'require',
            'giddhRegion', 'Country-Region', 'whiteLabel'
        ];

        giddhGlobals.forEach(key => {
            if ((window as any)[key] !== undefined) {
                console.log(`${key}:`, this.getSafeValue((window as any)[key]));
            }
        });

        // Log localStorage Giddh-specific items
        console.group('💾 GIDDH LOCALSTORAGE');
        const giddhStorageKeys = ['session', 'permission', 'branchConsolidated', 'whiteLabel', 'Country-Region'];
        giddhStorageKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`localStorage.${key}:`, parsed);
                } catch {
                    console.log(`localStorage.${key}:`, value);
                }
            }
        });
        console.groupEnd();

        // Log sessionStorage Giddh-specific items
        console.group('🗂️ GIDDH SESSIONSTORAGE');
        giddhStorageKeys.forEach(key => {
            const value = sessionStorage.getItem(key);
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`sessionStorage.${key}:`, parsed);
                } catch {
                    console.log(`sessionStorage.${key}:`, value);
                }
            }
        });
        console.groupEnd();

        console.groupEnd();
    }

    /**
     * Logs environment variables
     *
     * @private
     * @memberof AppComponent
     */
    private logEnvironmentVariables(): void {
        console.group('🌐 ENVIRONMENT VARIABLES');

        console.log('Environment Config:', {
            production: environment.production,
            PRODUCTION_ENV: environment.PRODUCTION_ENV,
            APP_FOLDER: environment.APP_FOLDER,
            isElectron: Configuration.isElectron,
            AppUrl: Configuration.AppUrl,
            ApiUrl: Configuration.ApiUrl
        });

        console.log('Service Config:', {
            AppUrl: this.serviceConfig?.AppUrl,
            ApiUrl: this.serviceConfig?.ApiUrl
        });

        console.groupEnd();
    }

    /**
     * Logs browser APIs
     *
     * @private
     * @memberof AppComponent
     */
    private logBrowserAPIs(): void {
        console.group('🌐 BROWSER APIS');

        const browserAPIs = [
            'navigator', 'location', 'history', 'document', 'console',
            'localStorage', 'sessionStorage', 'indexedDB', 'fetch',
            'XMLHttpRequest', 'WebSocket', 'Worker', 'ServiceWorker'
        ];

        browserAPIs.forEach(api => {
            if ((window as any)[api] !== undefined) {
                console.log(`${api}:`, this.getSafeValue((window as any)[api]));
            }
        });

        console.groupEnd();
    }

    /**
     * Logs third-party libraries
     *
     * @private
     * @memberof AppComponent
     */
    private logThirdPartyLibraries(): void {
        console.group('📚 THIRD-PARTY LIBRARIES');

        const thirdPartyLibs = [
            'jQuery', '$', 'Razorpay', 'CodeMirror', 'moment', 'dayjs',
            'Chart', 'D3', 'Froala', 'LogRocket', 'gtag', 'ga'
        ];

        thirdPartyLibs.forEach(lib => {
            if ((window as any)[lib] !== undefined) {
                const value = (window as any)[lib];
                console.log(`${lib}:`, {
                    type: typeof value,
                    version: value.version || value.VERSION || 'Unknown',
                    constructor: value.constructor?.name || 'Unknown'
                });
            }
        });

        console.groupEnd();
    }
}