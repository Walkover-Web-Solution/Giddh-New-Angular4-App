import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { ITransactionItem } from '../../../models/interfaces/ledger.interface';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'new-ledger-entry-panel',
  templateUrl: 'newLedgerEntryPanel.component.html'
})

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy {
  @Input() public selectedAccount: IFlattenAccountsResultItem | any = null;
  @Input() public currentTxn: ITransactionItem = null;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public showAdvanced: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _ledgerActions: LedgerActions) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);

    this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
  }

  public ngOnInit() {
    this.showAdvanced = false;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
