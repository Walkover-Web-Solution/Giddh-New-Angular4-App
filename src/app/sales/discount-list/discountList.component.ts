import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ILedgerDiscount } from '../../models/interfaces/ledger.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { LedgerActions } from '../../services/actions/ledger/ledger.actions';

@Component({
  selector: 'discount-list',
  templateUrl: 'discountList.component.html'
})

export class DiscountListComponent implements OnInit, OnDestroy {

  @Input() public isMenuOpen: boolean = false;
  @Input() public isHeadingVisible: boolean = false;
  @Output() public selectedDiscountItems: EventEmitter<any[]> = new EventEmitter();
  @Output() public selectedDiscountItemsTotal: EventEmitter<number> = new EventEmitter();

  public discountTotal: number;
  public discountItem$: Observable<IFlattenGroupsAccountsDetail>;
  public discountAccountsList: ILedgerDiscount[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private ledgerActions: LedgerActions
  ) {}

  public ngOnInit() {
    this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$).subscribe((o: IFlattenGroupsAccountsDetail) => {
      if (o) {
        this.prepareDiscountList(o.accountDetails);
        this.discountItem$ = Observable.of(o);
        this.change();
      }else {
        this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
      }
    });
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList(items) {
    if (items.length > 0) {
      items.forEach((acc) => {
        let disObj: ILedgerDiscount = {
          name: acc.name,
          particular: acc.uniqueName,
          amount: acc.amount || 0
        };
        this.discountAccountsList.push(disObj);
      });
    }
  }

  /**
   * on change of discount amount
   */
  public change() {
    this.discountTotal = this.generateTotal();
    this.selectedDiscountItemsTotal.emit(this.discountTotal);
    this.selectedDiscountItems.emit(this.discountAccountsList);
  }

  /**
   * generate total of discount amount
   * @returns {number}
   */
  public generateTotal() {
    return this.discountAccountsList.reduce((pv, cv) => {
      return cv.amount ? pv + cv.amount : pv;
    }, 0);
  }

  /**
   * hide menus on blur of span
   */
  public hideDiscountMenu() {
    console.log ('in hideDiscountMenu', this.isMenuOpen);
    this.isMenuOpen = false;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
