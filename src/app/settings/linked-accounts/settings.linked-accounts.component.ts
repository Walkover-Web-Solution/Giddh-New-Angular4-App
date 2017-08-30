import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs/Observable';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsLinkedAccountsActions } from '../../services/actions/settings/linked-accounts/settings.linked-accounts.action';
import { ModalDirective } from 'ngx-bootstrap';
import { IBankAccount } from '../../models/interfaces/dashboard.interface';

@Component({
  selector: 'setting-linked-accounts',
  templateUrl: './settings.linked-accounts.component.html'
})
export class SettingsLinkedAccountsComponent implements OnInit, OnDestroy {
  public bankAccounts$: Observable<BankAccountsResponse[]>;
  public selected4DelAcc: IBankAccount;
  public deleteAccountModalBody: string = '';
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _settingsLinkedAccountsActions: SettingsLinkedAccountsActions) {
    this.bankAccounts$ = this.store.select(p => p.settings.linkedAccounts.bankAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this._settingsLinkedAccountsActions.GetBankAccounts());
  }

  public showDeleteAccountModal(Acc: IBankAccount) {
    this.selected4DelAcc = Acc;
    this.deleteAccountModalBody = ` Are you sure you want to delete ${Acc.name} ? All accounts linked with the same bank will be deleted`;
    this.deleteAccountModal.show();
  }

  public hideDeleteAccountModal() {
    this.deleteAccountModal.hide();
    this.selected4DelAcc = null;
  }

  public deleteAccount() {
    this.store.dispatch(this._settingsLinkedAccountsActions.DeleteBankAccounts(this.selected4DelAcc.loginId));
    this.deleteAccountModal.hide();
    this.selected4DelAcc = null;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
