import { AccountsAction } from './../../services/actions/accounts.actions';
import { PermissionActions } from './../../services/actions/permission/permission.action';
import { SettingsPermissionActions } from './../../services/actions/settings/permissions/settings.permissions.action';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, trigger, transition, style, animate } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CompanyService } from '../../services/companyService.service';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'setting-permission',
  templateUrl: './setting.permission.component.html',
})
export class SettingPermissionComponent implements OnInit, OnDestroy {
  public sharedWith: object[] = [];
  public allRoles: object[] = [];
  public selectedCompanyUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _settingsPermissionActions: SettingsPermissionActions, private _permissionActions: PermissionActions, private _accountsAction: AccountsAction, private store: Store<AppState>) {}

  public ngOnInit() {
    this.store.dispatch(this._permissionActions.GetRoles());

    this.store.select(s => s.settings.usersWithCompanyPermissions).takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        let data = _.cloneDeep(s);
          let sharedWithArray = [];
          data.forEach((d) => {
            sharedWithArray.push({
              name: d.userName,
              uniqueName: d.userUniqueName,
              email: d.userEmail,
              roleUniquename: d.role.uniqueName
            });
          });

          this.sharedWith = _.cloneDeep(sharedWithArray);
      }
    });

    this.store.select(s => s.permission).takeUntil(this.destroyed$).subscribe(p => {
      if (p && p.roles) {
        let roles = _.cloneDeep(p.roles);
        let allRoleArray = [];
        roles.forEach((role) => {
          allRoleArray.push({
            name: role.name,
            uniqueName: role.uniqueName
          });
        });
        this.allRoles = _.cloneDeep(allRoleArray);
      }
    });

    this.store.take(1).subscribe(s => {
      this.selectedCompanyUniqueName = s.session.companyUniqueName;
      this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
    });

  }

  public onShareCompany(email: string, roleUniquename: string) {
    if (email && roleUniquename && this.selectedCompanyUniqueName) {
      let obj = { emailId: email, entity: 'company', entityUniqueName: this.selectedCompanyUniqueName};
      this.store.dispatch(this._accountsAction.shareEntity(obj, roleUniquename));
      this.waitAndReloadCompany();
    }
  }

  public onRevokePermission(email: string, roleUniquename: string) {
    if (email && roleUniquename && this.selectedCompanyUniqueName) {
      let obj = { emailId: email, entity: 'company', entityUniqueName: this.selectedCompanyUniqueName};
      this.store.dispatch(this._accountsAction.unShareEntity(obj, roleUniquename));
      this.waitAndReloadCompany();
    }
  }

  public waitAndReloadCompany() {
    setTimeout(() => {
      this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
    }, 2000);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
