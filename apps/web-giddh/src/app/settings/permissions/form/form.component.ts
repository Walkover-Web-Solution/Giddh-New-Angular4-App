import { debounceTime, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD } from './../../../shared/helpers/defaultDateFormat';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ShareRequestForm } from '../../../models/api-models/Permission';
import { ToasterService } from '../../../services/toaster.service';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { AccountsAction } from '../../../actions/accounts.actions';
import { SettingsPermissionService } from '../../../services/settings.permission.service';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { GeneralService } from '../../../services/general.service';
import { IForceClear } from '../../../models/api-models/Sales';
import { cloneDeep, forEach, isEmpty, isNull } from '../../../lodash-optimized';
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
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public onSubmitForm: EventEmitter<any> = new EventEmitter(null);
    /** Emits true if form has unsaved changes */
    @Output() public hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter(null);
    public showTimeSpan: boolean = false;
    public showIPWrap: boolean = false;
    public permissionForm: UntypedFormGroup;
    public allRoles: any[] = [];
    /** Holds all role list used to reset all all roles after filtered allRoles Varible */
    public allRolesConstantList: any[] = [];
    public selectedTimeSpan: string = '';
    // Selected Type of IP range
    public selectedIPRange: string = '';
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
        private _fb: UntypedFormBuilder,
        private generalService: GeneralService
    ) {
        this.createPermissionInProcess$ = this.store.pipe(select(permissionStore => permissionStore.permission.createPermissionInProcess), takeUntil(this.destroyed$));
        this.createPermissionSuccess$ = this.store.pipe(select(permissionStore => permissionStore.permission.createPermissionSuccess), takeUntil(this.destroyed$));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        this.selectedIPRange = this.localeData?.cidr_range;
        this._accountsAction.resetShareEntity();

        if (this.userdata) {
            if (this.userdata.from && this.userdata.to) {
                let from: any = dayjs(this.userdata.from, GIDDH_DATE_FORMAT);
                let to: any = dayjs(this.userdata.to, GIDDH_DATE_FORMAT);
                setTimeout(() => {
                    // Set timeout is used because ngx datepicker doesn't take the
                    // format provided in bsConfig if bsValue is set in ngOnInit
                    this.dateRangePickerValue = [from, to];
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
        this.store.pipe(select(s => s.permission), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.roles) {
                let roles = cloneDeep(p.roles);
                let allRoleArray = [];
                roles.forEach((role) => {
                    allRoleArray.push({
                        label: role?.name,
                        value: role?.uniqueName
                    });
                });
                this.allRoles = cloneDeep(allRoleArray);
                this.allRolesConstantList = this.allRoles;
            } else {
                this.store.dispatch(this._permissionActions.GetRoles());
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && activeCompany.userEntityRoles && activeCompany.userEntityRoles.length && activeCompany.userEntityRoles[0] && activeCompany.userEntityRoles[0].role && activeCompany.userEntityRoles[0].role.uniqueName === 'super_admin') {
                this.isSuperAdminCompany = true;
            } else {
                this.isSuperAdminCompany = false;
            }
        });

        // utitlity
        this.permissionForm.get('periodOptions').valueChanges.pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe(val => {
            this.togglePeriodOptionsVal(val);
        });

        this.permissionForm.get('ipOptions').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(val => {
            this.toggleIpOptVal(val);
        });

        this.permissionForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.hasUnsavedChanges.emit(this.permissionForm?.dirty);
        });
    }

    public toggleIpOptVal(val: string) {
        if (val === IP_ADDR) {
            this.selectedIPRange = this.localeData?.ip_address;
        } else if (val === CIDR_RANGE) {
            this.selectedIPRange = this.localeData?.cidr_range;
        }
    }


    public togglePeriodOptionsVal(val: string) {
        if (val === DATE_RANGE) {
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        } else if (val === PAST_PERIOD) {
            this.selectedTimeSpan = this.localeData?.past_period;
            this.dateRangePickerValue = [];
            if (this.permissionForm) {
                this.permissionForm?.patchValue({ from: null, to: null });
            }
        }
    }

    public getPeriodFromData(data: ShareRequestForm) {
        if (data) {
            if (data.from && data.to) {
                this.togglePeriodOptionsVal(DATE_RANGE);
                return [DATE_RANGE];
            }
            if (data.duration && data.period) {
                this.togglePeriodOptionsVal(PAST_PERIOD);
                return [PAST_PERIOD];
            }
        }
        return [DATE_RANGE];
    }

    public getIPOptsFromData(data: ShareRequestForm) {
        if (data?.allowedIps?.length > 0) {
            this.toggleIpOptVal(IP_ADDR);
            return [IP_ADDR];
        }
        if (data?.allowedCidrs?.length > 0) {
            this.toggleIpOptVal(CIDR_RANGE);
            return [CIDR_RANGE];
        }
        return [IP_ADDR];
    }

    public initAcForm(data?: ShareRequestForm): void {
        if (data) {
            let fromDate = null;
            let toDate = null;
            if (data.to && data.from) {
                fromDate = dayjs(data?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
                toDate = dayjs(data?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
            }

            this.permissionForm = this._fb.group({
                uniqueName: [data.uniqueName],
                emailId: [data.emailId, Validators.compose([Validators.required, Validators.maxLength(150)])],
                entity: ['company'],
                roleUniqueName: [data.roleUniqueName, [Validators.required]],
                periodOptions: this.getPeriodFromData(data),
                from: [fromDate],
                to: [toDate],
                duration: [data.duration],
                period: [null],
                ipOptions: this.getIPOptsFromData(data),
                allowedIps: this._fb.array([]),
                allowedCidrs: this._fb.array([])
            });
            let allowedIps = this.permissionForm.get('allowedIps') as UntypedFormArray;
            let allowedCidrs = this.permissionForm.get('allowedCidrs') as UntypedFormArray;

            if (data?.allowedIps?.length > 0) {
                forEach(data.allowedIps, (val) => {
                    allowedIps.push(this.initRangeForm(val));
                });
            } else {
                allowedIps.push(this.initRangeForm());
            }

            if (data?.allowedCidrs?.length > 0) {
                forEach(data.allowedCidrs, (val) => {
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
            let allowedIps = this.permissionForm.get('allowedIps') as UntypedFormArray;
            let allowedCidrs = this.permissionForm.get('allowedCidrs') as UntypedFormArray;
            allowedCidrs.push(this.initRangeForm());
            allowedIps.push(this.initRangeForm());
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
            this.selectedIPRange = this.localeData?.cidr_range;
            this.permissionRoleClear$ = observableOf({ status: true });
        }
    }

    public initRangeForm(val?: any): UntypedFormGroup {
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
        let arow = this.permissionForm.get(type) as UntypedFormArray;
        for (let control of arow.controls) {
            let val = control.get('range')?.value;
            if (isNull(val) || isEmpty(val)) {
                errFound = true;
                msg = undefined;
            }
            // match with regex
            if (type === 'allowedIps') {
                if (!this.validateIPaddress(val)) {
                    errFound = true;
                    msg = this.localeData?.invalid_ip_error;
                }
            }
            // match cidr
            if (type === 'allowedCidrs') {
                if (!this.generalService.isCidr(val)) {
                    errFound = true;
                    msg = this.localeData?.invalid_cidr_range;
                }
            }
        }
        if (errFound) {
            this._toasty.warningToast(msg || this.localeData?.field_required_error);
        } else {
            arow.push(this.initRangeForm());
        }
    }

    public delRow(type: string, i: number, e: any) {
        e.stopPropagation();
        const arow = this.permissionForm.get(type) as UntypedFormArray;
        arow.removeAt(i);
    }

    public submitPermissionForm() {
        let obj: any = {};
        let form: ShareRequestForm = cloneDeep(this.permissionForm?.value);
        let CidrArr = [];
        let IpArr = [];

        if (form?.from && form?.to) {
            form.from = dayjs(this.permissionForm.get('from').value).format(GIDDH_DATE_FORMAT);
            form.to = dayjs(this.permissionForm.get('to').value).format(GIDDH_DATE_FORMAT);
        }
        forEach(form.allowedCidrs, (n) => {
            if (n.range) {
                CidrArr.push(n.range);
            }
        });

        forEach(form.allowedIps, (n) => {
            if (n.range) {
                IpArr.push(n.range);
            }
        });
        if (CidrArr?.length > 0) {
            IpArr = [];
        }
        if (IpArr?.length > 0) {
            CidrArr = [];
        }
        form.allowedCidrs = CidrArr;
        form.allowedIps = IpArr;

        if (this.selectedTimeSpan === this.localeData?.past_period) {
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
            if ((obj.data.from && obj.data.from) === this.localeData?.invalid_date || (obj.data.to && obj.data.to) === this.localeData?.invalid_date) {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this._settingsPermissionService.UpdatePermission(form).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.hasUnsavedChanges.emit(false);
                    this._toasty.successToast(this.localeData?.permission_updated_success);
                } else {
                    this._toasty.warningToast(res?.message, res?.code);
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
        this.permissionForm.get('ipOptions')?.patchValue(value, { onlySelf: true });
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
        this.permissionForm.get('periodOptions')?.patchValue(value, { onlySelf: true });
    }

    /**
     * Handle Role search Query
     *
     * @param {*} event
     * @memberof SettingPermissionFormComponent
     */
    public onRoleSearchQueryChange(event: any): void {
        if (event) {
            this.allRoles = this.allRoles?.filter(role => role.label.toUpperCase().indexOf(event.toUpperCase()) > -1);
        }
    }

    /**
     * Handle Role Search Clear
     *
     * @memberof SettingPermissionFormComponent
     */
    public onSearchClear(): void {
        this.allRoles = this.allRolesConstantList;
    }
}
