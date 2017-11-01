import { ToasterService } from './../../services/toaster.service';
import { validateEmail } from './../../shared/helpers/helperFunctions';
import { IOption } from './../../theme/ng-select/option.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ManufacturingActions } from '../../services/actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { IStockItemDetail } from '../../models/interfaces/stocksItem.interface';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { GroupService } from '../../services/group.service';
import { ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomStockUnitAction } from '../../services/actions/inventory/customStockUnit.actions';
import { InventoryService } from '../../services/inventory.service';
import { AccountService } from '../../services/account.service';
import { Select2OptionData } from '../../theme/select2';

@Component({
  templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {
  @ViewChild('manufacturingConfirmationModal') public manufacturingConfirmationModal: ModalDirective;

  public stockListDropDown$: Observable<IOption[]>;
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
  public expenseGroupAccounts$: Observable<IOption[]>;
  public liabilityGroupAccounts$: Observable<IOption[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    private manufacturingActions: ManufacturingActions,
    private inventoryAction: InventoryAction,
    private _groupService: GroupService,
    private _location: Location,
    private _inventoryService: InventoryService,
    private _accountService: AccountService,
    private _toasty: ToasterService) {
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
          manufacturingObj.multipleOf = (manufacturingObj.manufacturingQuantity / manufacturingObj.manufacturingMultipleOf);
          // delete manufacturingObj.manufacturingQuantity;
          manufacturingObj.linkedStocks.forEach((item) => {
            item.quantity = item.manufacturingQuantity;
            // delete item.manufacturingQuantity;
          });
          this.manufacturingDetails = manufacturingObj;
        }
      }
    });

    // Get group with accounts
    this._groupService.GetGroupsWithAccounts('').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let GroupWithAccResponse = _.cloneDeep(data.body);
        this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(response => {
          if (response.status === 'success') {
            let flattenGroupResponse = _.cloneDeep(response.body.results);

            _.forEach(GroupWithAccResponse, (d: any) => {
              _.forEach(flattenGroupResponse, acc => {
                if (d.category === 'expenses' || d.category === 'liabilities' || d.category === 'assets') {
                  let matchedAccIndex = acc.parentGroups.findIndex((account) => account.uniqueName === d.uniqueName);
                  if (matchedAccIndex > -1) {
                    if (d.category === 'expenses') {
                      this.expenseGroupAccounts.push({ label: acc.name, value: acc.uniqueName });
                    }
                    if (d.category === 'liabilities' || d.category === 'assets') {
                      this.liabilityGroupAccounts.push({ label: acc.name, value: acc.uniqueName });
                    }
                  }
                }
              });
            });
            this.expenseGroupAccounts$ = Observable.of(this.expenseGroupAccounts);
            this.liabilityGroupAccounts$ = Observable.of(this.liabilityGroupAccounts);
          }
        });
      }
    });

    this.manufacturingDetails.quantity = 1;
  }
  public ngOnInit() {
    if (this.isUpdateCase) {
      let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
      this.store.dispatch(this.inventoryAction.GetStockUniqueName(manufacturingDetailsObj.uniqueName, manufacturingDetailsObj.stockUniqueName));
    }
    // dispatch stockList request
    this.store.select(p => p.inventory).takeUntil(this.destroyed$).subscribe((o: any) => {
      if (!o.stocksList) {
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());
      }
      if (this.isUpdateCase && o.activeStock && o.activeStock.manufacturingDetails) {
        let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
        manufacturingDetailsObj.multipleOf = o.activeStock.manufacturingDetails.manufacturingMultipleOf;
        this.manufacturingDetails = manufacturingDetailsObj;
      }
    });
    // get all stocks
    this.stockListDropDown$ = this.store.select(p => {
      let data = _.cloneDeep(p);
      let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
      if (data.inventory.manufacturingStockList) {
        if (data.inventory.manufacturingStockList.results) {
          let units = data.inventory.manufacturingStockList.results;

          return units.map(unit => {
            let alreadyPushedElementindx = manufacturingDetailsObj.linkedStocks.findIndex((obj) => obj.stockUniqueName === unit.uniqueName);
            if (alreadyPushedElementindx > -1) {
              return { label: ` ${unit.name} (${unit.uniqueName})`, value: unit.uniqueName, isAlreadyPushed: true };
            } else {
              return { label: ` ${unit.name} (${unit.uniqueName})`, value: unit.uniqueName, isAlreadyPushed: false };
            }
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
      this.onQuantityChange(1);
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
    if (data.amount > 0) {
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
    } else {
      this._toasty.errorToast('Can not add raw material, amount is 0');
    }
  }

  public removeConsumptionItem(indx) {
    if (indx > -1) {
      this.manufacturingDetails.linkedStocks.splice(indx, 1);
    }
  }

  public addExpense(data) {
    let objToPush = {
      baseAccount: {
        uniqueName: data.transactionAccountUniqueName
      },
      transactions: [
        {
          account: {
            uniqueName: data.baseAccountUniqueName
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
    manufacturingObj.manufacturingMultipleOf = manufacturingObj.quantity;
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
    let manufacturingDetails = _.cloneDeep(this.manufacturingDetails);
    if (from === 'linkedStocks' && this.manufacturingDetails.linkedStocks) {
      _.forEach(manufacturingDetails.linkedStocks, (item) => total = total + Number(item[field]));
    }
    if (from === 'otherExpenses' && this.manufacturingDetails.otherExpenses) {
      _.forEach(manufacturingDetails.otherExpenses, (item) => total = total + Number(item.transactions[0][field]));
    }

    return total;
  }

  public getCostPerProduct() {
    let manufacturingDetails = _.cloneDeep(this.manufacturingDetails);
    let quantity = manufacturingDetails.manufacturingMultipleOf;
    quantity = (quantity && quantity > 0) ? quantity : 1;
    let amount = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
    let cost = (amount / quantity);
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

  public onQuantityChange(value: number) {
    let manufacturingObj = _.cloneDeep(this.manufacturingDetails);

    if (!this.initialQuantityObj.length) {
      this.initialQuantityObj = [];
      manufacturingObj.linkedStocks.forEach((o) => {
        this.initialQuantityObj.push(o);
      });
    }

    if (_.isNumber(value)) {
      value = value;
    } else if (_.isEmpty(value)) {
      // alert('now');
      value = 1;
    } else {
      value = 1;
    }

    if (manufacturingObj && manufacturingObj.linkedStocks) {
      manufacturingObj.linkedStocks.forEach((stock) => {
        let selectedStock = this.initialQuantityObj.find((obj) => obj.stockUniqueName === stock.stockUniqueName);
        if (selectedStock) {
          stock.quantity = selectedStock.quantity * value;
          stock.amount = stock.quantity * stock.rate;
        }
      });
      this.manufacturingDetails = manufacturingObj;
    }
  }

  public getStockUnit(selectedItem, itemQuantity) {
    if (selectedItem && itemQuantity && Number(itemQuantity) > 0) {
      let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
      this._inventoryService.GetStockDetails(manufacturingDetailsObj.uniqueName, selectedItem).subscribe((res) => {

        if (res.status === 'success') {
          let unitCode = res.body.stockUnit.code;

          let data = {
            stockUniqueName: selectedItem,
            quantity: itemQuantity,
            stockUnitCode: unitCode,
            rate: null,
            amount: null
          };

          this._inventoryService.GetRateForStoke(selectedItem, data).subscribe((response) => {
            if (response.status === 'success') {
              this.linkedStocks.rate = _.cloneDeep(response.body.rate);
            }
          });

          this.linkedStocks.manufacturingUnit = unitCode;
          this.linkedStocks.stockUnitCode = unitCode;
        }
      });
    } else {
      this.linkedStocks.manufacturingUnit = null;
      this.linkedStocks.stockUnitCode = null;
      this.linkedStocks.rate = null;
    }
  }

  public setToday() {
    this.manufacturingDetails.date = String(moment());
  }

  public clearDate() {
    this.manufacturingDetails.date = '';
  }

  public getAccountName(uniqueName: string, category: string) {
    let name;
    if (category === 'liabilityGroupAccounts') {
      this.liabilityGroupAccounts$.subscribe((data) => {
        let account = data.find((acc) => acc.value === uniqueName);
        if (account) {
          name = account.label;
        }
      });
    } else if (category === 'expenseGroupAccounts') {
      this.expenseGroupAccounts$.subscribe((data) => {
        let account = data.find((acc) => acc.value === uniqueName);
        if (account) {
          name = account.label;
        }
      });
    }
    return Observable.of(name);
  }
}
