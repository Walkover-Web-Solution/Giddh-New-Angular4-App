import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import * as _ from 'apps/web-giddh/src/app/lodash-optimized';
import * as isCidr from 'is-cidr';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ShareRequestForm } from '../../../models/api-models/Permission';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { AccountsAction } from '../../../actions/accounts.actions';
import { SettingsPermissionService } from '../../../services/settings.permission.service';
import * as moment from 'moment';
import { GeneralService } from '../../../services/general.service';
import { IForceClear } from '../../../models/api-models/Sales';
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
    /** True if this component is opened in modal, required
     * as the radio button doesn't work in ngx-bootstrap modal
     */
    @Input() public isOpenedInModal: boolean;
    @Output() public onSubmitForm: EventEmitter<any> = new EventEmitter(null);

    public showTimeSpan: boolean = false;
    public showIPWrap: boolean = false;
    public permissionForm: FormGroup;
    public allRoles: object[] = [];
    public selectedTimeSpan: string = 'Date Range';
    // Selected Type of IP range
    public selectedIPRange: string = 'CIDR Range';
    public createPermissionInProcess$: Observable<boolean>;
    public dateRangePickerValue: Date[] = [];
    /** Default range format */
    public dateRangeConfig = { rangeInputFormat: GIDDH_DATE_FORMAT };
    /** To open model */
    public opened = false;
    /** To show model */
    public show: boolean = false;
    // observable to observe create new permission is successfull
    public createPermissionSuccess$: Observable<boolean>;
    // observable to clear role permission dropdown
    public permissionRoleClear$: Observable<IForceClear> = observableOf({ status: false });
    /** To check active company role */
    public isSuperAdminCompany: boolean = false;
    // private methods
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _settingsPermissionService: SettingsPermissionService,
        private _permissionActions: PermissionActions,
        private _accountsAction: AccountsAction,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _fb: FormBuilder,
        private generalService: GeneralService
    ) {
        this.createPermissionInProcess$ = this.store.pipe(select(permissionStore => permissionStore.permission.createPermissionInProcess),takeUntil(this.destroyed$));
        this.createPermissionSuccess$ = this.store.pipe(select(permissionStore => permissionStore.permission.createPermissionSuccess),takeUntil(this.destroyed$));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        this._accountsAction.resetShareEntity();

        if (this.userdata) {
            if (this.userdata.from && this.userdata.to) {
                let from: any = moment(this.userdata.from, GIDDH_DATE_FORMAT);
                let to: any = moment(this.userdata.to, GIDDH_DATE_FORMAT);
                setTimeout(() => {
                    // Set timeout is used because ngx datepicker doesn't take the
                    // format provided in bsConfig if bsValue is set in ngOnInit
                    this.dateRangePickerValue = [from._d, to._d];
                }, 0);
            }
            this.initAcForm(this.userdata);
        } else {
            this.initAcForm();
        }
        // reset form
        this.createPermissionSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            if (value && !this.isOpenedInModal) {
                this.permissionForm.reset();
                this.initAcForm();
            }
        });

        // get roles
        this.store.select(s => s.permission).pipe(takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.roles) {
                let roles = _.cloneDeep(p.roles);
                let allRoleArray = [];
                roles.forEach((role) => {
                    allRoleArray.push({
                        label: role.name,
                        value: role.uniqueName
                    });
                });
                this.allRoles = _.cloneDeep(allRoleArray);
            } else {
                this.store.dispatch(this._permissionActions.GetRoles());
            }
        });

        this.store.pipe(select(state => state.session.companies), take(1)).subscribe(companies => {
            companies = companies || [];
            let activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
            if (activeCompany && activeCompany.userEntityRoles && activeCompany.userEntityRoles.length && activeCompany.userEntityRoles[0] && activeCompany.userEntityRoles[0].role && activeCompany.userEntityRoles[0].role.uniqueName === 'super_admin') {
                this.isSuperAdminCompany = true;
            } else {
                this.isSuperAdminCompany = false;
            }
        });

        // utitlity
        this.permissionForm.get('periodOptions').valueChanges.pipe(debounceTime(100)).subscribe(val => {
            this.togglePeriodOptionsVal(val);
        });

        this.permissionForm.get('ipOptions').valueChanges.subscribe(val => {
            this.toggleIpOptVal(val);
        });
    }

    public toggleIpOptVal(val: string) {
        if (val === IP_ADDR) {
            this.selectedIPRange = 'IP Address';
        } else if (val === CIDR_RANGE) {
            this.selectedIPRange = 'CIDR Range';
        }
    }

    public onSelectDateRange(ev) {
        if (ev && ev.length) {
            let from = moment(ev[0]).format(GIDDH_DATE_FORMAT);
            let to = moment(ev[1]).format(GIDDH_DATE_FORMAT);
            this.permissionForm.patchValue({ from, to });
        }
    }

    public togglePeriodOptionsVal(val: string) {
        if (val === DATE_RANGE) {
            this.selectedTimeSpan = 'Date Range';
        } else if (val === PAST_PERIOD) {
            this.selectedTimeSpan = 'Past Period';
            this.dateRangePickerValue = [];
            if (this.permissionForm) {
                this.permissionForm.patchValue({ from: null, to: null });
            }
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
                uniqueName: [data.uniqueName],
                emailId: [data.emailId, Validators.compose([Validators.required, Validators.maxLength(150)])],
                entity: ['company'],
                roleUniqueName: [data.roleUniqueName, [Validators.required]],
                periodOptions: this.getPeriodFromData(data),
                from: [data.from],
                to: [data.to],
                duration: [data.duration],
                period: [null],
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
            } else {
                allowedIps.push(this.initRangeForm());
            }

            if (data.allowedCidrs.length > 0) {
                _.forEach(data.allowedCidrs, (val) => {
                    allowedCidrs.push(this.initRangeForm(val));
                });
            } else {
                allowedCidrs.push(this.initRangeForm());
            }

        } else {
            this.permissionForm = this._fb.group({
                emailId: [null, Validators.compose([Validators.required, Validators.maxLength(150)])],
                entity: ['company'],
                roleUniqueName: ['admin', [Validators.required]],
                periodOptions: [DATE_RANGE],
                from: [null],
                to: [null],
                duration: [null],
                period: [null],
                ipOptions: [CIDR_RANGE],
                allowedIps: this._fb.array([]),
                allowedCidrs: this._fb.array([])
            });
            let allowedIps = this.permissionForm.get('allowedIps') as FormArray;
            let allowedCidrs = this.permissionForm.get('allowedCidrs') as FormArray;
            allowedCidrs.push(this.initRangeForm());
            allowedIps.push(this.initRangeForm());
            this.selectedTimeSpan = 'Date Range';
            this.selectedIPRange = 'CIDR Range';
            this.permissionRoleClear$ = observableOf({ status: true });
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
        } else {
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

        if (this.selectedTimeSpan === 'Past Period') {
            if (form.duration) {
                form.period = 'day';
            } else {
                form.period = null;
            }
            form.from = null;
            form.to = null;
        } else {
            form.period = null;
            form.duration = null;
        }

        obj.action = (this.isUpdtCase) ? 'update' : 'create';
        this.dateRangePickerValue = [];
        obj.data = form;
        if (obj.action === 'create') {
            this.store.dispatch(this._accountsAction.shareEntity(form, form.roleUniqueName));
            this.onSubmitForm.emit(obj);
        } else if (obj.action === 'update') {
            if ((obj.data.from && obj.data.from) === 'Invalid date' || (obj.data.to && obj.data.to) === 'Invalid date') {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this._settingsPermissionService.UpdatePermission(form).subscribe((res) => {
                if (res.status === 'success') {
                    this._toasty.successToast('Permission Updated Successfully!');
                } else {
                    this._toasty.warningToast(res.message, res.code);
                }
                this.onSubmitForm.emit(obj);
            });
        }
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

    /**
     * This is to allow only digits and dot
     *
     * @param {*} event
     * @returns {boolean}
     * @memberof SettingPermissionFormComponent
     */
    public allowOnlyNumbersAndDot(event: any): boolean {
        return this.generalService.allowOnlyNumbersAndDot(event);
    }

    /**
     * Handler for IP address change, required for manually changing
     * the radio button value in modal as radio button doesn't work in
     * ngx-bootstrap modal
     *
     * @param {string} value Current selected value of radio button
     * @memberof SettingPermissionFormComponent
     */
    public handleIpAddressChange(value: string): void {
        this.permissionForm.get('ipOptions').patchValue(value, { onlySelf: true });
    }

    /**
     * Handler for Time span change, required for manually changing
     * the radio button value in modal as radio button doesn't work in
     * ngx-bootstrap modal
     *
     * @param {string} value Current selected value of radio button
     * @memberof SettingPermissionFormComponent
     */
    public handleTimeSpanChange(value: string): void {
        this.permissionForm.get('periodOptions').patchValue(value, { onlySelf: true });
    }
}
