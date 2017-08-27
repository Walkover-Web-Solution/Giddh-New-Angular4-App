import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs/Observable';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsLinkedAccountsActions } from '../../services/actions/settings/linked-accounts/settings.linked-accounts.action';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'setting-linked-accounts',
  templateUrl: './settings.linked-accounts.component.html'
})
export class SettingsLinkedAccountsComponent implements OnInit, OnDestroy {
  public bankAccounts$: Observable<BankAccountsResponse[]>;
  public deleteAccountModalBody: string = '';
  @ViewChild('deleteAccountModal') public deleteAccountModal: ModalDirective;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _settingsLinkedAccountsActions: SettingsLinkedAccountsActions) {
    this.bankAccounts$ = this.store.select(p => p.settings.linkedAccounts.bankAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this._settingsLinkedAccountsActions.GetBankAccounts());
  }

  public showDeleteAccountModal(name: string) {
    this.deleteAccountModalBody = ` Are you sure you want to delete ${name} ? All accounts linked with the same bank will be deleted`;
    this.deleteAccountModal.show();
  }

  public hideDeleteAccountModal() {
    this.deleteAccountModal.hide();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
