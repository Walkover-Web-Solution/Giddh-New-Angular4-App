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
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { BunchComponent } from './bunch/bunch.component';
import { AuthenticationService } from '../services/authentication.service';

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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    private settingsProfileActions: SettingsProfileActions,
    private _permissionDataService: PermissionDataService,
    public _route: ActivatedRoute,
    private router: Router,
    private _authenticationService: AuthenticationService,
  ) {
      this.isUserSuperAdmin = this._permissionDataService.isUserSuperAdmin;
    }
  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'settings';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    // this.selectTab(0);
    this._route.queryParams.takeUntil(this.destroyed$).subscribe((val) => {
      if (val && val.tab && val.tabIndex) {
        this.selectTab(val.tabIndex);
      } else if (val.tab === 'integration' && val.code) {
        this.saveGmailAuthCode(val.code);
        // this.selectTab(1);
      }
    });
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

  public bunchTabSelected(e) {
    if (e.heading === 'bunch') {
      this.bunchComp.getAllBunch();
    }
  }

  private saveGmailAuthCode(authCode: string) {
    const dataToSave = {
      code: authCode,
      client_secret: 'C97c9WiBRHL6GyOwj9GkY5He',
      client_id: '578717103927-mvjk3kbi9cgfa53t97m8uaqosa0mf9tt.apps.googleusercontent.com',
      grant_type: 'authorization_code',
      redirect_uri: this.getRedirectUrl(AppUrl)
    };
    this._authenticationService.saveGmailAuthCode(dataToSave).subscribe((res) => {
      this.router.navigateByUrl('/pages/settings?tab=integration&tabIndex=1');

      console.log('the response form saveGmailAuthCode is :', res);
    });
  }

  private getRedirectUrl(baseHref: string) {
    if (baseHref.indexOf('dev.giddh.com') > -1) {
      return 'http://dev.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('test.giddh.com') > -1) {
      return 'http://test.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('test.giddh.com') > -1) {
      return 'http://stage.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('localapp.giddh.com') > -1) {
      return 'http://localapp.giddh.com:3000/pages/settings?tab=integration';
    } else {
      return 'https://giddh.com/app/pages/settings?tab=integration';
    }
  }

}
