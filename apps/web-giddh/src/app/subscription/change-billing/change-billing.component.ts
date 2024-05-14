import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeBillingComponentStore } from './utility/change-billing.store';
import { IntlPhoneLib } from '../../theme/mobile-number-field/intl-phone-lib.class';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { Observable, takeUntil, of as observableOf, ReplaySubject } from 'rxjs';
import { CountryRequest, OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { Store } from '@ngrx/store';
import { GeneralActions } from '../../actions/general/general.actions';
import { StatesRequest } from '../../models/api-models/Company';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'change-billing',
    templateUrl: './change-billing.component.html',
    styleUrls: ['./change-billing.component.scss'],
    providers: [ChangeBillingComponentStore]
})
export class ChangeBillingComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Instance of change billing form group*/
    public changeBillingForm: FormGroup;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Mobile number library instance */
    public intlClass: any;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected country */
    public selectedCountry: string = '';
    /** Hold selected state */
    public selectedState: string = '';
    /** Hold state gst code list */
    public stateGstCode: any[] = [];
    /** Hold states list */
    public states: any[] = [];
    /** List of counties of country */
    public countyList: IOption[] = [];
    /** Hold selected state */
    public selectedStateCode: string = '';
    /** Hold form fields from forms api */
    public formFields: any[] = [];
    /** Hold state source observable*/
    public stateSource$: Observable<IOption[]> = observableOf([]);
    /** Hold country source*/
    public countrySource: IOption[] = [];
    /** Hold country source observable*/
    public countrySource$: Observable<IOption[]> = observableOf([]);
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold disable State */
    public disabledState: boolean = false;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** Holds company specific data */
    public company: any = {
        countryName: '',
        countryCode: '',
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        taxType: '',
        isTcsTdsApplicable: false,
        isActive: false,
        branch: null,
        addresses: null,
        giddhBalanceDecimalPlaces: 2
    };
    /** Hold active company */
    public activeCompany: any;
    /** Holds Store Get Billing Details observable*/
    public getBillingDetails$ = this.componentStore.select(state => state.getBillingDetails);
    /** Holds Store Update Billiing In Progress API success state as observable*/
    public getBillingDetailsInProgress$ = this.componentStore.select(state => state.getBillingDetailsInProgress);
    /** Holds Store Update Billiing Success observable*/
    public updateBillingDetailsSuccess$ = this.componentStore.select(state => state.updateBillingDetailsSuccess);
    /** Hold billing Details */
    public billingDetails = {
        billingAccountUnqiueName: "",
        billingName: "",
        uniqueName: ""
    };

    constructor(
        private formBuilder: FormBuilder,
        private componentStore: ChangeBillingComponentStore,
        private commonActions: CommonActions,
        private toasterService: ToasterService,
        private subscriptionService: SubscriptionsService,
        private store: Store<AppState>,
        private changeDetection: ChangeDetectorRef,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private generalActions: GeneralActions,
        private elementRef: ElementRef
    ) { }

    /**
     * Hook for component initialization
     *
     * @memberof ChangeBillingComponent
     */
    public ngOnInit(): void {
        this.initForm();
        this.getCountry();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params) {
                this.billingDetails.billingAccountUnqiueName = params?.billingAccountUnqiueName;
                this.getBillingDetails(this.billingDetails.billingAccountUnqiueName);
            }
        });

        this.updateBillingDetailsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.router.navigate(['/pages/subscription']);
            }
        });

        this.getBillingDetails$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.setFormValues(data);
                this.selectedCountry = data.country?.name;
                this.selectedState = data.state?.name;
                this.billingDetails.billingName = data?.billingName;
                this.billingDetails.uniqueName = data?.uniqueName;
            }
        });
    }
    /**
     *
     *
     * @memberof ChangeBillingComponent
     */
    public back(): void {
        this.location.back();
    }

    /**
     * This will be use for initialization form
     *
     * @memberof ChangeBillingComponent
     */
    public initForm(): void {
        this.changeBillingForm = this.formBuilder.group({
            billingName: ['', Validators.required],
            companyName: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
            pincode: [''],
            mobileNumber: ['', Validators.required],
            taxNumber: null,
            country: ['', Validators.required],
            state: ['', Validators.required],
            address: [''],
        });
    }

    /**
     * This will be use for set form values
     *
     * @param {*} data
     * @memberof ChangeBillingComponent
     */
    public setFormValues(data: any): void {
        this.changeBillingForm.controls['billingName'].setValue(data.billingName);
        this.changeBillingForm.controls['companyName'].setValue(data.companyName);
        this.changeBillingForm.controls['email'].setValue(data.email);
        this.changeBillingForm.controls['pincode'].setValue(data.pincode);
        this.changeBillingForm.controls['mobileNumber'].setValue(data.mobileNumber);
        this.changeBillingForm.controls['taxNumber'].setValue(data.taxNumber);
        this.changeBillingForm.controls['country'].setValue(data.country);
        this.changeBillingForm.controls['state'].setValue(data.state);
        this.changeBillingForm.controls['address'].setValue(data?.address);
        this.initIntl(this.changeBillingForm.get('mobileNumber')?.value);
    }

    /**
     * Initializes the int-tel input
     *
     * @memberof ChangeBillingComponent
     */
    public initIntl(inputValue?: string): void {
        let times = 0;
        const parentDom = this.elementRef?.nativeElement;
        const input = document.getElementById('init-contact');
        const interval = setInterval(() => {
            times += 1;
            if (input) {
                clearInterval(interval);
                this.intlClass = new IntlPhoneLib(
                    input,
                    parentDom,
                    false
                );
                if (inputValue) {
                    input.setAttribute('value', `+${inputValue}`);
                    this.changeDetection.detectChanges();
                }
            }
            if (times > 25) {
                clearInterval(interval);
            }
        }, 50);
    }

    /**
     * This will be use for get billing details
     *
     * @param {*} subscriptionId
     * @memberof ChangeBillingComponent
     */
    public getBillingDetails(subscriptionId: any): void {
        this.componentStore.getBillingDetails(subscriptionId);
    }

    /**
     * Validate the mobile number
     *
     * @memberof ChangeBillingComponent
     */
    public validateMobileField(): void {
        setTimeout(() => {
            if (!this.intlClass?.isRequiredValidNumber) {
                this.changeBillingForm.get("mobileNumber")?.setErrors({ invalidNumber: true });
            } else {
                this.changeBillingForm.get("mobileNumber")?.setErrors(null);
            }
        }, 100);
    }

    /**
   * This will be use for get countries
   *
   * @memberof ChangeBillingComponent
   */
    public getCountry(): void {
        this.componentStore.commonCountries$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.countrySource = [];
                Object.keys(response).forEach(key => {
                    this.countrySource.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName
                    });
                });
                this.countrySource$ = observableOf(this.countrySource);
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    /**
     * This will use for get states list
     *
     * @memberof ChangeBillingComponent
     */
    public getStates(): void {
        this.componentStore.generalState$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
     * This will use validate gst number
     *
     * @memberof ChangeBillingComponent
     */
    public validateGstNumber(): void {
        let isValid: boolean = false;
        if (this.changeBillingForm.get('taxNumber')?.value) {
            if (this.formFields['taxName']?.label) {
                if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(this.changeBillingForm.get('taxNumber')?.value)) {
                            isValid = true;
                        }
                    }
                } else {
                    isValid = true;
                }

                if (!isValid) {
                    let text = this.commonLocaleData?.app_invalid_tax_name;
                    text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                    this.toasterService.showSnackBar("error", text);
                    this.selectedState = '';
                    this.selectedStateCode = '';
                    this.isGstinValid = false;
                } else {
                    this.isGstinValid = true;
                }
            }
        }

        if (this.changeBillingForm.get('taxNumber')?.value?.length >= 2) {
            this.states?.find((state) => {
                let code = this.changeBillingForm.get('taxNumber')?.value?.substr(0, 2);
                let matchCode = state.stateGstCode == code;
                this.disabledState = false;
                if (matchCode) {
                    this.disabledState = true;
                    this.selectedState = state.label;
                    this.selectedStateCode = state.value;
                    this.changeBillingForm.controls['state'].setValue({ label: state?.label, value: state?.value });
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
    * This will return enter tax text
    *
    * @returns {string}
    * @memberof ChangeBillingComponent
    */
    public getEnterTaxText(): string {
        let text = this.commonLocaleData?.app_enter_tax_name;
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label ?? this.commonLocaleData?.app_tax_number);
        return text;
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof ChangeBillingComponent
     */
    public selectCountry(event: any): void {
        if (event?.value) {
            this.selectedCountry = event.label;
            this.changeBillingForm.controls['country'].setValue(event);

            this.changeBillingForm.get('taxNumber')?.setValue('');
            this.changeBillingForm.get('state')?.setValue('');
            this.selectedState = "";
            this.selectedStateCode = "";
            this.disabledState = false;

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
     * Gets company profile
     *
     * @private
     * @memberof ChangeBillingComponent
     */
    private getCompanyProfile(): void {
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile && Object.keys(profile).length) {
                this.company.countryName = profile.country;
                this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                this.company.baseCurrency = profile.baseCurrency;
                this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                this.showTaxTypeByCountry(this.company.countryCode);
            }
        });
    }

    /**
      * Finds tax type by country and calls onboarding form api
      *
      * @private
      * @param {string} countryCode
      * @memberof ChangeBillingComponent
      */
    private showTaxTypeByCountry(countryCode: string): void {
        this.company.taxType = this.subscriptionService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.company.taxType) {
            this.getOnboardingForm(countryCode);
        }
    }

    /**
    * Calls onboarding form data api
    *
    * @private
    * @param {string} countryCode
    * @memberof ChangeBillingComponent
    */
    private getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = 'onboarding';
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    /**
     * Gets onboarding form data
     *
     * @private
     * @memberof ChangeBillingComponent
     */
    private getOnboardingFormData(): void {
        this.componentStore.onboardingForm$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.formFields = [];
                Object.keys(response.fields).forEach(key => {
                    if (response?.fields[key]) {
                        this.formFields[response.fields[key]?.name] = [];
                        this.formFields[response.fields[key]?.name] = response.fields[key];
                    }
                });
            }
        })
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof ChangeBillingComponent
     */
    private getActiveCompany(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
            }
        })
    }

    /**
    * This will use for on submit change/update billing form
    *
    * @return {*}  {void}
    * @memberof ChangeBillingComponent
    */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.changeBillingForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mobileNumber = this.changeBillingForm.value.mobileNumber?.replace(/\+/g, '');
        let request = {
            billingName: this.changeBillingForm.value.billingName,
            companyName: this.changeBillingForm.value.companyName,
            taxNumber: this.changeBillingForm.value.taxNumber,
            email: this.changeBillingForm.value.email,
            pincode: this.changeBillingForm.value.pincode,
            mobileNumber: mobileNumber,
            country: {
                name: this.changeBillingForm.value.country.name,
                code: this.changeBillingForm.value.country.code
            },
            address: this.changeBillingForm.value.address
        }
        if (this.changeBillingForm.value.country.code === 'UK') {
            request['county'] = {
                name: this.changeBillingForm.value.state.name ? this.changeBillingForm.value.state.name : this.changeBillingForm.value.state.label,
                code: this.changeBillingForm.value.state.code ? this.changeBillingForm.value.state.code : this.changeBillingForm.value.state.value
            };
        } else {
            request['state'] = {
                name: this.changeBillingForm.value.state.name ? this.changeBillingForm.value.state.name : this.changeBillingForm.value.state.label,
                code: this.changeBillingForm.value.state.code ? this.changeBillingForm.value.state.code : this.changeBillingForm.value.state.value
            };
        }
        this.componentStore.updateBillingDetails({ request: request, id: this.billingDetails.uniqueName });
    }

    /**
     * Hook cycle for component destroyed
     *
     * @memberof ChangeBillingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
