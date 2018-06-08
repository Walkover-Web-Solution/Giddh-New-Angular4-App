import { IOption } from './../../theme/ng-select/option.interface';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { AccountService } from '../../services/account.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsLinkedAccountsService } from '../../services/settings.linked.accounts.service';
import { SettingsLinkedAccountsActions } from '../../actions/settings/linked-accounts/settings.linked.accounts.action';
import { IEbankAccount } from '../../models/api-models/SettingsLinkedAccounts';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'setting-linked-accounts',
  templateUrl: './setting.linked.accounts.component.html'
})
export class SettingLinkedAccountsComponent implements OnInit, OnDestroy {

  @ViewChild('connectBankModel') public connectBankModel: ModalDirective;
  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;
  @ViewChild('yodleeFormHTML') public yodleeFormHTML: HTMLFormElement;

  public iframeSource: string = 'https://developer.yodlee.com/sites/all/modules/action_yodleeregister/fastlink-util.php?sample_username=sbMemdd7073f144b18baa5c77e405dde56e0dea2';
  public ebankAccounts: BankAccountsResponse[] = [];
  public accounts$: IOption[];
  public confirmationMessage: string;
  public dateToUpdate: string;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public yodleeForm: FormGroup;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private selectedAccount: IEbankAccount;
  private actionToPerform: string;
  private dataToUpdate: object;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
    private settingsLinkedAccountsActions: SettingsLinkedAccountsActions,
    private _accountService: AccountService,
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder
  ) {
    this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    this.yodleeForm = this._fb.group({
      rsession: ['08062013_0:31aa4019f7b470cabe8127690a70a3b92d69b285da63791cbae703666c588a0ed96f0f9b8190599c0c731e4a481c299c235a039f9ebc00280b2a53321059dae2', [Validators.required]],
      app: ['10003600', [Validators.required]],
      redirectReq: [true, [Validators.required]],
      token: ['90ecde3a0d88222ca29b3c86a6df7fbffaad8c62482aada50e8d7a5accd59148', Validators.required],
      extraParams: ['', Validators.required]
    });

    this.store.select(p => p.settings).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.linkedAccounts && o.linkedAccounts.bankAccounts) {
        // console.log('Found');
        this.ebankAccounts = _.cloneDeep(o.linkedAccounts.bankAccounts);
      }
    });

    this.store.select(p => p.settings.linkedAccounts.needReloadingLinkedAccounts).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
      }
    });

    this.store.select(p => p.settings.linkedAccounts.iframeSource).takeUntil(this.destroyed$).subscribe((source) => {
      if (source) {
        this.iframeSource = _.clone(source);
        this.connectBankModel.show();
        this.connectBankModel.config.ignoreBackdropClick = true;
      }
    });

    this.flattenAccountsStream$.subscribe(data => {
      if (data) {
        let accounts: IOption[] = [];
        data.map(d => {
          accounts.push({ label: `${d.name} (${d.uniqueName})`, value : d.uniqueName });
        });
        this.accounts$ = accounts;
    }});

    // get flatternaccounts
    // this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
    //   if (data.status === 'success') {
    //     let accounts: IOption[] = [];
    //     data.body.results.map(d => {
    //       accounts.push({ label: `${d.name} (${d.uniqueName})`, value : d.uniqueName });
    //     });
    //     this.accounts$ = accounts;
    //   }
    // });
  }

  public getInitialEbankInfo() {
    this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
  }

  public connectBank() {
    // get token info
    this._settingsLinkedAccountsService.GetEbankToken().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        if (data.body.connectUrl) {
          this.iframeSource = data.body.connectUrl; // this._sanitizer.bypassSecurityTrustResourceUrl(data.body.connectUrl);
        }
      }
    });
    this.connectBankModel.show();
    this.connectBankModel.config.ignoreBackdropClick = true;
  }

  /**
   * yodleeBank
   */
  public yodleeBank() {
    this._settingsLinkedAccountsService.GetYodleeToken().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        if (data.body.user) {
          let token = _.cloneDeep(data.body.user.accessTokens[0]);
          this.yodleeForm.patchValue({
              rsession: data.body.rsession,
              app: token.appId,
              // redirectReq: token.url,
              token: token.value,
              extraParams: ['', Validators.required]
          });
          this.yodleeFormHTML.nativeElement.submit();
          this.connectBankModel.show();
        }
      }
    });

  }

  public closeModal() {
    this.connectBankModel.hide();
    this.iframeSource = undefined;
    this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
  }

  public closeConfirmationModal(isUserAgree: boolean) {
    if (isUserAgree) {
      let accountId = this.selectedAccount.accountId;
      switch (this.actionToPerform) {
        case 'DeleteAddedBank':
          this.store.dispatch(this.settingsLinkedAccountsActions.DeleteBankAccount(this.selectedAccount.loginId));
          break;
        case 'UpdateDate':
          this.store.dispatch(this.settingsLinkedAccountsActions.UpdateDate(this.dateToUpdate, accountId));
          break;
        case 'LinkAccount':
          this.store.dispatch(this.settingsLinkedAccountsActions.LinkBankAccount(this.dataToUpdate, accountId));
          break;
        case 'UnlinkAccount':
          this.store.dispatch(this.settingsLinkedAccountsActions.UnlinkBankAccount(accountId));
          break;
      }
    }

    this.confirmationModal.hide();
    this.selectedAccount = null;
    this.actionToPerform = null;
  }

  public onRefreshAccounts() {
    this.store.dispatch(this.settingsLinkedAccountsActions.RefreshAllAccounts());
  }

  public onReconnectAccount(account) {
    this.store.dispatch(this.settingsLinkedAccountsActions.ReconnectAccount(account.loginId));
  }

  public onDeleteAddedBank(bankName, account) {
    if (bankName && account && account.loginId) {
      this.selectedAccount = _.cloneDeep(account);
      this.confirmationMessage = `Are you sure you want to delete ${bankName} ? All accounts linked with the same bank will be deleted.`;
      this.actionToPerform = 'DeleteAddedBank';
      this.confirmationModal.show();
    } else {
      console.log('No account found');
    }
  }

  public onRefreshToken(account) {
    // this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(account.loginId));
    this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
  }

  public onAccountSelect(account, data) {
    if (data && data.value) {
      // Link bank account
      this.dataToUpdate = {
        itemAccountId: account.accountId,
        uniqueName: data.value
      };

      this.selectedAccount = _.cloneDeep(account);
      this.confirmationMessage = `Are you sure you want to link ${data.value} ?`;
      this.actionToPerform = 'LinkAccount';
      this.confirmationModal.show();
    }
  }

  public onUnlinkBankAccount(account) {
    this.selectedAccount = _.cloneDeep(account);
    this.confirmationMessage = `Are you sure you want to unlink ${account.linkedAccount.name} ?`;
    this.actionToPerform = 'UnlinkAccount';
    this.confirmationModal.show();
  }

  public onUpdateDate(date, account) {
    this.dateToUpdate = moment(date).format('DD-MM-YYYY');

    this.selectedAccount = _.cloneDeep(account);
    this.confirmationMessage = `Do you want to get ledger entries for this account from ${this.dateToUpdate} ?`;
    this.actionToPerform = 'UpdateDate';
    this.confirmationModal.show();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
