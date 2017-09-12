import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryAction } from '../services/actions/inventory/inventory.actions';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../services/actions/company.actions';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private _inventoryAction: InventoryAction, private _companyActions: CompanyActions) {
  }

  public ngOnInit() {
    console.log('hello inventory module');
    // this.exampleData = [
    // ];
  }

  public ngOnDestroy(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'inventory';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    this.store.dispatch(this._inventoryAction.ResetInventoryState());
  }
}
