import { CompanyRequest } from './../models/api-models/Company';
import { CompanyActions } from './../services/actions/company.actions';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { InventoryAction } from '../services/actions/inventory/inventory.actions';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private _inventoryAction: InventoryAction) {
  }

  public ngOnInit() {
    console.log('hello inventory module');
    // this.exampleData = [
    // ];
  }

  public ngOnDestroy(): void {
    this.store.dispatch(this._inventoryAction.ResetInventoryState());
  }
}
