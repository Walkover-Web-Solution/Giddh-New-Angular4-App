import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ModalOptions } from 'ngx-bootstrap';
import { combineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CommonActions } from '../actions/common.actions';
import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { OnBoardingType } from '../app.constant';
import * as _ from '../lodash-optimized';
import { CountryRequest, OnboardingFormRequest } from '../models/api-models/Common';
import { Addresses, CompanyCreateRequest, StatesRequest } from '../models/api-models/Company';
import { IForceClear } from '../models/api-models/Sales';
import { CompanyService } from '../services/companyService.service';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store';
import { ItemOnBoardingState } from '../store/item-on-boarding/item-on-boarding.reducer';
import { IOption } from '../theme/ng-select/option.interface';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';

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
    public isbranch: boolean = false;
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
        pincode: '',
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
        taxNumber: ''
    };

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

    /** States dropdown instance */
    @ViewChild('states') statesDropdown: ShSelectComponent;
    /** GST number field */
    @ViewChild('gstNumberField') gstNumberField: ElementRef<any>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private _router: Router,
        private _generalService: GeneralService,
        private _toasty: ToasterService,
        private companyActions: CompanyActions,
        private _companyService: CompanyService,
        private _generalActions: GeneralActions,
        private commonActions: CommonActions
    ) {
        this.companyProfileObj = {};
        this.store.dispatch(this._generalActions.resetStatesList());
        this.store.dispatch(this.commonActions.resetOnboardingForm());
        this.store.select(state => {
            if (!state.session.companies) {
                return;
            }
            state.session.companies.forEach(cmp => {
                if (cmp.uniqueName === state.session.companyUniqueName) {
                    this.activeCompany = cmp;
                }
            });
        }).pipe(takeUntil(this.destroyed$)).subscribe();
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.itemOnboarding), takeUntil(this.destroyed$))
            .subscribe((itemOnBoardingDetails: ItemOnBoardingState) => {
                this.itemOnBoardingDetails = itemOnBoardingDetails;
                this.isOnBoardingInProgress = this.itemOnBoardingDetails && this.itemOnBoardingDetails.isOnBoardingInProgress;
                this.isItemUpdateInProgress = this.itemOnBoardingDetails && this.itemOnBoardingDetails.isItemUpdateInProgress;
            });

        if (this.isItemUpdateInProgress) {
            this.company.name = (this.itemDetails && this.itemDetails.name) ? this.itemDetails.name : '';
            this.company.phoneCode = (this.itemDetails && this.itemDetails.callingCode) ? this.itemDetails.callingCode : '';
            this.company.contactNo = (this.itemDetails && this.itemDetails.mobileNumber) ? this.getFormattedContactNumber(this.itemDetails.mobileNumber) : '';
            this.company.uniqueName = (this.itemDetails && this.itemDetails.uniqueName) ? this.itemDetails.uniqueName : '';
            this.company.country = (this.itemDetails && this.itemDetails.countryCode) ? this.itemDetails.countryCode : '';
            this.company.baseCurrency = (this.itemDetails && this.itemDetails.currencyCode) ? this.itemDetails.currencyCode : '';
            this.prepareWelcomeForm();
        } else {
            this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    this.isbranch = res.isBranch;
                    this.createNewCompany = res;
                    this.company = this.createNewCompany;
                    this.company.contactNo = this.getFormattedContactNumber(this.company.contactNo);
                    this.prepareWelcomeForm();
                }
            });
        }
        combineLatest([
            this._companyService.GetAllBusinessTypeList(),
            this._companyService.GetAllBusinessNatureList()
        ]).subscribe(([businessTypeResponse, businessNatureResponse]) => {
            _.map(businessTypeResponse.body, (businessType) => {
                this.businessTypeList.push({ label: businessType, value: businessType });
            });
            _.map(businessNatureResponse.body, (businessNature) => {
                this.businessNatureList.push({ label: businessNature, value: businessNature });
            });
            this.reFillForm();
        });
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
    }

    public skip() {
        this._router.navigate(['/onboarding']);
    }

    public reFillForm() {
        if (this.isOnBoardingInProgress) {
            this.fillOnBoardingDetails();
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
            for (stateLoop; stateLoop < this.states.length; stateLoop++) {
                if (this.states[stateLoop].value === this.companyProfileObj.state) {
                    this.companyProfileObj.selectedState = this.states[stateLoop].label;
                }
            }
        }
    }

    public reFillTax() {
        if (this.createNewCompany.taxes && this.createNewCompany.taxes.length > 0) {
            this.createNewCompany.taxes.forEach(tax => {
                if (this.currentTaxList[tax] !== undefined && this.selectedTaxes.indexOf(tax) === -1) {
                    this.selectedTaxes.push(tax);

                    let matchedIndex = this.currentTaxList[tax];
                    if (matchedIndex > -1) {
                        this.taxesList[matchedIndex].isSelected = true;
                    }
                }
            });
        }
    }

    public prepareWelcomeForm() {
        if (this.company) {
            this.createNewCompanyPreparedObj.name = this.company.name ? this.company.name : '';
            this.createNewCompanyPreparedObj.phoneCode = this.company.phoneCode ? this.company.phoneCode : '';
            this.createNewCompanyPreparedObj.contactNo = this.company.contactNo ? this.company.contactNo : '';
            this.createNewCompanyPreparedObj.uniqueName = this.company.uniqueName ? this.company.uniqueName : '';
            this.createNewCompanyPreparedObj.isBranch = this.company.isBranch;
            this.createNewCompanyPreparedObj.country = this.company.country ? this.company.country : '';
            this.createNewCompanyPreparedObj.baseCurrency = this.company.baseCurrency ? this.company.baseCurrency : '';
            this.getCountry();
            this.getCurrency();
            this.getCallingCodes();
        }
    }

    public submit(welcomeForm: NgForm) {
        if (!this.isOnBoardingInProgress) {
            this.createNewCompanyPreparedObj.businessNature = this.companyProfileObj.businessNature ? this.companyProfileObj.businessNature : '';
            this.createNewCompanyPreparedObj.businessType = this.companyProfileObj.businessType ? this.companyProfileObj.businessType : '';
            this.createNewCompanyPreparedObj.address = this.companyProfileObj.address ? this.companyProfileObj.address : '';
            this.createNewCompanyPreparedObj.taxes = (this.selectedTaxes.length > 0) ? this.selectedTaxes : [];
            if (this.createNewCompanyPreparedObj.phoneCode && this.createNewCompanyPreparedObj.contactNo) {
                if (!this.createNewCompanyPreparedObj.contactNo.toString().includes('-')) {
                    this.createNewCompanyPreparedObj.contactNo = this.createNewCompanyPreparedObj.phoneCode + '-' + this.createNewCompanyPreparedObj.contactNo;
                }
            }
            let gstDetails = this.prepareGstDetail(this.companyProfileObj);
            if (gstDetails.taxNumber || gstDetails.address) {
                this.createNewCompanyPreparedObj.addresses.push(gstDetails);
            } else {
                this.createNewCompanyPreparedObj.addresses = [];
            }

            this._generalService.createNewCompany = this.createNewCompanyPreparedObj;
            this.store.dispatch(this.companyActions.userStoreCreateCompany(this.createNewCompanyPreparedObj));
            this._router.navigate(['select-plan']);
        }
        this.nextButtonClicked.emit({
            welcomeForm,
            otherData: {
                taxName: this.formFields
            }
        });
    }

    public prepareGstDetail(obj) {
        if (obj.taxNumber) {
            this.addressesObj.taxNumber = obj.taxNumber;
            this.addressesObj.stateCode = obj.state;
            this.addressesObj.address = obj.address;
            this.addressesObj.isDefault = false;
            this.addressesObj.stateName = this.selectedstateName ? this.selectedstateName.split('-')[1] : '';
        } else if (obj.address) {
            this.addressesObj.taxNumber = "";
            this.addressesObj.stateCode = "";
            this.addressesObj.address = obj.address;
            this.addressesObj.isDefault = false;
            this.addressesObj.stateName = '';
        }
        return this.addressesObj;
    }

    public checkGstNumValidation(ele: HTMLInputElement) {
        let isValid: boolean = false;

        if (ele.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                this._toasty.errorToast('Invalid ' + this.formFields['taxName'].label);
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
            let gstVal: string = gstNo.value;
            this.companyProfileObj.gstNumber = gstVal;

            if (gstVal.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                    let s = state.find(st => st.value === stateCode);
                    _.uniqBy(s, 'value');
                    statesEle.setDisabledState(false);

                    if (s) {
                        this.companyProfileObj.state = s.value;
                        this.selectedstateName = s.label;
                        statesEle.setDisabledState(true);

                    } else {
                        this.companyProfileObj.state = '';
                        statesEle.setDisabledState(false);
                        this._toasty.clearAllToaster();
                        this._toasty.warningToast('Invalid ' + this.formFields['taxName'].label);
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
            this.companyProfileObj.selectedState = '';
            this.companyProfileObj.state = '';
            this.forceClear$ = observableOf({ status: true });
            this.isTaxNumberSameAsHeadQuarter = 0;

            if (this.selectedBusinesstype === 'Unregistered') {
                this.isGstValid = true;
            } else {
                this.isGstValid = false;
            }

            for (let i = 0; i < this.taxesList.length; i++) {
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
                let indx = this.selectedTaxes.indexOf(tax.value);
                this.selectedTaxes.splice(indx, 1);
            }
        }
        event.stopPropagation();
    }

    public back(isbranch: boolean) {
        if (!this.isOnBoardingInProgress) {
            /* Company or Branch on boarding is going on */
            if (isbranch) {
                this._router.navigate(['pages', 'settings', 'branch']); // <!-- pages/settings/branch -->
            } else {
                this._router.navigate(['new-user']);
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
                if (this.isOnBoardingInProgress) {
                    countryRequest.formName = this.itemOnBoardingDetails.onBoardingType.toLowerCase();
                } else {
                    countryRequest.formName = 'onboarding';
                }
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    public getCurrency() {
        this.store.pipe(select(s => s.common.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });
                this.currencySource$ = observableOf(this.currencies);
            } else {
                this.store.dispatch(this.commonActions.GetCurrency());
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
                Object.keys(res.fields).forEach(key => {
                    this.formFields[res.fields[key].name] = [];
                    this.formFields[res.fields[key].name] = res.fields[key];
                });

                Object.keys(res.applicableTaxes).forEach(key => {
                    this.taxesList.push({
                        label: res.applicableTaxes[key].name,
                        value: res.applicableTaxes[key].uniqueName,
                        isSelected: false
                    });

                    this.currentTaxList[res.applicableTaxes[key].uniqueName] = [];
                    this.currentTaxList[res.applicableTaxes[key].uniqueName] = res.applicableTaxes[key];
                });
                this.reFillTax();
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                if (this.isOnBoardingInProgress) {
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
                this.store.dispatch(this._generalActions.getAllState(statesRequest));
            }
        });
    }

    public removeTax(tax) {
        let i = 0;
        let matchedIndex = -1;

        for (i; i < this.taxesList.length; i++) {
            if (tax === this.taxesList[i].value) {
                matchedIndex = i;
                break;
            }
        }

        let indx = this.selectedTaxes.indexOf(tax);
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
                this.activeCompany.addresses.forEach(key => {
                    if (key.isDefault === true) {
                        this.companyProfileObj.taxNumber = key.taxNumber;
                        gstNo.value = key.taxNumber;
                        this.checkGstNumValidation(gstNo);
                        this.getStateCode(gstNo, statesEle);
                    }
                });
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
     * Auto fills the on boarding details
     *
     * @private
     * @memberof WelcomeComponent
     */
    private fillOnBoardingDetails(): void {
        if (this.itemOnBoardingDetails.onBoardingType === OnBoardingType.Warehouse) {
            // TODO: Add default warehouse logic
            this.companyProfileObj.businessNature = (this.isItemUpdateInProgress && this.itemDetails) ? this.itemDetails.businessNature : this.activeCompany.businessNature;
            this.companyProfileObj.businessType = (this.isItemUpdateInProgress && this.itemDetails) ? this.itemDetails.businessType : this.activeCompany.businessType;
            this.selectedBusinesstype = this.companyProfileObj.businessType;

            let autoFillAddress = '', autoFillTaxNumber = '';
            if (this.itemOnBoardingDetails.isItemUpdateInProgress && this.itemDetails) {
                // Autofill GST and Address from warehouse being updated
                autoFillAddress = this.itemDetails.address;
                autoFillTaxNumber = this.itemDetails.taxNumber;
            } else {
                // Autofill GST and Address from default warehouse and default company
                if (this.activeCompany && this.activeCompany.addresses) {
                    this.activeCompany.addresses.forEach((address: any) => {
                        if (address.isDefault) {
                            autoFillAddress = address.address;
                            autoFillTaxNumber = address.taxNumber;
                        }
                    });
                }
            }
            this.companyProfileObj.address = autoFillAddress;
            if (this.selectedBusinesstype === 'Registered') {
                this.companyProfileObj.taxNumber = autoFillTaxNumber;
            }
            setTimeout(() => {
                // setTimeout is required as 'gstNumberField' viewchild is not present in ngOnInit() lifecycle
                if (this.gstNumberField) {
                    // Check the validity of GST number and select the state as per the GST
                    this.checkGstNumValidation(this.gstNumberField.nativeElement);
                    this.getStateCode(this.gstNumberField.nativeElement, this.statesDropdown);
                }
            });
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
        if (contactNumber.toString().includes('-')) {
            return contactNumber.split('-')[1];
        }
        return contactNumber;
    }
}
