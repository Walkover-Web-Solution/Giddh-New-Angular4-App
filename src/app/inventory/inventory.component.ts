import { CompanyRequest } from './../models/api-models/Company';
import { CompanyActions } from './../services/actions/company.actions';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {
  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    console.log('hello inventory module');
    // this.exampleData = [
    // ];
  }
}
