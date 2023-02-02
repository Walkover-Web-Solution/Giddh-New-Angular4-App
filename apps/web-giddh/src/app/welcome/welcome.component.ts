import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ElementRef, NgZone,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/min';
import { CommonActions } from '../actions/common.actions';
import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { OnBoardingType } from '../app.constant';
import { CountryRequest, OnboardingFormRequest } from '../models/api-models/Common';
import { Addresses, CompanyCreateRequest, StatesRequest, CreateCompanyUsersPlan, SubscriptionRequest } from '../models/api-models/Company';
import { IForceClear } from '../models/api-models/Sales';
import { CompanyService } from '../services/companyService.service';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store';
import { ItemOnBoardingState } from '../store/item-on-boarding/item-on-boarding.reducer';
import { IOption } from '../theme/ng-select/option.interface';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { UserDetails } from '../models/api-models/loginModels';

@Component({
    selector: 'welcome-component',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {
    public stateGstCode: any[] = [];
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    public countryPhoneCode: IOption[] = [];
    public callingCodesSource$: Observable<IOption[]> = observableOf([]);
    public companyProfileObj: any = null;
    public company: any = {};
    public createNewCompany: any = {};
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public states: IOption[] = [];
    public selectedBusinesstype: string = '';
    public selectedstateName: string = '';
    public selectedCountry = '';
    public isGstValid: boolean = true;
    public taxesList: any = [];
    public businessTypeList: IOption[] = [];
    public businessNatureList: IOption[] = [];
    public selectedTaxes: string[] = [];
    public isBranch: boolean = false;
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: true,
        backdrop: false,
        ignoreBackdropClick: true
    };
    public createNewCompanyPreparedObj: CompanyCreateRequest = {
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
        razorpaySignature: ''
    };
    public addressesObj: Addresses = {
        stateCode: '',
        address: '',
        isDefault: false,
        stateName: '',
        taxNumber: '',
        pincode: ''
    };
    public subscriptionPlan: CreateCompanyUsersPlan = {
        companies: null,
        totalCompanies: 0,
        userDetails: null,
        additionalTransactions: 0,
        createdAt: null,
        planDetails: {
            countries: [],
            name: "",
            uniqueName: "",
            createdAt: "",
            amount: 0,
            ratePerExtraTransaction: 0,
            isCommonPlan: true,
            duration: 0,
            companiesLimit: 0,
            durationUnit: "",
            transactionLimit: 0
        },
        additionalCharges: null,
        status: null,
        subscriptionId: null,
        balance: null,
        expiry: null,
        startedAt: null,
        companiesWithTransactions: null,
        companyTotalTransactions: null,
        totalTransactions: 0
    };
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public createNewCompanyPreObj: CompanyCreateRequest;
    public loggedInUser: UserDetails;
    public businessType: IOption[] = [];
    public formFields: any[] = [];
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public isTaxNumberSameAsHeadQuarter: number = 0;
    public activeCompany: any;
    public currentTaxList: any[] = [];
    /** Stores the item on boarding store data */
    public itemOnBoardingDetails: ItemOnBoardingState;
    /** True, if on boarding is going on */
    public isOnBoardingInProgress: boolean;
    /** True, if item update is in progress */
    public isItemUpdateInProgress: boolean;
    /** Event emitter to represent back button click */
    @Output() backButtonClicked: EventEmitter<any> = new EventEmitter();
    /** Event emitter to represent next button click */
    @Output() nextButtonClicked: EventEmitter<any> = new EventEmitter();
    /** Item details to be pre-filled in welcome form */
    @Input() itemDetails: any;
    /** True if API is in progress */
    @Input() isApiInProgress: boolean;
    /** States dropdown instance */
    @ViewChild('states', { static: true }) statesDropdown: ShSelectComponent;
    /** GST number field */
    @ViewChild('gstNumberField', { static: true }) gstNumberField: ElementRef<any>;
    /** Contact number field */
    @ViewChild('mobileNoEl', { static: true }) contactNumberField: ElementRef<any>;
    /** Address field */
    @ViewChild('address', { static: true }) addressField: ElementRef<any>;
    /** Form instance */
    @ViewChild('welcomeForm', { static: true }) welcomeForm: NgForm;
    /** Applicable taxes dropdown instance */
    @ViewChild('dropdown') public dropdown: any;

    /**
     * Returns true, if onboarding of Warehouse is going on
     *
     * @readonly
     * @type {boolean}
     * @memberof WelcomeComponent
     */
    public get isWarehouse(): boolean {
        return this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === 'Warehouse';
    }

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isCreateCompanyInProgress: boolean = false;
    public isCompanyCreated$: Observable<boolean>;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private generalService: GeneralService,
        private toasty: ToasterService,
        private companyActions: CompanyActions,
        private companyService: CompanyService,
        private generalActions: GeneralActions,
        private commonActions: CommonActions,
        private zone: NgZone
    ) {
        this.companyProfileObj = {};

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    public ngOnInit() {
        this.store.dispatch(this.generalActions.resetStatesList());
        this.store.dispatch(this.commonActions.resetOnboardingForm());

        this.store.pipe(select(state => state.itemOnboarding), takeUntil(this.destroyed$))
            .subscribe((itemOnBoardingDetails: ItemOnBoardingState) => {
                this.itemOnBoardingDetails = itemOnBoardingDetails;
                this.isOnBoardingInProgress = this.itemOnBoardingDetails && this.itemOnBoardingDetails.isOnBoardingInProgress;
                this.isItemUpdateInProgress = this.itemOnBoardingDetails && this.itemOnBoardingDetails.isItemUpdateInProgress;
            });
        this.store.pipe(select(state => state.warehouse), takeUntil(this.destroyed$)).subscribe((warehouseDetails: any) => {
            if (warehouseDetails) {
                this.isApiInProgress = false;
            }
        });
        this.store.pipe(select(appState => appState.session.isCompanyCreationInProcess), takeUntil(this.destroyed$)).subscribe(data => {
            this.isCreateCompanyInProgress = data;
        });

        if (this.isItemUpdateInProgress && this.company) {
            this.company.name = (this.itemDetails && this.itemDetails.name) ? this.itemDetails.name : '';
            this.company.phoneCode = (this.itemDetails && this.itemDetails.mobileNumber) ? this.getCallingCode(this.itemDetails.mobileNumber) : '';
            this.company.contactNo = (this.itemDetails && this.itemDetails.mobileNumber) ? this.getFormattedContactNumber(this.itemDetails.mobileNumber) : '';
            this.company.uniqueName = (this.itemDetails && this.itemDetails.uniqueName) ? this.itemDetails.uniqueName : '';
            this.company.country = (this.itemDetails && this.itemDetails.countryCode) ? this.itemDetails.countryCode : '';
            this.company.baseCurrency = (this.itemDetails && this.itemDetails.currencyCode) ? this.itemDetails.currencyCode : '';
            this.prepareWelcomeForm();
        } else {
            this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), take(1)).subscribe(res => {
                if (res) {
                    this.isBranch = res.isBranch;
                    this.createNewCompany = res;
                    this.company = this.createNewCompany;
                    this.company.contactNo = this.getFormattedContactNumber(this.company.contactNo);
                    this.prepareWelcomeForm();
                }
            });
        }
        if (!this.isOnBoardingInProgress) {
            this.companyService.GetAllBusinessNatureList().pipe(takeUntil(this.destroyed$)).subscribe((businessNatureResponse) => {
                if (businessNatureResponse && businessNatureResponse.body) {
                    _.map(businessNatureResponse.body, (businessNature) => {
                        this.businessNatureList.push({ label: businessNature, value: businessNature });
                    });
                }
                this.reFillForm();
            });
        }

        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.createNewCompanyPreObj = res;
            }
        });

        this.loggedInUser = this.generalService.user;
        this.subscriptionRequestObj.userUniqueName = (this.loggedInUser) ? this.loggedInUser.uniqueName : "";

        this.store.pipe(select(state => state.session.isCompanyCreated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.router.url.includes("welcome")) {
                this.router.navigate(['/pages/onboarding']);
            }
        });
    }

    public ngAfterViewInit() {
        this.generalService.IAmLoaded.next(true);
    }

    public reFillForm() {
        if (this.isOnBoardingInProgress) {
            this.fillOnBoardingDetails('ITEM');
        } else {
            this.companyProfileObj.businessNature = this.createNewCompany.businessNature;
            this.companyProfileObj.businessType = this.createNewCompany.businessType;
            this.selectedBusinesstype = this.createNewCompany.businessType;
            if (this.selectedBusinesstype === 'Registered') {
                if (this.createNewCompany.addresses !== undefined && this.createNewCompany.addresses[0] !== undefined) {
                    this.companyProfileObj.taxNumber = this.createNewCompany.addresses[0].taxNumber;
                }
            }
            this.companyProfileObj.address = this.createNewCompany.address;
        }
    }

    public reFillState() {
        if (this.createNewCompany.addresses !== undefined && this.createNewCompany.addresses[0] !== undefined) {
            this.companyProfileObj.state = this.createNewCompany.addresses[0].stateCode;

            let stateLoop = 0;
            for (stateLoop; stateLoop < this.states?.length; stateLoop++) {
                if (this.states[stateLoop]?.value === this.companyProfileObj.state) {
                    this.companyProfileObj.selectedState = this.states[stateLoop].label;
                }
            }
        } else if (this.isItemUpdateInProgress && this.isWarehouse) {
            // Prefill state details if warehouse update flow is carried out
            this.reFillForm();
        }
    }

    public reFillTax() {
        if (this.createNewCompany.taxes && this.createNewCompany.taxes.length > 0) {
            this.createNewCompany.taxes.forEach(tax => {
                if (this.currentTaxList[tax] !== undefined && this.selectedTaxes?.indexOf(tax) === -1) {
                    this.selectedTaxes.push(tax);

                    let matchedIndex = this.taxesList.findIndex(listedTax => listedTax.value === tax);
                    if (matchedIndex > -1) {
                        this.taxesList[matchedIndex].isSelected = true;
                    }
                }
            });
        }
    }

    public prepareWelcomeForm() {
        if (this.company && this.createNewCompanyPreparedObj) {
            this.createNewCompanyPreparedObj.name = this.company.name ? this.company.name : '';
            this.createNewCompanyPreparedObj.phoneCode = this.company.phoneCode ? this.company.phoneCode : '';
            this.createNewCompanyPreparedObj.contactNo = this.company.contactNo ? this.company.contactNo : '';
            this.createNewCompanyPreparedObj.uniqueName = this.company.uniqueName ? this.company.uniqueName : '';
            this.createNewCompanyPreparedObj.isBranch = this.company.isBranch;
            this.createNewCompanyPreparedObj.country = this.company.country ? this.company.country : '';
            this.createNewCompanyPreparedObj.baseCurrency = this.company?.baseCurrency ? this.company?.baseCurrency : '';
            this.createNewCompanyPreparedObj.nameAlias = this.company.nameAlias ? this.company.nameAlias : '';
            this.getCountry();
            this.getCurrency();
            this.getCallingCodes();
        }
    }

    public submit(welcomeForm: NgForm) {
        let isWelcomeFormValid: boolean = true;
        if (!this.isOnBoardingInProgress) {
            this.isCreateCompanyInProgress = true;
            this.createNewCompanyPreparedObj.businessNature = this.companyProfileObj.businessNature ? this.companyProfileObj.businessNature : '';
            this.createNewCompanyPreparedObj.businessType = this.companyProfileObj.businessType ? this.companyProfileObj.businessType : '';
            this.createNewCompanyPreparedObj.address = this.companyProfileObj.address ? this.companyProfileObj.address : '';
            this.createNewCompanyPreparedObj.taxes = (this.selectedTaxes?.length > 0) ? this.selectedTaxes : [];
            if (this.createNewCompanyPreparedObj.phoneCode && this.createNewCompanyPreparedObj.contactNo) {
                if (!this.createNewCompanyPreparedObj.contactNo?.toString()?.includes('-')) {
                    this.createNewCompanyPreparedObj.contactNo = this.createNewCompanyPreparedObj.phoneCode + '-' + this.createNewCompanyPreparedObj.contactNo;
                }
            }
            let gstDetails = this.prepareGstDetail(this.companyProfileObj);
            if (gstDetails.taxNumber || gstDetails.address || gstDetails.stateCode || gstDetails.pincode) {
                this.createNewCompanyPreparedObj.addresses.push(gstDetails);
            } else {
                this.createNewCompanyPreparedObj.addresses = [];
            }

            this.generalService.createNewCompany = this.createNewCompanyPreparedObj;
            this.store.dispatch(this.companyActions.userStoreCreateCompany(this.createNewCompanyPreparedObj));
            setTimeout(() => {
                this.company.contactNo = this.getFormattedContactNumber(this.company.contactNo);
                this.createNewCompanyPreparedObj.contactNo = this.company.contactNo ? this.company.contactNo : '';
                if (this.isBranch) {
                    this.createBranch();
                } else {
                    this.createCompany();
                }
            }, 100);
        } else {
            this.isCreateCompanyInProgress = false;
            if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
                if (this.isItemUpdateInProgress) {
                    // Check for contact number validity only for update flow of warehouse as
                    // the create warehouse validation will be performed in on-boarding component
                    isWelcomeFormValid = this.isContactNumberValid();
                    if (!isWelcomeFormValid && this.contactNumberField && this.contactNumberField.nativeElement) {
                        this.contactNumberField.nativeElement.focus();
                    }
                }
                // Validate address field
                const addressField = this.welcomeForm.form.controls['address'];
                addressField.setValue(addressField?.value.trim());
                if (!this.isAddressValid(addressField?.value)) {
                    addressField.setErrors({ 'required': true });
                    if (this.addressField) {
                        (this.addressField.nativeElement as HTMLElement).classList.add('error-box');
                    }
                    isWelcomeFormValid = false;
                } else {
                    addressField.setErrors(null);
                    this.removeAddressFieldError();
                }
            }
        }
        if (isWelcomeFormValid) {
            if (this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
                this.isApiInProgress = true;
            }
            this.nextButtonClicked.emit({
                welcomeForm,
                otherData: {
                    taxName: this.formFields
                }
            });
        }
    }

    /**
     * Removes error class from address field
     *
     * @memberof WelcomeComponent
     */
    public removeAddressFieldError(): void {
        if (this.addressField) {
            (this.addressField.nativeElement as HTMLElement).classList.remove('error-box');
        }
    }

    public prepareGstDetail(obj) {
        this.addressesObj.taxNumber = obj.taxNumber || '';
        this.addressesObj.stateCode = obj.state || '';
        this.addressesObj.address = obj.address || '';
        this.addressesObj.pincode = obj.pincode;
        this.addressesObj.isDefault = false;
        this.addressesObj.stateName = this.selectedstateName ? this.selectedstateName.split('-')[1] : '';
        return this.addressesObj;
    }

    public checkGstNumValidation(ele: HTMLInputElement) {
        let isValid: boolean = false;

        if (ele?.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele?.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                let text = this.commonLocaleData?.app_invalid_tax_name;
                text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                this.toasty.errorToast(text);
                ele.classList.add('error-box');
                this.isGstValid = false;
            } else {
                ele.classList.remove('error-box');
                this.isGstValid = true;
            }
        } else {
            ele.classList.remove('error-box');
        }
    }

    public getStateCode(gstNo: HTMLInputElement, statesEle: ShSelectComponent) {
        if (this.createNewCompanyPreparedObj.country === "IN") {
            let gstVal: string = gstNo?.value;
            this.companyProfileObj.gstNumber = gstVal;

            if (gstVal?.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                    let s = state.find(st => st?.value === stateCode);
                    _.uniqBy(s, 'value');
                    statesEle.setDisabledState(false);

                    if (s) {
                        this.companyProfileObj.state = s?.value;
                        this.selectedstateName = s.label;
                        statesEle.setDisabledState(true);

                    } else {
                        statesEle.setDisabledState(false);
                        this.toasty.clearAllToaster();

                        if (this.formFields['taxName'] && !this.welcomeForm.form.get('gstNumber')?.valid) {
                            let text = this.commonLocaleData?.app_invalid_tax_name;
                            text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                            this.toasty.warningToast(text);
                            this.companyProfileObj.state = '';
                        }
                    }
                });
            } else {
                statesEle.setDisabledState(false);
                this.companyProfileObj.state = '';
            }
        }
    }

    public selectedbusinessType(event) {
        if (event) {
            this.selectedBusinesstype = event.value;
            this.selectedTaxes = [];
            this.companyProfileObj.taxNumber = '';
            this.companyProfileObj.taxType = '';
            this.companyProfileObj.selectedState = '';
            this.companyProfileObj.state = '';
            this.companyProfileObj.pincode = '';
            this.forceClear$ = observableOf({ status: true });
            this.isTaxNumberSameAsHeadQuarter = 0;

            if (this.selectedBusinesstype === 'Unregistered' || this.selectedBusinesstype === 'Others') {
                this.isGstValid = true;
            } else {
                this.isGstValid = false;
            }

            for (let i = 0; i < this.taxesList?.length; i++) {
                this.taxesList[i].isSelected = false;
            }
        }
    }

    public selectApplicableTaxes(tax, event) {
        if (event && tax) {
            if (event.target.checked) {
                tax.isSelected = event.target.checked;
                this.selectedTaxes.push(tax.value);
            } else {
                let indx = this.selectedTaxes?.indexOf(tax.value);
                this.selectedTaxes.splice(indx, 1);
            }
        }
        event.stopPropagation();
    }

    public back(isBranch: boolean) {
        if (!this.isOnBoardingInProgress) {
            /* Company or Branch on boarding is going on */
            if (isBranch) {
                this.router.navigate(['pages', 'settings', 'branch']); // <!-- pages/settings/branch -->
            } else {
                this.zone.run(() => {
                    this.router.navigate(['/new-user']);
                });
            }
        }
        this.backButtonClicked.emit();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getCountry() {
        this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {

                    if (this.createNewCompanyPreparedObj.country === res[key].alpha2CountryCode) {
                        this.selectedCountry = res[key].alpha2CountryCode + ' - ' + res[key].countryName;
                    }

                    this.countrySource.push({
                        value: res[key].countryName,
                        label: res[key].alpha2CountryCode + ' - ' + res[key].countryName,
                        additional: res[key].callingCode
                    });
                    // Creating Country Currency List

                    if (res[key].currency !== undefined && res[key].currency !== null) {
                        this.countryCurrency[res[key].alpha2CountryCode] = [];
                        this.countryCurrency[res[key].alpha2CountryCode] = res[key].currency.code;
                    }
                });
                this.countrySource$ = observableOf(this.countrySource);

                this.getOnboardingForm();
                this.getStates();
            } else {
                let countryRequest = new CountryRequest();
                if (this.isOnBoardingInProgress && this.itemOnBoardingDetails) {
                    countryRequest.formName = this.itemOnBoardingDetails.onBoardingType.toLowerCase();
                } else {
                    countryRequest.formName = 'onboarding';
                }
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    public getCurrency() {
        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });
                this.currencySource$ = observableOf(this.currencies);
            }
        });
    }

    public getCallingCodes() {
        this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.callingCodes).forEach(key => {
                    this.countryPhoneCode.push({ label: res.callingCodes[key], value: res.callingCodes[key] });
                });
                this.callingCodesSource$ = observableOf(this.countryPhoneCode);
            } else {
                this.store.dispatch(this.commonActions.GetCallingCodes());
            }
        });
    }

    public getOnboardingForm() {
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
                if (res.applicableTaxes) {
                    this.taxesList = [];
                    Object.keys(res.applicableTaxes).forEach(key => {
                        if (res.applicableTaxes[key]) {
                            this.taxesList.push({
                                label: res.applicableTaxes[key]?.name,
                                value: res.applicableTaxes[key]?.uniqueName,
                                isSelected: false
                            });
                            this.currentTaxList[res.applicableTaxes[key]?.uniqueName] = [];
                            this.currentTaxList[res.applicableTaxes[key]?.uniqueName] = res.applicableTaxes[key];
                        }
                    });
                }
                if (res.businessType) {
                    _.map(res.businessType, (businessType) => {
                        this.businessTypeList.push({ label: businessType, value: businessType });
                    });
                    if (this.businessTypeList && this.businessTypeList.length === 1) {
                        this.selectedBusinesstype = this.businessTypeList[0]?.value;
                        this.companyProfileObj.businessType = this.selectedBusinesstype;
                    }
                }
                this.reFillTax();
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                if (this.isOnBoardingInProgress && this.itemOnBoardingDetails) {
                    onboardingFormRequest.formName = this.itemOnBoardingDetails.onBoardingType.toLowerCase();
                } else {
                    onboardingFormRequest.formName = 'onboarding';
                }
                onboardingFormRequest.country = this.createNewCompanyPreparedObj.country;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    public getStates() {
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {

                    if (res.stateList[key].stateGstCode !== null) {
                        this.stateGstCode[res.stateList[key].stateGstCode] = [];
                        this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                    }

                    this.states.push({
                        label: res.stateList[key].code + ' - ' + res.stateList[key].name,
                        value: res.stateList[key].code
                    });
                });
                this.statesSource$ = observableOf(this.states);
                this.reFillState();
            } else {
                let statesRequest = new StatesRequest();
                statesRequest.country = this.createNewCompanyPreparedObj.country;
                this.store.dispatch(this.generalActions.getAllState(statesRequest));
            }
        });
    }

    public removeTax(tax) {
        let i = 0;
        let matchedIndex = -1;

        for (i; i < this.taxesList?.length; i++) {
            if (tax === this.taxesList[i]?.value) {
                matchedIndex = i;
                break;
            }
        }

        let indx = this.selectedTaxes?.indexOf(tax);
        this.selectedTaxes.splice(indx, 1);

        if (matchedIndex > -1) {
            this.taxesList[matchedIndex].isSelected = false;
        }
    }

    public onClearBusinessType() {
        this.selectedBusinesstype = '';
        this.companyProfileObj.businessType = '';

    }

    public onClearBusinessNature() {
        this.companyProfileObj.businessNature = '';
    }

    public sameAsHeadQuarter(gstNo: HTMLInputElement, statesEle: ShSelectComponent) {
        if (this.isTaxNumberSameAsHeadQuarter) {
            if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
                const defaultCompany = this.getDefaultCompanyDetails();
                if (defaultCompany.taxNumber) {
                    this.companyProfileObj.taxNumber = defaultCompany.taxNumber;
                    gstNo.value = defaultCompany.taxNumber;
                    this.checkGstNumValidation(gstNo);
                    this.getStateCode(gstNo, statesEle);
                }
            } else {
                this.companyProfileObj.taxNumber = '';
                gstNo.value = '';
                this.companyProfileObj.selectedState = '';
                this.companyProfileObj.state = '';
                this.forceClear$ = observableOf({ status: true });

                if (this.selectedBusinesstype === 'Unregistered') {
                    this.isGstValid = true;
                } else {
                    this.isGstValid = false;
                }
                this.getStateCode(gstNo, statesEle);
            }
        } else {
            this.companyProfileObj.taxNumber = '';
            gstNo.value = '';
            this.companyProfileObj.selectedState = '';
            this.companyProfileObj.state = '';
            this.forceClear$ = observableOf({ status: true });

            if (this.selectedBusinesstype === 'Unregistered') {
                this.isGstValid = true;
            } else {
                this.isGstValid = false;
            }
            this.getStateCode(gstNo, statesEle);
        }
    }

    /**
     * GST field change handler
     *
     * @param {HTMLInputElement} gstNumberField GST field
     * @param {ShSelectComponent} states States field
     * @memberof WelcomeComponent
     */
    public handleGstChange(gstNumberField: HTMLInputElement, states: ShSelectComponent): void {
        if (this.isTaxNumberSameAsHeadQuarter) {
            const defaultCompany = this.getDefaultCompanyDetails();
            if (this.companyProfileObj.taxNumber !== defaultCompany.taxNumber) {
                this.isTaxNumberSameAsHeadQuarter = 0;
            }
        }
        this.getStateCode(gstNumberField, states);
        this.checkGstNumValidation(gstNumberField);
    }

    /**
     * Returns true, if the contact number is valid
     *
     * @returns {boolean} True, if the contact number is valid
     * @memberof WelcomeComponent
     */
    public isContactNumberValid(): boolean {
        const contactNumberElement = (this.contactNumberField && this.contactNumberField.nativeElement) ? this.contactNumberField.nativeElement : undefined;
        try {
            let parsedNumber = parsePhoneNumberFromString('+' + this.createNewCompanyPreparedObj.phoneCode + contactNumberElement?.value, this.company.country as CountryCode);
            if (parsedNumber.isValid()) {
                if (contactNumberElement) {
                    contactNumberElement.classList.remove('error-box');
                }
                return true;
            } else {
                this.toasty.errorToast(this.localeData?.invalid_contact_number_error);
                if (contactNumberElement) {
                    contactNumberElement.classList.add('error-box');
                }
                return false;
            }
        } catch (error) {
            this.toasty.errorToast(this.localeData?.invalid_contact_number_error);
            if (contactNumberElement) {
                contactNumberElement.classList.add('error-box');
            }
            return false;
        }
    }

    /**
     * On boarding name change handler
     *
     * @param {string} itemName Change event
     * @memberof WelcomeComponent
     */
    public handleNameChange(itemName: string = ''): void {
        if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
            if (itemName && itemName.length > 100) {
                this.welcomeForm.form.controls['name'].setErrors({ 'maxlength': true });
            }
        }
    }

    /**
     * Validates onboarding item name
     *
     * @param {string} itemName Name of the item to be validated
     * @memberof WelcomeComponent
     */
    public validateName(itemName: string = ''): void {
        if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
            setTimeout(() => {
                if (itemName) {
                    itemName = itemName.trim();
                    if (!itemName) {
                        this.welcomeForm.form.controls['name'].setErrors({ 'required': true });
                    }
                    if (itemName?.length > 100) {
                        this.welcomeForm.form.controls['name'].setErrors({ 'maxlength': true });
                    }
                }
            });
        }
    }

    /**
     * Auto fills the form details recursively
     *
     * @private
     * @param {string} entity Entity name with which details should be filled
     * @memberof WelcomeComponent
     */
    private fillOnBoardingDetails(entity: string): void {
        if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
            /*  For warehouse, if the warehouse item has detais then fill the form
                with those details else search the default warehouse and fill with
                default warehouse details. At last, if the details are not found
                then fill form with default company details */
            let isFormFilled;
            switch (entity) {
                case 'ITEM':
                    isFormFilled = this.fillFormDetails(this.itemDetails);
                    if (!isFormFilled) {
                        // Current warehouse item has no detail, try the default warehouse
                        this.fillOnBoardingDetails('DEFAULT_WAREHOUSE');
                    }
                    break;
                case 'DEFAULT_WAREHOUSE':
                    const defaultWarehouse = this.getDefaultWarehouseDetails();
                    isFormFilled = this.fillFormDetails(defaultWarehouse);
                    if (!isFormFilled) {
                        // Default warehouse has no detail, try the default company
                        this.fillOnBoardingDetails('DEFAULT_COMPANY');
                    }
                    break;
                case 'DEFAULT_COMPANY':
                    const { address: autoFillAddress = '', stateCode } = this.getDefaultCompanyDetails();
                    const defaultCompany = {
                        address: autoFillAddress,
                        stateCode
                    };
                    this.fillFormDetails(defaultCompany);
                    // Check the 'Same as HQ' checkbox
                    this.isTaxNumberSameAsHeadQuarter = 1;
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Returns the formatted contact number (without '-')
     *
     * @private
     * @param {string} contactNumber Contact number to be formatted
     * @returns {string} Formatted contact number
     * @memberof WelcomeComponent
     */
    private getFormattedContactNumber(contactNumber: string): string {
        if (contactNumber?.toString()?.includes('-')) {
            return contactNumber.split('-')[1];
        }
        return contactNumber;
    }

    /**
     * Retrieves the calling code from a contact number of the format
     * <calling_code - number>
     *
     * @private
     * @param {string} contactNumber Contact number
     * @returns {string} Calling code
     * @memberof WelcomeComponent
     */
    private getCallingCode(contactNumber: string): string {
        if (contactNumber?.toString()?.includes('-')) {
            return contactNumber?.split('-')[0];
        }
        return '';
    }

    /**
     * Returns the default warehouse data
     *
     * @private
     * @returns {*} Default warehouse data
     * @memberof WelcomeComponent
     */
    private getDefaultWarehouseDetails(): any {
        let defaultWarehouse: any;
        this.store.pipe(select(state => state.warehouse.warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses) {
                for (let index = 0; index < warehouses.results?.length; index++) {
                    if (warehouses.results[index].isDefault) {
                        defaultWarehouse = warehouses.results[index];
                        break;
                    }
                }
            }
        });
        return defaultWarehouse;
    }

    /**
     * Fills the form details with proovided entity type
     *
     * @private
     * @param {*} entity Entity with which the form details will get filled
     * @returns {boolean} True, if any one of the form field is filled with the entity details
     * @memberof WelcomeComponent
     */
    private fillFormDetails(entity: any): boolean {
        if (entity) {
            this.companyProfileObj.address = entity.address;
            this.companyProfileObj.state = entity.stateCode;
        }
        return !!(this.companyProfileObj.address || this.companyProfileObj.state);
    }

    /**
     * Returns the default company details such as address and tax number
     *
     * @private
     * @returns {*} Default company details
     * @memberof WelcomeComponent
     */
    private getDefaultCompanyDetails(): any {
        let defaultCompany = {};
        if (this.activeCompany.addresses && this.activeCompany.addresses.length > 0) {
            this.activeCompany.addresses.forEach((address: any) => {
                if (address.isDefault) {
                    defaultCompany = address;
                    return defaultCompany;
                }
            });
        }
        return defaultCompany;
    }

    /**
     * Returns true if address is valid
     *
     * @private
     * @param {string} address Address to be validated
     * @returns {boolean} True if address is valid
     * @memberof WelcomeComponent
     */
    private isAddressValid(address: string = ''): boolean {
        return address?.trim()?.length > 0;
    }

    /**
     * This will create company with a predefined free plan
     *
     * @memberof WelcomeComponent
     */
    public createCompany(): void {
        this.subscriptionRequestObj.licenceKey = "";
        this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));

        if (this.subscriptionPlan.subscriptionId) {
            this.subscriptionRequestObj.subscriptionId = this.subscriptionPlan.subscriptionId;
            this.createNewCompanyPreObj.subscriptionRequest = this.subscriptionRequestObj;
            this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompanyPreObj));
        } else {
            this.subscriptionRequestObj.planUniqueName = this.subscriptionPlan.planDetails?.uniqueName;
            this.createNewCompanyPreObj.subscriptionRequest = this.subscriptionRequestObj;
            this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompanyPreObj));
        }
    }

    /**
     * Creates new branch
     *
     * @memberof WelcomeComponent
     */
    public createBranch(): void {
        this.companyService.createNewBranch(this.activeCompany?.uniqueName, this.createNewCompanyPreObj).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            this.store.dispatch(this.companyActions.userStoreCreateBranch(null));
            this.store.dispatch(this.companyActions.removeCompanyCreateSession());
            this.router.navigate(['pages/settings/branch']);
        });
    }

    /**
     * This will return onboarding type name text
     *
     * @returns {string}
     * @memberof WelcomeComponent
     */
    public getOnboardingTypeNameText(): string {
        let text = this.localeData?.onboarding_name;
        let onboardingType = "";

        if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Branch) {
            onboardingType = this.commonLocaleData?.app_branch;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Company) {
            onboardingType = this.commonLocaleData?.app_company;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Warehouse) {
            onboardingType = this.commonLocaleData?.app_warehouse;
        }

        text = text?.replace("[ONBOARDING_TYPE]", onboardingType);
        return text;
    }

    /**
     * This will return enter tax text
     *
     * @returns {string}
     * @memberof WelcomeComponent
     */
    public getEnterTaxText(): string {
        let text = this.localeData?.enter_tax;
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

    /**
     * This will return onboarding type address text
     *
     * @returns {string}
     * @memberof WelcomeComponent
     */
    public getOnboardingTypeAddressText(): string {
        let text = this.localeData?.onboarding_address;
        let onboardingType = "";

        if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Branch) {
            onboardingType = this.commonLocaleData?.app_branch;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Company) {
            onboardingType = this.commonLocaleData?.app_company;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Warehouse) {
            onboardingType = this.commonLocaleData?.app_warehouse;
        }

        text = text?.replace("[ONBOARDING_TYPE]", onboardingType);
        return text;
    }

    /**
     * This will return create onboarding type text
     *
     * @returns {string}
     * @memberof WelcomeComponent
     */
    public getCreateOnboardingTypeText(): string {
        let text = this.localeData?.create_onboarding;
        let onboardingType = "";

        if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Branch) {
            onboardingType = this.commonLocaleData?.app_branch;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Company) {
            onboardingType = this.commonLocaleData?.app_company;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Warehouse) {
            onboardingType = this.commonLocaleData?.app_warehouse;
        }

        text = text?.replace("[ONBOARDING_TYPE]", onboardingType);
        return text;
    }

    /**
     * This will return update onboarding type text
     *
     * @returns {string}
     * @memberof WelcomeComponent
     */
    public getUpdateOnboardingTypeText(): string {
        let text = this.localeData?.update_onboarding;
        let onboardingType = "";

        if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Branch) {
            onboardingType = this.commonLocaleData?.app_branch;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Company) {
            onboardingType = this.commonLocaleData?.app_company;
        } else if (this.itemOnBoardingDetails?.onBoardingType === OnBoardingType.Warehouse) {
            onboardingType = this.commonLocaleData?.app_warehouse;
        }

        text = text?.replace("[ONBOARDING_TYPE]", onboardingType);
        return text;
    }

    /**
     * Adds styling on focused Dropdown List
     *
     * @param {HTMLElement} taxLabel
     * @memberof WelcomeComponent
     */
    public selectApplicableTaxesFocus(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusIn(taxLabel);
    }

    /**
     * Removes styling from focused Dropdown List
     *
     * @param {HTMLElement} taxLabel
     * @memberof WelcomeComponent
     */
    public selectApplicableTaxesBlur(taxLabel: HTMLElement): void {
        this.generalService.dropdownFocusOut(taxLabel);
    }

    /**
     * Selects applicable dropdown list taxes using click and enter
     *
     * @param {boolean} isChecked
     * @param {*} tax
     * @param {*} event
     * @memberof WelcomeComponent
     */
    public selectingApplicableTaxes(isChecked: boolean, tax: any, event: any): void {
        tax.isSelected = isChecked;
        if (isChecked) {
            this.selectedTaxes.push(tax?.value);
        } else {
            let index = this.selectedTaxes?.indexOf(tax?.value);
            this.selectedTaxes.splice(index, 1);
        }
        event.preventDefault();
    }

    /**
     * Closes applicable taxes dropdown on focus out
     *
     * @param {number} last
     * @memberof WelcomeComponent
     */
    public closeApplicableTaxesDropdown(last: boolean): void {
        if (last) {
            this.dropdown.hide();
        }
    }
}
