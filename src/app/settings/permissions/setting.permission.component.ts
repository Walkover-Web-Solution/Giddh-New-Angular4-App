import { GeneralService } from './../../services/general.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { PermissionActions } from '../../actions/permission/permission.action';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, trigger, transition, style, animate, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CompanyService } from '../../services/companyService.service';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../services/toaster.service';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { digitsOnly } from '../../shared/helpers/customValidationHelper';
import isCidr from 'is-cidr';
import { ShareRequestForm, ISharedWithResponseForUI } from '../../models/api-models/Permission';
import { ModalDirective } from 'ngx-bootstrap';
import { forIn } from 'app/lodash-optimized';

@Component({
  selector: 'setting-permission',
  templateUrl: './setting.permission.component.html'
})
export class SettingPermissionComponent implements OnInit, OnDestroy {

  @ViewChild('editUserModal') public editUserModal: ModalDirective;

  public sharedWith: object[] = [];
  public usersList: any;
  public selectedCompanyUniqueName: string;
  public selectedUser: ShareRequestForm;
  public currentUser: any;

  // modals related
  public showEditUserModal: boolean = false;
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  private loggedInUserEmail: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _settingsPermissionActions: SettingsPermissionActions,
    private _permissionActions: PermissionActions,
    private _accountsAction: AccountsAction,
    private store: Store<AppState>,
    private _fb: FormBuilder,
    private _toasty: ToasterService,
    private _generalService: GeneralService
  ) {
    this.loggedInUserEmail = this._generalService.user.email;
  }

  public ngOnInit() {
    this.store.select(s => s.settings.usersWithCompanyPermissions).takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        let data = _.cloneDeep(s);
        let sortedArr = _.groupBy(this.prepareDataForUI(data), 'emailId');
        let arr = [];
        forIn(sortedArr, (value, key) => {
          if (value[0].emailId === this.loggedInUserEmail) {
            value[0].isLoggedInUser = true;
          }
          arr.push({ name: value[0].userName, rows: value });
        });
        this.usersList = _.sortBy(arr, ['name']);
      }
    });

  }

  public getInitialData() {
    this.store.dispatch(this._permissionActions.GetRoles());
    this.store.take(1).subscribe(s => {
      this.selectedCompanyUniqueName = s.session.companyUniqueName;
      this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
      if (s.session.user) {
        this.currentUser = s.session.user.user;
      }
    });
  }

  public prepareDataForUI(data: ShareRequestForm[]) {
    return data.map((o) => {
      if (o.allowedCidrs && o.allowedCidrs.length > 0) {
        o.cidrsStr = o.allowedCidrs.toString();
      }else {
        o.cidrsStr = null;
      }
      if (o.allowedIps && o.allowedIps.length > 0) {
        o.ipsStr = o.allowedIps.toString();
      }else {
        o.ipsStr = null;
      }
      return o;
    });
  }

  public submitPermissionForm(e: {action: string, data: ShareRequestForm}) {
    if (e.action === 'update') {
      this.closeEditUserModal();
    }
    this.waitAndReloadCompany();
  }

  public onRevokePermission(assignRoleEntryUniqueName: string) {
    if (assignRoleEntryUniqueName) {
      this.store.dispatch(this._accountsAction.unShareEntity(assignRoleEntryUniqueName, 'company', this.selectedCompanyUniqueName));
      this.waitAndReloadCompany();
    }
  }

  public showModalForEdit(user: any) {
    this.selectedUser = user;
    this.showEditUserModal = true;
    setTimeout(() => this.editUserModal.show(), 700);
  }

  public closeEditUserModal() {
    this.editUserModal.hide();
    setTimeout(() => this.showEditUserModal = false, 700);
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
