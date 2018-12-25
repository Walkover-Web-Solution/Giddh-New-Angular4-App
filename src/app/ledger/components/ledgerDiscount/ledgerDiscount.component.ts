import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { IDiscountList, LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html'
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public discountAccountsDetails: LedgerDiscountClass[];
  @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
  public discountTotal: number;
  public discountAccountsList$: Observable<IDiscountList[]>;

  @Input() public discountMenu: boolean;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
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
    let discountAccountsList: IDiscountList[] = [];
    this.discountAccountsList$.pipe(take(1)).subscribe(d => discountAccountsList = d);
    if (!this.discountAccountsDetails.length && discountAccountsList) {
      discountAccountsList.map(acc => {
        let obj: LedgerDiscountClass = new LedgerDiscountClass();
        obj.amount = acc.discountValue;
        obj.discountValue = acc.discountValue;
        obj.discountType = acc.discountType;
        obj.isActive = true;
        obj.particular = acc.linkAccount.uniqueName;
        obj.discountUniqueName = acc.uniqueName;
        obj.name = acc.name;
        this.discountAccountsDetails.push(obj);
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
      ds.discountValue = Number(ds.discountValue);
      return ds;
    }).filter(o => o.isActive).reduce((pv, cv) => {
      return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
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
