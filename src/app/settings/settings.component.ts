import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { PermissionDataService } from 'app/permissions/permission-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { SettingsTagsComponent } from './tags/tags.component';

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

  public isUserSuperAdmin: boolean = false;

  constructor(
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    private settingsProfileActions: SettingsProfileActions,
    private _permissionDataService: PermissionDataService) {
      this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
    }
  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'settings';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    this.selectTab(0);
  }

  public selectTab(id: number) {
    this.staticTabs.tabs[id].active = true;
  }
  public disableEnable() {
    this.staticTabs.tabs[2].disabled = ! this.staticTabs.tabs[2].disabled;
  }
  public profileSelected(e) {
    if (e.heading === 'Profile') {
      this.profileComponent.getInitialProfileData();
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
}
