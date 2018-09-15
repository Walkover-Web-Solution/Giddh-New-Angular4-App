import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ILedgerDiscount } from '../../../models/interfaces/ledger.interface';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html'
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public discountAccountsDetails: ILedgerDiscount[];
  @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
  public discountTotal: number;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;

  @Input() public discountMenu: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.prepareDiscountList();
    this.change();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
      this.prepareDiscountList();
      this.change();
    }
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList() {
    let discountAccountsList: IFlattenGroupsAccountsDetail = null;
    this.discountAccountsList$.pipe(take(1)).subscribe(d => discountAccountsList = d);
    if (!this.discountAccountsDetails.length && discountAccountsList) {
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
    this.discountTotal = Number(this.generateTotal().toFixed(2));
    this.discountTotalUpdated.emit(this.discountTotal);
  }

  /**
   * generate total of discount amount
   * @returns {number}
   */
  public generateTotal(): number {
    return this.discountAccountsDetails.map(ds => {
      ds.amount = Number(ds.amount);
      return ds;
    }).reduce((pv, cv) => {
      return Number(cv.amount) ? Number(pv) + Number(cv.amount) : Number(pv);
    }, 0) || 0;
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
