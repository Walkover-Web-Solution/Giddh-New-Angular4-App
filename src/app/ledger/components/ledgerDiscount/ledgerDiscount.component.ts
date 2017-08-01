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
   * prepare discountobj
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
        amount: acc.amount
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
    // this.discountUpdatedEvent.emit(this.discountAccountsDetails as ILedgerDiscount[]);
  }

  /**
   * generate total of discount amount
   * @returns {number}
   */
  public generateTotal() {
    return this.discountAccountsDetails.reduce((pv, cv) => {
      return cv.amount ?  pv + cv.amount : pv;
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.discountUpdatedEvent.unsubscribe();
    this.discountTotalUpdatedEvent.unsubscribe();
  }
}
