import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { BillingDetails, CompanyCreateRequest, CreateCompanyUsersPlan, States, StatesRequest, SubscriptionRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { IOption } from '../theme/sales-ng-virtual-select/sh-options.interface';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CompanyService } from '../services/companyService.service';
import { GeneralActions } from '../actions/general/general.actions';
import { CompanyActions } from '../actions/company.actions';
import { WindowRefService } from '../theme/universal-list/service';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { OnboardingFormRequest } from "../models/api-models/Common";
import { CommonActions } from '../actions/common.actions';
import * as googleLibphonenumber from 'google-libphonenumber';
import { environment } from '../../environments/environment.prod';

@Component({
    selector: 'billing-details',
    templateUrl: 'billingDetail.component.html',
    styleUrls: ['billingDetail.component.scss']
})
export class BillingDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    public logedInuser: UserDetails;
    public billingDetailsObj: BillingDetails = {
        name: '',
        email: '',
        contactNo: '',
        gstin: '',
        stateCode: '',
        address: '',
        autorenew: true
    };
    public createNewCompany: CompanyCreateRequest;
    public createNewCompanyFinalObj: CompanyCreateRequest;
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public stateStream$: Observable<States[]>;
    public userSelectedSubscriptionPlan$: Observable<CreateCompanyUsersPlan>;
    public selectedPlans: CreateCompanyUsersPlan;
    public states: IOption[] = [];
    public isGstValid: boolean;
    public selectedState: any = '';
    public subscriptionPrice: any = '';
    public razorpayAmount: any;
    public orderId: string;
    public UserCurrency: string = '';
    public companyCountry: string = '';
    public fromSubscription: boolean = false;
    public bankList: any;
    public razorpay: any;
    public options: any;
    public isCompanyCreationInProcess$: Observable<boolean>;
    public isRefreshing$: Observable<boolean>;
    public isCreateAndSwitchCompanyInProcess: boolean = true;
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isUpdateCompanySuccess$: Observable<boolean>;
    public SubscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public ChangePaidPlanAMT: any = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public formFields: any[] = [];
    public stateGstCode: any[] = [];
    public disableState: boolean = false;
    public phoneUtility: any = googleLibphonenumber.PhoneNumberUtil.getInstance();
    public isMobileNumberValid: boolean = true;
    public liveRazorPayKeyforAuthentication = 'rzp_live_rM2Ub3IHfDnvBq';
    public testRazorPayKeyforAuthentication = 'rzp_test_QS3CQB90ukHDIF';
    public razorpayAuthKey = 'rzp_live_rM2Ub3IHfDnvBq';

    private activeCompany;

    constructor(private store: Store<AppState>, private _generalService: GeneralService, private _toasty: ToasterService, private _route: Router,
        private activatedRoute: ActivatedRoute, private _companyService: CompanyService, private _generalActions: GeneralActions,
        private companyActions: CompanyActions, private winRef: WindowRefService, private cdRef: ChangeDetectorRef,
        private settingsProfileActions: SettingsProfileActions, private commonActions: CommonActions) {
        this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));
        this.fromSubscription = this._route.routerState.snapshot.url.includes('buy-plan');
        this.isUpdateCompanySuccess$ = this.store.select(s => s.settings.updateProfileSuccess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.dispatch(this.settingsProfileActions.resetPatchProfile());
        // set active company
        this.store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this._generalService.companyUniqueName);
        });

        this.getStates();

        this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
        this.isRefreshing$ = this.store.select(s => s.session.isRefreshing).pipe(takeUntil(this.destroyed$));
        this.logedInuser = this._generalService.user;

        if (this._generalService.createNewCompany) {
            this.createNewCompanyFinalObj = this._generalService.createNewCompany;
        }

        this.store.pipe(select(s => s.session.userSelectedSubscriptionPlan), takeUntil(this.destroyed$)).subscribe(res => {
            this.selectedPlans = res;
            if (this.selectedPlans) {
                this.subscriptionPrice = this.selectedPlans.planDetails.amount;
            }
        });
        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (!res.isBranch && !res.city) {
                    this.createNewCompany = res;
                    this.UserCurrency = this.createNewCompany.baseCurrency;
                    this.orderId = this.createNewCompany.orderId;
                    this.razorpayAmount = this.getPayAmountForRazorPay(this.createNewCompany.amountPaid);
                    this.getOnboardingForm();
                }
            }
        });

        this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.isBranch && res.city) {
                    this.createNewCompany = res;
                    this.UserCurrency = this.createNewCompany.baseCurrency;
                    this.orderId = this.createNewCompany.orderId;
                    this.razorpayAmount = this.getPayAmountForRazorPay(this.createNewCompany.amountPaid);
                    this.getOnboardingForm();
                }
            }
        });

        this.isCompanyCreationInProcess$.pipe(takeUntil(this.destroyed$)).subscribe(isINprocess => {
            this.isCreateAndSwitchCompanyInProcess = isINprocess;
        });
        this.isRefreshing$.pipe(takeUntil(this.destroyed$)).subscribe(isInpro => {
            this.isCreateAndSwitchCompanyInProcess = isInpro;
        });
        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(inProcess => {
            this.isCreateAndSwitchCompanyInProcess = inProcess;
        });
        this.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(success => {
            if (success) {
                this._route.navigate(['pages', 'user-details', 'subscription']);
            }
        });
        this.cdRef.detectChanges();
        if (this.fromSubscription && this.selectedPlans) {
            this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    this.UserCurrency = res.baseCurrency;
                }
            });
            this.prepareSelectedPlanFromSubscriptions(this.selectedPlans);
        }
        // check environment is live or test then change authentication key for razorpay
        if (!environment.production) {
            this.razorpayAuthKey = this.testRazorPayKeyforAuthentication;
        } else {
            this.razorpayAuthKey = this.liveRazorPayKeyforAuthentication;

        }
    }

    public getPayAmountForRazorPay(amt: any) {
        return amt * 100;
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
        this.disableState = false;
        if (this.createNewCompany.country === "IN") {
            let gstVal: string = gstNo.value;
            this.billingDetailsObj.gstin = gstVal;

            if (gstVal.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];
                    let s = state.find(st => st.value === stateCode);
                    statesEle.setDisabledState(false);

                    if (s) {
                        this.billingDetailsObj.stateCode = s.value;
                        statesEle.setDisabledState(true);
                    } else {
                        this.billingDetailsObj.stateCode = '';
                        statesEle.setDisabledState(false);
                        this._toasty.clearAllToaster();
                        this._toasty.warningToast('Invalid .' + this.formFields['taxName'].label);
                    }
                });
            } else {
                statesEle.setDisabledState(false);
                this.billingDetailsObj.stateCode = '';
            }
        }
    }

    public validateEmail(emailStr) {
        let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(emailStr);
    }

    public autoRenewSelected(event) {
        if (event) {
            this.billingDetailsObj.autorenew = event.target.checked;
        }
    }

    public prepareSelectedPlanFromSubscriptions(plan: CreateCompanyUsersPlan) {
        this.isCreateAndSwitchCompanyInProcess = true;
        this.subscriptionPrice = plan.planDetails.amount;
        this.SubscriptionRequestObj.userUniqueName = this.logedInuser.uniqueName;
        this.SubscriptionRequestObj.planUniqueName = plan.planDetails.uniqueName;
        if (!this.UserCurrency) {
            this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    this.UserCurrency = res.baseCurrency;
                }
            });
        }
        if (this.subscriptionPrice && this.UserCurrency) {
            this._companyService.getRazorPayOrderId(this.subscriptionPrice, this.UserCurrency).subscribe((res: any) => {
                this.isCreateAndSwitchCompanyInProcess = false;
                if (res.status === 'success') {
                    this.ChangePaidPlanAMT = res.body.amount;
                    this.orderId = res.body.id;
                    this.store.dispatch(this.companyActions.selectedPlan(plan));
                    this.razorpayAmount = this.getPayAmountForRazorPay(this.ChangePaidPlanAMT);
                    this.ngAfterViewInit();
                } else {
                    this._toasty.errorToast(res.message);
                }
            });
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public backToSubscriptions() {
        this._route.navigate(['pages', 'user-details', 'subscription']);
    }

    public payWithRazor(billingDetail: NgForm) {
        if (!(this.validateEmail(billingDetail.value.email))) {
            this._toasty.warningToast('Enter valid Email ID', 'Warning');
            return false;
        }
        if (billingDetail.valid && this.createNewCompany) {
            this.createNewCompany.userBillingDetails = billingDetail.value;
            if (this.billingDetailsObj) {
                if (this.billingDetailsObj.stateCode) {
                    this.createNewCompany.userBillingDetails.stateCode = this.billingDetailsObj.stateCode;
                }
            }
        }
        this.razorpay.open();
    }

    public patchProfile(obj) {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    public createPaidPlanCompany(razorPay_response: any) {
        if (razorPay_response) {
            if (!this.fromSubscription) {
                this.createNewCompany.paymentId = razorPay_response.razorpay_payment_id;
                this.createNewCompany.razorpaySignature = razorPay_response.razorpay_signature;
                this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompany));
            } else {
                let reQuestob = {
                    subscriptionRequest: this.SubscriptionRequestObj,
                    paymentId: razorPay_response.razorpay_payment_id,
                    razorpaySignature: razorPay_response.razorpay_signature,
                    amountPaid: this.ChangePaidPlanAMT,
                    userBillingDetails: this.billingDetailsObj,
                    country: this.createNewCompany ? this.createNewCompany.country : '',
                    callNewPlanApi: true
                };
                this.patchProfile(reQuestob);
            }
        }
        this.cdRef.detectChanges();

    }

    ngAfterViewInit(): void {
        let s = document.createElement('script');
        let that = this;
        let testEnvAuthkeyForRazorpay =

            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.type = 'text/javascript';
        document.body.appendChild(s);
        this.options = {
            key: 'rzp_test_QS3CQB90ukHDIF',   // rzp_live_rM2Ub3IHfDnvBq   // rzp_test_QS3CQB90ukHDIF //rzp_live_rM2Ub3IHfDnvBq  //'https://i.imgur.com/n5tjHFD.png'
            image: 'data:image/png;base64,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',
            handler: function (res) {
                that.createPaidPlanCompany(res);
            },
            order_id: this.orderId,
            theme: {
                color: '#F37254'
            },
            amount: this.razorpayAmount,
            currency: this.UserCurrency,
            name: 'GIDDH',
            description: 'Walkover Technologies Private Limited.',

        };
        setTimeout(() => {
            this.razorpay = new (window as any).Razorpay(this.options);
        }, 1000);
        this.reFillForm();
    }

    public reFillForm() {
        // if createNewCompany is undefined or null
        // it means user came from user derails => subscription => buy new plan
        // then get current company data and assign it to createNewCompany object
        if (!this.createNewCompany) {
            this.createNewCompany = new CompanyCreateRequest();
            this.createNewCompany.name = this.activeCompany.name;
            this.createNewCompany.contactNo = this.activeCompany.contactNo;
            this.createNewCompany.phoneCode = this.activeCompany.countryV2 ? this.activeCompany.countryV2.callingCode : '';
            this.createNewCompany.country = this.activeCompany.countryV2 ? this.activeCompany.countryV2.alpha2CountryCode : '';
            this.createNewCompany.uniqueName = this.activeCompany.uniqueName;
            this.createNewCompany.address = this.activeCompany.address;
            this.createNewCompany.addresses = this.activeCompany.addresses;
            this.createNewCompany.subscriptionRequest = new SubscriptionRequest();
            this.createNewCompany.subscriptionRequest.userUniqueName = this.activeCompany.subscription ? this.activeCompany.subscription.userDetails.uniqueName : '';

            // assign state code to billing details object
            this.billingDetailsObj.stateCode = this.activeCompany.state;
        }

        this.billingDetailsObj.name = this.createNewCompany.name;
        this.billingDetailsObj.contactNo = this.createNewCompany.contactNo;
        this.billingDetailsObj.email = this.createNewCompany.subscriptionRequest.userUniqueName;
        // this.billingDetailsObj.stateCode = this.billingDetailsObj.stateCode;

        let selectedBusinesstype = this.createNewCompany.businessType;
        if (selectedBusinesstype === 'Registered') {
            this.billingDetailsObj.gstin = this.createNewCompany.addresses[0].taxNumber;
        }
        this.billingDetailsObj.address = this.createNewCompany.address;
    }

    public getStates() {
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {

                    if (res.stateList[key].stateGstCode !== null) {
                        this.stateGstCode[res.stateList[key].stateGstCode] = [];
                        this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                    }

                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });

                    if (this.createNewCompany !== undefined && this.createNewCompany.addresses !== undefined && this.createNewCompany.addresses[0] !== undefined) {
                        if (res.stateList[key].code === this.createNewCompany.addresses[0].stateCode) {
                            this.selectedState = res.stateList[key].code + ' - ' + res.stateList[key].name;
                            this.billingDetailsObj.stateCode = res.stateList[key].code;
                            this.disableState = true;
                        }
                    }
                });

                this.statesSource$ = observableOf(this.states);
            } else {
                // initialize new StatesRequest();
                let statesRequest = new StatesRequest();

                // check if createNewCompany object is initialized if not then user current company country code
                statesRequest.country = this.createNewCompany ? this.createNewCompany.country : this.activeCompany.countryV2 ? this.activeCompany.countryV2.alpha2CountryCode : '';
                this.store.dispatch(this._generalActions.getAllState(statesRequest));
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
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = 'onboarding';
                onboardingFormRequest.country = this.createNewCompany.country;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    public isValidMobileNumber(ele: HTMLInputElement) {
        if (ele.value) {
            this.checkMobileNo(ele);
        }
    }

    public checkMobileNo(ele) {
        try {
            let parsedNumber = this.phoneUtility.parse('+' + this.createNewCompany.phoneCode + ele.value, this.createNewCompany.country);
            if (this.phoneUtility.isValidNumber(parsedNumber)) {
                ele.classList.remove('error-box');
                this.isMobileNumberValid = true;
            } else {
                this.isMobileNumberValid = false;
                this._toasty.errorToast('Invalid Contact number');
                ele.classList.add('error-box');
            }
        } catch (error) {
            this.isMobileNumberValid = false;
            this._toasty.errorToast('Invalid Contact number');
            ele.classList.add('error-box');
        }
    }
}
