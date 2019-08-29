import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, of as observableOf, Observable } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { CompanyCreateRequest, States, BillingDetails, CreateCompanyUsersPlan } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { WindowRef } from '../shared/helpers/window.object';
import { IOption } from '../theme/sales-ng-virtual-select/sh-options.interface';
import { State, Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { takeUntil, take } from 'rxjs/operators';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CompanyService } from '../services/companyService.service';
import { GeneralActions } from '../actions/general/general.actions';
import { CompanyActions } from '../actions/company.actions';
import { WindowRefService } from '../theme/universal-list/service';

@Component({
  selector: 'billing-details',
  templateUrl: 'billingDetail.component.html',
  styleUrls: ['billingDetail.component.scss']
})
export class BillingDetailComponent implements OnInit, OnDestroy {

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

  public subscriptionPrice: any = '';
  public payAmount: any;
  public orderId: string;
  public UserCurrency: string = '';
  public fromSubscription: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _generalService: GeneralService, private _toasty: ToasterService, private _route: Router, private activatedRoute: ActivatedRoute, private _companyService: CompanyService, private _generalActions: GeneralActions, private companyActions: CompanyActions, private winRef: WindowRefService) {
    this.store.dispatch(this._generalActions.getAllState());
    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({ label: `${d.code} - ${d.name}`, value: d.code });
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });
    this.fromSubscription = this._route.routerState.snapshot.url.includes('buy-plan');
  }

  public ngOnInit() {

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
        this.createNewCompany = res;
        this.UserCurrency = this.createNewCompany.baseCurrency;
      }
      console.log('billing', this.createNewCompany);
    });
    if (this.subscriptionPrice && this.UserCurrency) {
      this._companyService.getRazorPayOrderId(this.subscriptionPrice, this.UserCurrency).subscribe((res: any) => {
        if (res.status === 'success') {
          this.payAmount = res.body.amount;
          this.orderId = res.body.id;
          console.log('OrderId', this.orderId, 'amnt', this.payAmount);
        }
      });
    }

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
      console.log(this.billingDetailsObj);
    }
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public backToSubscriptions() {
    this._route.navigate(['pages', 'user-details'], { queryParams: { tab: 'subscriptions', tabIndex: 3 } });
  }


  public payWithRazor(billingDetail: NgForm) {
    if (!(this.validateEmail(billingDetail.value.email))) {
      this._toasty.warningToast('Enter valid Email ID', 'Warning');
      return false;
    }
    if (billingDetail.valid && this.createNewCompany) {
      this.createNewCompany.userBillingDetails = billingDetail.value;
      this.createNewCompany.amountPaid = this.payAmount;
    }
    console.log('create company Obj', this.createNewCompany);
    // this.createPaidPlanCompany(paymentId); //  after payment done then you will get paymentId pass this parameter in  createPaidPlanCompany method

    // let options = {
    //   key: 'rzp_live_rM2Ub3IHfDnvBq', // Enter the Key ID generated from the Dashboard
    //   amount: '29935', // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
    //   currency: 'INR',
    //   name: 'Acme Corp',
    //   handler: function (response) {
    //     alert(response.razorpay_payment_id);
    //   },
    //   prefill: {
    //     name: 'Gaurav Kumar',
    //     email: 'gaurav.kumar@example.com'
    //   },
    //   notes: {
    //     address: 'note value'
    //   },
    //   theme: {
    //     color: '#F37254'
    //   }
    // };
    // let rzp1 = new this.winRef.nativeWindow.Razorpay(options);
    // document.getElementById('rzp-button1').onclick = function (e) {
    // rzp1.open();
    // }
  }

  public createPaidPlanCompany(paymentId: string) {
    if (paymentId) {
      this.createNewCompany.paymentId = paymentId;
    }
    this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompany));
  }
}