import { BankAccountsResponse } from '../../../models/api-models/Dashboard';
import { HomeActions } from '../../../services/actions/home/home.actions';
import { AppState } from '../../../store/roots';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'live-accounts',
  templateUrl: 'live-accounts.component.html'
})

export class LiveAccountsComponent implements OnInit, OnDestroy {
  public bankAccounts$: Observable<BankAccountsResponse[]>;
  public isGetBankAccountsInProcess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _homeActions: HomeActions) {
    this.isGetBankAccountsInProcess$ = this.store.select(p => p.home.isGetBankAccountsInProcess).takeUntil(this.destroyed$);
    this.bankAccounts$ = this.store.select(p => p.home.BankAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
    this.reload();
  }
  public reload() {
    this.store.dispatch(this._homeActions.GetBankAccount());
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
