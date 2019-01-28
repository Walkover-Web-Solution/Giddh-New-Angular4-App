import { take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { IDiscountList, LedgerDiscountClass } from '../../../models/api-models/SettingsDiscount';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html',
  styleUrls: [`./ledgerDiscount.component.scss`]
})

export class LedgerDiscountComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public discountAccountsDetails: LedgerDiscountClass[];
  @Input() public ledgerAmount: number = 0;
  @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
  public discountTotal: number;
  public discountAccountsList$: Observable<IDiscountList[]>;
  public discountFromPer: boolean = true;
  public discountFromVal: boolean = true;
  public discountPercentageModal: number = 0;
  public discountFixedValueModal: number = 0;

  @Input() public discountMenu: boolean;

  public get defaultDiscount(): LedgerDiscountClass {
    return this.discountAccountsDetails[0];
  }

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.prepareDiscountList();

    if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
      this.discountFixedValueModal = this.defaultDiscount.amount;
    } else {
      this.discountPercentageModal = this.defaultDiscount.amount;
    }
    this.change();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
      this.prepareDiscountList();

      if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
        this.discountFixedValueModal = this.defaultDiscount.amount;
      } else {
        this.discountPercentageModal = this.defaultDiscount.amount;
      }
      this.change();
    }
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList() {
    let discountAccountsList: IDiscountList[] = [];
    this.discountAccountsList$.pipe(take(1)).subscribe(d => discountAccountsList = d);
    if (discountAccountsList.length) {
      discountAccountsList.forEach(acc => {
        let hasItem = this.discountAccountsDetails.some(s => s.discountUniqueName === acc.uniqueName);

        if (!hasItem) {
          let obj: LedgerDiscountClass = new LedgerDiscountClass();
          obj.amount = acc.discountValue;
          obj.discountValue = acc.discountValue;
          obj.discountType = acc.discountType;
          obj.isActive = false;
          obj.particular = acc.linkAccount.uniqueName;
          obj.discountUniqueName = acc.uniqueName;
          obj.name = acc.name;
          this.discountAccountsDetails.push(obj);
        }
      });
    }
  }

  public discountFromInput(type: 'FIX_AMOUNT' | 'PERCENTAGE', val: string) {
    this.defaultDiscount.amount = parseFloat(val);
    this.defaultDiscount.discountValue = parseFloat(val);
    this.defaultDiscount.discountType = type;

    this.change();

    if (!val) {
      this.discountFromVal = true;
      this.discountFromPer = true;
      return;
    }
    if (type === 'PERCENTAGE') {
      this.discountFromPer = true;
      this.discountFromVal = false;
    } else {
      this.discountFromPer = false;
      this.discountFromVal = true;
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
    let percentageListTotal = this.discountAccountsDetails.filter(f => f.isActive)
      .filter(s => s.discountType === 'PERCENTAGE')
      .reduce((pv, cv) => {
        return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
      }, 0) || 0;

    let fixedListTotal = this.discountAccountsDetails.filter(f => f.isActive)
      .filter(s => s.discountType === 'FIX_AMOUNT')
      .reduce((pv, cv) => {
        return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
      }, 0) || 0;

    let perFromAmount = ((percentageListTotal * this.ledgerAmount) / 100);
    return perFromAmount + fixedListTotal;
    // return this.discountAccountsDetails.map(ds => {
    //   ds.discountValue = Number(ds.discountValue);
    //   return ds;
    // }).filter(o => o.isActive).reduce((pv, cv) => {
    //   return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
    // }, 0) || 0;
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
