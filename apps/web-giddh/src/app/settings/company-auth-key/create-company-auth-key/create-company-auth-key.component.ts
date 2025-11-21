import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, ReplaySubject, of as observableOf } from "rxjs";
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from "@angular/forms";
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
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
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
    /** Discounts list Observable */
    public discountsAccountList$: Observable<any> = observableOf(null);
    /** Form Group for company auth key form */
    public createCompanyAuthKeyForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected country */
    public selectedDiscountAccount: string = '';
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True if update mode */
    public isUpdateMode: boolean = false;
    /** Holds true if api is in progress */
    public isLoading: boolean = true;
    /** Voucher API Version */
    public voucherApiVersion: number;
    /** All roles list */
    public allRoles: any[] = [];
    /** Holds all role list used to reset all all roles after filtered allRoles Varible */
    public allRolesConstantList: any[] = [];
    /** To check form is invalid */
    public isFormInvalid: boolean = false;
    public showTimeSpan: boolean = false;
    public showIPWrap: boolean = false;
    public selectedTimeSpan: string = '';
    // Selected Type of IP range
    public selectedIPRange: string = '';
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
        this.store.pipe(select(s => s.permission), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.roles) {
                console.log(p.roles);
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
            this.getAuthKeyDetails(this.companyAuthKeyInfo.uniqueName || this.companyAuthKeyInfo.userRoleUniqueName);
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
        if(authKey){
            this.createCompanyAuthKeyForm = this.formBuilder.group({
                roleName: [authKey?.roleName ?? '', Validators.required],
                roleUniqueName: [authKey?.roleUniqueName ?? ''],
                allowedCidrs: [authKey?.allowedCidrs ?? []],
                allowedIps: [authKey?.allowedIps ?? []],
                from: [authKey?.from ?? ''],
                to: [authKey?.to ?? ''],
                ipOptions: this.getIPOptsFromData(authKey),
                duration: [authKey?.duration ?? ''],
                reGenerateAuthKey: [authKey?.reGenerateAuthKey ?? false]
            });
        }else{
            this.createCompanyAuthKeyForm = this.formBuilder.group({
                roleName: ['', Validators.required],
                roleUniqueName: ['admin', [Validators.required]],
                periodOptions: [DATE_RANGE],
                from: [null],
                to: [null],
                duration: [null],
                ipOptions: [CIDR_RANGE],
                allowedIps: this.formBuilder.array([]),
                allowedCidrs: this.formBuilder.array([])
            });
            let allowedIps = this.createCompanyAuthKeyForm.get('allowedIps') as UntypedFormArray;
            let allowedCidrs = this.createCompanyAuthKeyForm.get('allowedCidrs') as UntypedFormArray;
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
                return [DATE_RANGE];
            }
            if (data.duration) {
                this.togglePeriodOptionsVal(PAST_PERIOD);
                return [PAST_PERIOD];
            }
        }
        return [DATE_RANGE];
    }

    public getIPOptsFromData(data: CreateCompanyAuthKeyRequest) {
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
     * Gets auth key details for edit mode
     *
     * @private
     * @param {string} roleUser
     * @memberof CreateCompanyAuthKeyComponent
     */
    private getAuthKeyDetails(roleUser: string): void {
        this.companyAuthKeyService.GetAuthKey(roleUser).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.initCompanyAuthKeyForm(response.body);
            } else {
                this.initCompanyAuthKeyForm();
            }
        });
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
            form.from = null;
            form.to = null;
        } else {
            form.duration = null;
        }

        obj.action = (this.isUpdateMode) ? 'update' : 'create';
        this.dateRangePickerValue = [];
        obj.data = form;
        if (obj.action === 'create') {
            this.companyAuthKeyService.CreateAuthKey(form.roleName, form).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
            this.companyAuthKeyService.UpdateAuthKey(this.companyAuthKeyInfo?.roleUniqueName, obj.data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    // this.hasUnsavedChanges.emit(false);
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
        let arow = this.createCompanyAuthKeyForm.get(type) as UntypedFormArray;
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
        const arow = this.createCompanyAuthKeyForm.get(type) as UntypedFormArray;
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
     * Callback for translation completion
     *
     * @param {*} event
     * @memberof CreateDiscountComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            // this.initDiscountTypeOptions();
        }
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
