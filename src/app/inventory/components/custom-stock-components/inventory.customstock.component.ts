import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { CustomStockUnitAction } from '../../../services/actions/inventory/customStockUnit.actions';
import * as  _ from 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { StockUnits } from './stock-unit';
import { SettingsProfileActions } from '../../../services/actions/settings/profile/settings.profile.action';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'inventory-custom-stock',  // <home></home>
  templateUrl: './inventory.customstock.component.html'
})
export class InventoryCustomStockComponent implements OnInit, OnDestroy {
  public stockUnitsDropDown$: Observable<Select2OptionData[]>;
  public activeGroupUniqueName$: Observable<string>;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Choose a parent unit',
    allowClear: true
  };
  public stockUnit$: Observable<StockUnitRequest[]>;
  public editMode: boolean;
  public editCode: string;
  public customUnitObj: StockUnitRequest;
  public createCustomStockInProcess$: Observable<boolean>;
  public updateCustomStockInProcess$: Observable<boolean>;
  public deleteCustomStockInProcessCode$: Observable<any[]>;
  public stockUnitsList = StockUnits;
  public companyProfile: any;
  public country: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private customStockActions: CustomStockUnitAction, private inventoryAction: InventoryAction,
    private sidebarAction: SidebarAction, private settingsProfileActions: SettingsProfileActions) {
    this.customUnitObj = new StockUnitRequest();
    this.stockUnit$ = this.store.select(p => p.inventory.stockUnits).takeUntil(this.destroyed$);
    this.stockUnitsDropDown$ = this.store.select(p => {
      if (p.inventory.stockUnits.length) {
        let units = p.inventory.stockUnits;

        return units.map(unit => {
          return { text: unit.name, id: unit.code };
        });
      }
    });
    this.store.select(p => p.settings.profile).takeUntil(this.destroyed$).subscribe((o) => {
      if (!_.isEmpty(o)) {
        this.companyProfile = _.cloneDeep(o);
        if (this.companyProfile.country) {
          this.country = this.companyProfile.country.toLocaleLowerCase();
        } else {
          this.country = 'india';
        }
      } else {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
      }
    });
    this.activeGroupUniqueName$ = this.store.select(s => s.inventory.activeGroupUniqueName).takeUntil(this.destroyed$);
    this.createCustomStockInProcess$ = this.store.select(s => s.inventory.createCustomStockInProcess).takeUntil(this.destroyed$);
    this.updateCustomStockInProcess$ = this.store.select(s => s.inventory.updateCustomStockInProcess).takeUntil(this.destroyed$);
    this.deleteCustomStockInProcessCode$ = this.store.select(s => s.inventory.deleteCustomStockInProcessCode).takeUntil(this.destroyed$);

  }

  public ngOnInit() {
    let activeGroup = null;
    this.activeGroupUniqueName$.take(1).subscribe(a => activeGroup = a);
    if (activeGroup) {
      this.store.dispatch(this.sidebarAction.OpenGroup(activeGroup));
    }

    this.store.dispatch(this.inventoryAction.resetActiveGroup());
    this.store.dispatch(this.inventoryAction.resetActiveStock());
    this.store.dispatch(this.customStockActions.GetStockUnit());
    this.stockUnit$.subscribe(p => this.clearFields());
  }

  public saveUnit(): any {
    if (!this.editMode) {
      this.store.dispatch(this.customStockActions.CreateStockUnit(_.cloneDeep(this.customUnitObj)));
    } else {
      this.store.dispatch(this.customStockActions.UpdateStockUnit(_.cloneDeep(this.customUnitObj), this.editCode));
      this.customUnitObj.name = null;
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
    this.customUnitObj.name = null;
    this.editMode = false;
    this.editCode = '';

  }

  public change(v) {
    this.stockUnit$.find(p => {
      let unit = p.find(q => q.code === v.value);
      if (unit !== undefined) {
        this.customUnitObj.parentStockUnit = unit;
        return true;
      }
    }).subscribe();
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public setUnitName(name) {
    let unit = this.stockUnitsList.filter((obj) => obj.id === name.value || obj.text === name.value);
    console.log(unit);
    if (unit !== undefined && unit.length > 0) {
      this.customUnitObj.code = unit[0].id;
    }
  }
}
