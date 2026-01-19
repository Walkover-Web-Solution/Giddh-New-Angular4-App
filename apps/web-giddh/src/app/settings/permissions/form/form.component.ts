import { debounceTime, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD, GIDDH_EMAIL_REGEX } from './../../../shared/helpers/defaultDateFormat';
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
import { RestrictedModules } from '../../../app.constant';
// some local const
const DATE_RANGE = 'daterange';
const PAST_PERIOD = 'pastperiod';
const IP_ADDR = 'ip_address';
const CIDR_RANGE = 'cidr_range';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'setting-permission-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
/**
 * SettingPermissionFormComponent component
 * Handles settingpermissionform functionality and user interactions
 */
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
    /** Emits when form is submitted */
    @Output() public onSubmitForm: EventEmitter<any> = new EventEmitter(null);
    /** Emits when dialog is closed */
    @Output() public closeDialog: EventEmitter<any> = new EventEmitter(null);
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
    /** True if user module is restricted */
    public isUserRestricted: boolean = false;
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** Email id validation regex pattern */
    public giddhEmailRegex = GIDDH_EMAIL_REGEX;
    /** To check form is invalid */
    public isFormInvalid: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
        this.activeCompany$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        this.selectedIPRange = this.localeData?.cidr_range;
        this._accountsAction.resetShareEntity();

        /**
         * Handles if functionality
         */
        if (this.userdata) {
            /**
             * Handles if functionality
             */
            if (this.userdata.from && this.userdata.to) {
                let from: any = dayjs(this.userdata.from, GIDDH_DATE_FORMAT);
                let to: any = dayjs(this.userdata.to, GIDDH_DATE_FORMAT);
                this.dateRangePickerValue = [from, to];
            }
            this.initAcForm(this.userdata);
        } else {
            this.initAcForm();
        }
        // reset form
        this.createPermissionSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            /**
             * Handles if functionality
             */
            if (value && !this.isOpenedInModal) {
                this.permissionForm.reset();
                this.initAcForm();
            }
        });

        // get roles
        this.store.pipe(select(s => s.permission), takeUntil(this.destroyed$)).subscribe(p => {
            /**
             * Handles if functionality
             */
            if (p && p.roles) {
                let roles = cloneDeep(p.roles);
                let allRoleArray = [];
                (Array.isArray(roles) ? roles : []).forEach((role) => {
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

        this.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany && activeCompany.userEntityRoles && activeCompany.userEntityRoles.length && activeCompany.userEntityRoles[0] && activeCompany.userEntityRoles[0].role && activeCompany.userEntityRoles[0].role.uniqueName === 'super_admin') {
                this.isSuperAdminCompany = true;
            } else {
                this.isSuperAdminCompany = false;
            }
            /**
             * Handles if functionality
             */
            if (activeCompany.subscription?.planDetails?.restrictedModules && Object.hasOwn(activeCompany.subscription.planDetails.restrictedModules, this.restrictedModules.Users) && activeCompany.moduleRestrictionStatus) {
                const module = activeCompany.moduleRestrictionStatus.find(
                    (module) => module?.moduleName === this.restrictedModules.Users
                );
                this.isUserRestricted = !module?.remainingUsers;
                /**
                 * Handles if functionality
                 */
                if (this.isUserRestricted) {
                    this.permissionForm.get('roleUniqueName').patchValue('');
                }
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

    /**
     * Toggles ipoptval state
     */
    public toggleIpOptVal(val: string) {
        /**
         * Handles if functionality
         */
        if (val === IP_ADDR) {
            this.selectedIPRange = this.localeData?.ip_address;
        } else if (val === CIDR_RANGE) {
            this.selectedIPRange = this.localeData?.cidr_range;
        }
    }


    /**
     * Toggles periodoptionsval state
     */
    public togglePeriodOptionsVal(val: string) {
        /**
         * Handles if functionality
         */
        if (val === DATE_RANGE) {
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        } else if (val === PAST_PERIOD) {
            this.selectedTimeSpan = this.localeData?.past_period;
            this.dateRangePickerValue = [];
            /**
             * Handles if functionality
             */
            if (this.permissionForm) {
                this.permissionForm?.patchValue({ from: null, to: null });
            }
        }
    }

    /**
     * Retrieves periodfromdata data
     */
    public getPeriodFromData(data: ShareRequestForm) {
        /**
         * Handles if functionality
         */
        if (data) {
            /**
             * Handles if functionality
             */
            if (data.from && data.to) {
                this.togglePeriodOptionsVal(DATE_RANGE);
                return [DATE_RANGE];
            }
            /**
             * Handles if functionality
             */
            if (data.duration && data.period) {
                this.togglePeriodOptionsVal(PAST_PERIOD);
                return [PAST_PERIOD];
            }
        }
        return [DATE_RANGE];
    }

    /**
     * Retrieves ipoptsfromdata data
     */
    public getIPOptsFromData(data: ShareRequestForm) {
        /**
         * Handles if functionality
         */
        if (data?.allowedIps?.length > 0) {
            this.toggleIpOptVal(IP_ADDR);
            return [IP_ADDR];
        }
        /**
         * Handles if functionality
         */
        if (data?.allowedCidrs?.length > 0) {
            this.toggleIpOptVal(CIDR_RANGE);
            return [CIDR_RANGE];
        }
        return [IP_ADDR];
    }

    /**
     * Initializes acform
     */
    public initAcForm(data?: ShareRequestForm): void {
        /**
         * Handles if functionality
         */
        if (data) {
            let fromDate = null;
            let toDate = null;
            /**
             * Handles if functionality
             */
            if (data.to && data.from) {
                fromDate = dayjs(data?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
                toDate = dayjs(data?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
            }

            this.permissionForm = this._fb.group({
                uniqueName: [data.uniqueName],
                emailId: [data.emailId, Validators.compose([Validators.required, Validators.maxLength(150), Validators.pattern(this.giddhEmailRegex)])],
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

            /**
             * Handles if functionality
             */
            if (data?.allowedIps?.length > 0) {
                /**
                 * Handles forEach functionality
                 */
                forEach(data.allowedIps, (val) => {
                    allowedIps.push(this.initRangeForm(val));
                });
            } else {
                allowedIps.push(this.initRangeForm());
            }

            /**
             * Handles if functionality
             */
            if (data?.allowedCidrs?.length > 0) {
                /**
                 * Handles forEach functionality
                 */
                forEach(data.allowedCidrs, (val) => {
                    allowedCidrs.push(this.initRangeForm(val));
                });
            } else {
                allowedCidrs.push(this.initRangeForm());
            }

        } else {
            this.permissionForm = this._fb.group({
                emailId: [null, Validators.compose([Validators.required, Validators.maxLength(150), Validators.pattern(this.giddhEmailRegex)])],
                entity: ['company'],
                roleUniqueName: [null, [Validators.required]],
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

    /**
     * Initializes rangeform
     */
    public initRangeForm(val?: any): UntypedFormGroup {
        return this._fb.group({
            /**
             * Handles range functionality
             */
            range: (val) ? [val] : [null]
        });
    }

    /**
     * Validates ipaddress input
     */
    public validateIPaddress(ipaddress: string) {
        /**
         * Handles if functionality
         */
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        return false;
    }

    /**
     * Handles addNewRow functionality
     */
    public addNewRow(type: string, item: any, e: any) {
        e.stopPropagation();
        let errFound: boolean = false;
        let msg: string;
        let arow = this.permissionForm.get(type) as UntypedFormArray;
        /**
         * Handles for functionality
         */
        for (let control of arow.controls) {
            let val = control.get('range')?.value;
            /**
             * Handles if functionality
             */
            if (isNull(val) || isEmpty(val)) {
                errFound = true;
                msg = undefined;
            }
            // match with regex
            /**
             * Handles if functionality
             */
            if (type === 'allowedIps') {
                /**
                 * Handles if functionality
                 */
                if (!this.validateIPaddress(val)) {
                    errFound = true;
                    msg = this.localeData?.invalid_ip_error;
                }
            }
            // match cidr
            /**
             * Handles if functionality
             */
            if (type === 'allowedCidrs') {
                /**
                 * Handles if functionality
                 */
                if (!this.generalService.isCidr(val)) {
                    errFound = true;
                    msg = this.localeData?.invalid_cidr_range;
                }
            }
        }
        /**
         * Handles if functionality
         */
        if (errFound) {
            this._toasty.warningToast(msg || this.localeData?.field_required_error);
        } else {
            arow.push(this.initRangeForm());
        }
    }

    /**
     * Handles delRow functionality
     */
    public delRow(type: string, i: number, e: any) {
        e.stopPropagation();
        const arow = this.permissionForm.get(type) as UntypedFormArray;
        arow.removeAt(i);
    }

    /**
     * Handles submitPermissionForm functionality
     */
    public submitPermissionForm() {
        this.isFormInvalid = this.permissionForm.invalid;
        /**
         * Handles if functionality
         */
        if (this.isFormInvalid) {
            return;
        }
        let obj: any = {};
        let form: ShareRequestForm = cloneDeep(this.permissionForm?.value);
        let CidrArr = [];
        let IpArr = [];

        /**
         * Handles if functionality
         */
        if (form?.from && form?.to) {
            form.from = dayjs(this.permissionForm.get('from').value).format(GIDDH_DATE_FORMAT);
            form.to = dayjs(this.permissionForm.get('to').value).format(GIDDH_DATE_FORMAT);
        }
        /**
         * Handles forEach functionality
         */
        forEach(form.allowedCidrs, (n) => {
            /**
             * Handles if functionality
             */
            if (n.range) {
                CidrArr.push(n.range);
            }
        });

        /**
         * Handles forEach functionality
         */
        forEach(form.allowedIps, (n) => {
            /**
             * Handles if functionality
             */
            if (n.range) {
                IpArr.push(n.range);
            }
        });
        /**
         * Handles if functionality
         */
        if (CidrArr?.length > 0) {
            IpArr = [];
        }
        /**
         * Handles if functionality
         */
        if (IpArr?.length > 0) {
            CidrArr = [];
        }
        form.allowedCidrs = CidrArr;
        form.allowedIps = IpArr;

        /**
         * Handles if functionality
         */
        if (this.selectedTimeSpan === this.localeData?.past_period) {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (obj.action === 'create') {
            this.store.dispatch(this._accountsAction.shareEntity(form, form.roleUniqueName));
            this.onSubmitForm.emit(obj);
        } else if (obj.action === 'update') {
            /**
             * Handles if functionality
             */
            if ((obj.data.from && obj.data.from) === this.localeData?.invalid_date || (obj.data.to && obj.data.to) === this.localeData?.invalid_date) {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this._settingsPermissionService.UpdatePermission(form).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                /**
                 * Handles if functionality
                 */
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

    /**
     * Handles methodForToggleSection functionality
     */
    public methodForToggleSection(id: string) {
        /**
         * Handles if functionality
         */
        if (id === 'timeSpanSection') {
            /**
             * Handles if functionality
             */
            if (this.showTimeSpan) {
                this.showTimeSpan = false;
            }
        }
        /**
         * Handles if functionality
         */
        if (id === 'rangeSpanSection') {
            /**
             * Handles if functionality
             */
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
}
