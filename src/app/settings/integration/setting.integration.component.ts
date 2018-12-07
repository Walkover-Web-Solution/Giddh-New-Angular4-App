import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import * as _ from '../../lodash-optimized';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';

export declare const gapi: any;

@Component({
  selector: 'setting-integration',
  templateUrl: './setting.integration.component.html',
  styles: [`
    #inlnImg img {
      max-height: 18px;
    }

    .fs18 {
      font-weight: bold;
    }

    .pdBth20 {
      padding: 0 20px;
    }
  `]
})
export class SettingIntegrationComponent implements OnInit {

  public auth2: any;

  public smsFormObj: SmsKeyClass = new SmsKeyClass();
  public emailFormObj: EmailKeyClass = new EmailKeyClass();
  public razorPayObj: RazorPayClass = new RazorPayClass();
  public payoutObj: CashfreeClass = new CashfreeClass();
  public autoCollectObj: CashfreeClass = new CashfreeClass();
  public paymentGateway: CashfreeClass = new CashfreeClass();
  public amazonSeller: AmazonSellerClass = new AmazonSellerClass();
  public accounts$: Observable<IOption[]>;
  public updateRazor: boolean = false;
  public paymentGatewayAdded: boolean = false;
  public autoCollectAdded: boolean = false;
  public payoutAdded: boolean = false;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public bankAccounts$: Observable<IOption[]>;
  public gmailAuthCodeUrl$: Observable<string> = null;
  public amazonSellerForm: FormGroup;
  public amazonEditItemIdx: number;
  public amazonSellerRes: AmazonSellerClass[];
  public isGmailIntegrated$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
  private isSellerAdded: Observable<boolean> = observableOf(false);
  private isSellerUpdate: Observable<boolean> = observableOf(false);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private settingsIntegrationActions: SettingsIntegrationActions,
    private accountService: AccountService,
    private toasty: ToasterService,
    private _fb: FormBuilder
  ) {
    this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
    this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl.replace(':redirect_url', this.getRedirectUrl(AppUrl)).replace(':client_id', this.getGoogleCredentials(AppUrl).GOOGLE_CLIENT_ID);
    this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);
    this.isSellerAdded = this.store.select(s => s.settings.amazonState.isSellerSuccess).pipe(takeUntil(this.destroyed$));
    this.isSellerUpdate = this.store.select(s => s.settings.amazonState.isSellerUpdated).pipe(takeUntil(this.destroyed$));
    this.isGmailIntegrated$ = this.store.select(s => s.settings.isGmailIntegrated).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());

    // getting all page data of integration page
    this.store.select(p => p.settings.integration).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
      // set sms form data
      if (o.smsForm) {
        this.smsFormObj = o.smsForm;
      }
      // set email form data
      if (o.emailForm) {
        this.emailFormObj = o.emailForm;
      }
      // set razor pay form data
      if (o.razorPayForm) {
        this.razorPayObj = _.cloneDeep(o.razorPayForm);
        this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.updateRazor = true;
      } else {
        this.setDummyData();
        this.updateRazor = false;
      }
      // set cashfree form data
      if (o.payoutForm && o.payoutForm.userName) {
        this.payoutObj = _.cloneDeep(o.payoutForm);
        // this.payoutObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.payoutAdded = true;
      } else {
        this.payoutObj = new CashfreeClass();
        this.payoutAdded = false;
      }
      if (o.autoCollect && o.autoCollect.userName) {
        this.autoCollectObj = _.cloneDeep(o.autoCollect);
        // this.autoCollectObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.autoCollectAdded = true;
      } else {
        this.autoCollectObj = new CashfreeClass();
        this.autoCollectAdded = false;
      }
      if (o.paymentGateway && o.paymentGateway.userName) {
        this.paymentGateway = _.cloneDeep(o.paymentGateway);
        this.paymentGatewayAdded = true;
      } else {
        this.paymentGateway = new CashfreeClass();
        this.paymentGatewayAdded = false;
      }
      if (o.amazonSeller && o.amazonSeller.length) {
        this.amazonSellerRes = _.cloneDeep(o.amazonSeller);
        this.amazonSellerForm.controls['sellers'].patchValue(this.amazonSellerRes);
        // this.amazonSellerForm.controls['sellers'].disable();
        this.addAmazonSellerRow();
      }
    });

    this.flattenAccountsStream$.subscribe(data => {
      if (data) {
        let accounts: IOption[] = [];
        let bankAccounts: IOption[] = [];
        _.forEach(data, (item) => {
          accounts.push({label: item.name, value: item.uniqueName});
          let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts');
          if (findBankIndx !== -1) {
            bankAccounts.push({label: item.name, value: item.uniqueName});
          }
        });
        this.accounts$ = observableOf(accounts);
        this.bankAccounts$ = observableOf(accounts);
      }
    });

    this.amazonSellerForm = this._fb.group({
      sellers: this._fb.array([
        this.initAmazonReseller()
      ])
    });

    this.isSellerAdded.subscribe(a => {
      if (a) {
        this.addAmazonSellerRow();
      }
    });

    this.isSellerUpdate.subscribe(a => {
      if (a) {
        // console.log('isSellerUpdate', a);
        this.amazonEditItemIdx = null;
        this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
      }
    });

  }

  public getInitialData() {
    this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
    this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
    this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
    this.store.dispatch(this.settingsIntegrationActions.GetAmazonSellers());
  }

  public setDummyData() {
    this.razorPayObj.userName = '';
    this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
    this.razorPayObj.account = {name: null, uniqueName: null};
    this.razorPayObj.autoCapturePayment = true;
  }

  public onSubmitMsgform(f: NgForm) {
    if (f.valid) {
      this.store.dispatch(this.settingsIntegrationActions.SaveSMSKey(f.value.smsFormObj));
    }
  }

  public onSubmitEmailform(f: NgForm) {
    if (f.valid) {
      this.store.dispatch(this.settingsIntegrationActions.SaveEmailKey(f.value));
    }
  }

  public toggleCheckBox() {
    return this.razorPayObj.autoCapturePayment = !this.razorPayObj.autoCapturePayment;
  }

  public selectAccount(event: IOption) {
    if (event.value) {
      this.accounts$.subscribe((arr: IOption[]) => {
        let res = _.find(arr, (o) => o.value === event.value);
        if (res) {
          this.razorPayObj.account.name = res.text;
        }
      });
    }
  }

  public saveRazorPayDetails() {
    let data = _.cloneDeep(this.razorPayObj);
    this.store.dispatch(this.settingsIntegrationActions.SaveRazorPayDetails(data));
  }

  public updateRazorPayDetails() {
    let data = _.cloneDeep(this.razorPayObj);
    this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
  }

  public unlinkAccountFromRazorPay() {
    if (this.razorPayObj.account && this.razorPayObj.account.name && this.razorPayObj.account.uniqueName) {
      let data = _.cloneDeep(this.razorPayObj);
      data.account.uniqueName = null;
      data.account.name = null;
      this.store.dispatch(this.settingsIntegrationActions.UpdateRazorPayDetails(data));
    } else {
      this.toasty.warningToast('You don\'t have any account linked with Razorpay.');
    }
  }

  public deleteRazorPayDetails() {
    this.store.dispatch(this.settingsIntegrationActions.DeleteRazorPayDetails());
  }

  public selectCashfreeAccount(event: IOption, objToApnd) {
    let accObj = {
      name: event.label,
      uniqueName: event.value
    };
    objToApnd.account = accObj;
  }

  public submitCashfreeDetail(f) {
    if (f.userName && f.password) {
      let objToSend = _.cloneDeep(f);
      this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
    }
  }

  public deleteCashFreeAccount() {
    this.store.dispatch(this.settingsIntegrationActions.DeleteCashfreeDetails());
  }

  public updateCashfreeDetail(f) {
    if (f.userName && f.password) {
      let objToSend = _.cloneDeep(f);
      this.store.dispatch(this.settingsIntegrationActions.UpdateCashfreeDetails(objToSend));
    }
  }

  public submitAutoCollect(f) {
    if (f.userName && f.password) {
      let objToSend = _.cloneDeep(f);
      this.store.dispatch(this.settingsIntegrationActions.AddAutoCollectUser(objToSend));
    }
  }

  public updateAutoCollect(f) {
    if (f.userName && f.password) {
      let objToSend = _.cloneDeep(f);
      this.store.dispatch(this.settingsIntegrationActions.UpdateAutoCollectUser(objToSend));
    }
  }

  public deleteAutoCollect() {
    this.store.dispatch(this.settingsIntegrationActions.DeleteAutoCollectUser());
  }

  /**
   * submitPaymentGateway
   */
  public submitPaymentGateway(f) {
    if (f.userName && f.password) {
      this.store.dispatch(this.settingsIntegrationActions.AddPaymentGateway(f));
    }
  }

  /**
   * UpdatePaymentGateway
   */
  public updatePaymentGateway(f) {
    if (f.userName && f.password) {
      this.store.dispatch(this.settingsIntegrationActions.UpdatePaymentGateway(f));
    }
  }

  /**
   * DeletePaymentGateway
   */
  public deletePaymentGateway() {
    this.store.dispatch(this.settingsIntegrationActions.DeletePaymentGateway());
  }

  /**
   * saveAmazonSeller
   */
  public saveAmazonSeller() {
    let sellers = [];
    sellers.push(_.cloneDeep({}));
    this.store.dispatch(this.settingsIntegrationActions.AddAmazonSeller(sellers));
  }

  /**
   * updateAmazonSeller
   */
  public updateAmazonSeller(obj) {
    if (!obj.value.sellerId) {
      return;
    }
    let sellerObj = _.cloneDeep(obj.value);
    delete sellerObj['secretKey'];
    this.store.dispatch(this.settingsIntegrationActions.UpdateAmazonSeller(sellerObj));
  }

  /**
   * deleteAmazonSeller
   */
  public deleteAmazonSeller(sellerId, idx) {
    let seller = this.amazonSellerRes.findIndex((o) => o.sellerId === sellerId);
    if (seller > -1) {
      this.store.dispatch(this.settingsIntegrationActions.DeleteAmazonSeller(sellerId));
      this.removeAmazonSeller(idx);
    } else {
      this.removeAmazonSeller(idx);
    }
  }

  // initial initAmazonReseller controls
  public initAmazonReseller() {
    // initialize our controls
    return this._fb.group({
      sellerId: [''],
      mwsAuthToken: [''],
      accessKey: [''],
      secretKey: ['']
    });
  }

  public addAmazonSellerRow(i?: number, item?: any) {
    const AmazonSellerControl = this.amazonSellerForm.controls['sellers'] as FormArray;
    const control = this.amazonSellerForm.controls['sellers'] as FormArray;
    if (item) {
      if (control.controls[i]) {
        control.controls[i].patchValue(item);
        if (control.controls[i].value.sellerId) {
          control.controls[i].disable();
        }
      } else {
        control.push(this.initAmazonReseller());
        setTimeout(() => {
          control.controls[i].patchValue(item);
          if (control.controls[i].value.sellerId) {
            control.controls[i].disable();
          }
        }, 200);
      }
    } else {
      let arr = control.value;
      if (!control.value[arr.length - 1].sellerId) {
        return;
      }
      control.push(this.initAmazonReseller());
    }
  }

  // remove amazon Seller controls
  public removeAmazonSeller(i: number) {
    // remove address from the list
    const control = this.amazonSellerForm.controls['sellers'] as FormArray;
    if (control.length > 1) {
      control.removeAt(i);
    } else {
      control.controls[0].reset();
    }
  }

  /**
   * editAmazonSeller
   */
  public editAmazonSeller(idx: number) {
    this.enableDisableAmazonControl(idx, 'enable');
    this.amazonEditItemIdx = idx;
  }

  /**
   * enableDisableAmazonControl
   */
  public enableDisableAmazonControl(idx, type) {
    const control = this.amazonSellerForm.controls['sellers'] as FormArray;
    if (type === 'enable') {
      control.controls[idx].enable();
    } else {
      control.controls[idx].disable();
    }
  }

  private getRedirectUrl(baseHref: string) {
    if (baseHref.indexOf('dev.giddh.com') > -1) {
      return 'http://dev.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('test.giddh.com') > -1) {
      return 'http://test.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('stage.giddh.com') > -1) {
      return 'http://stage.giddh.com/app/pages/settings?tab=integration';
    } else if (baseHref.indexOf('localapp.giddh.com') > -1) {
      return 'http://localapp.giddh.com:3000/pages/settings?tab=integration';
    } else {
      return 'https://giddh.com/app/pages/settings?tab=integration';
    }
  }

  private getGoogleCredentials(baseHref: string) {
    if (baseHref === 'https://giddh.com/' || isElectron) {
      return {
        GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com'
      };
    } else {
      return {
        GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com'
      };
    }
  }

}
