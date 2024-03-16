import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';
import { BuyPlanComponentStore } from './utility/buy-plan.store';
import { Observable, ReplaySubject, takeUntil, of as observableOf, debounceTime } from 'rxjs';
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
import { Router } from '@angular/router';

@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore]
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    /** Step Form instance */
    @ViewChild('stepper') stepperIcon: any;
    /** Mobile number field instance */
    @ViewChild('mobileNoField', { static: false }) mobileNoField: ElementRef;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for company form */
    public subscriptionForm: FormGroup;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected tab*/
    public selectedStep: number = 0;
    /** Form Group for company form */
    public firstStepForm: FormGroup;
    /** Form Group for company address form */
    public secondStepForm: FormGroup;
    /** Form Group for subscription company form */
    public thirdStepForm: FormGroup;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected country */
    public selectedCountry: string = '';
    /** Hold current flag*/
    public currentFlag: any;
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
    /** Holds Store Plan list API succes state as observable*/
    public readonly planListInProgress$ = this.componentStore.select(state => state.planListInProgress);
    /** Holds Store Create Discount API in progress state as observable*/
    public readonly createPlanInProgress$ = this.componentStore.select(state => state.createPlanInProgress);
    /** Holds Store Create Discount API succes state as observable*/
    public readonly createPlanSuccess$ = this.componentStore.select(state => state.createPlanSuccess);
    /** Holds Store Create Discount API in progress state as observable*/
    public readonly applyPromoCodeInProgress$ = this.componentStore.select(state => state.applyPromoCodeInProgress);
    /** Holds Store Create Discount API succes state as observable*/
    public readonly applyPromoCodeSuccess$ = this.componentStore.select(state => state.applyPromoCodeSuccess);
    /** Holds Store Create Discount API succes state as observable*/
    public readonly promoCodeResponse$ = this.componentStore.select(state => state.promoCodeResponse);
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
    /** True if promo code applied */
    public appliedPromocode: boolean = false;
    /** Hold selected plan*/
    public selectedPlan: any;

    public stateSource$: Observable<IOption[]> = observableOf([]);
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public displayedColumns: any = [];
    public dataSource: any;

    public getColumnNames(): string[] {
        return this.displayedColumns.map(column => column.uniqueName);
    }

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
        private router : Router

    ) {
        this.componentStore.getAllPlans({ params: { countryCode: this.company.countryCode } });
    }

    public ngOnInit(): void {
        this.initSubscriptionForm();
        this.getAllPlans();
        this.getCountry();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();

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

        this.thirdStepForm.get('promoCode').valueChanges.pipe(
            debounceTime(300), takeUntil(this.destroyed$))
            .subscribe((newValue) => {
                if (!newValue) {
                    this.appliedPromocode = false;
            }
            });
    }

    public getPromoCodeData(): void {
        this.promoCodeResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {

        })
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getActiveCompany(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
            }
        })
    }

    public applyPromoCode(): void {
        console.log(this.thirdStepForm.get('promoCode')?.value);
        if (this.thirdStepForm.get('promoCode')?.value) {
            this.appliedPromocode = true;
            let request = {
                promoCode: this.thirdStepForm.get('promoCode')?.value,
                planUniqueName: this.firstStepForm.get('planUniqueName').value,
                duration: this.firstStepForm.get('duration').value
            }
            this.componentStore.applyPromocode(request);
        } else {
            this.appliedPromocode = false;
        }
    }


    /**
   * Gets company profile
   *
   * @private
   * @memberof VoucherCreateComponent
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
  * @memberof VoucherCreateComponent
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
       * @memberof VoucherCreateComponent
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
     * @memberof VoucherCreateComponent
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
 * Initializing the company form
 *
 * @private
 * @memberof
 */
    private initSubscriptionForm(): void {
        this.firstStepForm = this.formBuilder.group({
            duration: ['YEARLY'],
            planUniqueName: ['', Validators.required]
        });

        this.secondStepForm = this.formBuilder.group({
            billingName: ['', Validators.required],
            companyName: ['', Validators.required],
            email: ["", [Validators.required, Validators.email]],
            pincode: [''],
            mobileNumber: ['', Validators.required],
            taxNumber: null,
            country: ['', Validators.required],
            state: ['', Validators.required],
            address: [''],
        });

        this.thirdStepForm = this.formBuilder.group({
            userUniqueName: [''],
            promoCode: [''],
            paymentProvider: ['']
        });

        this.subscriptionForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm
        });

        // this.firstStepForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        //     if (this.showPageLeaveConfirmation) {
        //         this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        //     }
        // });
    }

    /**
 * Initializes the int-tel input
 *
 * @memberof VoucherCreateComponent
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
     * @memberof VoucherCreateComponent
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
 * @memberof AddCompanyComponent
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
 * @memberof AddCompanyComponent
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
* @memberof AddCompanyComponent
*/
    public getEnterTaxText(): string {
        let text = 'Enter Tax';
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

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
 * @memberof AddCompanyComponent
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
 * @memberof
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
        /** Get Plan List */
        this.planList$.pipe(takeUntil(this.componentStore.destroy$)).subscribe(response => {
            if (response?.length) {
                this.selectedPlan = response.find(plan => plan.name === 'Oak');
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
 * @memberof AddCompanyComponent
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
 * @memberof AddCompanyComponent
 */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.subscriptionForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        let request = {
            planUniqueName: this.subscriptionForm.value.firstStepForm.planUniqueName,
            duration: this.subscriptionForm.value.firstStepForm.duration,
            userUniqueName: "dilpreet@walkover.in",
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
            promoCode: this.subscriptionForm.value.thirdStepForm.promoCode,
            paymentProvider: "CASHFREE"
        }
        this.componentStore.createPlan(request);
    }

    /**
* This will use for select country
*
* @param {*} event
* @memberof AddCompanyComponent
*/
    public selectState(event: any): void {
        if (event?.value) {
            this.selectedState = event.label;
            this.secondStepForm.controls['state'].setValue(event);
        }
    }

    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
        this.initIntl();
    }

    public activateDialog(): void {
        this.dialog.open(ActivateDialogComponent, {
            width: '600px'
        })
    }


    /**
     * This will call on component destroy
     *
     * @memberof
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
