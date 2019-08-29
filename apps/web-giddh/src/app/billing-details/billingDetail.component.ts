import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { BillingDetails, CompanyCreateRequest, CreateCompanyUsersPlan, States } from '../models/api-models/Company';
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

  public subscriptionPrice: any = '';
  public payAmount: number;
  public orderId: string;
  public UserCurrency: string = '';
  public fromSubscription: boolean = false;
  public bankList: any;
  public razorpay: any;
  public options: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _generalService: GeneralService, private _toasty: ToasterService, private _route: Router, private activatedRoute: ActivatedRoute, private _companyService: CompanyService, private _generalActions: GeneralActions, private companyActions: CompanyActions, private winRef: WindowRefService) {
    this.store.dispatch(this._generalActions.getAllState());
    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });
    this.fromSubscription = this._route.routerState.snapshot.url.includes('buy-plan');
  }


  public payNow() {
// has to be placed within user initiated context, such as click, in order for popup to open.

    let data = {
      amount: 1000, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
      currency: "INR",// Default is INR. We support more than 90 currencies.
      email: 'gaurav.kumar@example.com',
      contact: '9123456780',
      notes: {
        address: 'Ground Floor, SJR Cyber, Laskar Hosur Road, Bengaluru',
      },
      order_id: this.orderId,
      method: 'netbanking',

      // method specific fields
      bank: 'HDFC',

    };


    this.razorpay.createPayment(data);

    this.razorpay.on('payment.success', function (resp) {
      alert(resp.razorpay_payment_id),
        alert(resp.razorpay_order_id),
        alert(resp.razorpay_signature)
    }); // will pass payment ID, order ID, and Razorpay signature to success handler.

    this.razorpay.on('payment.error', function (resp) {
      alert(resp.error.description)
    }); // will pass error object to error handler
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

    // @ts-ignore
    // setTimeout(() => {
    // }, 1000);
    // this.razorpay.once('ready', function (response) {
    //   console.log(response.methods);
    //   this.bankList = response.methods.netbanking // response.methods.netbanking contains list of all banks
    // })

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
    this._route.navigate(['pages', 'user-details'], {queryParams: {tab: 'subscriptions', tabIndex: 3}});
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
    this.options.amount = this.payAmount * 100;
    this.razorpay.open();

  }

  public createPaidPlanCompany(paymentId: string) {
    if (paymentId) {
      this.createNewCompany.paymentId = paymentId;
    }
    this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompany));
  }

  ngAfterViewInit(): void {
    let s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.type = 'text/javascript';
    document.body.appendChild(s);
    this.options = {
      key: 'rzp_live_rM2Ub3IHfDnvBq', //rzp_test_yJEJrE3vJK4Q7U
      image: 'https://i.imgur.com/n5tjHFD.png',//'data:image/png;base64,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',
      handler: function (res) {
      this.createPaidPlanCompany(res.razorpay_payment_id)
      },
      amount: (this.payAmount * 100),
      currency: "INR",
      name: 'GIDDH',
      description: 'Walkover Solutions Pvt. Ltd.',
      
    };
    setTimeout(() => {
      this.razorpay = new (window as any).Razorpay(this.options);
    }, 1000);
  }
}
