import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { CustomStockUnitAction } from '../../../services/actions/inventory/customStockUnit.actions';
import * as  _ from 'lodash';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'inventory-custom-stock',  // <home></home>
  templateUrl: './inventory.customstock.component.html'
})
export class InventoryCustomStockComponent implements OnInit {
  public stockUnitsDropDown$: Observable<Select2OptionData[]>;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Choose a parent unit'
  };
  public stockUnit$: Observable<StockUnitRequest[]>;
  public editMode: boolean;
  public editCode: string;
  public customUnitObj: StockUnitRequest;

  constructor(private store: Store<AppState>, private customStockActions: CustomStockUnitAction) {
    this.customUnitObj = new StockUnitRequest();
    this.stockUnit$ = this.store.select(p => p.inventory.stockUnits);
    this.stockUnitsDropDown$ = this.store.select(p => {
      let units = p.inventory.stockUnits;
      return units.map(unit => {
        return { text: unit.name, id: unit.code };
      });
    });

  }

  public ngOnInit() {
    console.log('hello `inventory-custom-stock` component');
    this.store.dispatch(this.customStockActions.GetStockUnit());
    this.stockUnit$.subscribe(p => this.clearFields());
  }

  public saveUnit(): any {
    if (!this.editMode) {
      this.store.dispatch(this.customStockActions.CreateStockUnit(_.cloneDeep(this.customUnitObj)));
    } else {
      this.store.dispatch(this.customStockActions.UpdateStockUnit(_.cloneDeep(this.customUnitObj), this.editCode));
    }
  }

  public deleteUnit(code): any {
    this.store.dispatch(this.customStockActions.DeleteStockUnit(code));
  }

  public editUnit(item: StockUnitRequest) {
    this.customUnitObj = Object.assign({}, item);
    this.editCode = item.code;
    this.editMode = true;
  }

  public clearFields() {
    this.customUnitObj = new StockUnitRequest();
    this.editMode = false;
    this.editCode = '';

  }

  public  change(v) {
    this.stockUnit$.find(p => {
      let unit = p.find(q => q.code === v.value);
      if (unit !== undefined) {
        this.customUnitObj.parentStockUnit = unit;
        return true;
      }
    }).subscribe();
  }
}
