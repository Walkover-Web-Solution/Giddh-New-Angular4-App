import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ILedgerDiscount } from '../../../models/interfaces/ledger.interface';
import { INameUniqueName } from '../../../models/api-models/Inventory';

export class UpdateLedgerDiscountData {
  public particular: INameUniqueName = {name: '', uniqueName: ''};
  public amount: number = 0;
}

@Component({
  selector: 'update-ledger-discount',
  templateUrl: 'updateLedgerDiscount.component.html'
})

export class UpdateLedgerDiscountComponent implements OnInit, OnDestroy {
  @Input() public discountAccountsDetails: ILedgerDiscount[];
  @Output() public discountTotalUpdated: EventEmitter<number> = new EventEmitter();
  public discountTotal: number;
  @Input() public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;

  @Input() public discountMenu: boolean;
  @Output() public appliedDiscountEvent: EventEmitter<UpdateLedgerDiscountData[]> = new EventEmitter();

  public appliedDiscount: UpdateLedgerDiscountData[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    // this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
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
    this.appliedDiscount = this.generateAppliedDiscounts();
    this.discountTotalUpdated.emit(this.discountTotal);
    this.appliedDiscountEvent.emit(this.appliedDiscount);
  }

  public genTotal() {
    this.discountTotal = Number(this.generateTotal().toFixed(2));
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

  public generateAppliedDiscounts(): UpdateLedgerDiscountData[] {
    return this.discountAccountsDetails.map(p => {
      let discountObj = new UpdateLedgerDiscountData();
      discountObj.particular.name = p.name;
      discountObj.particular.uniqueName = p.particular;
      discountObj.amount = p.amount;
      return discountObj;
    });
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
