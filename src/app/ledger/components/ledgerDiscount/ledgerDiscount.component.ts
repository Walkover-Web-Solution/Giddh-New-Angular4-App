import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html',
  styles: [`
    .discount-dropdown-menu {
      position: absolute;
      /*top: 100%;*/
      left: 0;
      z-index: 1000;
      min-width: 160px;
      padding: 5px 0;
      margin: 2px 0 0;
      font-size: 14px;
      text-align: left;
      list-style: none;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ccc;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 4px;
      -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
      box-shadow: 0 6px 12px rgba(0, 0, 0, .175)
    }`]
})

export class LedgerDiscountComponent implements OnInit, OnDestroy {
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public discountMenu: boolean = false;
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
