import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { StockUnitResponse } from '../../../models/api-models/Inventory';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'invetory-custom-stock',  // <home></home>
  templateUrl: './inventory.customstock.component.html'
})
export class InventoryCustomStockComponent implements OnInit {
  public stockUnitsDropDown$: Observable<Select2OptionData[]>;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Choose a parent unit'
  };
  public stockUnit$: Observable<StockUnitResponse[]>;
  public editMode: boolean;
  public customUnitObj: StockUnitResponse = new StockUnitResponse();

  constructor(private store: Store<AppState>) {
    this.stockUnit$ = this.store.select(p => p.inventory.stockUnits);
    this.stockUnitsDropDown$ = this.store.select(p => {
      let units = p.inventory.stockUnits;
      return units.map(unit => {
        return { text: unit.name, id: unit.code };
      });
    });

  }

  public ngOnInit() {
    console.log('hello `invetory-custom-stock` component');
    // this.exampleData = [
    // ];
  }

  public saveUnit(): any {

  }

  public deleteUnit(): any {

  }

  public editUnit(item: StockUnitResponse, index: number) {
    this.customUnitObj = item;
    this.editMode = true;
  }

  public clearFields() {
    this.customUnitObj = new StockUnitResponse();
    this.editMode = false;
  }
}
