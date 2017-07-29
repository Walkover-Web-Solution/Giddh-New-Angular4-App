import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html'
})

export class LedgerDiscountComponent implements OnInit, OnDestroy {
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
