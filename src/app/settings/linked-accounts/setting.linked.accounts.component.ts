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
import { SettingsLinkedAccountsActions } from '../../services/actions/settings/linked-accounts/settings.linked.accounts.action';
import { IEbankAccount } from '../../models/api-models/SettingsLinkedAccounts';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2OptionData } from '../../theme/select2';

@Component({
  selector: 'setting-linked-accounts',
  templateUrl: './setting.linked.accounts.component.html'
})
export class SettingLinkedAccountsComponent implements OnInit, OnDestroy {

  @ViewChild('connectBankModel') public connectBankModel: ModalDirective;
  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;

  public iframeSource: string;
  public ebankAccounts: BankAccountsResponse[] = [];
  public accounts$: Select2OptionData[];
  public confirmationMessage: string;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true
  };
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
    private _sanitizer: DomSanitizer
  ) {
    this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
  }

  public ngOnInit() {

    this.store.select(p => p.settings).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.linkedAccounts && o.linkedAccounts.bankAccounts) {
        // console.log('Found');
        this.ebankAccounts = _.cloneDeep(o.linkedAccounts.bankAccounts);
      } else {
        // console.log('Not found');
      }
    });

    // get flatternaccounts
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          accounts.push({ text: `${d.name} (${d.uniqueName})`, id: d.uniqueName });
        });
        this.accounts$ = accounts;
      }
    });
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
  }

  public closeModal() {
    this.connectBankModel.hide();
    this.iframeSource = undefined;
  }

  public closeConfirmationModal(isUserAgree: boolean) {
    if (isUserAgree) {
      let accountId = this.selectedAccount.accountId;
      switch (this.actionToPerform) {
        case 'DeleteAddedBank':
          this.store.dispatch(this.settingsLinkedAccountsActions.DeleteBankAccount(this.selectedAccount.loginId));
          break;
        case 'UpdateDate':
          let dateToUpdate = moment(this.selectedAccount.transactionDate).format('DD-MM-YYYY');
          this.store.dispatch(this.settingsLinkedAccountsActions.UpdateDate(dateToUpdate, accountId));
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
    this.selectedAccount = _.cloneDeep(account);
    this.confirmationMessage = `Are you sure you want to delete ${bankName} ? All accounts linked with the same bank will be deleted.`;
    this.actionToPerform = 'DeleteAddedBank';
    this.confirmationModal.show();
  }

  public onRefreshToken(account) {
    this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(account.loginId));
  }

  public onAccountSelect(account, data) {
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

  public onUnlinkBankAccount(account) {
    this.selectedAccount = _.cloneDeep(account);
    this.confirmationMessage = `Are you sure you want to unlink ${account.linkedAccount.name} ?`;
    this.actionToPerform = 'UnlinkAccount';
    this.confirmationModal.show();
  }

  public onUpdateDate(date, account) {
    let dateToUpdate = moment(date).format('DD-MM-YYYY');

    this.selectedAccount = _.cloneDeep(account);
    this.confirmationMessage = `Do you want to get ledger entries for this account from ${dateToUpdate} ?`;
    this.actionToPerform = 'UpdateDate';
    this.confirmationModal.show();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
