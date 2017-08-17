import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { IStockItemDetail } from '../../models/interfaces/stocksItem.interface';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GroupService } from '../../services/group.service';
import { ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {

  public stockListDropDown$: Observable<Select2OptionData[]>;
  public consumptionDetail = [];
  public isUpdateCase: boolean = false;
  public manufacturingDetails: ManufacturingItemRequest;
  public otherExpenses: any = {};
  public toggleAddExpenses: boolean = false;
  public toggleAddLinkedStocks: boolean = false;
  public linkedStocks: IStockItemDetail = new IStockItemDetail();
  public expenseGroupAccounts: any = [];
  public liabilityGroupAccounts: any = [];
  public selectedProduct: string;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select'
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private manufacturingActions: ManufacturingActions,
              private inventoryAction: InventoryAction,
              private _groupService: GroupService,
              private _location: Location) {
    this.manufacturingDetails = new ManufacturingItemRequest();

    // Update/Delete condition
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stockToUpdate) {
        this.isUpdateCase = true;
        let manufacturingObj = _.cloneDeep(o.reportData.results.find((stock) => stock.uniqueName === o.stockToUpdate));
        manufacturingObj.quantity = manufacturingObj.manufacturingQuantity;
        manufacturingObj.date = new Date(manufacturingObj.date);
        delete manufacturingObj.manufacturingQuantity;
        manufacturingObj.linkedStocks.forEach((item) => {
          item.quantity = item.manufacturingQuantity;
          delete item.manufacturingQuantity;
        });
        this.manufacturingDetails = manufacturingObj;
        console.log('In edit this.manufacturingDetails is :', this.manufacturingDetails);
      }
    });

    console.log('first of all the manufacturingDetailis :', this.manufacturingDetails);
    // Get group with accounts
    this._groupService.GetGroupsWithAccounts('').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        console.log('Groups loaded success 1:', data.body);
        let groups: Select2OptionData[] = [];
        data.body.map((d: any) => {
          if (d.category === 'expenses') {
            this.expenseGroupAccounts.push({text: d.name, id: d.uniqueName});
          }
          if (d.category === 'liabilities') {
            this.liabilityGroupAccounts.push({text: d.name, id: d.uniqueName});
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
            return {text: ` ${unit.name} (${unit.uniqueName})`, id: unit.uniqueName};
          });
        }
      }
    }).takeUntil(this.destroyed$);
    // get stock with rate details
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stockWithRate && o.stockWithRate.manufacturingDetails) {
        // In create only
        this.manufacturingDetails.linkedStocks = _.cloneDeep(o.stockWithRate.manufacturingDetails.linkedStocks);
        // this.manufacturingDetails.stockUniqueName = '';
        console.log('the stockWithRate is :', this.manufacturingDetails);
      }
    });
  }

  public getStocksWithRate(data) {
    if (data.value) {
      let selectedValue = _.cloneDeep(data.value);
      this.selectedProduct = selectedValue;
      let manufacturingObj = _.cloneDeep(this.manufacturingDetails);
      manufacturingObj.stockUniqueName = selectedValue;
      this.manufacturingDetails = manufacturingObj;
      this.store.dispatch(this.manufacturingActions.GetStockWithRate(selectedValue));
    }
  }

  public goBackToListPage() {
    this._location.back();
  }

  private addConsumption(data) {
    console.log('The data to push is :', data);
    let val = {
      amount: data.amount,
      rate: data.rate,
      stockName: data.stockUniqueName,
      stockUniqueName: data.stockUniqueName,
      quantity: data.quantity
      // stockUnitCode: 'm' // TODO: Remove hardcoded value
    };

    let manufacturingObj = _.cloneDeep(this.manufacturingDetails);

    if (manufacturingObj.linkedStocks) {
      manufacturingObj.linkedStocks.push(val);
    } else {
      manufacturingObj.linkedStocks = [val];
    }

    // manufacturingObj.stockUniqueName = this.selectedProduct;
    this.manufacturingDetails = manufacturingObj;
    this.linkedStocks = new IStockItemDetail();
  }

  private removeConsumptionItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.linkedStocks.splice(indx, 1);
    }
  }

  private addExpense(data) {
    let objToPush = {
      baseAccount: {
        uniqueName: data.baseAccountUniqueName
      },
      transactions: [
        {
          account: {
            uniqueName: data.transactionAccountUniqueName
          },
          amount: data.transactionAmount
        }
      ]
    };
    let manufacturingObj = _.cloneDeep(this.manufacturingDetails);

    if (manufacturingObj.otherExpenses) {
      manufacturingObj.otherExpenses.push(objToPush);
    } else {
      manufacturingObj.otherExpenses = [objToPush];
    }

    this.manufacturingDetails = manufacturingObj;

    console.log('After push the otherExpanse is :', this.manufacturingDetails);

    this.otherExpenses = {};
  }

  private removeExpenseItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.otherExpenses.splice(indx, 1);
    }
  }

  private createEntry() {
    let dataToSave = _.cloneDeep(this.manufacturingDetails);
    dataToSave.stockUniqueName = this.selectedProduct;
    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
    // dataToSave.multipleOf = dataToSave.quantity;
    console.log('THe data is :', dataToSave);
    this.store.dispatch(this.manufacturingActions.CreateMfItem(dataToSave));
  }

  private updateEntry() {
    let dataToSave = _.cloneDeep(this.manufacturingDetails);
    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
    // dataToSave.multipleOf = dataToSave.quantity;
    // dataToSave.manufacturingUniqueName =
    console.log('THe data is ---:', dataToSave);
    this.store.dispatch(this.manufacturingActions.UpdateMfItem(dataToSave));
  }

  private deleteEntry() {
    let manufacturingObj = _.cloneDeep(this.manufacturingDetails);
    console.log('THe data is ---:', manufacturingObj);
    this.store.dispatch(this.manufacturingActions.DeleteMfItem({
      stockUniqueName: manufacturingObj.stockUniqueName,
      manufacturingUniqueName: manufacturingObj.uniqueName
    }));
  }

  private getTotal(from, field) {
    let total: number = 0;
    if (from === 'linkedStocks' && this.manufacturingDetails.linkedStocks) {
      _.forEach(this.manufacturingDetails.linkedStocks, (item) => total = total + Number(item[field]));
    }
    if (from === 'otherExpenses' && this.manufacturingDetails.otherExpenses) {
      _.forEach(this.manufacturingDetails.otherExpenses, (item) => total = total + Number(item.transactions[0][field]));
    }

    return total;
  }

  private getCosePerProduct() {
    let quantity = _.cloneDeep(this.manufacturingDetails).quantity;
    quantity = (quantity && quantity > 0) ? quantity : 1;
    let cost = ((this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount')) / quantity);
    if (!isNaN(cost)) {
      return cost;
    }
    return 0;
  }
}
