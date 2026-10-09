import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GeneralService } from "../../../services/general.service";
import { CompanyAuthKeyService } from "../../../services/settings.company-auth-key.service";
import { debounceTime, takeUntil } from "rxjs/operators";
import { CreateCompanyAuthKeyRequest } from "../../../models/api-models/SettingsCompanyAuthKey";
import { AppState } from "../../../store";
import { Store, select } from "@ngrx/store";
import { cloneDeep, isEmpty, isNull } from '../../../lodash-optimized';
import { PermissionActions } from "../../../actions/permission/permission.action";
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { ToasterService } from "../../../services/toaster.service";
import { IPV4_REGEX } from "../../../app.constant";
import { PageLeaveUtilityService } from "../../../services/page-leave-utility.service";
import { SettingsProfileActions } from "../../../actions/settings/profile/settings.profile.action";
dayjs.extend(customParseFormat);
// some local const
const DATE_RANGE = 'daterange';
const PAST_PERIOD = 'pastperiod';
const IP_ADDR = 'ip_address';
const CIDR_RANGE = 'cidr_range';

@Component({
    selector: "create-company-auth-key",
    templateUrl: "./create-company-auth-key.component.html",
    styleUrls: ["./create-company-auth-key.component.scss"],
    standalone: false
})
export class CreateCompanyAuthKeyComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data for company auth key module */
    @Input() public localeData: any = {};
    /* This will hold common JSON data shared across modules */
    @Input() public commonLocaleData: any = {};
    /** Form Group for company auth key form */
    public createCompanyAuthKeyForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** True if update mode */
    public isUpdateMode: boolean = false;
    /** Holds true if api is in progress */
    public isLoading: boolean = true;
    /** Voucher API Version */
    public voucherApiVersion: number = 1 | 2;
    /** All roles list */
    public allRoles: any[] = [];
    /** True if show time span */
    public showTimeSpan: boolean = false;
    /** True if show IP wrap */
    public showIPWrap: boolean = false;
    /** Selected time span */
    public selectedTimeSpan: string = '';
    // Selected Type of IP range
    public selectedIPRange: string = '';
    /** Date range picker value */
    public dateRangePickerValue: Date[] = [];
    /** Flag to prevent multiple GetRoles() dispatches */
    private rolesRequested: boolean = false;
    /** Returns true if form is dirty else false */
    public get showPageLeaveConfirmation(): boolean {
        return this.createCompanyAuthKeyForm?.dirty;
    }
    /** Constants */
    public readonly CIDR_RANGE = CIDR_RANGE;
    public readonly IP_ADDRESS = IP_ADDR;
    public readonly DATE_RANGE = DATE_RANGE;
    public readonly PAST_PERIOD = PAST_PERIOD;

    constructor(
        @Inject(MAT_DIALOG_DATA) public companyAuthKeyInfo: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<any>,
        private generalService: GeneralService,
        private companyAuthKeyService: CompanyAuthKeyService,
        private store: Store<AppState>,
        private permissionActions: PermissionActions,
        private toasterService: ToasterService,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private settingsProfileActions: SettingsProfileActions
    ) {
    }

    /**
     * Used for component initialization
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public ngOnInit(): void {
        this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        this.selectedIPRange = this.localeData?.cidr_range;
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        // get roles
        this.store.pipe(select(state => state.permission), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.roles && response.roles.length > 0) {
                let roles = cloneDeep(response.roles);
                let allRoleArray = [];
                (Array.isArray(roles) ? roles : []).forEach((role: any) => {
                    allRoleArray.push({
                        label: role?.name,
                        value: role?.uniqueName
                    });
                });
                this.allRoles = cloneDeep(allRoleArray);
                this.rolesRequested = false; // Reset flag when roles are received
            } else if (!this.rolesRequested) {
                this.rolesRequested = true; // Set flag to prevent multiple requests
                this.store.dispatch(this.permissionActions.GetRoles());
            }
        });

        if (this.companyAuthKeyInfo) {
            this.isUpdateMode = true;
            if (this.companyAuthKeyInfo.from && this.companyAuthKeyInfo.to) {
                let from: any = dayjs(this.companyAuthKeyInfo.from, GIDDH_DATE_FORMAT);
                let to: any = dayjs(this.companyAuthKeyInfo.to, GIDDH_DATE_FORMAT);
                this.dateRangePickerValue = [from, to];
            }
            this.initCompanyAuthKeyForm(this.companyAuthKeyInfo);
        } else {
            this.initCompanyAuthKeyForm();
        }

        // utitlity
        this.createCompanyAuthKeyForm.get('periodOptions').valueChanges.pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe(val => {
            this.togglePeriodOptionsVal(val);
        });

        this.createCompanyAuthKeyForm.get('ipOptions').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(val => {
            this.toggleIpOptVal(val);
        });

        this.createCompanyAuthKeyForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
    }

    /**
     * Initializes company auth key form
     *
     * @private
     * @memberof CreateCompanyAuthKeyComponent
     */
    private initCompanyAuthKeyForm(authKey?: any): void {
        if (authKey) {
            let fromDate: Date | null = null;
            let toDate: Date | null = null;
            if (authKey.to && authKey.from) {
                const from = dayjs(authKey?.from, GIDDH_DATE_FORMAT).toDate();
                const to = dayjs(authKey?.to, GIDDH_DATE_FORMAT).toDate();
                fromDate = from;
                toDate = to;
            }
            this.createCompanyAuthKeyForm = this.formBuilder.group({
                roleName: [authKey?.userName ?? '', Validators.required],
                roleUniqueName: [authKey?.roleUniqueName ?? ''],
                from: [fromDate],
                to: [toDate],
                duration: [authKey?.duration],
                period: [null],
                periodOptions: this.getPeriodFromData(authKey),
                ipOptions: this.getIPOptsFromData(authKey),
                reGenerateAuthKey: [authKey?.reGenerateAuthKey ?? false],
                allowedIps: this.formBuilder.array([]),
                allowedCidrs: this.formBuilder.array([])
            });

            let allowedIps = this.createCompanyAuthKeyForm.get('allowedIps') as FormArray;
            let allowedCidrs = this.createCompanyAuthKeyForm.get('allowedCidrs') as FormArray;

            if (authKey?.allowedIps?.length > 0) {
                (Array.isArray(authKey.allowedIps) ? authKey.allowedIps : []).forEach((val: any) => {
                    allowedIps.push(this.initRangeForm(val));
                });
            } else {
                allowedIps.push(this.initRangeForm());
            }

            if (authKey?.allowedCidrs?.length > 0) {
                (Array.isArray(authKey.allowedCidrs) ? authKey.allowedCidrs : []).forEach((val: any) => {
                    allowedCidrs.push(this.initRangeForm(val));
                });
            } else {
                allowedCidrs.push(this.initRangeForm());
            }
        } else {
            this.createCompanyAuthKeyForm = this.formBuilder.group({
                roleName: [null, Validators.required],
                roleUniqueName: [null, [Validators.required]],
                periodOptions: DATE_RANGE,
                from: [null],
                to: [null],
                duration: [null],
                period: [null],
                ipOptions: CIDR_RANGE,
                allowedIps: this.formBuilder.array([]),
                allowedCidrs: this.formBuilder.array([])
            });
            let allowedIps = this.createCompanyAuthKeyForm.get('allowedIps') as FormArray;
            let allowedCidrs = this.createCompanyAuthKeyForm.get('allowedCidrs') as FormArray;
            allowedCidrs.push(this.initRangeForm());
            allowedIps.push(this.initRangeForm());
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
            this.selectedIPRange = this.localeData?.cidr_range;
        }
        this.isLoading = false;
    }

    /**
     * Initializes a range form group for IP/CIDR values
     *
     * @param val Existing value for the range, if any
     * @returns {FormGroup} Form group with range control
     * @memberof CreateCompanyAuthKeyComponent
     */
    public initRangeForm(val?: any): FormGroup {
        return this.formBuilder.group({
            range: (val) ? [val] : [null]
        });
    }

    /**
     * Validates IPv4 address
     *
     * @param ipaddress IP address string
     * @returns {boolean} True if valid IPv4 address, else false
     * @memberof CreateCompanyAuthKeyComponent
     */
    public validateIPaddress(ipaddress: string): boolean {
        if (IPV4_REGEX.test(ipaddress)) {
            return true;
        }
        return false;
    }

    /**
     * Toggles IP option label between CIDR and IP address
     *
     * @param val Selected IP option
     * @memberof CreateCompanyAuthKeyComponent
     */
    public toggleIpOptVal(val: string): void {
        if (val === IP_ADDR) {
            this.selectedIPRange = this.localeData?.ip_address;
        } else if (val === CIDR_RANGE) {
            this.selectedIPRange = this.localeData?.cidr_range;
        }
    }


    /**
     * Toggles period option label and resets dates when needed
     *
     * @param val Selected period option
     * @memberof CreateCompanyAuthKeyComponent
     */
    public togglePeriodOptionsVal(val: string): void {
        if (val === DATE_RANGE) {
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        } else if (val === PAST_PERIOD) {
            this.selectedTimeSpan = this.localeData?.past_period;
            this.dateRangePickerValue = [];
            if (this.createCompanyAuthKeyForm) {
                this.createCompanyAuthKeyForm?.patchValue({ from: null, to: null });
            }
        }
    }

    /**
     * Derives period option from existing auth key data
     *
     * @param data Existing auth key data
     * @returns Period option string
     * @memberof CreateCompanyAuthKeyComponent
     */
    public getPeriodFromData(data: CreateCompanyAuthKeyRequest): string {
        if (data) {
            if (data.from && data.to) {
                this.togglePeriodOptionsVal(DATE_RANGE);
                return DATE_RANGE;
            }
            if (data.duration && data.period) {
                this.togglePeriodOptionsVal(PAST_PERIOD);
                return PAST_PERIOD;
            }
        }
        return DATE_RANGE;
    }

    /**
     * Derives IP option from existing auth key data
     *
     * @param data Existing auth key data
     * @returns IP option string
     * @memberof CreateCompanyAuthKeyComponent
     */
    public getIPOptsFromData(data: CreateCompanyAuthKeyRequest): string {
        if (data?.allowedIps?.length > 0) {
            this.toggleIpOptVal(IP_ADDR);
            return IP_ADDR;
        }
        if (data?.allowedCidrs?.length > 0) {
            this.toggleIpOptVal(CIDR_RANGE);
            return CIDR_RANGE;
        }
        return IP_ADDR;
    }

    /**
 * This is to allow only digits and dot
 *
 * @param {*} event
 * @returns {boolean}
 * @memberof CreateCompanyAuthKeyComponent
 */
    public allowOnlyNumbersAndDot(event: any): boolean {
        return this.generalService.allowOnlyNumbersAndDot(event);
    }

    /**
     * Hides expanded sections for time span and IP range when clicked outside
     *
     * @param id Section identifier
     * @memberof CreateCompanyAuthKeyComponent
     */
    public methodForToggleSection(id: string): void {
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
     * Saves company auth key
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public saveCompanyAuthKey(): void {
        this.isFormSubmitted = false;
        if (this.createCompanyAuthKeyForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        let obj: any = {};
        let form: CreateCompanyAuthKeyRequest = cloneDeep(this.createCompanyAuthKeyForm?.value);
        let CidrArr = [];
        let IpArr = [];

        if (form?.from && form?.to) {
            form.from = dayjs(this.createCompanyAuthKeyForm.get('from').value).format(GIDDH_DATE_FORMAT);
            form.to = dayjs(this.createCompanyAuthKeyForm.get('to').value).format(GIDDH_DATE_FORMAT);
        }
        (Array.isArray(form.allowedCidrs) ? form.allowedCidrs : []).forEach((n: any) => {
            if (n.range) {
                CidrArr.push(n.range);
            }
        });

        (Array.isArray(form.allowedIps) ? form.allowedIps : []).forEach((res: any) => {
            if (res.range) {
                IpArr.push(res.range);
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

        obj.action = (this.isUpdateMode) ? 'update' : 'create';
        this.dateRangePickerValue = [];
        obj.data = form;
        if (obj.action === 'create') {
            this.companyAuthKeyService.createAuthKey(form).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.createCompanyAuthKeyForm.markAsPristine();
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.toasterService.successToast(this.localeData?.auth_key_created_success);
                    this.dialogRef.close(true);
                } else if (response?.message) {
                    this.toasterService.showSnackBar("error", response?.message);
                }
            });
        } else if (obj.action === 'update') {
            if ((obj.data.from && obj.data.from) === this.localeData?.invalid_date || (obj.data.to && obj.data.to) === this.localeData?.invalid_date) {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this.companyAuthKeyService.updateAuthKey(this.companyAuthKeyInfo?.uniqueName, obj.data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.createCompanyAuthKeyForm.markAsPristine();
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.dialogRef.close(true);
                    this.toasterService.successToast(this.localeData?.auth_key_updated_success);
                } else if (res?.message) {
                    this.toasterService.showSnackBar("error", res?.message);
                }
            });
        }


    }

    /**
     * Adds new row for IP/CIDR ranges with validations
     *
     * @param type Control name (allowedIps/allowedCidrs)
     * @param item Current form group
     * @param e Event
     * @memberof CreateCompanyAuthKeyComponent
     */
    public addNewRow(type: string, item: any, event: any): void {
        event.stopPropagation();
        let errFound: boolean = false;
        let msg: string;
        let arow = this.createCompanyAuthKeyForm.get(type) as FormArray;
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
            this.toasterService.warningToast(msg || this.localeData?.field_required_error);
        } else {
            arow.push(this.initRangeForm());
        }
    }

    /**
     * Deletes row for IP/CIDR ranges
     *
     * @param type Control name (allowedIps/allowedCidrs)
     * @param i Index to remove
     * @param e Event
     * @memberof CreateCompanyAuthKeyComponent
     */
    public delRow(type: string, i: number, event: any): void {
        event.stopPropagation();
        const arow = this.createCompanyAuthKeyForm.get(type) as FormArray;
        arow.removeAt(i);
    }

    /**
     * Cancels auth key dialog
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public cancelAuthKey(): void {
        this.dialogRef?.close();
    }

    /**
     * Handler for IP address change, required for manually changing
     * the radio button value in modal as radio button doesn't work in
     * ngx-bootstrap modal
     *
     * @param {string} value Current selected value of radio button
     * @memberof CreateCompanyAuthKeyComponent
     */
    public handleIpAddressChange(value: string): void {
        this.createCompanyAuthKeyForm.get('ipOptions')?.patchValue(value, { onlySelf: true });
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
        this.createCompanyAuthKeyForm.get('periodOptions')?.patchValue(value, { onlySelf: true });
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.createCompanyAuthKeyForm.markAsPristine();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
    }

    /**
     * Cancels auth key dialog
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public cancel(): void {
        if (this.showPageLeaveConfirmation) {
            this.pageLeaveUtilityService.confirmPageLeave((action: boolean) => {
                if (action) {
                    this.dialogRef?.close();
                }
            });
        } else {
            this.dialogRef?.close();
        }
    }

    /**
     * Updates unsaved changes returned from inline form
     *
     * @param {*} event
     * @memberof SettingPermissionComponent
     */
    public updateUnsavedChanges(event: any): void {
        if (event) {
            this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        } else {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        }
        this.store.dispatch(this.settingsProfileActions.hasUnsavedChanges(event));
    }
}
