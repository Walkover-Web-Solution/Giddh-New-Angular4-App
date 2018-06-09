import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryAction } from '../actions/inventory/inventory.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit, OnDestroy {
  public isWareHouseVisible$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _inventoryAction: InventoryAction, private _companyActions: CompanyActions) {
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.isWareHouseVisible$ = this.store.select(s => s.inventory.showWarehouseScreen).takeUntil(this.destroyed$);
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'inventory';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  }

  public ngOnDestroy() {
    this.store.dispatch(this._inventoryAction.ResetInventoryState());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
