import * as _ from 'lodash';
import isCidr from 'is-cidr';
import { Component, OnInit, OnDestroy, trigger, transition, style, animate, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ShareRequestForm } from '../../../models/api-models/Permission';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionActions } from '../../../services/actions/permission/permission.action';
import { AccountsAction } from '../../../services/actions/accounts.actions';

// some local const
const DATE_RANGE = 'daterange';
const PAST_PERIOD = 'pastperiod';
const IP_ADDR = 'ip_address';
const CIDR_RANGE = 'cidr_range';

@Component({
  selector: 'setting-permission-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SettingPermissionFormComponent implements OnInit, OnDestroy {

  @Input() public userdata: ShareRequestForm;
  @Input() public isHorizntl: boolean;
  @Input() public isUpdtCase: boolean;
  @Input() public isLblShow: boolean;
  @Output() public onSubmitForm: EventEmitter<any> = new EventEmitter(null);

  public showTimeSpan: boolean = false;
  public showIPWrap: boolean = false;
  public permissionForm: FormGroup;
  public allRoles: object[] = [];
  public selectedTimeSpan: string = 'Date Range';
  public selectedIPRange: string = 'IP Address';
  public createPermissionInProcess$: Observable<boolean>;
  // private methods
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _permissionActions: PermissionActions,
    private _accountsAction: AccountsAction,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _fb: FormBuilder
  ) {
    this.createPermissionInProcess$ = this.store.select(p => p.permission.createPermissionInProcess).takeUntil(this.destroyed$);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnInit() {
    if (this.userdata) {
      this.initAcForm(this.userdata);
    }else {
      this.initAcForm();
    }
    // reset form
    this.createPermissionInProcess$.takeUntil(this.destroyed$).subscribe((val) => {
      if (val) {
        this.permissionForm.reset();
        this.initAcForm();
      }
    });

    // get roles
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
      }else {
        this.store.dispatch(this._permissionActions.GetRoles());
      }
    });

    // utitlity
    this.permissionForm.get('periodOptions').valueChanges.subscribe( val => {
      this.togglePeriodOptionsVal(val);
    });

    this.permissionForm.get('ipOptions').valueChanges.subscribe( val => {
      this.toggleIpOptVal(val);
    });
  }

  public toggleIpOptVal(val: string) {
    if (val === IP_ADDR) {
      this.selectedIPRange = 'IP Address';
    }else if (val === CIDR_RANGE) {
      this.selectedIPRange = 'CIDR Range';
    }
  }

  public togglePeriodOptionsVal(val: string) {
    if (val === DATE_RANGE) {
      this.selectedTimeSpan = 'Date Range';
    }else if (val === PAST_PERIOD) {
      this.selectedTimeSpan = 'Past Period';
    }
  }

  public getPeriodFromData(data: ShareRequestForm) {
    if (data.from && data.to) {
      this.togglePeriodOptionsVal(DATE_RANGE);
      return [DATE_RANGE];
    }
    if (data.duration && data.period) {
      this.togglePeriodOptionsVal(PAST_PERIOD);
      return [PAST_PERIOD];
    }
    return [DATE_RANGE];
  }

  public getIPOptsFromData(data: ShareRequestForm) {
    if (data.allowedIps.length > 0) {
      this.toggleIpOptVal(IP_ADDR);
      return [IP_ADDR];
    }
    if (data.allowedCidrs.length > 0) {
      this.toggleIpOptVal(CIDR_RANGE);
      return [CIDR_RANGE];
    }
    return [IP_ADDR];
  }

  public initAcForm(data?: ShareRequestForm): void {
    if (data) {
      this.permissionForm = this._fb.group({
        emailId: [data.emailId, Validators.compose([Validators.required, Validators.maxLength(150)])],
        entity: ['company'],
        roleUniqueName: [data.roleUniqueName, [Validators.required]],
        periodOptions: this.getPeriodFromData(data),
        from: [data.from],
        to: [data.to],
        duration: [data.duration],
        period: [data.period],
        ipOptions: this.getIPOptsFromData(data),
        allowedIps: this._fb.array([]),
        allowedCidrs: this._fb.array([])
      });
      let allowedIps = this.permissionForm.get('allowedIps') as FormArray;
      let allowedCidrs = this.permissionForm.get('allowedCidrs') as FormArray;

      if (data.allowedIps.length > 0) {
        _.forEach(data.allowedIps, (val) => {
          allowedIps.push(this.initRangeForm(val));
        });
      }else {
        allowedIps.push(this.initRangeForm());
      }

      if (data.allowedCidrs.length > 0) {
        _.forEach(data.allowedCidrs, (val) => {
          allowedCidrs.push(this.initRangeForm(val));
        });
      }else {
        allowedCidrs.push(this.initRangeForm());
      }

    }else {
      this.permissionForm = this._fb.group({
        emailId: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
        entity: ['company'],
        roleUniqueName: ['admin', [Validators.required]],
        periodOptions: [DATE_RANGE],
        from: [null],
        to: [null],
        duration: [null],
        period: ['DAY'],
        ipOptions: [CIDR_RANGE],
        allowedIps: this._fb.array([]),
        allowedCidrs: this._fb.array([])
      });
      let allowedIps = this.permissionForm.get('allowedIps') as FormArray;
      let allowedCidrs = this.permissionForm.get('allowedCidrs') as FormArray;
      allowedCidrs.push(this.initRangeForm());
      allowedIps.push(this.initRangeForm());
    }
  }

  public initRangeForm(val?: any): FormGroup {
    return this._fb.group({
      range: (val) ? [val] : [null]
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
    let obj: any = {};
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
    if (CidrArr.length > 0) {
      IpArr = [];
    }
    if (IpArr.length > 0) {
      CidrArr = [];
    }
    form.allowedCidrs = CidrArr;
    form.allowedIps = IpArr;

    obj.action = (this.isUpdtCase) ? 'update' : 'create';
    obj.data = form;
    if (obj.action === 'create') {
      this.store.dispatch(this._accountsAction.shareEntity(form, form.roleUniqueName));
    }else if (obj.action === 'update') {
      //
    }
    this.onSubmitForm.emit(obj);
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
}
