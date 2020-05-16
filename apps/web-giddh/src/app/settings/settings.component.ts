import {take, takeUntil} from 'rxjs/operators';
import {Observable, ReplaySubject} from 'rxjs';
import {ToasterService} from 'apps/web-giddh/src/app/services/toaster.service';
import {SettingPermissionComponent} from './permissions/setting.permission.component';
import {SettingLinkedAccountsComponent} from './linked-accounts/setting.linked.accounts.component';
import {FinancialYearComponent} from './financial-year/financial-year.component';
import {SettingProfileComponent} from './profile/setting.profile.component';
import {SettingIntegrationComponent} from './integration/setting.integration.component';
import {PermissionDataService} from 'apps/web-giddh/src/app/permissions/permission-data.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TabsetComponent} from 'ngx-bootstrap';
import {StateDetailsRequest} from '../models/api-models/Company';
import {CompanyActions} from '../actions/company.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../store/roots';
import {SettingsProfileActions} from '../actions/settings/profile/settings.profile.action';
import {SettingsTagsComponent} from './tags/tags.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BunchComponent} from './bunch/bunch.component';
import {AuthenticationService} from '../services/authentication.service';
import {GeneralActions} from '../actions/general/general.actions';
import {SettingsIntegrationActions} from '../actions/settings/settings.integration.action';
import {WarehouseActions} from './warehouse/action/warehouse.action';
import { PAGINATION_LIMIT } from '../app.constant';
import { HttpClient } from "@angular/common/http";

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    @ViewChild('staticTabs') public staticTabs: TabsetComponent;

    @ViewChild('integrationComponent') public integrationComponent: SettingIntegrationComponent;
    @ViewChild('profileComponent') public profileComponent: SettingProfileComponent;
    @ViewChild('financialYearComp') public financialYearComp: FinancialYearComponent;
    @ViewChild('eBankComp') public eBankComp: SettingLinkedAccountsComponent;
    @ViewChild('permissionComp') public permissionComp: SettingPermissionComponent;
    @ViewChild('tagComp') public tagComp: SettingsTagsComponent;
    @ViewChild('bunchComp') public bunchComp: BunchComponent;

    public isUserSuperAdmin: boolean = false;
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isCompanyProfileUpdated: boolean = false;
    //variable to hold sub tab value inside any tab e.g. integration -> payment
    public selectedChildTab: number = 0;
    public activeTab: string = 'taxes';
    public integrationtab: string;

    public get shortcutEnabled() {
        return document.activeElement === document.body;
    }

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public asideSettingMenuState: string = 'out';

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private _permissionDataService: PermissionDataService,
        public _route: ActivatedRoute,
        private router: Router,
        private _authenticationService: AuthenticationService,
        private _toast: ToasterService,
        private _generalActions: GeneralActions,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private warehouseActions: WarehouseActions,
        private http: HttpClient
    ) {
        this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
        this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));
        this.isCompanyProfileUpdated = false;
    }

    public ngOnInit() {
        this.toggleSettingPane();

        this._route.params.subscribe(params => {
            if (params['type'] && this.activeTab !== params['type'] && params['referrer']) {
                this.setStateDetails(params['type'], params['referrer']);
                if (params['type'] === 'integration' && params['referrer']) {
                    this.selectedChildTab = this.assignChildtabForIntegration(params['referrer']);
                }
                this.integrationtab = params['referrer'];
                this.activeTab = params['type'];
            } else if (params['type'] && this.activeTab !== params['type']) {
                this.setStateDetails(params['type'], params['referrer']);
                this.selectedChildTab = 0;
                this.integrationtab = '';
                this.activeTab = params['type'];
            }
        });

        this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.tab === 'integration' && val.code) {
                this.saveGmailAuthCode(val.code);
                this.activeTab = val.tab;
            }
        });

        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            if (yes) {
                this.isCompanyProfileUpdated = true;
            }
        });
    }

    /**
     * Selects next tab on `TAB` key Press and previous tab on `SHIFT+TAB` key press.
     * @param key Key that was pressed.
     */
    public selectTabByShortcut(key: string) {
        const selectedId = this.staticTabs.tabs.findIndex(p => p.active);
        if (key === 'alt+right' && selectedId < this.staticTabs.tabs.length) {
            this.staticTabs.tabs[selectedId + 1].active = true;
        } else if (selectedId > 0) {
            this.staticTabs.tabs[selectedId - 1].active = true;
        }
    }

    public selectTab(id: number) {
        this.staticTabs.tabs[id].active = true;
    }

    public assignChildtabForIntegration(childTab: string): number {
        switch (childTab) {
            case 'payment':
                return 4;
            case 'email':
                return 1;
            default:
                return 0;
        }
    }

    public disableEnable() {
        this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled;
    }

    public profileSelected(e) {
        if (e.heading === 'Profile') {
            this.profileComponent.getInitialProfileData();
            this.profileComponent.getInventorySettingData();
        }
    }

    public integrationSelected(e) {
        if (e.heading === 'Integration') {
            this.integrationComponent.getInitialData();
        }
    }

    public financialYearSelected(e) {
        this.financialYearComp.getInitialFinancialYearData();
    }

    public linkedAccountSelected(e) {
        this.eBankComp.getInitialEbankInfo();
    }

    public permissionTabSelected(e) {
        this.permissionComp.getInitialData();
    }

    public tagsTabSelected(e) {
        if (e.heading === 'Tags') {
            this.tagComp.getTags();
        }
    }

    public bunchTabSelected(e) {
        if (e.heading === 'bunch') {
            this.bunchComp.getAllBunch();
        }
    }

    public tabChanged(tab: string) {
        if (tab === 'integration') {
            this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab + '/' + this.integrationtab));
            this.loadModuleData(tab);
            if (this.integrationtab) {
                this.router.navigate(['pages/settings/', tab, this.integrationtab], {replaceUrl: true});
            }
        } else {
            this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab));
            this.loadModuleData(tab);
            this.router.navigate(['pages/settings/', tab], {replaceUrl: true});
        }
    }

    private saveGmailAuthCode(authCode: string) {
        const getAccessTokenData = {
            code: authCode,
            client_secret: this.getGoogleCredentials().GOOGLE_CLIENT_SECRET,
            client_id: this.getGoogleCredentials().GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl(AppUrl)
        };

        let options = { headers: {} };
        options.headers['Accept'] = 'application/json';
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        options.headers = {} as any;

        this.http.post("https://accounts.google.com/o/oauth2/token", getAccessTokenData, options).subscribe((p: any) => {
            const dataToSave = {
                "access_token": p.access_token,
                "expires_in": p.expires_in,
                "refresh_token": p.refresh_token
            };
            this._authenticationService.saveGmailToken(dataToSave).subscribe((res) => {

                if (res.status === 'success') {
                    this._toast.successToast('Gmail account added successfully.', 'Success');
                } else {
                    this._toast.errorToast(res.message, res.code);
                }
                this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
            });
        })
    }

    private getRedirectUrl(baseHref: string) {
        return `${baseHref}pages/settings?tab=integration`;
    }

    private getGoogleCredentials() {
        if (PRODUCTION_ENV || isElectron || isCordova) {
            return {
                GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: 'eWzLFEb_T9VrzFjgE40Bz6_l'
            };
        } else {
            return {
                GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: '8htr7iQVXfZp_n87c99-jm7a'
            };
        }
    }

    private setStateDetails(type, referer?: string) {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        if (referer) {
            stateDetailsRequest.lastState = 'pages/settings/' + type + '/' + referer;
        } else {
            stateDetailsRequest.lastState = 'pages/settings/' + type;
        }

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
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

    public toggleSettingPane(event?) {
        if (event) {
            event.preventDefault();
        }
        this.asideSettingMenuState = this.asideSettingMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.asideSettingMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
}
