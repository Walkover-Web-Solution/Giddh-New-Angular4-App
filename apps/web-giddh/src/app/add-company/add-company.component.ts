import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { LoginActions } from "../actions/login.action";
import { BusinessTypes, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_UTIL_URL, OTP_PROVIDER_URL, OTP_WIDGET_ID_NEW, OTP_WIDGET_TOKEN_NEW } from '../app.constant';
import { CountryRequest, OnboardingFormRequest } from "../models/api-models/Common";
import { Addresses, CompanyCreateRequest, CompanyResponse, SocketNewCompanyRequest, StatesRequest } from "../models/api-models/Company";
import { UserDetails } from "../models/api-models/loginModels";
import { CompanyService } from "../services/company.service";
import { GeneralService } from "../services/general.service";
import { ToasterService } from "../services/toaster.service";
import { AppState } from "../store";
import { ItemOnBoardingState } from "../store/item-on-boarding/item-on-boarding.reducer";
import { IOption } from "../theme/ng-select/option.interface";
import { PageLeaveUtilityService } from "../services/page-leave-utility.service";
import { MatDialog } from "@angular/material/dialog";
import { VerifyMobileActions } from "../actions/verify-mobile.actions";
import { AuthService } from "../theme/ng-social-login-module/index";
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { HttpClient } from "@angular/common/http";
import { AddCompanyComponentStore } from "./utility/add-company.store";
import { userLoginStateEnum } from "../models/user-login-state";
import { CommonService } from "../services/common.service";

declare var initSendOTP: any;
declare var window: any;

@Component({
    selector: 'add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AddCompanyComponentStore]
})

