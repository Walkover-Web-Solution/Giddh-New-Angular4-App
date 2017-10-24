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
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { digitsOnly } from '../../shared/helpers/customValidationHelper';
import isCidr from 'is-cidr';
import { ShareRequestForm } from '../../models/api-models/Permission';

@Component({
  selector: 'setting-permission',
  templateUrl: './setting.permission.component.html',
  styleUrls: ['./settings.permission.scss']
})
export class SettingPermissionComponent implements OnInit, OnDestroy {

  public permissionForm: FormGroup;
  public sharedWith: object[] = [];
  public allRoles: object[] = [];
  public selectedCompanyUniqueName: string;
  public showTimeSpan: boolean = false;
  public showIPWrap: boolean = false;
  public createPermissionInProcess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _settingsPermissionActions: SettingsPermissionActions,
    private _permissionActions: PermissionActions,
    private _accountsAction: AccountsAction,
    private store: Store<AppState>,
    private _fb: FormBuilder,
    private _toasty: ToasterService
  ) {
    this.initAcForm();
    this.createPermissionInProcess$ = this.store.select(p => p.permission.createPermissionInProcess).takeUntil(this.destroyed$);
  }

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

    this.createPermissionInProcess$.takeUntil(this.destroyed$).subscribe((val) => {
      if (val) {
        this.permissionForm.reset();
        this.initAcForm();
      }
    });

  }

  public initAcForm(): void {
    this.permissionForm = this._fb.group({
      emailId: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
      entity: ['company'],
      entityUniqueName: ['admin', [Validators.required]],
      periodOptions: ['daterange'],
      from: [null],
      to: [null],
      duration: [null],
      period: [null],
      ipOptions: ['cidr_range'],
      allowedIps: this._fb.array([]),
      allowedCidrs: this._fb.array([])
    });
    let allowedIps = this.permissionForm.get('allowedIps') as FormArray;
    let allowedCidrs = this.permissionForm.get('allowedCidrs') as FormArray;
    allowedCidrs.push(this.initRangeForm());
    allowedIps.push(this.initRangeForm());
  }

  public initRangeForm(): FormGroup {
    return this._fb.group({
      range: [null]
    });
  }

  public validateIPaddress(ipaddress: string) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return true;
    }
    return false;
  }

  public addNewRow(type: string, item: any, e: any) {
    e.stopPropagation();
    let errFound: boolean = false;
    let msg: string;
    let arow = this.permissionForm.get(type) as FormArray;
    for (let control of arow.controls) {
      let val = control.get('range').value;
      if (_.isNull(val) || _.isEmpty(val)) {
        errFound = true;
        msg = undefined;
      }
      // match with regex
      if (type === 'allowedIps') {
        if (!this.validateIPaddress(val)) {
          errFound = true;
          msg = 'Invalid IP Address';
        }
      }
      // match cidr
      if (type === 'allowedCidrs') {
        if (!isCidr(val)) {
          errFound = true;
          msg = 'Invalid CIDR Range';
        }
      }
    }
    if (errFound) {
      this._toasty.warningToast(msg || 'Field Cannot be empty');
    }else {
      arow.push(this.initRangeForm());
    }
  }

  public delRow(type: string, i: number, e: any) {
    e.stopPropagation();
    const arow = this.permissionForm.get(type) as FormArray;
    arow.removeAt(i);
  }

  public submitPermissionForm() {
    let form: ShareRequestForm = _.cloneDeep(this.permissionForm.value);
    let CidrArr = [];
    let IpArr = [];
    _.forEach(form.allowedCidrs, (n) => {
      if (n.range) {
        CidrArr.push(n.range);
      }
    });

    _.forEach(form.allowedIps, (n) => {
      if (n.range) {
        IpArr.push(n.range);
      }
    });
    form.allowedCidrs = CidrArr;
    form.allowedIps = IpArr;
    this.store.dispatch(this._accountsAction.shareEntity(form, form.entityUniqueName));
    this.waitAndReloadCompany();
  }

  public methodForToggleSection(id: string) {
    if (id === 'timeSpanSection') {
      if (this.showTimeSpan) {
        this.showTimeSpan = false;
      }
    }
    if (id === 'rangeSpanSection') {
      if (this.showIPWrap) {
        this.showIPWrap = false;
      }
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
