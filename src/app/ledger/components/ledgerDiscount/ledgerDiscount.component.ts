import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ILedgerDiscount } from '../../../models/interfaces/ledger.interface';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html'
})

export class LedgerDiscountComponent implements OnInit, OnDestroy {
  @Input() public discountAccountsDetails: ILedgerDiscount[];
  @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
  public discountTotal: number;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;

  @Input() public discountMenu: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.prepareDiscountList();
    this.change();
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList() {
    let discountAccountsList: IFlattenGroupsAccountsDetail = null;
    this.discountAccountsList$.take(1).subscribe(d => discountAccountsList = d);
    if (!this.discountAccountsDetails.length) {
      discountAccountsList.accountDetails.map(acc => {
        let disObj: ILedgerDiscount = {
          name: acc.name,
          particular: acc.uniqueName,
          amount: acc.amount || 0
        };
        this.discountAccountsDetails.push(disObj);
      });
    }
  }

  /**
   * on change of discount amount
   */
  public change() {
    this.discountTotal = this.generateTotal();
    this.discountTotalUpdated.emit(this.discountTotal);
  }

  /**
   * generate total of discount amount
   * @returns {number}
   */
  public generateTotal() {
    return this.discountAccountsDetails.reduce((pv, cv) => {
      return cv.amount ? pv + cv.amount : pv;
    }, 0);
  }

  public trackByFn(index) {
    return index; // or item.id
  }

  public hideDiscountMenu() {
    this.discountMenu = false;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