export class AddCompanyComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('stepper') stepperIcon: any;
    /** Mobile number field instance */
    @ViewChild('mobileNoField', { static: false }) mobileNoField: ElementRef;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if user doesn't have mobile number and we have to provide field to input mobile number */
    public showMobileField: boolean = false;
    /** This will hold mobile number field input  */
    public intl: any;
    /** This will hold if mobile number is invalid */
    public isMobileNumberInvalid: boolean = false;
    /** Form Group for company form */
    public companyForm: UntypedFormGroup;
    /** Form Group for company form */
    public firstStepForm: UntypedFormGroup;
    /** Form Group for company address form */
    public secondStepForm: UntypedFormGroup;
    /** Form Group for subscription company form */
    public thirdStepForm: UntypedFormGroup;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** This will hold company create object  */
    public company: CompanyCreateRequest = {
        name: '',
        country: '',
        phoneCode: '',
        contactNo: '',
        uniqueName: '',
        isBranch: false,
        subscriptionRequest: {
            planUniqueName: '',
            subscriptionId: '',
            userUniqueName: '',
            licenceKey: ''
        },
        addresses: [],
        pincode: '',
        businessNature: '',
        businessType: '',
        address: '',
        industry: '',
        baseCurrency: '',
        isMultipleCurrency: false,
        city: '',
        email: '',
        taxes: [],
        userBillingDetails: {
            name: '',
            email: '',
            contactNo: '',
            gstin: '',
            stateCode: '',
            address: '',
            autorenew: ''
        },
        nameAlias: '',
        paymentId: '',
        amountPaid: '',
        razorpaySignature: '',
        creatorSuperAdmin: false,
        permission: [{
            emailId: '',
            entity: 'company',
            roleUniqueName: ''
        }]
    };
    /** Data for query params */
    public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
    /** Observable to company response */
    public companies$: Observable<CompanyResponse[]>;
    /** Hold countries list */
    public countries: IOption[] = [];
    /** Hold currencies list */
    public currencies: IOption[] = [];
    /** Hold taxes list */
    public taxesList: any = [];
    /** Hold current taxes list */
    public currentTaxList: any[] = [];
    /** Hold business type list */
    public businessTypeList: IOption[] = [];
    /** Hold business nature list */
    public businessNatureList: IOption[] = [{ label: "Food", value: "Food" }, { label: "Service", value: "Service" }, { label: "Manufacturing", value: "Manufacturing" }, { label: "Retail", value: "Retail" }];
    /** Stores the item on boarding store data */
    public itemOnBoardingDetails: ItemOnBoardingState;
    /** Hold state gst code list */
    public stateGstCode: any[] = [];
    /** Hold states list */
    public states: IOption[] = [];
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected country */
    public selectedCountry: string = '';
    /** Hold selected country code*/
    public selectedCountryCode: string = '';
    /** Hold selected state */
    public selectedState: string = '';
    /** Hold selected state */
    public selectedStateCode: string = '';
    /** Hold form fields from forms api */
    public formFields: any[] = [];
    /** Hold active company */
    public activeCompany: any;
    /** Hold address form */
    public addressesObj: Addresses = {
        stateCode: '',
        address: '',
        isDefault: false,
        stateName: '',
        taxNumber: '',
        pincode: ''
    };
    /** Hold logged user */
    public loggedInUser: UserDetails;
    /** True if other country selected */
    public isOtherCountry: boolean = false;
    /** Constant for business type */
    public businessTypes = BusinessTypes;
    /** Hold current flag*/
    public currentFlag: any;
    /** Hold selected tab*/
    public selectedStep: number = 0;
    /** List of counties of country */
    public countyList: IOption[] = [];
    /** List of registered business type countries */
    public registeredTypeCountryList: any[] = ["IN", "GB", "AE", "ZW", "KE"];
    /** This will hold disable State */
    public disabledState: boolean = false;
    /** Returns true if company created */
    public isCompanyCreated: boolean = false;
    /**Observable to login with social account */
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    /** List of companies */
    public companiesList: any[] = [];
    /** Holds mobile number of user */
    public mobileNo: string = "";
    /** True if need to show otp field */
    public showOtpField: boolean = false;
    /** Holds otp request id */
    public otpRequestId: string = "";
    /** This will hold if mobile number is verified */
    public isMobileNumberVerified: boolean = false;
    /** True if send otp in progress */
    public sendOtpInProgress: boolean = false;
    /** True if resend otp in progress */
    public resendOtpInProgress: boolean = false;
    /** True if verify otp in progress */
    public verifyOtpInProgress: boolean = false;
    /** True if need to focus in otp field */
    public showFocusInOtpField: boolean = false;
    /** Hold selected role */
    public selectedRole: string = '';
    /** Holds Store permission roles API response state as observable*/
    public permissionRoles$ = this.componentStore.select(state => state.permissionRoles);
    /** List of permission  roles */
    public permissionRoles: any[] = [
        { label: 'View', value: 'view' },
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' }
    ];
    /** True if user is super admin */
    public isUserSuperAdmin: boolean = false;
    /** Hold permission role index */
    public permissionRoleIndex: number;
    /** Hold session source observable*/
    public session$: Observable<userLoginStateEnum>;
    /** True if new user logged in */
    public isNewUserLoggedIn: boolean = false;
    /** True if is come from subscription */
    public isCreateBySubscription: boolean = false;


    /** Returns true if form is dirty else false */
    public get showPageLeaveConfirmation(): boolean {
        return !this.isCompanyCreated && this.firstStepForm?.dirty;
    }

    constructor(
        private formBuilder: UntypedFormBuilder,
        private toaster: ToasterService,
        private componentStore: AddCompanyComponentStore,
        private http: HttpClient,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private companyService: CompanyService,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
        private companyActions: CompanyActions,
        private route: Router,
        private loginAction: LoginActions,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        public dialog: MatDialog,
        private verifyActions: VerifyMobileActions,
        private socialAuthService: AuthService,
        private activateRoute: ActivatedRoute,
        public router: Router,
        private commonService: CommonService
    ) {
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(state => state.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
        this.session$ = this.store.pipe(select(state => state.session.userLoginState), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    /**
     * On init component hook
     *
     * @memberof AddCompanyComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('create-company');
        this.initCompanyForm();
        this.getStates();
        this.getCurrency();

        this.activateRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.subscriptionId) {
                this.company.subscriptionRequest.subscriptionId = res?.subscriptionId;
                this.getCountryListBySubscriptionId(res?.subscriptionId);
                this.isCreateBySubscription = true;
            }
        });

        this.session$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isNewUserLoggedIn = response === userLoginStateEnum.newUserLoggedIn;
        });

        /** Library to separate phone number and calling code */
        if (window['libphonenumber'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.10.41/libphonenumber-js.min.js';
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            document.body.appendChild(scriptTag);
        }
        /** Library to separate phone number and calling code */

        this.loggedInUser = this.generalService.user;
        this.company.subscriptionRequest.userUniqueName = (this.loggedInUser) ? this.loggedInUser.uniqueName : "";

        this.store.pipe(select(response => response.session.companies), takeUntil(this.destroyed$)).subscribe(companyList => {
            this.companiesList = companyList;
        });

        let mappings = this.thirdStepForm.get('permissionRoles') as FormArray;
        mappings.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroyed$), distinctUntilChanged((prev, current) => current?.[this.permissionRoleIndex]?.emailId === prev?.[this.permissionRoleIndex]?.emailId)).subscribe((res) => {
            if (this.permissionRoleIndex === null || this.permissionRoleIndex === undefined) {
                return;
            }
            const index = this.permissionRoleIndex;
            let change = mappings.at(index);
            if (change?.get('emailId')?.value && change?.get('emailId')?.status === 'VALID') {
                this.updateSelectRoleValue(index, 'super_admin');
            } else {
                this.updateSelectRoleValue(index, '');
            }
        });

        this.store.pipe(select(response => response.common.onboardingform), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.fields) {
                    Object.keys(response.fields)?.forEach(key => {
                        if (response.fields[key]) {
                            this.formFields[response.fields[key].name] = [];
                            this.formFields[response.fields[key].name] = response.fields[key];
                        }
                    });
                    this.changeDetection.detectChanges();
                }
                if (response.applicableTaxes) {
                    this.taxesList = [];
                    Object.keys(response.applicableTaxes)?.forEach(key => {
                        if (response.applicableTaxes[key]) {
                            this.taxesList.push({
                                label: response.applicableTaxes[key]?.name,
                                value: response.applicableTaxes[key]?.uniqueName,
                                isSelected: false
                            });
                            this.currentTaxList[response.applicableTaxes[key]?.uniqueName] = [];
                            this.currentTaxList[response.applicableTaxes[key]?.uniqueName] = response.applicableTaxes[key];
                        }
                    });
                    this.changeDetection.detectChanges();
                }
            }
        });

        this.store.pipe(select(state => state.session.user), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.user?.contactNo) {
                this.showMobileField = false;
                this.mobileNo = response.user.contactNo;
                this.firstStepForm.get('mobileNo')?.removeValidators(Validators.required);
            } else {
                this.showMobileField = true;
                this.firstStepForm.get('mobileNo')?.addValidators(Validators.required);
                this.initMobileNumberField();
            }
        });

        this.changeDetection.detectChanges();
    }

    /**
     * Resets the verified mobile number
     *
     * @memberof AddCompanyComponent
     */
    public reVerifyNumber(): void {
        this.isMobileNumberVerified = false;
        this.showOtpField = false;
        this.firstStepForm.get('mobileOtp')?.patchValue("");
        this.changeDetection.detectChanges();
    }

    /**
     * This will be use for get country list by subscription id
     *
     * @param {*} subscriptionId
     * @memberof AddCompanyComponent
     */
    public getCountryListBySubscriptionId(subscriptionId: any): void {
        this.companyService.countryListBySubscriptionId(subscriptionId).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response) {
                this.countries = [];
                Object.keys(response?.body)?.forEach(key => {
                    this.countries.push({
                        value: response?.body[key]?.alpha2CountryCode,
                        label: response?.body[key]?.alpha2CountryCode + ' - ' + response?.body[key]?.countryName,
                        additional: response?.body[key]
                    });
                });
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }


    /**
     * Inits mobile number field
     *
     * @memberof AddCompanyComponent
     */
    public initMobileNumberField(): void {
        let interval = setInterval(() => {
            if (this.mobileNoField) {
                setTimeout(() => {
                    this.showPhoneNumberField();
                }, 100);
                clearInterval(interval);
            }
        }, 500);

        let configuration = {
            widgetId: OTP_WIDGET_ID_NEW,
            tokenAuth: OTP_WIDGET_TOKEN_NEW,
            exposeMethods: true,
            success: (data: any) => { },
            failure: (error: any) => {
                this.toaster.showSnackBar("error", error?.message);
            }
        };

        /* OTP LOGIN */
        if (window['initSendOTP'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = OTP_PROVIDER_URL;
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            scriptTag.onload = () => {
                initSendOTP(configuration);
            };
            document.body.appendChild(scriptTag);
        } else {
            initSendOTP(configuration);
        }
    }

    /**
     * Sends otp
     *
     * @returns {void}
     * @memberof AddCompanyComponent
     */
    public sendOtp(): void {
        this.isMobileNumberVerified = false;
        let mobileNo = this.intl.getNumber();
        mobileNo = mobileNo?.replace("+", "");
        if (!mobileNo || this.isMobileNumberInvalid) {
            this.toaster.showSnackBar("error", this.localeData?.enter_valid_mobile_number);
            return;
        }
        this.sendOtpInProgress = true;
        window.sendOtp(mobileNo, (data) => { this.mobileOtpSentCallback(data); }, (error) => { this.mobileOtpFailedCallback(error) });
        this.changeDetection.detectChanges();
    }

    /**
     * OTP sent callback
     *
     * @private
     * @param {*} data
     * @memberof AddCompanyComponent
     */
    private mobileOtpSentCallback(data: any): void {
        this.sendOtpInProgress = false;
        this.otpRequestId = data?.message;
        this.showOtpField = true;
        this.showHideFocusFromOtpField(true);
        this.toaster.showSnackBar("success", this.localeData?.otp_sent);
        this.changeDetection.detectChanges();
    }

    /**
     * Focus in otp field
     *
     * @param {boolean} value
     * @memberof AddCompanyComponent
     */
    public showHideFocusFromOtpField(value: boolean): void {
        this.showFocusInOtpField = value;
        this.changeDetection.detectChanges();
    }

    /**
     * OTP sent fail callback
     *
     * @private
     * @param {string} error
     * @memberof AddCompanyComponent
     */
    private mobileOtpFailedCallback(error: string): void {
        this.sendOtpInProgress = false;
        this.changeDetection.detectChanges();
        this.toaster.showSnackBar("error", error);
    }

    /**
     * Resends otp
     *
     * @memberof AddCompanyComponent
     */
    public resendOtp(): void {
        this.resendOtpInProgress = true;
        this.isMobileNumberVerified = false;
        this.showHideFocusFromOtpField(true);
        this.firstStepForm.get('mobileOtp')?.patchValue("");
        window.retryOtp(11, (data) => { this.retrySendOtpSuccessCallback(); }, (error) => { this.retrySendOtpErrorCallback(error); }, this.otpRequestId);
        this.changeDetection.detectChanges();
    }

    /**
     * Resend otp callback
     *
     * @private
     * @memberof AddCompanyComponent
     */
    private retrySendOtpSuccessCallback(): void {
        this.toaster.showSnackBar("success", this.localeData?.otp_resent);
        this.resendOtpInProgress = false;
        this.changeDetection.detectChanges();
    }

    /**
     * Resend otp error callback
     *
     * @private
     * @param {string} error
     * @memberof AddCompanyComponent
     */
    private retrySendOtpErrorCallback(error: string): void {
        this.resendOtpInProgress = false;
        this.changeDetection.detectChanges();
        this.toaster.showSnackBar("error", error);
    }

    /**
     * Verify otp
     *
     * @memberof AddCompanyComponent
     */
    public verifyOtp(): void {
        if (!this.firstStepForm.get('mobileOtp')?.value?.trim()) {
            this.toaster.showSnackBar("error", this.localeData?.enter_valid_otp);
            return;
        }
        this.verifyOtpInProgress = true;
        window.verifyOtp(this.firstStepForm.get('mobileOtp')?.value, (data) => { this.verifyOtpSuccessCallback(); }, (error) => { this.verifyOtpErrorCallback(error); }, this.otpRequestId);
        this.changeDetection.detectChanges();
    }

    /**
     * Verify otp callback
     *
     * @private
     * @memberof AddCompanyComponent
     */
    private verifyOtpSuccessCallback(): void {
        this.verifyOtpInProgress = false;
        this.isMobileNumberVerified = true;
        this.showOtpField = false;
        this.toaster.showSnackBar("success", this.localeData?.mobile_verified);
        this.changeDetection.detectChanges();
    }

    /**
     * Verify otp error callback
     *
     * @private
     * @param {string} error
     * @memberof AddCompanyComponent
     */
    private verifyOtpErrorCallback(error: string): void {
        this.verifyOtpInProgress = false;
        this.isMobileNumberVerified = false;
        this.changeDetection.detectChanges();
        this.toaster.showSnackBar("error", error);
    }

    /**
    * Initializing the company form
    *
    * @private
    * @memberof AddCompanyComponent
    */
    private initCompanyForm(): void {
        this.firstStepForm = this.formBuilder.group({
            name: ['', Validators.required],
            country: ['', Validators.required],
            currency: ['', Validators.required],
            mobile: [''],
            mobileOtp: ['']
        });

        this.secondStepForm = this.formBuilder.group({
            businessType: [''],
            businessNature: [''],
            gstin: [''],
            state: [''],
            county: [''],
            taxes: null,
            pincode: [''],
            address: [''],
        });

        this.thirdStepForm = this.formBuilder.group({
            creatorSuperAdmin: [''],
            permissionRoles: this.formBuilder.array([
                this.formBuilder.group({
                    emailId: ['', Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)],
                    roleUniqueName: [''],
                    entity: ['company']
                }),
            ]),
        });

        this.companyForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm
        });

        this.firstStepForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
    }

    /**
     * This will be use for add new user
     *
     * @param {*} [user]
     * @memberof AddCompanyComponent
     */
    public addNewUser(): void {
        const isSuperAdmin = Boolean(this.thirdStepForm.get('creatorSuperAdmin').value) === false;
        let mappings = this.thirdStepForm.get('permissionRoles') as FormArray;
        let mappingForm = this.formBuilder.group({
            emailId: ['', Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)], // Add email validation
            roleUniqueName: [''],
            entity: ['company']
        });
        if (isSuperAdmin) {
            mappingForm.get('roleUniqueName').setValidators(Validators.required);
            mappingForm.get('roleUniqueName').updateValueAndValidity();
        }
        mappings.push(mappingForm);
    }



    /**
     * This will be use for remove  user
     *
     * @param {number} index
     * @memberof AddCompanyComponent
     */
    public removeUser(index: number): void {
        let mappings = this.thirdStepForm.get('permissionRoles') as FormArray;
        if (index === 0) {
            mappings.reset(); // Reset the control at index 0
        } else {
            mappings.removeAt(index);
        }
    }

    /**
     * This will called after component initialization
     *
     * @memberof AddCompanyComponent
     */
    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
    }

    /**
     * This will use validate gst number
     *
     * @memberof AddCompanyComponent
     */
    public validateGstNumber(): void {
        let isValid: boolean = false;
        if (this.secondStepForm.get('gstin')?.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(this.secondStepForm.get('gstin')?.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                let text = this.localeData?.invalid_tax;
                text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                this.toaster.showSnackBar("error", text);
                this.selectedState = '';
                this.selectedStateCode = '';
                this.isGstinValid = false;
            } else {
                this.isGstinValid = true;
                if (this.selectedCountryCode === 'IN') {
                    this.getGstConfirmationPopup();
                }
            }
        }

        if (this.secondStepForm.get('gstin')?.value?.length >= 2) {
            this.states?.find((state) => {
                let code = this.secondStepForm.get('gstin')?.value?.substr(0, 2);
                let matchCode = state.stateGstCode == code;
                this.disabledState = false;
                if (matchCode) {
                    this.disabledState = true;
                    this.selectedState = state.label;
                    this.selectedStateCode = state.value;
                    this.secondStepForm.controls['state'].setValue({ label: state?.label, value: state?.value });
                    return true;
                }
            });
        } else {
            this.disabledState = false;
            this.isGstinValid = false;
            this.selectedState = '';
            this.selectedStateCode = '';
        }
        this.changeDetection.detectChanges();
    }


    /**
     * This will open for get gst information confirmation dialog
     *
     * @memberof AddCompanyComponent
     */
    public getGstConfirmationPopup(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.commonLocaleData?.app_gst_confirm_message1,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_gst_confirm_message2
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.commonService.getGstInformationDetails(this.secondStepForm.get('gstin')?.value).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                    if (result) {
                        let completeAddress = this.generalService.getCompleteAddres(result.body?.pradr?.addr);
                        this.firstStepForm.get('name')?.patchValue(result.body?.lgnm);
                        this.secondStepForm.get('address')?.patchValue(completeAddress);
                        this.secondStepForm.get('pincode')?.patchValue(result.body?.pradr?.addr?.pncd);
                    }
                });
            }
        });
    }

    /**
    * This will return enter tax text
    *
    * @returns {string}
    * @memberof AddCompanyComponent
    */
    public getEnterTaxText(): string {
        let text = this.localeData?.enter_tax;
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

    /**
     * This will use for get states list
     *
     * @memberof AddCompanyComponent
     */
    public getStates() {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.states = [];
                this.countyList = [];

                if (response.stateList) {
                    Object.keys(response.stateList).forEach(key => {
                        if (key) {
                            if (response.stateList[key].stateGstCode !== null) {
                                this.stateGstCode[response.stateList[key].stateGstCode] = [];
                                this.stateGstCode[response.stateList[key].stateGstCode] = response.stateList[key].code;
                            }
                            this.states.push({
                                label: response.stateList[key].code + ' - ' + response.stateList[key].name,
                                value: response.stateList[key].code,
                                stateGstCode: response.stateList[key].stateGstCode
                            });
                        }
                    });
                }

                if (response.countyList) {
                    this.countyList = response.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }
            }
        });
    }

    /**
     * Get countries list
     *
     * @memberof AddCompanyComponent
     */
    public getCountry(): void {
        this.store.pipe(select(response => response.common.countries), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.countries = [];
                Object.keys(response).forEach(key => {
                    this.countries.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName,
                        additional: response[key]
                    });
                });
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    /**
     * Get currencies list
     *
     * @memberof AddCompanyComponent
     */
    public getCurrency(): void {
        this.store.pipe(select(state => state.session.currencies), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.currencies = [];
                Object.keys(response).forEach(key => {
                    this.currencies.push({ label: response[key].code, value: response[key].code });
                });
            }
        });
    }

    /**
     *This will use for select currency
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCurrency(event: any): void {
        if (event) {
            this.firstStepForm.controls['currency'].setValue({ label: event?.label, value: event?.value });
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for selected tab index
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public onSelectedTab(event: any): void {
        this.selectedStep = event?.selectedIndex;
        if (this.showMobileField) {
            setTimeout(() => {
                let currencyFlag = this.intl?.getSelectedCountryData();
                this.currentFlag = currencyFlag?.iso2;
                this.changeDetection.detectChanges();
            }, 500);
        }
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCountry(event: any): void {
        if (event?.value) {
            this.selectedCountry = event.label;
            this.selectedCountryCode = event.value;
            this.secondStepForm.get('gstin')?.setValue('');
            this.secondStepForm.get('state')?.setValue('');
            this.selectedState = "";
            this.selectedStateCode = "";
            this.disabledState = false;
            this.businessTypeList = [];

            if (!this.registeredTypeCountryList.includes(event.value)) {
                this.isOtherCountry = true;
                this.secondStepForm.controls['businessType'].setValue(this.businessTypes.Unregistered);
                this.businessTypeList.push({ label: this.localeData.unregistered, value: this.businessTypes.Unregistered });
                this.selectBusinessType(this.businessTypes.Unregistered);
            } else {
                this.isOtherCountry = false;
                this.businessTypeList.push({ label: this.localeData.registered, value: this.businessTypes.Registered }, { label: this.localeData.unregistered, value: this.businessTypes.Unregistered });
            }
            this.firstStepForm.controls['country'].setValue(event);
            this.company.baseCurrency = event?.additional?.currency?.code;
            this.firstStepForm.controls['currency'].setValue({ label: event?.additional?.currency?.code, value: event?.additional?.currency?.code });

            if (this.showMobileField) {
                this.intl?.setCountry(event.value?.toLowerCase());

                let phoneNumber = this.intl?.getNumber();

                if (phoneNumber?.length) {
                    let input = document.getElementById('init-contact-proforma');
                    const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
                    const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
                    let reset = () => {
                        input?.classList?.remove("error");
                        if (errorMsg && validMsg) {
                            errorMsg.innerHTML = "";
                            errorMsg.classList.add("d-none");
                            validMsg.classList.add("d-none");
                        }
                    };
                    let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
                    if (input) {
                        reset();
                        if (this.intl?.isValidNumber()) {
                            validMsg?.classList?.remove("d-none");
                            this.setMobileNumberValid(true);
                        } else {
                            input?.classList?.add("error");
                            this.setMobileNumberValid(false);
                            let errorCode = this.intl?.getValidationError();
                            if (errorMsg && errorMap[errorCode]) {
                                this.toaster.showSnackBar("error", this.localeData?.invalid_contact_number);
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("d-none");
                            }
                        }
                    } else {
                        this.setMobileNumberValid(true);
                    }
                }
            }

            let onboardingFormRequest = new OnboardingFormRequest();
            onboardingFormRequest.formName = 'onboarding';
            onboardingFormRequest.country = event.value;
            this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));

            let statesRequest = new StatesRequest();
            statesRequest.country = event.value;
            this.store.dispatch(this.generalActions.getAllState(statesRequest));
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for mobile number
     *
     * @memberof AddCompanyComponent
     */
    public showPhoneNumberField(): void {
        let input = document.getElementById('init-contact-proforma');
        const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
        const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
        let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
        const intlTelInput = !isElectron ? window['intlTelInput'] : window['intlTelInputGlobals']['electron'];
        if (intlTelInput && input) {
            this.intl = intlTelInput(input, {
                nationalMode: true,
                utilsScript: MOBILE_NUMBER_UTIL_URL,
                autoHideDialCode: false,
                separateDialCode: false,
                initialCountry: 'auto',
                geoIpLookup: (success, failure) => {
                    let countryCode = 'in';
                    const fetchIPApi = this.http.get<any>(MOBILE_NUMBER_SELF_URL);
                    fetchIPApi.subscribe(
                        (response) => {
                            if (response?.ipAddress) {
                                return success(response.countryCode);
                            } else {
                                return success(countryCode);
                            }
                        },
                        (err) => {
                            return success(countryCode);
                        }
                    );
                },
            });
            let reset = () => {
                input?.classList?.remove("error");
                if (errorMsg && validMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("d-none");
                    validMsg.classList.add("d-none");
                }
            };
            input.addEventListener('blur', () => {
                let phoneNumber = this.intl?.getNumber();
                reset();
                if (input) {
                    if (phoneNumber?.length) {
                        if (this.intl?.isValidNumber()) {
                            validMsg?.classList?.remove("d-none");
                            this.setMobileNumberValid(true);
                        } else {
                            input?.classList?.add("error");
                            this.setMobileNumberValid(false);
                            let errorCode = this.intl?.getValidationError();
                            if (errorMsg && errorMap[errorCode]) {
                                this.toaster.showSnackBar("error", this.localeData?.invalid_contact_number);
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("d-none");
                            }
                        }
                    } else {
                        this.setMobileNumberValid(true);
                    }
                }
            });
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for set mobile number validation.
     *
     * @param {boolean} value
     * @memberof AddCompanyComponent
     */
    public setMobileNumberValid(value: boolean): void {
        this.firstStepForm.controls['mobile'].setErrors(value ? null : { invalidMobileNumber: true });
        this.isMobileNumberInvalid = !value;
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for next step form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public nextStepForm(): void {
        this.isFormSubmitted = false;
        if ((this.selectedStep === 0 && this.firstStepForm.invalid) || (this.showMobileField && !this.isMobileNumberVerified)) {
            this.isFormSubmitted = true;
            if (!this.firstStepForm.invalid && this.showMobileField && !this.isMobileNumberVerified) {
                this.toaster.showSnackBar("error", this.localeData?.verify_number);
            }
            return;
        }

        if (this.selectedStep === 1 && this.secondStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        if (this.isNewUserLoggedIn && this.selectedStep === 2 && this.thirdStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        this.firstStepForm.controls['mobile'].setValue(this.showMobileField ? this.intl?.getNumber() : this.mobileNo);
        this.selectedStep++;
        this.company.name = this.firstStepForm.controls['name'].value;
        this.company.country = this.firstStepForm.controls['country'].value.value;
        this.company.baseCurrency = this.firstStepForm.controls['currency'].value.value;
        this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
        this.generalService.createNewCompany = this.company;
        if (PRODUCTION_ENV && this.companiesList?.length === 0) {
            this.sendNewUserInfo();
            this.fireSocketCompanyCreateRequest();
        }
    }


    /**
     * Get random string for company
     *
     * @private
     * @param {string} companyName
     * @param {string} country
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private getRandomString(companyName: string, country: string): string {
        if (companyName) {
            let date, dateString, randomGenerate, strings;
            companyName = this.removeSpecialCharacters(companyName);
            country = this.removeSpecialCharacters(country);
            date = new Date();
            dateString = date.getTime()?.toString();
            randomGenerate = this.getSixCharRandom();
            strings = [companyName, country, dateString, randomGenerate];
            return strings.join('');
        }
    }

    /**
     * Remove special characters from company name
     *
     * @private
     * @param {string} value
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private removeSpecialCharacters(value: string): string {
        let finalString = value?.replace(/[^a-zA-Z0-9]/g, '');
        return finalString?.substr(0, 6)?.toLowerCase();
    }

    /**
     * Get six character random company name
     *
     * @private
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private getSixCharRandom(): string {
        return Math.random().toString(36)?.replace(/[^a-zA-Z0-9]+/g, '')?.substr(0, 6);
    }

    /**
     * Fire socket api call on create company
     *
     * @memberof AddCompanyComponent
     */
    public fireSocketCompanyCreateRequest(): void {
        this.socketCompanyRequest.CompanyName = this.company.name;
        this.socketCompanyRequest.Timestamp = Date.now();
        this.socketCompanyRequest.LoggedInEmailID = this.generalService.user.email;
        this.socketCompanyRequest.MobileNo = this.firstStepForm.controls['mobile'].value;
        this.socketCompanyRequest.Name = this.generalService.user.name;
        this.socketCompanyRequest.utm_source = this.generalService.getUtmParameter('utm_source');
        this.socketCompanyRequest.utm_medium = this.generalService.getUtmParameter('utm_medium');
        this.socketCompanyRequest.utm_campaign = this.generalService.getUtmParameter('utm_campaign');
        this.socketCompanyRequest.utm_term = this.generalService.getUtmParameter('utm_term');
        this.socketCompanyRequest.utm_content = this.generalService.getUtmParameter('utm_content');
        this.companyService.SocketCreateCompany(this.socketCompanyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => { });
        this.generalService.removeUtmParameters();
    }

    /**
     * Sends new user info to 3rd party
     *
     * @memberof AddCompanyComponent
     */
    public sendNewUserInfo(): void {
        let newUserInfo = {
            name: this.company.name,
            currency: this.company.baseCurrency,
            contactNo: this.firstStepForm.controls['mobile'].value,
            source: this.generalService.getUtmParameter('utm_source'),
            medium: this.generalService.getUtmParameter('utm_medium'),
            campaign: this.generalService.getUtmParameter('utm_campaign'),
            term: this.generalService.getUtmParameter('utm_term'),
            content: this.generalService.getUtmParameter('utm_content'),
            country: this.company.country
        };
        this.companyService.sendNewUserInfo(newUserInfo).pipe(take(1)).subscribe(response => { });
    }

    /**
     * This will use for select state
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectState(event: any): void {
        this.selectedStateCode = event?.value;
        this.selectedState = event?.label;
        this.secondStepForm.controls['state']?.setValue(this.selectedStateCode);
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for on submit company form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.companyForm.invalid || (!this.isGstinValid && this.secondStepForm.controls['businessType'].value === BusinessTypes.Registered)) {
            this.isFormSubmitted = true;
            return;
        }

        let number = "";
        let countryCode = "";

        if (!this.showMobileField) {
            if (this.mobileNo) {
                let parsedMobileNo = window['libphonenumber']?.parsePhoneNumber("+" + this.mobileNo);
                number = parsedMobileNo?.nationalNumber ?? this.mobileNo;
                countryCode = parsedMobileNo?.countryCallingCode;
            }
        } else {
            const phoneNumber = this.intl.getNumber();
            countryCode = this.intl.getSelectedCountryData().dialCode;
            number = phoneNumber.replace(countryCode, '').trim();
            number = number.substring(1);
        }

        let taxDetails = this.prepareTaxDetail(this.companyForm);
        this.company.name = this.firstStepForm.value.name;
        this.company.country = this.firstStepForm.value.country.value;
        this.company.businessNature = this.secondStepForm.value.businessNature;
        this.company.businessType = this.secondStepForm.value.businessType;
        this.company.contactNo = number;
        this.company.phoneCode = countryCode;
        this.company.addresses = [taxDetails];
        this.company.pincode = taxDetails[0]?.pincode;
        this.company.address = taxDetails[0]?.address;
        this.company.taxes = this.secondStepForm.value.taxes;
        this.generalService.createNewCompany = this.company;
        this.company.permission = this.thirdStepForm.value.permissionRoles;
        this.company.creatorSuperAdmin = this.thirdStepForm.value.creatorSuperAdmin;
        this.isLoading = true;
        if (this.thirdStepForm.value.creatorSuperAdmin && !this.thirdStepForm.value.permissionRoles[0]?.emailId) {
            delete this.company.permission;
        }
        if (!this.isNewUserLoggedIn) {
            delete this.company.permission;
            delete this.company.creatorSuperAdmin;
        }
        this.companyService.CreateNewCompany(this.company).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                this.store.dispatch(this.companyActions.CreateNewCompanyResponse(response));
                this.generalService.companyUniqueName = response?.body?.uniqueName;

                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                this.isCompanyCreated = true;
                this.firstStepForm.markAsPristine();

                setTimeout(() => {
                    this.store.dispatch(this.loginAction.ChangeCompany(response?.body?.uniqueName));
                    this.route.navigate(['/pages', 'onboarding']);
                }, 500);
            } else {
                this.isLoading = false;
                this.toaster.showSnackBar("error", response?.message);

                if (this.showMobileField) {
                    let mobileNo = this.intl?.getNumber();

                    setTimeout(() => {
                        this.showPhoneNumberField();
                        setTimeout(() => {
                            this.intl?.setNumber(mobileNo);
                        }, 500);
                    }, 500);
                }

                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * This will use for select businss type
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectBusinessType(value: any): void {
        if (value) {
            this.secondStepForm.controls['businessType'].setValue(value);
            this.secondStepForm.get('gstin').removeValidators(Validators.required);
            this.secondStepForm.get('state').removeValidators(Validators.required);
            this.secondStepForm.get('county').removeValidators(Validators.required);
            this.secondStepForm.get('address').removeValidators(Validators.required);

            if (value === this.businessTypes.Registered) {
                this.secondStepForm.get('gstin').setValidators(Validators.required);
                if (this.countyList?.length) {
                    this.secondStepForm.get('county').setValidators(Validators.required);
                } else {
                    this.secondStepForm.get('state').setValidators(Validators.required);
                }
                this.secondStepForm.get('address').setValidators(Validators.required);
            } else {
                this.secondStepForm.get('gstin')?.setValue('');
                this.secondStepForm.get('state').removeValidators(Validators.required);
                this.isGstinValid = false;
                this.disabledState = false;
            }
            this.secondStepForm.get('gstin')?.updateValueAndValidity();
            this.secondStepForm.get('address')?.updateValueAndValidity();
            this.secondStepForm.get('state')?.updateValueAndValidity();
            this.secondStepForm.get('country')?.updateValueAndValidity();
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for select businss type
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectBusinessNature(event: any): void {
        if (event) {
            this.secondStepForm.controls['businessNature'].setValue(event.value);
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for prepare tax details
     *
     * @param {*} form
     * @return {*}
     * @memberof AddCompanyComponent
     */
    public prepareTaxDetail(form: any): any {
        if (form?.value) {
            this.addressesObj.taxNumber = form.value.secondStepForm.gstin;
            if (this.countyList?.length) {
                this.addressesObj.county = { code: form.value.secondStepForm.county?.value };
            } else {
                this.addressesObj.stateCode = this.selectedStateCode;
            }
            this.addressesObj.address = form.value.secondStepForm.address;
            this.addressesObj.pincode = form.value.secondStepForm.pincode;
            this.addressesObj.isDefault = false;
            this.addressesObj.stateName = this.selectedState;
            return this.addressesObj;
        }

        return null;
    }

    /**
     * This will open the logout confirmation dialog
     *
     * @memberof AddCompanyComponent
     */
    public openLogoutConfirmationDialog(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.localeData?.logout,
                body: this.localeData?.create_company_close,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                this.isCompanyCreated = true;
                this.firstStepForm.markAsPristine();
                this.logoutUser();
            } else {
                this.closeDialog()
            }
        });
    }

    /**
     * This will close the modal
     *
     * @memberof AddCompanyComponent
     */
    public closeDialog(): void {
        this.dialog?.closeAll();
    }

    /**
     * This will use for logout user
     *
     * @memberof AddCompanyComponent
     */
    public logoutUser(): void {
        this.store.dispatch(this.verifyActions.hideVerifyBox());
        this.dialog?.closeAll();
        if (isElectron) {
            this.store.dispatch(this.loginAction.ClearSession());
        } else {
            this.isLoggedInWithSocialAccount$.subscribe((val) => {
                if (val) {
                    this.socialAuthService.signOut().then().catch((err) => {
                    });
                    this.store.dispatch(this.loginAction.ClearSession());
                    this.store.dispatch(this.loginAction.socialLogoutAttempt());
                } else {
                    this.store.dispatch(this.loginAction.ClearSession());
                }
            });
        }
    }

    /**
     * Retrieves the roles for permissions and updates the component's state.
     * Invokes the `getPermissionRoles` method of `componentStore`.
     *
     * @memberof AddCompanyComponent
     */
    public getRoles(): void {
        this.componentStore.getPermissionRoles(null);
    }

    /**
     * Updates the selected role in the third step form.
     *
     * @param {*} event - The event containing the selected role.
     * @memberof AddCompanyComponent
     */
    public selectRole(event: any, index: number): void {
        const selectedRole = event?.value;
        const permissionRolesArray = this.thirdStepForm.get('permissionRoles') as FormArray;
        const permissionGroup = permissionRolesArray?.at(index) as FormGroup;
        permissionGroup.get('roleUniqueName')?.setValue(selectedRole);
    }

    /**
     * Sets the owner permission in the third step form.
     *
     * @param {*} event - The event containing the owner permission.
     * @memberof AddCompanyComponent
     */
    public setOwnerPermission(event: any): void {
        const isSuperAdmin = Boolean(event?.value) === true;
        this.thirdStepForm.get('creatorSuperAdmin').setValue(event?.value);
        const permissionRolesArray = this.thirdStepForm.get('permissionRoles') as FormArray;
        permissionRolesArray?.controls.forEach((permissionGroup: FormGroup) => {
            const roleUniqueNameControl = permissionGroup.get('roleUniqueName');
            if (isSuperAdmin) {
                roleUniqueNameControl.clearValidators();
            } else {
                roleUniqueNameControl.setValidators([Validators.required]); // Add your validators here
            }
            roleUniqueNameControl.updateValueAndValidity();
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.businessTypeList = [
                {
                    label: this.localeData?.registered,
                    value: this.businessTypes.Registered,
                },
                {
                    label: this.localeData?.unregistered,
                    value: this.businessTypes.Unregistered,
                }
            ];
            this.businessNatureList = [
                {
                    label: this.localeData?.food,
                    value: "Food",
                },
                {
                    label: this.localeData?.service,
                    value: "Service"
                },
                {
                    label: this.localeData?.manufacturing,
                    value: "Manufacturing"
                },
                {
                    label: this.localeData?.retails,
                    value: "Retail"
                }
            ];
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will be use for get permissions roles
     *
     * @memberof AddCompanyComponent
     */
    public getPermissionRoles(): void {
        this.permissionRoles$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.permissionRoles = response?.map(role => ({
                    label: role.name,
                    value: role?.uniqueName,
                    additional: role
                }));
            }
        });
    }

    /**
     * This wiill be use for update select role value
     *
     * @param {string} value
     * @memberof AddCompanyComponent
     */
    public updateSelectRoleValue(index: number, role: string): void {
        const mappings = this.thirdStepForm.get('permissionRoles') as FormArray;
        const userGroup = mappings?.at(index) as FormGroup;
        userGroup?.get('roleUniqueName').setValue(role);
    }

    /**
     * This will be use for back to previous page
     *
     * @memberof AddCompanyComponent
     */
    public back(): void {
        this.router.navigate(['/pages/subscription']);
    }

    /**
     * This will call on component destroy
     *
     * @memberof AddCompanyComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('create-company');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
