import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { GeneralService } from '../services/general.service';
import {
  BillingDetails,
  CompanyCreateRequest,
  CreateCompanyUsersPlan,
  States,
  SubscriptionRequest,
  CompanyCountry,
  StatesRequest
} from '../models/api-models/Company';
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
import {CountryRequest} from "../models/api-models/Common";
import { CommonActions } from '../actions/common.actions';

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
    mobile: '',
    gstin: '',
    state: '',
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
  public selectedState: any = ''
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
  public SubscriptionRequestObj: SubscriptionRequest = {
    planUniqueName: '',
    subscriptionId: '',
    userUniqueName: '',
    licenceKey: ''
  };
  public ChangePaidPlanAMT: any = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public countryNameCode: any[] = [];

  constructor(private store: Store<AppState>, private _generalService: GeneralService, private _toasty: ToasterService, private _route: Router, private activatedRoute: ActivatedRoute, private _companyService: CompanyService, private _generalActions: GeneralActions, private companyActions: CompanyActions, private winRef: WindowRefService, private cdRef: ChangeDetectorRef, private settingsProfileActions: SettingsProfileActions, private commonActions: CommonActions) {
    this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));
    this.fromSubscription = this._route.routerState.snapshot.url.includes('buy-plan');
  }

  public ngOnInit() {
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
          this.razorpayAmount = this.getPayAmountForTazorPay(this.createNewCompany.amountPaid);
        }
      }
    });
    this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        if (res.isBranch && res.city) {
          this.createNewCompany = res;
          this.UserCurrency = this.createNewCompany.baseCurrency;
          this.orderId = this.createNewCompany.orderId;
          this.razorpayAmount = this.getPayAmountForTazorPay(this.createNewCompany.amountPaid);
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
    this.cdRef.detectChanges();
    if (this.fromSubscription && this.selectedPlans) {
      this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
        if (res) {
          this.UserCurrency = res.baseCurrency;
        }
      });
      this.prepareSelectedPlanFromSubscriptions(this.selectedPlans);
    }
  }

  public getPayAmountForTazorPay(amt: any) {
    return amt * 100;
  }

  public checkGstNumValidation(ele: HTMLInputElement) {
    let isInvalid: boolean = false;
    if (ele.value) {
      if (ele.value.length !== 15 || (Number(ele.value.substring(0, 2)) < 1) || (Number(ele.value.substring(0, 2)) > 37)) {
        this._toasty.errorToast('Invalid GST number');
        ele.classList.add('error-box');
        this.isGstValid = false;
      } else {
        ele.classList.remove('error-box');
        this.isGstValid = true;
        // this.checkGstDetails();
      }
    } else {
      ele.classList.remove('error-box');
    }
  }

  public getStateCode(gstNo: HTMLInputElement, statesEle: ShSelectComponent) {
    let gstVal: string = gstNo.value;
    this.billingDetailsObj.gstin = gstVal;

    if (gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.setDisabledState(false);

        if (s) {
          this.billingDetailsObj.state = s.value;
          statesEle.setDisabledState(true);

        } else {
          this.billingDetailsObj.state = '';
          statesEle.setDisabledState(false);
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.setDisabledState(false);
      this.billingDetailsObj.state = '';
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
        if (res.status === 'success') {
          this.ChangePaidPlanAMT = res.body.amount;
          this.orderId = res.body.id;
          this.store.dispatch(this.companyActions.selectedPlan(plan));
          this.razorpayAmount = this.getPayAmountForTazorPay(this.ChangePaidPlanAMT);
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
    this._route.navigate(['pages', 'user-details'], { queryParams: { tab: 'subscriptions', tabIndex: 3, isPlanPage: true } });
  }

  public payWithRazor(billingDetail: NgForm) {
    if (!(this.validateEmail(billingDetail.value.email))) {
      this._toasty.warningToast('Enter valid Email ID', 'Warning');
      return false;
    }
    if (billingDetail.valid && this.createNewCompany) {
      this.createNewCompany.userBillingDetails = billingDetail.value;
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
          country: this.companyCountry
        };
        this.patchProfile(reQuestob);
      }
    }
    this.cdRef.detectChanges();

  }

  ngAfterViewInit(): void {
    let s = document.createElement('script');
    let that = this;
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.type = 'text/javascript';
    document.body.appendChild(s);
    this.options = {
      key: 'rzp_test_QS3CQB90ukHDIF',   // rzp_live_rM2Ub3IHfDnvBq   // rzp_test_QS3CQB90ukHDIF //rzp_live_rM2Ub3IHfDnvBq  //'https://i.imgur.com/n5tjHFD.png'
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAk1BMVEUAAAAgICCvIAAoKCivIAArKyWvIACuIAAoKCirIAApKSasIwArKCitIwApKSesIgApKSmtIgCtIgAqKiitIgArKSmtIgAqKSmsIgAqKiitIgArKSisIwAqKSmsIwAqKimsIwArKSisIwArKSitIwCsIgArKiitIgCtIgAqKSmtIgArKimtIgArKSisIgArKimtIwCLeJzxAAAAL3RSTlMAEBAgIDAwP0BAUF9gYG9vcHB/gICPj5CQn5+goK+vsLC/v8DAz9DQ3+Dg7+/w8HQisAwAAALGSURBVFjDrZjreqIwEIaR4iFV1oJsdVvXIgWTjRi4/6tbah91JkxCwu78bNP3mfnmwEyDwGKzZVoUou1MFEW6nAVjLFof6laz+rCOPDHLQ2uww9KdEqZ1azGRhm4cO+Ya4toBw6rWwSo2xHltHe3VnqqqdbbKksBZ3XpYbayruPW02Jkj9xljXbJDxrK9dCT1ODLTVIgy6UBi2pOSTDArtWc9nSKsszTWCcNe1XrucN4zW41kuArwL3fInYF5wRR8vTMKxAd7MuTwPTMExh16G5EqOmruNCMQKbn/FGRMOs6aECSvDgmHnOcyI5JcO+bdWAWi1xvSZ65LvVNyOpM+weXX5gD95fepAX331SjJSIeQSwmKTPp+RCWKrR6TMj1xdTencaBeNoP1F4+PDMYWA/f2/qA9kKUcLxEUqQQg5g9iACT+D6gKHsIbBsj05/F4Pv7+8UR94h9/DUAkZnFsbvaLQDmDtg2w87MbiAjtvcG2soQmLWJvG90WJrG5Lf2LHqc5T4zptxTkqQ9qNoaCzC0tQjjUuWRskVgf4RaFvgxlToCmNY+RTxK0MY2RQJlEOg2CHrIoNGq12EhO80FGltuG/2Bo2vAH1Vn4gQpNXtMH8oUETY0fSPjJRipNKc4fSqHbcqsMSwQV2wu1REhirYHBPfU5J3KtuW1aIXBJwGGy0jmXKbWcqfvfJHAjDM16A05FrX5BwE2k1QUKTXO4aT1GpMl9SF4eFYQ4uGbQwi7QIjl53rx/bjdgNrLauLDj4No2tR7P6CnXx7jCJ7n5qBHooYosK8p339FnVjF0ZhGHn0i1V7NUjDshO9ZbOp93zkfzefom/uWoHXUcd74rH4yynBsRd+dw+8q5c+XsBncnJ6e4y1aWDCqlEsejLpM2jExC9+Uwzk2YPPb9Z12S90JUeeJ9HXzXVZyV5TVMXuZZbD1T/wJZ67NdEouQRAAAAABJRU5ErkJggg==',
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
      description: 'Walkover Web Solutions Pvt. Ltd.',

    };
    setTimeout(() => {
      this.razorpay = new (window as any).Razorpay(this.options);
    }, 1000);
    this.reFillForm();
  }

  public reFillForm() {
    this.billingDetailsObj.name = this.createNewCompany.name;
    this.billingDetailsObj.mobile = this.createNewCompany.contactNo;
    this.billingDetailsObj.email = this.createNewCompany.subscriptionRequest.userUniqueName;

    let selectedBusinesstype = this.createNewCompany.bussinessType;
    if (selectedBusinesstype === 'Registered') {
      this.billingDetailsObj.gstin = this.createNewCompany.gstDetails[0].gstNumber;
    }
    this.billingDetailsObj.address = this.createNewCompany.address;
  }

  public reFillState() {
    if(this.createNewCompany !== undefined && this.createNewCompany.gstDetails !== undefined && this.createNewCompany.gstDetails[0] !== undefined && this.createNewCompany.gstDetails[0].addressList !== undefined && this.createNewCompany.gstDetails[0].addressList[0] !== undefined) {
      this.billingDetailsObj.state = this.createNewCompany.gstDetails[0]['addressList'][0].stateCode;

      let stateLoop = 0;
      for(stateLoop; stateLoop < this.states.length; stateLoop++) {
        if(this.states[stateLoop].value === this.billingDetailsObj.state) {
          this.selectedState = this.states[stateLoop].label;
        }
      }
    }
  }

  public getCountry() {
    this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res).forEach(key => {
          // Creating Country List
          this.countryNameCode[res[key].countryName] = [];
          this.countryNameCode[res[key].countryName] = res[key].alpha2CountryCode;
        });
        this.getStates();
      } else {
        let countryRequest = new CountryRequest();
        countryRequest.formName = 'onboarding';
        this.store.dispatch(this.commonActions.GetCountry(countryRequest));
      }
    });
  }

  public getStates() {
    this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        Object.keys(res.stateList).forEach(key => {
          this.states.push({
            label: res.stateList[key].code + ' - ' + res.stateList[key].name,
            value: res.stateList[key].code
          });
        });
        this.statesSource$ = observableOf(this.states);
      } else {
        //let statesRequest = new StatesRequest();
        //statesRequest.country = this.countryNameCode[this.createNewCompanyPreparedObj.country];
        //this.store.dispatch(this._generalActions.getAllState(statesRequest));
      }
    });
  }
}
