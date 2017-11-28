import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryAction } from '../actions/inventory/inventory.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private _inventoryAction: InventoryAction, private _companyActions: CompanyActions) {
  }

  public ngOnInit() {
    // console.log('hello inventory module');
    // this.exampleData = [
    // ];
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'inventory';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  }

  public ngOnDestroy(): void {
    this.store.dispatch(this._inventoryAction.ResetInventoryState());
  }
}
