import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions
  ) {
  }

  public ngOnInit() {
    console.log('hello from MfEditComponent');
  }

  private addExpense() {
    // Add new expense
  }

  private addProduct() {
    // Add new product
  }

  private save() {
    // create expense in db
    // this.store.dispatch(this.manufacturingActions.CreateMfItem(data));
  }

  private update() {
    // update expense
    // this.store.dispatch(this.manufacturingActions.Update(data));
  }

  private delete() {
    // delete expense
    // this.store.dispatch(this.manufacturingActions.Delete(data));
  }
}
