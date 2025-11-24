import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, ReplaySubject, of as observableOf } from "rxjs";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GeneralService } from "../../../services/general.service";
import { CompanyAuthKeyService } from "../../../services/settings.company-auth-key.service";
import { debounceTime, takeUntil } from "rxjs/operators";
import { CreateCompanyAuthKeyRequest, UpdateCompanyAuthKeyRequest } from "../../../models/api-models/SettingsCompanyAuthKey";
import { AppState } from "../../../store";
import { Store, select } from "@ngrx/store";
import { cloneDeep, forEach, isEmpty, isNull } from '../../../lodash-optimized';
import { PermissionActions } from "../../../actions/permission/permission.action";
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD } from "../../../shared/helpers/defaultDateFormat";
import { ToasterService } from "../../../services/toaster.service";
dayjs.extend(customParseFormat);
// some local const
const DATE_RANGE = 'daterange';
const PAST_PERIOD = 'pastperiod';
const IP_ADDR = 'ip_address';
const CIDR_RANGE = 'cidr_range';

@Component({
    selector: "create-company-auth-key",
    templateUrl: "./create-company-auth-key.component.html",
    styleUrls: ["./create-company-auth-key.component.scss"]
})
export class CreateCompanyAuthKeyComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
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
    public voucherApiVersion: number = 1|2;
    /** All roles list */
    public allRoles: any[] = [];
    /** Holds all role list used to reset all all roles after filtered allRoles Varible */
    public allRolesConstantList: any[] = [];
    /** To check form is invalid */
    public isFormInvalid: boolean = false;
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

    constructor(
        @Inject(MAT_DIALOG_DATA) public companyAuthKeyInfo: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<any>,
        private generalService: GeneralService,
        private companyAuthKeyService: CompanyAuthKeyService,
        private store: Store<AppState>,
        private permissionActions: PermissionActions,
        private toasterService: ToasterService
    ) { }

    /**
     * This will be use for component initialization
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public ngOnInit(): void {
        this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
        this.selectedIPRange = this.localeData?.cidr_range;
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        console.log(this.companyAuthKeyInfo, this.selectedTimeSpan);

        // get roles
        this.store.pipe(select(state=> state.permission), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.roles) {
                let roles = cloneDeep(response.roles);
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
            // this.hasUnsavedChanges.emit(this.createCompanyAuthKeyForm?.dirty);
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
                forEach(authKey?.allowedIps, (val) => {
                    allowedIps.push(this.initRangeForm(val));
                });
            } else {
                allowedIps.push(this.initRangeForm());
            }

            if (authKey?.allowedCidrs?.length > 0) {
                forEach(authKey?.allowedCidrs, (val) => {
                    allowedCidrs.push(this.initRangeForm(val));
                });
            } else {
                allowedCidrs.push(this.initRangeForm());
            }
        }else{
            this.createCompanyAuthKeyForm = this.formBuilder.group({
                roleName: ['', Validators.required],
                roleUniqueName: ['', [Validators.required]],
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
            console.log(allowedIps, allowedCidrs);
            allowedCidrs.push(this.initRangeForm());
            allowedIps.push(this.initRangeForm());
            this.selectedTimeSpan = this.commonLocaleData?.app_date_range;
            this.selectedIPRange = this.localeData?.cidr_range;
        }
        this.isLoading = false;
    }

    public initRangeForm(val?: any): FormGroup {
        return this.formBuilder.group({
            range: (val) ? [val] : [null]
        });
    }

    public validateIPaddress(ipaddress: string) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        return false;
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
            if (this.createCompanyAuthKeyForm) {
                this.createCompanyAuthKeyForm?.patchValue({ from: null, to: null });
            }
        }
    }

    public getPeriodFromData(data: CreateCompanyAuthKeyRequest) {
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

    public getIPOptsFromData(data: CreateCompanyAuthKeyRequest) {
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
 * @memberof SettingPermissionFormComponent
 */
    public allowOnlyNumbersAndDot(event: any): boolean {
        return this.generalService.allowOnlyNumbersAndDot(event);
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

        obj.action = (this.isUpdateMode) ? 'update' : 'create';
        this.dateRangePickerValue = [];
        obj.data = form;
        console.log(obj, form);
        if (obj.action === 'create') {
            this.companyAuthKeyService.CreateAuthKey(form.roleUniqueName, form).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.dialogRef.close(true);
                }
            });
        } else if (obj.action === 'update') {
            if ((obj.data.from && obj.data.from) === this.localeData?.invalid_date || (obj.data.to && obj.data.to) === this.localeData?.invalid_date) {
                delete obj.data.from;
                delete obj.data.to;
                obj.data.periodOptions = null;
            }
            this.companyAuthKeyService.UpdateAuthKey(this.companyAuthKeyInfo?.uniqueName, obj.data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    // this.hasUnsavedChanges.emit(false);
                    this.dialogRef.close(true);
                    this.toasterService.successToast(this.localeData?.permission_updated_success);
                } else {
                    this.toasterService.warningToast(res?.message, res?.code);
                }
            });
        }


    }

    public addNewRow(type: string, item: any, e: any) {
        e.stopPropagation();
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

    public delRow(type: string, i: number, e: any) {
        e.stopPropagation();
        const arow = this.createCompanyAuthKeyForm.get(type) as FormArray;
        arow.removeAt(i);
    }

    /**
     * Updates company auth key
     *
     * @memberof CreateCompanyAuthKeyComponent
     */
    public updateAuthKey(): void {
        this.isFormSubmitted = false;
        if (this.createCompanyAuthKeyForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        let model: UpdateCompanyAuthKeyRequest = this.createCompanyAuthKeyForm.value;
        const userRoleUniqueName = this.companyAuthKeyInfo.uniqueName || this.companyAuthKeyInfo.userRoleUniqueName;

        this.companyAuthKeyService.UpdateAuthKey(userRoleUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.dialogRef.close(true);
            }
        });
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
     * Lifecycle hook for component destroy
     *
     * @memberof CreateDiscountComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
}
