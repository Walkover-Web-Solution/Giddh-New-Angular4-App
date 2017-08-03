import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { StockDetailResponse } from '../../models/api-models/Inventory';
import { IManufacturingDetails, IStockItemDetail } from '../../models/interfaces/stocksItem.interface';
import * as _ from 'lodash';
import { LinkedStocks } from '../manufacturing.utility';
import { GroupService } from '../../services/group.service';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {

  public stockListDropDown$: Observable<Select2OptionData[]>;
  public consumptionDetail = [];
  public manufacturingDetails: any = {};
  public otherExpenses: any = {};
  public linkedStocks: IStockItemDetail = new IStockItemDetail();
  public expenseGroupAccounts: any = [];
  public liabilityGroupAccounts: any = [];
  public selectedProduct: string = null;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select'
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction,
    private _groupService: GroupService
  ) {
    // Get group with accounts
    this._groupService.GetGroupsWithAccounts('').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        console.log('Groups loaded success 1:', data.body);
        let groups: Select2OptionData[] = [];
        data.body.map((d: any) => {
          if (d.category === 'expenses') {
            this.expenseGroupAccounts.push({ text: d.name, id: d.uniqueName });
          }
          if (d.category === 'liabilities') {
            this.liabilityGroupAccounts.push({ text: d.name, id: d.uniqueName });
          }
        });
      }
    });
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
    // get stock with rate details
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stockWithRate) {
        this.manufacturingDetails = _.cloneDeep(o.stockWithRate.manufacturingDetails);
        console.log('the stockWithRate is :', this.manufacturingDetails);
      }
    });
  }

  public getStocksWithRate(data) {
    if (data.value) {
      this.store.dispatch(this.manufacturingActions.GetStockWithRate(data.value));
    }
  }

  private addConsumption(data) {
    let val = new LinkedStocks();
    val.amount = data.amount;
    val.rate = data.rate;
    val.stockUniqueName = data.stockUniqueName;
    val.quantity = data.quantity;

    if (this.manufacturingDetails.linkedStocks) {
      this.manufacturingDetails.linkedStocks.push(val);
      console.log('the data to push is : ', val);
    } else {
      this.manufacturingDetails.linkedStocks = [val];
    }
  }

  private removeConsumptionItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.linkedStocks.splice(indx, 1);
    }
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
