import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import {
  IFlattenGroupsAccountsDetail,
  IFlattenGroupsAccountsDetailItem
} from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { ILedgerDiscount } from '../../../models/interfaces/ledger.interface';

@Component({
  selector: 'ledger-discount',
  templateUrl: 'ledgerDiscount.component.html'
})

export class LedgerDiscountComponent implements OnInit, OnDestroy {
  @Output() public discountUpdatedEvent: EventEmitter<ILedgerDiscount[]> = new EventEmitter();
  @Output() public discountTotalUpdatedEvent: EventEmitter<number> = new EventEmitter();
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public discountAccountsDetails: IFlattenGroupsAccountsDetailItem[] = [];
  public discountMenu: boolean = false;
  public discountTotal: number = 0;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.discountAccountsDetails = [];
    this.prepareDiscountList();
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList() {
    let discountAccountsList: IFlattenGroupsAccountsDetail = null;
    this.discountAccountsList$.take(1).subscribe(d => discountAccountsList = d);
    discountAccountsList.accountDetails.map(acc => {
      let disObj: IFlattenGroupsAccountsDetailItem = {
        name: acc.name,
        applicableTaxes: acc.applicableTaxes,
        groupUniqueName: acc.groupUniqueName,
        isOpen: acc.isOpen,
        groupName: acc.groupName,
        groupSynonyms: acc.groupSynonyms,
        amount: acc.amount || 0
      };
      this.discountAccountsDetails.push(disObj);
    });
  }

  /**
   * on change of discount amount
   */
  public change() {
    this.discountTotal = this.generateTotal();
    this.discountTotalUpdatedEvent.emit(this.discountTotal);
    this.discountUpdatedEvent.emit(this.generateDiscountObject());
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

  /**
   * generate discount object as per ledger api require
   * @returns {ILedgerDiscount[]}
   */
  public generateDiscountObject(): ILedgerDiscount[] {
    let discountObj: ILedgerDiscount[] = [];
    this.discountAccountsDetails.map(d => {
      discountObj.push({
        name: d.name,
        uniqueName: d.groupUniqueName,
        amount: d.amount
      });
    });
    return discountObj;
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
    this.discountUpdatedEvent.unsubscribe();
    this.discountTotalUpdatedEvent.unsubscribe();
  }
}
