import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ModalDirective } from 'ngx-bootstrap';
import { CustomStockUnitAction } from '../../services/actions/inventory/customStockUnit.actions';
import { InventoryService } from '../../services/inventory.service';
import { AccountService } from '../../services/account.service';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {
  @ViewChild('manufacturingConfirmationModal') public manufacturingConfirmationModal: ModalDirective;

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
  public showFromDatePicker: boolean = false;
  public moment = moment;
  public initialQuantityObj: any = [];
  public options: Select2Options = {
    multiple: false,
    placeholder: 'Select'
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction,
    private _groupService: GroupService,
    private _location: Location,
    private _inventoryService: InventoryService,
    private _accountService: AccountService) {
    this.manufacturingDetails = new ManufacturingItemRequest();
    this.initializeOtherExpenseObj();
    // Update/Delete condition
    this.store.select(p => p.manufacturing).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (o.stockToUpdate) {
        this.isUpdateCase = true;
        let manufacturingObj = _.cloneDeep(o.reportData.results.find((stock) => stock.uniqueName === o.stockToUpdate));
        if (manufacturingObj) {
          manufacturingObj.quantity = manufacturingObj.manufacturingQuantity;
          manufacturingObj.date = moment(manufacturingObj.date, 'DD-MM-YYYY').toDate();
          delete manufacturingObj.manufacturingQuantity;
          manufacturingObj.linkedStocks.forEach((item) => {
            item.quantity = item.manufacturingQuantity;
            delete item.manufacturingQuantity;
          });
          this.manufacturingDetails = manufacturingObj;
        }
      }
    });

    // Get group with accounts
    // this._groupService.GetGroupsWithAccounts('').takeUntil(this.destroyed$).subscribe(data => {
    //   if (data.status === 'success') {
    //     let groups: Select2OptionData[] = [];
    //     data.body.map((d: any) => {
    //       if (d.category === 'expenses') {
    //         this.expenseGroupAccounts.push({ text: d.name, id: d.uniqueName });
    //       }
    //       if (d.category === 'liabilities') {
    //         this.liabilityGroupAccounts.push({ text: d.name, id: d.uniqueName });
    //       }
    //     });
    //   }
    // });

    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        data.body.results.map(d => {
          this.liabilityGroupAccounts.push({ text: d.name, id: d.uniqueName });
          this.expenseGroupAccounts.push({ text: d.name, id: d.uniqueName });
        });
      }
    });

  }
  public ngOnInit() {
    console.log('hello from MfEditComponent');
    if (this.isUpdateCase) {
      let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
      this.store.dispatch(this.inventoryAction.GetStockUniqueName(manufacturingDetailsObj.uniqueName, manufacturingDetailsObj.stockUniqueName));
    }
    // dispatch stocklist request
    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (!o.stocksList) {
        this.store.dispatch(this.inventoryAction.GetStock());
      }
      if (this.isUpdateCase && o.activeStock && o.activeStock.manufacturingDetails) {
        let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
        manufacturingDetailsObj.multipleOf = o.activeStock.manufacturingDetails.manufacturingMultipleOf;
        this.manufacturingDetails = manufacturingDetailsObj;
      }
    });
    // get all stocks
    this.stockListDropDown$ = this.store.select(p => {
      if (p.inventory.stocksList) {
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
      if (!this.isUpdateCase) {
        let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
        if (o.stockWithRate && o.stockWithRate.manufacturingDetails) {
          // In create only
          manufacturingDetailsObj.linkedStocks = _.cloneDeep(o.stockWithRate.manufacturingDetails.linkedStocks);
          manufacturingDetailsObj.multipleOf = _.cloneDeep(o.stockWithRate.manufacturingDetails.manufacturingMultipleOf);
        } else {
          manufacturingDetailsObj.linkedStocks = [];
          manufacturingDetailsObj.multipleOf = null;
        }
        this.manufacturingDetails = manufacturingDetailsObj;
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

  public initializeOtherExpenseObj() {
    this.otherExpenses.baseAccountUniqueName = '';
    this.otherExpenses.transactionAccountUniqueName = '';
  }

  public goBackToListPage() {
    this._location.back();
  }

  public addConsumption(data) {
    let val: any = {
      amount: data.amount,
      rate: data.rate,
      stockName: data.stockUniqueName,
      stockUniqueName: data.stockUniqueName,
      quantity: data.quantity
      // stockUnitCode: 'm' // TODO: Remove hardcoded value
    };

    if (this.isUpdateCase) {
      val.stockUnitCode = data.manufacturingUnit;
    } else {
      val.stockUnitCode = data.stockUnitCode;
    }

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

  public removeConsumptionItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.linkedStocks.splice(indx, 1);
    }
  }

  public addExpense(data) {
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

    this.otherExpenses = {};
    this.initializeOtherExpenseObj();
  }

  public removeExpenseItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.otherExpenses.splice(indx, 1);
    }
  }

  public createEntry() {
    let dataToSave = _.cloneDeep(this.manufacturingDetails);
    dataToSave.stockUniqueName = this.selectedProduct;
    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    dataToSave.linkedStocks.forEach((obj) => {
      obj.manufacturingUnit = obj.stockUnitCode;
      obj.manufacturingQuantity = obj.quantity;
      // delete obj.stockUnitCode;
      // delete obj.quantity;
    });
    // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
    // dataToSave.multipleOf = dataToSave.quantity;
    this.store.dispatch(this.manufacturingActions.CreateMfItem(dataToSave));
  }

  public updateEntry() {
    let dataToSave = _.cloneDeep(this.manufacturingDetails);
    dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
    // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
    // dataToSave.multipleOf = dataToSave.quantity;
    // dataToSave.manufacturingUniqueName =
    this.store.dispatch(this.manufacturingActions.UpdateMfItem(dataToSave));
  }

  public deleteEntry() {
    this.manufacturingConfirmationModal.show();
  }

  public getTotal(from, field) {
    let total: number = 0;
    if (from === 'linkedStocks' && this.manufacturingDetails.linkedStocks) {
      _.forEach(this.manufacturingDetails.linkedStocks, (item) => total = total + Number(item[field]));
    }
    if (from === 'otherExpenses' && this.manufacturingDetails.otherExpenses) {
      _.forEach(this.manufacturingDetails.otherExpenses, (item) => total = total + Number(item.transactions[0][field]));
    }

    return total;
  }

  public getCosePerProduct() {
    let quantity = _.cloneDeep(this.manufacturingDetails).quantity;
    quantity = (quantity && quantity > 0) ? quantity : 1;
    let cost = ((this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount')) / quantity);
    if (!isNaN(cost)) {
      return cost;
    }
    return 0;
  }

  public closeConfirmationPopup(userResponse: boolean) {
    if (userResponse) {
      let manufacturingObj = _.cloneDeep(this.manufacturingDetails);
      this.store.dispatch(this.manufacturingActions.DeleteMfItem({
        stockUniqueName: manufacturingObj.stockUniqueName,
        manufacturingUniqueName: manufacturingObj.uniqueName
      }));
    }
    this.manufacturingConfirmationModal.hide();
  }

  public getCalculatedAmount(quantity, rate) {
    if (quantity.model && rate.model) {
      let amount = quantity.model * rate.model;
      this.linkedStocks.amount = amount;
      return amount;
    }
    return 0;
  }

  public onQuantityChange(event) {
    let manufacturingObj = _.cloneDeep(this.manufacturingDetails);
    // || this.initialQuantityObj.length !== manufacturingObj.linkedStocks.length
    if (!this.initialQuantityObj.length) {
      this.initialQuantityObj.length = [];
      manufacturingObj.linkedStocks.forEach((o) => {
        this.initialQuantityObj.push(o);
      });
    }

    if (event && !isNaN(event) && event > 0) {
      event = event;
    } else {
      event = 1;
    }

    if (manufacturingObj && manufacturingObj.linkedStocks) {
      manufacturingObj.linkedStocks.forEach((stock) => {

        let selectedStock = this.initialQuantityObj.find((obj) => obj.stockUniqueName === stock.stockUniqueName);
        if (selectedStock) {
          stock.quantity = selectedStock.quantity * event;
          stock.amount = stock.quantity * stock.rate;
        }
      });
      this.manufacturingDetails = manufacturingObj;
    }
  }

  public getStockUnit(selectedItem) {
    // console.log(selectedItem);
    let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
    this._inventoryService.GetStockDetails(manufacturingDetailsObj.uniqueName, selectedItem).subscribe((res) => {
      console.log('The response from the API is :', res);
      if (res.status === 'success') {
        let unitCode = res.body.stockUnit.code;
        if (this.isUpdateCase) {
          this.linkedStocks.manufacturingUnit = unitCode;
        } else {
          this.linkedStocks.stockUnitCode = unitCode;
        }
        console.log('unitCode is :', unitCode);
      }
    });
  }

  public setToday() {
    this.manufacturingDetails.date = String(moment());
  }

  public clearDate() {
    this.manufacturingDetails.date = '';
  }
}
