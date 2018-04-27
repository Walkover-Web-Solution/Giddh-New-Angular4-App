import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsIntegrationActions } from '../../actions/settings/settings.integration.action';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import { EmailKeyClass, RazorPayClass, SmsKeyClass, CashfreeClass } from '../../models/api-models/SettingsIntegraion';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';

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
export class SettingIntegrationComponent implements OnInit {

  public smsFormObj: SmsKeyClass = new SmsKeyClass();
  public emailFormObj: EmailKeyClass = new EmailKeyClass();
  public razorPayObj: RazorPayClass = new RazorPayClass();
  public cashfreeObj: CashfreeClass = new CashfreeClass();
  public accounts$: Observable<IOption[]>;
  public updateRazor: boolean = false;
  public cashfreeAdded: boolean = false;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
      if (o.cashfreeForm) {
        this.cashfreeObj = _.cloneDeep(o.cashfreeForm);
        // this.razorPayObj.password = 'YOU_ARE_NOT_ALLOWED';
        this.cashfreeAdded = true;
      } else {
        this.cashfreeObj = new CashfreeClass();
        this.cashfreeAdded = false;
      }
    });

    this.flattenAccountsStream$.subscribe(data => {
      if (data) {
        let accounts: IOption[] = [];
        _.forEach(data, (item) => {
          accounts.push({ label: item.name, value: item.uniqueName });
        });
        this.accounts$ = Observable.of(accounts);
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

  public submitCashfreeDetail(f: NgForm) {
    if (f.valid) {
      console.log(f.value);
      // this.store.dispatch(this.settingsIntegrationActions.SaveEmailKey(f.value));
    }
  }
}
