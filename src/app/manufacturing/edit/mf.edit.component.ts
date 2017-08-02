import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {

  public stockListDropDown$: Observable<Select2OptionData[]>;
  public consumptionDetail = [];
  public manufacturingDetails = {};
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select'
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction
  ) {
  }

  public ngOnInit() {
    console.log('hello from MfEditComponent');
    // dispatch stocklist request
    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (!o.stocksList) {
        this.store.dispatch(this.inventoryAction.GetStock());
      }
    });
    // get all stocks
    this.stockListDropDown$ = this.store.select(p => {
      if (p.inventory.stocksList) {
        console.log('The Stock List is available :', p.inventory.stocksList);
        if (p.inventory.stocksList.results) {
          let units = p.inventory.stocksList.results;

          return units.map(unit => {
            return { text: ` ${unit.name} (${unit.uniqueName})`, id: unit.uniqueName };
          });
        }
      }
    }).takeUntil(this.destroyed$);
    // get stock details
    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (!o.stocksList) {
        this.store.dispatch(this.inventoryAction.GetStock());
      }
    });
  }

  public getStocksWithRate(data) {
    if (data.value) {
      this.store.dispatch(this.manufacturingActions.GetStockWithRate(data.value));
    }
  }

  private addConsumption() {
    console.log('the data to push is : AAA');
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
