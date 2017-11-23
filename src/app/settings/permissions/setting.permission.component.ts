import { AccountsAction } from './../../services/actions/accounts.actions';
import { PermissionActions } from './../../services/actions/permission/permission.action';
import { SettingsPermissionActions } from './../../services/actions/settings/permissions/settings.permissions.action';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, trigger, transition, style, animate, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CompanyService } from '../../services/companyService.service';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { ToasterService } from '../../services/toaster.service';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { digitsOnly } from '../../shared/helpers/customValidationHelper';
import isCidr from 'is-cidr';
import { ShareRequestForm, ISharedWithResponseForUI } from '../../models/api-models/Permission';
import { ModalDirective } from 'ngx-bootstrap';
import { PermissionService } from '../../services/permission.service';

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
  public allRoles = [
    { name: 'Admin', uniqueName: 'admin' },
    { name: 'View only', uniqueName: 'view_only' },
    { name: 'Super Admin', uniqueName: 'super_admin' },
    { name: 'Edit', uniqueName: 'edit' }
  ];

  // modals related
  public showEditUserModal: boolean = false;
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _settingsPermissionActions: SettingsPermissionActions,
    private _permissionActions: PermissionActions,
    private _accountsAction: AccountsAction,
    private store: Store<AppState>,
    private _fb: FormBuilder,
    private _toasty: ToasterService,
    private _permissionService: PermissionService
  ) {}

  public ngOnInit() {

    this.store.select(s => s.settings.usersWithCompanyPermissions).takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        let data = _.cloneDeep(s);
        let sortedArr = _.groupBy(this.prepareDataForUI(data), 'userUniqueName');
        let arr = [];
        _.forIn(sortedArr, (value, key) => {
          arr.push({ name: key, rows: value });
        });
        this.usersList = _.sortBy(arr, ['name']);
      }
    });

    this.store.take(1).subscribe(s => {
      this.selectedCompanyUniqueName = s.session.companyUniqueName;
      this.store.dispatch(this._settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
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

  public onRevokePermission(email: string, roleUniquename: string) {
    if (email && roleUniquename && this.selectedCompanyUniqueName) {
      let obj = { emailId: email, entity: 'company', entityUniqueName: this.selectedCompanyUniqueName};
      this.store.dispatch(this._accountsAction.unShareEntity(obj, roleUniquename));
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

  public shareCurrentCompany(user: string, role: string) {
    this._permissionService.ShareCompany({role, user}).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this._permissionService.GetCompanySharedWith().subscribe(sharedWith => {
          if (sharedWith.status === 'success') {
            let sharedWithData = _.cloneDeep(sharedWith.body);
            let sortedArr = _.groupBy(this.prepareDataForUI(sharedWithData), 'userUniqueName');
            let arr = [];
            _.forIn(sortedArr, (value, key) => {
              arr.push({ name: key, rows: value });
            });
            this.usersList = _.sortBy(arr, ['name']);
          }
        });
        this._toasty.clearAllToaster();
        this._toasty.successToast(data.body);
      } else {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message);
      }
    });
  }

  public unShareCurrentCompany(user) {
    this._permissionService.UnShareCompany({user}).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this._permissionService.GetCompanySharedWith().subscribe(sharedWith => {
          if (sharedWith.status === 'success') {
            let sharedWithData = _.cloneDeep(sharedWith.body);
            let sortedArr = _.groupBy(this.prepareDataForUI(sharedWithData), 'userUniqueName');
            let arr = [];
            _.forIn(sortedArr, (value, key) => {
              arr.push({ name: key, rows: value });
            });
            this.usersList = _.sortBy(arr, ['name']);
          }
        });
        this._toasty.clearAllToaster();
        this._toasty.successToast(data.body);
      } else {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message);
      }
    });
  }

}
