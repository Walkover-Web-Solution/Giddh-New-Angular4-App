import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';
import { BuyPlanComponentStore } from './utility/buy-plan.store';
import { Observable, ReplaySubject, takeUntil, of as observableOf, distinctUntilChanged, debounceTime } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { CountryRequest, OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { IntlPhoneLib } from "../../theme/mobile-number-field/intl-phone-lib.class";
import { SubscriptionsService } from '../../services/subscriptions.service';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { StatesRequest } from '../../models/api-models/Company';
import { GeneralActions } from '../../actions/general/general.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore]
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    /** Stepper Form instance */
    @ViewChild('stepper') stepperIcon: any;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for subscription form */
    public subscriptionForm: FormGroup;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected tab */
    public selectedStep: number = 0;
    /** Form Group for subscription first step form form */
    public firstStepForm: FormGroup;
    /** Form Group for subscription second step form */
    public secondStepForm: FormGroup;
    /** Form Group for subscription third step form */
    public thirdStepForm: FormGroup;
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
    /** Hold active company */
    public activeCompany: any;
    /** This will hold disable State */
    public disabledState: boolean = false;
    /** Holds Store Plan list observable*/
    public readonly planList$ = this.componentStore.select(state => state.planList);
    /** Holds Store Plan list API success state as observable*/
    public planListInProgress$ = this.componentStore.select(state => state.planListInProgress);
    /** Holds Store Create Plan API in progress state as observable*/
    public createPlanInProgress$ = this.componentStore.select(state => state.createPlanInProgress);
    /** Holds Store Create Plan API succes state as observable*/
    public createPlanSuccess$ = this.componentStore.select(state => state.createPlanSuccess);
    /** Holds Store Apply Promocode API in progress state as observable*/
    public applyPromoCodeInProgress$ = this.componentStore.select(state => state.applyPromoCodeInProgress);
    /** Holds Store Apply Promocode  API success state as observable*/
    public applyPromoCodeSuccess$ = this.componentStore.select(state => state.applyPromoCodeSuccess);
    /** Holds Store Apply Promocode API response state as observable*/
    public promoCodeResponse$ = this.componentStore.select(state => state.promoCodeResponse);
    /** Mobile number library instance */
    public intlClass: any;
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
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Hold selected plan*/
    public selectedPlan: any;
    /** Hold popular plan*/
    public popularPlan: any;
    /** Hold state source observable*/
    public stateSource$: Observable<IOption[]> = observableOf([]);
    /** Hold country source*/
    public countrySource: IOption[] = [];
    /** Hold country source observable*/
    public countrySource$: Observable<IOption[]> = observableOf([]);
    /** Hold displayed columns dynamically*/
    public displayedColumns: any = [];
    /** Hold plan data source*/
    public dataSource: any;
    /** Getter for column unique names*/
    public getColumnNames(): string[] {
        return this.displayedColumns.map(column => column.uniqueName);
    }
    /** Hold plan data source*/
    public planUniqueName: any;
    /** Hold plan data source*/
    public promoCodeResponse: any[]=[];

    constructor(
        public dialog: MatDialog,
        private readonly componentStore: BuyPlanComponentStore,
        private toasterService: ToasterService,
        private commonActions: CommonActions,
        private store: Store<AppState>,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
        private formBuilder: FormBuilder,
        private subscriptionService: SubscriptionsService,
        private router: Router,
        private route : ActivatedRoute,
        private location: Location

    ) {
        this.componentStore.getAllPlans({ params: { countryCode: this.company.countryCode } });
    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof BuyPlanComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("plan-page");
        this.initSubscriptionForm();
        this.getAllPlans();
        this.getCountry();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();


        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params) {
                console.log(params);
                this.planUniqueName = params.planUniqueName;
            }
        });

        this.createPlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate(['/pages/subscription'])
            } else {
            }
        });

        this.applyPromoCodeSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getPromoCodeData();
            }
        });

        this.firstStepForm?.get('promoCode').valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            console.log(searchedText);
            if (searchedText === "" || searchedText === undefined) {
                this.promoCodeResponse = [];
                this.firstStepForm?.get('promoCode').setValue("");
            }
        });
    }

    /**
 * Initializing the company form
 *
 * @private
 * @memberof
 */
    private initSubscriptionForm(): void {
        this.firstStepForm = this.formBuilder.group({
            duration: ['YEARLY'],
            planUniqueName: ['', Validators.required],
            promoCode: [''],
        });

        this.secondStepForm = this.formBuilder.group({
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

        this.thirdStepForm = this.formBuilder.group({
            userUniqueName: [''],
            paymentProvider: ['']
        });

        this.subscriptionForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm,
        });
    }

    /**
     * This will be use for get active company
     *
     * @memberof BuyPlanComponent
     */
    public getPromoCodeData(): void {
        this.promoCodeResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            this.promoCodeResponse[0] = response;
        })
    }

