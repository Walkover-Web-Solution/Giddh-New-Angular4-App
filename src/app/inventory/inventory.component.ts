import { take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryAction } from '../actions/inventory/inventory.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { StockGroupResponse, StockDetailResponse } from '../models/api-models/Inventory';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit, OnDestroy {
  public isBranchVisible$: Observable<boolean>;
  public activeStock$: Observable<StockDetailResponse>;
  public activeGroup$: Observable<StockGroupResponse>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _inventoryAction: InventoryAction, private _companyActions: CompanyActions, private invoiceActions: InvoiceActions) {
    this.activeStock$ = this.store.select(p => p.inventory.activeStock).pipe(takeUntil(this.destroyed$));
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.isBranchVisible$ = this.store.select(s => s.inventory.showBranchScreen).pipe(takeUntil(this.destroyed$));
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'inventory';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    this.store.dispatch(this.invoiceActions.getInvoiceSetting());
  }

  public ngOnDestroy() {
    this.store.dispatch(this._inventoryAction.ResetInventoryState());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
