import { take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { Component, OnInit, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { SettingsTagsComponent } from './tags/tags.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { GeneralActions } from '../actions/general/general.actions';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { WarehouseActions } from './warehouse/action/warehouse.action';
import { PAGINATION_LIMIT, SETTING_INTEGRATION_TABS } from '../app.constant';
import { HttpClient } from "@angular/common/http";
import { BreakpointObserver } from '@angular/cdk/layout';
import { LocaleService } from '../services/locale.service';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('integrationComponent', { static: false }) public integrationComponent: SettingIntegrationComponent;
    @ViewChild('profileComponent', { static: false }) public profileComponent: SettingProfileComponent;
    @ViewChild('financialYearComp', { static: false }) public financialYearComp: FinancialYearComponent;
    @ViewChild('eBankComp', { static: false }) public eBankComp: SettingLinkedAccountsComponent;
    @ViewChild('permissionComp', { static: false }) public permissionComp: SettingPermissionComponent;
    @ViewChild('tagComp', { static: false }) public tagComp: SettingsTagsComponent;

    public isUserSuperAdmin: boolean = false;
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isCompanyProfileUpdated: boolean = false;
    //variable to hold sub tab value inside any tab e.g. integration -> payment
    public selectedChildTab: number = SETTING_INTEGRATION_TABS.EMAIL.VALUE;
    public activeTab: string = 'taxes';
    public integrationtab: string;
    public isMobileScreen: boolean = true;
    public permissionTabDataFetched: boolean = false;
    public get shortcutEnabled() {
        return document.activeElement === document.body;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** This holds heading for profile tab */
    public profileTabHeading: string = "";
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';

    constructor(
        private store: Store<AppState>,
        private _permissionDataService: PermissionDataService,
        public _route: ActivatedRoute,
        private router: Router,
        private _authenticationService: AuthenticationService,
        private _toast: ToasterService,
        private _generalActions: GeneralActions,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private warehouseActions: WarehouseActions,
        private http: HttpClient,
        private breakPointObservar: BreakpointObserver,
        private localeService: LocaleService
    ) {
        this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
        this.isUpdateCompanyInProgress$ = this.store.pipe(select(state => state.settings.updateProfileInProgress), takeUntil(this.destroyed$));
        this.isCompanyProfileUpdated = false;
    }

    public ngOnInit() {
        this.breakPointObservar.observe([
            '(max-width:767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this._route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type'] && params['referrer']) {
                if (params['type'] === 'integration' && params['referrer']) {
                    this.selectedChildTab = this.assignChildtabForIntegration(params['referrer']);
                }
                this.integrationtab = params['referrer'];
                this.activeTab = params['type'];
            } else if (params['type'] && this.activeTab !== params['type']) {
                this.selectedChildTab = SETTING_INTEGRATION_TABS.EMAIL.VALUE;
                this.integrationtab = '';
                this.activeTab = params['type'];
            } else {
                this.integrationtab = params['referrer'];
            }

            this.tabChanged(this.activeTab);

            if (this.activeTab === "linked-accounts") {
                setTimeout(() => {
                    if (this.eBankComp) {
                        this.eBankComp.getInitialEbankInfo();
                    }
                }, 0);
            } else if (this.activeTab === "profile" || this.activeTab === "addresses") {
                setTimeout(() => {
                    if (this.profileComponent) {
                        this.profileComponent.getInitialProfileData();
                        this.profileComponent.getInventorySettingData();
                    }
                }, 0);
            } else if (this.activeTab === "financial-year") {
                setTimeout(() => {
                    if (this.financialYearComp) {
                        this.financialYearComp.getInitialFinancialYearData();
                    }
                }, 0);
            } else if (this.activeTab === "permission") {
                setTimeout(() => {
                    if (this.permissionComp) {
                        this.permissionComp.getInitialData();
                    }
                }, 0);
            }

            if(this.activeTab === "taxes") {
                this.asideGstSidebarMenuState = "in";
                document.querySelector('body').classList.remove('setting-sidebar-open');
                document.querySelector('body').classList.add('gst-sidebar-open');
                this.toggleGstPane();
            } else {
                this.asideGstSidebarMenuState = "out";
                document.querySelector('body').classList.add('setting-sidebar-open');
                document.querySelector('body').classList.remove('gst-sidebar-open');
            }
        });

        this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.tab === 'integration' && val.code) {
                this.saveGmailAuthCode(val.code);
                this.activeTab = val.tab;
                this.router.navigate(['pages/settings/integration/email'], { replaceUrl: true });
            }
        });

        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                this.isCompanyProfileUpdated = true;
            }
        });

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('settings', response?.value).subscribe(response => {
                    this.localeData = response;
                });
            }
            this.activeLocale = response?.value;
        });
    }

    public assignChildtabForIntegration(childTab: string): number {
        switch (childTab) {
            case SETTING_INTEGRATION_TABS.PAYMENT.LABEL:
                return SETTING_INTEGRATION_TABS.PAYMENT.VALUE;
            case SETTING_INTEGRATION_TABS.E_COMMERCE.LABEL:
                return SETTING_INTEGRATION_TABS.E_COMMERCE.VALUE;
            case SETTING_INTEGRATION_TABS.COLLECTION.LABEL:
                return SETTING_INTEGRATION_TABS.COLLECTION.VALUE;
            case SETTING_INTEGRATION_TABS.EMAIL.LABEL:
                return SETTING_INTEGRATION_TABS.EMAIL.VALUE;
            // case SETTING_INTEGRATION_TABS.SMS.LABEL:
            //     return SETTING_INTEGRATION_TABS.SMS.VALUE;
            default:
                return SETTING_INTEGRATION_TABS.EMAIL.VALUE;
        }
    }

    public profileSelected(e) {
        if (e.heading === 'Profile') {
            this.profileComponent.getInitialProfileData();
            this.profileComponent.getInventorySettingData();
        }
    }

    public financialYearSelected(e) {
        this.financialYearComp.getInitialFinancialYearData();
    }

    public linkedAccountSelected(e) {
        this.eBankComp.getInitialEbankInfo();
    }

    public permissionTabSelected(e) {
        if (!this.permissionTabDataFetched) {
            this.permissionTabDataFetched = true;
            this.permissionComp.getInitialData();
        }
    }

    public tabChanged(tab: string) {
        if ((tab === 'integration' || tab === 'profile' || tab === 'addresses') && this.integrationtab) {
            this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab + '/' + this.integrationtab));
            this.loadModuleData(tab);
            this.router.navigate(['pages/settings/', tab, this.integrationtab], { replaceUrl: true });
        } else {
            this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab));
            this.loadModuleData(tab);
            this.router.navigate(['pages/settings/', tab], { replaceUrl: true });
        }
    }

    private saveGmailAuthCode(authCode: string) {
        const getAccessTokenData = {
            code: authCode,
            client_secret: GOOGLE_CLIENT_SECRET,
            client_id: GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl(AppUrl)
        };

        let options = { headers: {} };
        options.headers['Accept'] = 'application/json';
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        options.headers = {} as any;

        this.http.post("https://accounts.google.com/o/oauth2/token", getAccessTokenData, options).pipe(take(1)).subscribe((p: any) => {
            const dataToSave = {
                "access_token": p.access_token,
                "expires_in": p.expires_in,
                "refresh_token": p.refresh_token
            };
            this._authenticationService.saveGmailToken(dataToSave).pipe(take(1)).subscribe((res) => {
                if (res?.status === 'success') {
                    this._toast.successToast(this.localeData?.gmail_account_added, this.commonLocaleData?.app_success);
                } else {
                    this._toast.errorToast(res?.message, res?.code);
                }
                this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
            });
        })
    }

    private getRedirectUrl(baseHref: string) {
        return `${baseHref}pages/settings?tab=integration`;
    }

    /**
     * Fetches the data for a particular module by calling
     * respective API
     *
     * @private
     * @param {string} tabName Currently active tab name
     * @memberof SettingsComponent
     */
    private loadModuleData(tabName: string): void {
        if (tabName === 'warehouse') {
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
        }
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof SettingsComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('setting-sidebar-open');
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState = "out";
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
      * This will toggle the gst sidebar
      *
      * @memberof SettingsComponent
      */
     public toggleGstPane(): void {
        if (this.isMobileScreen && this.asideGstSidebarMenuState === 'in') {
            this.asideGstSidebarMenuState = "out";
        }
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof SettingsComponent
     */
     public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }
}