/**
 * This will be use for back to previous page
 *
 * @memberof BuyPlanComponent
 */
public back(): void {
        this.location.back();
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof BuyPlanComponent
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
     * This will be use for apply promo code discount on plans
     *
     * @memberof BuyPlanComponent
     */
    public applyPromoCode(): void {
        if (this.firstStepForm.get('promoCode')?.value) {
            let request = {
                promoCode: this.firstStepForm.get('promoCode')?.value,
                planUniqueName: this.firstStepForm.get('planUniqueName').value,
                duration: this.firstStepForm.get('duration').value
            }
            this.componentStore.applyPromocode(request);
        }
    }


    /**
       * Gets company profile
       *
       * @private
       * @memberof BuyPlanComponent
       */
    private getCompanyProfile(): void {
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile && Object.keys(profile).length && !this.company?.countryName) {
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
      * @memberof BuyPlanComponent
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
    * @memberof BuyPlanComponent
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
     * @memberof BuyPlanComponent
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
     * Initializes the int-tel input
     *
     * @memberof BuyPlanComponent
     */
    public initIntl(): void {
        const parentDom = document.querySelector('create');
        const input = document.getElementById('init-contact');
        if (input) {
            this.intlClass = new IntlPhoneLib(
                input,
                parentDom,
                false
            );
        }
    }

    /**
     * Validate the mobile number
     *
     * @memberof BuyPlanComponent
     */
    public validateMobileField(): void {
        setTimeout(() => {
            if (!this.intlClass?.isRequiredValidNumber) {
                this.secondStepForm.get("mobileNumber")?.setErrors({ invalidNumber: true });
            } else {
                this.secondStepForm.get("mobileNumber")?.setErrors(null);
            }
        }, 100);
    }

    /**
     * This will be use for get countries
     *
     * @memberof BuyPlanComponent
     */
    public getCountry() {
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
     * @memberof BuyPlanComponent
     */
    public getStates() {
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
     * @memberof BuyPlanComponent
     */
    public validateGstNumber(): void {
        let isValid: boolean = false;
        if (this.secondStepForm.get('taxNumber')?.value) {
            if (this.formFields['taxName']?.label) {
                if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(this.secondStepForm.get('taxNumber')?.value)) {
                            isValid = true;
                        }
                    }
                } else {
                    isValid = true;
                }

                if (!isValid) {
                    let text = 'Invalid Tax';
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

        if (this.secondStepForm.get('taxNumber')?.value?.length >= 2) {
            this.states?.find((state) => {
                let code = this.secondStepForm.get('taxNumber')?.value?.substr(0, 2);
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
    * This will return enter tax text
    *
    * @returns {string}
    * @memberof BuyPlanComponent
    */
    public getEnterTaxText(): string {
        let text = 'Enter Tax';
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

    /**
     *  This will be use for selecting plan
     *
     * @param {*} plan
     * @memberof BuyPlanComponent
     */
    public selectPlan(plan: any): void {
        this.firstStepForm.get('planUniqueName').setValue(plan?.uniqueName);
        this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.selectedPlan = result.find(plan => plan.uniqueName === this.firstStepForm.get('planUniqueName').value);
        })
    }

    /**
     * This will use for next step form
     *
     * @return {*}  {void}
     * @memberof BuyPlanComponent
     */
    public nextStepForm(): void {
        this.isFormSubmitted = false;
        if (this.selectedStep === 0 && this.firstStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        if (this.selectedStep === 1 && this.secondStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        // Assuming the third step form validation
        if (this.selectedStep === 2 && this.thirdStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.selectedPlan = result.find(plan => plan.uniqueName === this.firstStepForm.get('planUniqueName').value);
        });
        this.selectedStep++;
    }


    /**
     * This will use for selected tab index
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public onSelectedTab(event: any): void {
        this.selectedStep = event?.selectedIndex;
    }

    /**
     * Get All Plan API Call
     *
     * @memberof BuyPlanComponent
     */
    public getAllPlans(): void {
        this.planList$.pipe(takeUntil(this.componentStore.destroy$)).subscribe(response => {
            if (response?.length) {
                this.selectedPlan = response[1];
                this.popularPlan = response[1];
                this.firstStepForm.get('planUniqueName').setValue(this.selectedPlan?.uniqueName);
                let displayedColumns = [{ uniqueName: 'content', additional: "" }];
                displayedColumns = displayedColumns.concat(response.map(column => ({ uniqueName: column.uniqueName, additional: column })));
                this.displayedColumns = displayedColumns;
                this.dataSource = new MatTableDataSource<any>(response);
            } else {
                this.displayedColumns = [{ uniqueName: 'content', label: 'Content', sticky: true }];
                this.dataSource = new MatTableDataSource<any>([]);
            }
        });
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public selectCountry(event: any): void {
        if (event?.value) {
            this.selectedCountry = event.label;
            this.secondStepForm.controls['country'].setValue(event);

            this.secondStepForm.get('taxNumber')?.setValue('');
            this.secondStepForm.get('state')?.setValue('');
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
     * This will use for on submit company form
     *
     * @return {*}  {void}
     * @memberof BuyPlanComponent
     */
    public onSubmit(): void {
        console.log(this.subscriptionForm.value.firstStepForm);
        this.isFormSubmitted = false;
        if (this.subscriptionForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        let request = {
            planUniqueName: this.subscriptionForm.value.firstStepForm.planUniqueName,
            duration: this.subscriptionForm.value.firstStepForm.duration,
            userUniqueName: null,
            billingAccount: {
                billingName: this.subscriptionForm.value.secondStepForm.billingName,
                companyName: this.subscriptionForm.value.secondStepForm.companyName,
                taxNumber: this.subscriptionForm.value.secondStepForm.taxNumber,
                email: this.subscriptionForm.value.secondStepForm.email,
                pincode: this.subscriptionForm.value.secondStepForm.pincode,
                mobileNumber: this.subscriptionForm.value.secondStepForm.mobileNumber,
                country: {
                    name: this.subscriptionForm.value.secondStepForm.country.label,
                    code: this.subscriptionForm.value.secondStepForm.country.value
                },
                state: {
                    name: this.subscriptionForm.value.secondStepForm.state.label,
                    code: this.subscriptionForm.value.secondStepForm.state.value
                },
                address: this.subscriptionForm.value.secondStepForm.address
            },
            promoCode: this.subscriptionForm.value.firstStepForm.promoCode ? this.subscriptionForm.value.firstStepForm.promoCode : null,
            paymentProvider: "CASHFREE",
            returnUrl: "https://test.giddh.com/pages/subscription"
        }
        if (this.planUniqueName) {
            this.componentStore.updatePlan(request);
        } else {
            this.componentStore.createPlan(request);
        }
    }

    /**
    * This will use for select country
    *
    * @param {*} event
    * @memberof BuyPlanComponent
    */
    public selectState(event: any): void {
        if (event?.value) {
            this.selectedState = event.label;
            this.secondStepForm.controls['state'].setValue(event);
        }
    }

    /**
     *Hook cycle for afte component initialization
     *
     * @memberof BuyPlanComponent
     */
    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
        this.initIntl();
    }

    /**
     *This will be use for open activate key dialog
     *
     * @memberof BuyPlanComponent
     */
    public activateDialog(): void {
        this.dialog.open(ActivateDialogComponent, {
            width: '600px'
        })
    }

    /**
     * This will call on component destroy
     *
     * @memberof BuyPlanComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("plan-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
