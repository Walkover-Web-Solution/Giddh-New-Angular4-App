import { take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { PermissionDataService } from 'apps/web-giddh/src/app/permissions/permission-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { SettingsTagsComponent } from './tags/tags.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BunchComponent } from './bunch/bunch.component';
import { AuthenticationService } from '../services/authentication.service';
import { GeneralActions } from '../actions/general/general.actions';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { WarehouseActions } from './warehouse/action/warehouse.action';

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
    public selectedChildTab: number;
    public activeTab: string;

    public get shortcutEnabled() {
        return document.activeElement === document.body;
    }

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private _permissionDataService: PermissionDataService,
        public _route: ActivatedRoute,
        private router: Router,
        private _authenticationService: AuthenticationService,
        private _toast: ToasterService,
        private _generalActions: GeneralActions,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private warehouseActions: WarehouseActions
    ) {
        this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
        this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));
        this.isCompanyProfileUpdated = false;
    }

    public ngOnInit() {

        this._route.params.subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                // if active tab is null or undefined then it means component initialized for the first time
                if (!this.activeTab) {
                    this.setStateDetails(params['type']);
                }
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
        this.setStateDetails(tab);
        this.store.dispatch(this._generalActions.setAppTitle('/pages/settings/' + tab));
        this.loadModuleData(tab);
        this.router.navigate(['pages/settings/', tab], { replaceUrl: true });
    }

    private saveGmailAuthCode(authCode: string) {
        const dataToSave = {
            code: authCode,
            client_secret: this.getGoogleCredentials(AppUrl).GOOGLE_CLIENT_SECRET,
            client_id: this.getGoogleCredentials(AppUrl).GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl(AppUrl)
        };
        this._authenticationService.saveGmailAuthCode(dataToSave).subscribe((res) => {

            if (res.status === 'success') {
                this._toast.successToast('Gmail account added successfully.', 'Success');
            } else {
                this._toast.errorToast(res.message, res.code);
            }
            this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());

            // this.router.navigateByUrl('/pages/settings?tab=integration&tabIndex=1');
        });
    }

    private getRedirectUrl(baseHref: string) {
        if (baseHref.indexOf('dev.giddh.com') > -1) {
            return 'http://dev.giddh.com/app/pages/settings?tab=integration';
        } else if (baseHref.indexOf('test.giddh.com') > -1) {
            return 'http://test.giddh.com/app/pages/settings?tab=integration';
        } else if (baseHref.indexOf('stage.giddh.com') > -1) {
            return 'http://stage.giddh.com/app/pages/settings?tab=integration';
        } else if (baseHref.indexOf('localapp.giddh.com') > -1) {
            return 'http://localapp.giddh.com:3000/pages/settings?tab=integration';
        } else {
            return 'https://giddh.com/app/pages/settings?tab=integration';
        }
    }

    private getGoogleCredentials(baseHref: string) {
        if (baseHref === 'https://giddh.com/' || isElectron) {
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

    private setStateDetails(type) {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'pages/settings/' + type;

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
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses());
        }
    }
}
