import { Store } from '@ngrx/store';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import { CashfreeClass, EmailKeyClass, RazorPayClass, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';

export declare const gapi: any;

@Component({
  selector: 'setting-integration',
  templateUrl: './setting.integration.component.html',
  styles: [`
    #inlnImg img{
      max-height:18px;
    }
    .fs18{
      font-weight: bold;
    }
    .pdBth20{
      padding: 0 20px;
    }
  `]
})
export class SettingIntegrationComponent implements OnInit, AfterViewInit {

  public auth2: any;

  public smsFormObj: SmsKeyClass = new SmsKeyClass();
  public emailFormObj: EmailKeyClass = new EmailKeyClass();
  public razorPayObj: RazorPayClass = new RazorPayClass();
  public payoutObj: CashfreeClass = new CashfreeClass();
  public autoCollectObj: CashfreeClass = new CashfreeClass();
  public paymentGateway: CashfreeClass = new CashfreeClass();
  public accounts$: Observable<IOption[]>;
  public updateRazor: boolean = false;
  public paymentGatewayAdded: boolean = false;
  public autoCollectAdded: boolean = false;
  public payoutAdded: boolean = false;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public bankAccounts$: Observable<IOption[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private isGmailInited: boolean = false;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private settingsIntegrationActions: SettingsIntegrationActions,
    private accountService: AccountService,
    private toasty: ToasterService,
  ) {
    this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // getting all page data of integration page
    this.store.select(p => p.settings.integration).takeUntil(this.destroyed$).subscribe((o) => {
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
        // this.autoCollectObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.paymentGatewayAdded = true;
      } else {
        this.paymentGateway = new CashfreeClass();
        this.paymentGatewayAdded = false;
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
        this.accounts$ = Observable.of(accounts);
        this.bankAccounts$ = Observable.of(accounts);
      }
    });
    // get accounts
    // this.accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
    //   if (data.status === 'success') {
    //     let accounts: IOption[] = [];
    //     _.forEach(data.body.results, (item) => {
    //       accounts.push({ label: item.name, value: item.uniqueName });
    //     });
    //     this.accounts$ = Observable.of(accounts);
    //   }
    // });

  }

  public getInitialData() {
    this.store.dispatch(this.settingsIntegrationActions.GetSMSKey());
    this.store.dispatch(this.settingsIntegrationActions.GetEmailKey());
    this.store.dispatch(this.settingsIntegrationActions.GetRazorPayDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetCashfreeDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetAutoCollectDetails());
    this.store.dispatch(this.settingsIntegrationActions.GetPaymentGateway());
  }

  public setDummyData() {
    this.razorPayObj.userName = '';
    this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
    this.razorPayObj.account = { name: null, uniqueName: null };
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

  public ngAfterViewInit() {
    if (!this.isGmailInited) {
      this.googleInit();
      this.isGmailInited = true;
    }
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
        // cookiepolicy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/gmail.send',
        access_type: 'offline',
        response_type: 'code',
        auth_uri: 'https://accounts.google.com/o/oauth2/v2/auth',
        prompt: 'select_account',
        include_granted_scopes: true,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localapp.giddh.com:3000/pages/home',
        ux_mode: 'popup'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        console.log('googleUser is :', googleUser.getAuthResponse());

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse(true).id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
