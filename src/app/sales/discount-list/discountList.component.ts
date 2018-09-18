import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ILedgerDiscount } from '../../models/interfaces/ledger.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { LedgerActions } from '../../actions/ledger/ledger.actions';
import { ElementViewContainerRef } from 'app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap';
import { QuickAccountComponent } from 'app/theme/quick-account-component/quickAccount.component';

@Component({
  selector: 'discount-list',
  templateUrl: 'discountList.component.html',
  styles: [`
    .dropdown-menu > li > a.btn-link {
      color: #10aae0;
    }

    :host .dropdown-menu {
      overflow: auto;
    }

    .form-control[readonly] {
      background: #fff !important;
    }
  `]
})

export class DiscountListComponent implements OnInit, OnDestroy {

  @Input() public isMenuOpen: boolean = false;
  @Output() public selectedDiscountItems: EventEmitter<any[]> = new EventEmitter();
  @Output() public selectedDiscountItemsTotal: EventEmitter<number> = new EventEmitter();
  @ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
  @ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;
  @ViewChild('disInptEle') public disInptEle: ElementRef;

  public discountTotal: number;
  public discountItem$: Observable<IFlattenGroupsAccountsDetail>;
  public discountAccountsList: ILedgerDiscount[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private ledgerActions: LedgerActions,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  public ngOnInit() {
    this.store.select(p => p.ledger.discountAccountsList).pipe(takeUntil(this.destroyed$)).subscribe((o: IFlattenGroupsAccountsDetail) => {
      if (o) {
        this.prepareDiscountList(o.accountDetails);
        this.discountItem$ = observableOf(o);
      } else {
        this.discountItem$ = observableOf(null);
        this.discountAccountsList = [];
        this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
      }
      this.change();
    });
  }

  public discountInputBlur(event) {
    if (event && event.relatedTarget && !this.disInptEle.nativeElement.contains(event.relatedTarget)) {
      this.hideDiscountMenu();
    }
  }

  /**
   * prepare discount obj
   */
  public prepareDiscountList(items) {
    this.discountAccountsList = [];
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
   * hide menus on outside click of span
   */
  public hideDiscountMenu() {
    this.isMenuOpen = false;
  }

  public toggleDiscountMenu() {
    this.isMenuOpen = (this.isMenuOpen) ? false : true;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public addNewDiscount(e: any) {
    e.preventDefault();
    this.loadQuickAccountComponent();
    this.quickAccountModal.show();
  }

  public loadQuickAccountComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
    let viewContainerRef = this.quickAccountComponent.viewContainerRef;
    viewContainerRef.remove();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    let componentInstance = componentRef.instance as QuickAccountComponent;
    componentInstance.comingFromDiscountList = true;
    componentInstance.closeQuickAccountModal.subscribe((a) => {
      this.quickAccountModal.hide();
      componentInstance.comingFromDiscountList = false;
      componentInstance.newAccountForm.reset();
      this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
      componentInstance.destroyed$.next(true);
      componentInstance.destroyed$.complete();
    });

  }

}
