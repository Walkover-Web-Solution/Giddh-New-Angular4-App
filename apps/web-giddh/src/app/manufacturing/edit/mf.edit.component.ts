import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { ToasterService } from './../../services/toaster.service';
import { IOption } from './../../theme/ng-select/option.interface';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ManufacturingActions } from '../../actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
import { IStockItemDetail } from '../../models/interfaces/stocksItem.interface';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { GroupService } from '../../services/group.service';
import { ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';
import { ModalDirective } from 'ngx-bootstrap';
import { InventoryService } from '../../services/inventory.service';
import { AccountService } from '../../services/account.service';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { createSelector } from 'reselect';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    templateUrl: './mf.edit.component.html'
})

export class MfEditComponent implements OnInit {
    @ViewChild('manufacturingConfirmationModal') public manufacturingConfirmationModal: ModalDirective;

    public stockListDropDown$: Observable<IOption[]>;
    public allStocksDropDown$: Observable<IOption[]>;
    public groupsList$: Observable<GroupsWithAccountsResponse[]>;
    public consumptionDetail = [];
    public isUpdateCase: boolean = false;
    public manufacturingDetails: ManufacturingItemRequest;
    public otherExpenses: any = {};
    public toggleAddExpenses: boolean = true;
    public toggleAddLinkedStocks: boolean = false;
    public linkedStocks: IStockItemDetail = new IStockItemDetail();
    public expenseGroupAccounts: any = [];
    public liabilityGroupAccounts: any = [];
    public selectedProduct: string;
    public selectedProductName: string;
    public showFromDatePicker: boolean = false;
    public moment = moment;
    public initialQuantityObj: any = [];
    public needForceClearLiability$: Observable<IForceClear> = observableOf({ status: false });
    public needForceClearGroup$: Observable<IForceClear> = observableOf({ status: false });

    public needForceClearProductList$: Observable<IForceClear> = observableOf({ status: false });

    public options: Select2Options = {
        multiple: false,
        placeholder: 'Select'
    };
    public expenseGroupAccounts$: Observable<IOption[]>;
    public liabilityGroupAccounts$: Observable<IOption[]>;
    /** To check which index of expense is in editable mode */
    public isEditableIndex: number = null;
    /** To get manufacture stock list in-progress */
    public isGetManufactureStockInProgress$: Observable<boolean> = observableOf(false);
    /** To get stock with rate in-progress */
    public isStockWithRateInprogress$: Observable<boolean> = observableOf(false);
    /** set default value to date picker */
    public bsValue = new Date();
    private initialQuantity: number = 1;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private manufacturingActions: ManufacturingActions,
        private inventoryAction: InventoryAction,
        private _groupService: GroupService,
        private _location: Location,
        private _inventoryService: InventoryService,
        private _accountService: AccountService,
        private generalAction: GeneralActions,
        private _toasty: ToasterService) {

        this.store.dispatch(this.inventoryAction.GetManufacturingCreateStock());
        this.store.dispatch(this.inventoryAction.GetStock());
        this.isGetManufactureStockInProgress$ = this.store.pipe(select(state => state.inventory.isGetManufactureStockInProgress), takeUntil(this.destroyed$));
        this.isStockWithRateInprogress$ = this.store.pipe(select(state => state.manufacturing.isStockWithRateInprogress), takeUntil(this.destroyed$));

        this.groupsList$ = this.store.select(p => p.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));

        this.manufacturingDetails = new ManufacturingItemRequest();
        this.initializeOtherExpenseObj();
        // Update/Delete condition
        this.store.select(p => p.manufacturing).pipe(takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (o.stockToUpdate) {
                this.isUpdateCase = true;
                let manufacturingObj = _.cloneDeep(o.reportData.results.find((stock) => stock.uniqueName === o.stockToUpdate));
                if (manufacturingObj) {
                    this.selectedProductName = `${manufacturingObj.stockName} (${manufacturingObj.stockUniqueName})`;
                    manufacturingObj.quantity = manufacturingObj.manufacturingQuantity;
                    manufacturingObj.date = moment(manufacturingObj.date, 'DD-MM-YYYY').toDate();
                    manufacturingObj.multipleOf = (manufacturingObj.manufacturingQuantity / manufacturingObj.manufacturingMultipleOf);
                    // delete manufacturingObj.manufacturingQuantity;
                    manufacturingObj.linkedStocks.forEach((item) => {
                        item.quantity = (item.manufacturingQuantity / manufacturingObj.manufacturingMultipleOf);
                    });
                    if (!this.initialQuantityObj.length) {
                        this.initialQuantityObj = manufacturingObj.linkedStocks;
                    }
                    // manufacturingObj.activeStockGroupUniqueName = o.activeStockGroup;
                    this.manufacturingDetails = manufacturingObj;
                    this.onQuantityChange(manufacturingObj.manufacturingMultipleOf);
                }
            }
        });

        // Get group with accounts
        this.groupsList$.subscribe(data => {
            if (data && data.length) {
                let GroupWithAccResponse = _.cloneDeep(data);
                this._accountService.getFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response.status === 'success') {
                        let flattenGroupResponse = _.cloneDeep(response.body.results);

                        this.liabilityGroupAccounts = [];
                        this.expenseGroupAccounts = [];

                        _.forEach(GroupWithAccResponse, (d: any) => {
                            _.forEach(flattenGroupResponse, acc => {
                                if (d.category === 'expenses' || d.category === 'liabilities' || d.category === 'assets') {
                                    let matchedAccIndex = acc.parentGroups.findIndex((account) => account.uniqueName === d.uniqueName);
                                    if (matchedAccIndex > -1) {
                                        if (d.category === 'expenses') {
                                            this.expenseGroupAccounts.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName });
                                        }
                                        if (d.category === 'liabilities' || d.category === 'assets') {
                                            this.liabilityGroupAccounts.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName });
                                        }
                                    }
                                }
                            });
                        });
                        this.expenseGroupAccounts$ = observableOf(this.expenseGroupAccounts);
                        this.liabilityGroupAccounts$ = observableOf(this.liabilityGroupAccounts);
                    }
                });
            }
        });

        this.manufacturingDetails.quantity = 1;
        this.setCurrentPageTitle();
        this.setToday();
    }

    public ngOnInit() {
        if (this.isUpdateCase) {
            let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
            this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(manufacturingDetailsObj.stockUniqueName));
        }
        // dispatch stockList request
        this.store.select(p => p.inventory).pipe(takeUntil(this.destroyed$)).subscribe((o: any) => {
            if (this.isUpdateCase && o.activeStock && o.activeStock.manufacturingDetails) {
                let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
                manufacturingDetailsObj.multipleOf = o.activeStock.manufacturingDetails.manufacturingMultipleOf;
                this.manufacturingDetails = manufacturingDetailsObj;
            }
        });

        // get manufacturing stocks
        this.stockListDropDown$ = this.store.select(
            createSelector([(state: AppState) => state.inventory.manufacturingStockListForCreateMF], (manufacturingStockListForCreateMF) => {
                let data = _.cloneDeep(manufacturingStockListForCreateMF);
                let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
                if (data) {
                    if (data.results) {
                        let units = data.results;

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
            })).pipe(takeUntil(this.destroyed$));
        // get All stocks
        this.allStocksDropDown$ = this.store.select(
            createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
                let data = _.cloneDeep(allStocks);

                let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
                if (data) {
                    if (data.results) {
                        let units = data.results;
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
            })).pipe(takeUntil(this.destroyed$));
        // get stock with rate details
        this.store.select(p => p.manufacturing).pipe(takeUntil(this.destroyed$)).subscribe((o: any) => {
            let manufacturingDetailsObj = _.cloneDeep(this.manufacturingDetails);
            if (!this.isUpdateCase) {
                if (o.stockWithRate && o.stockWithRate.manufacturingDetails) {
                    // In create only
                    let manufacturingDetailsObjData = _.cloneDeep(o.stockWithRate.manufacturingDetails);
                    manufacturingDetailsObj.linkedStocks = _.cloneDeep(o.stockWithRate.manufacturingDetails.linkedStocks);
                    // this.initialQuantityObj = manufacturingDetailsObj.linkedStocks;
                    // manufacturingDetailsObj.multipleOf = _.cloneDeep(o.stockWithRate.manufacturingDetails.manufacturingMultipleOf);
                    manufacturingDetailsObj.multipleOf = (manufacturingDetailsObjData.manufacturingQuantity / manufacturingDetailsObjData.manufacturingMultipleOf);
                    manufacturingDetailsObj.manufacturingQuantity = manufacturingDetailsObjData.manufacturingQuantity;
                    manufacturingDetailsObj.manufacturingMultipleOf = manufacturingDetailsObjData.manufacturingMultipleOf;
                } else {
                    manufacturingDetailsObj.linkedStocks = [];
                    manufacturingDetailsObj.multipleOf = null;
                }
                this.manufacturingDetails = manufacturingDetailsObj;
                this.onQuantityChange(1);
            }
        });
    }

    public getStocksWithRate(data) {
        this.selectedProductName = data.label;
        this.manufacturingDetails.manufacturingMultipleOf = 1;
        if (data.value) {
            let selectedValue = _.cloneDeep(data.value);
            this.selectedProduct = selectedValue;
            let manufacturingObj = _.cloneDeep(this.manufacturingDetails);
            // manufacturingObj.stockUniqueName = selectedValue;
            manufacturingObj.uniqueName = selectedValue;
            this.manufacturingDetails = manufacturingObj;
            this.store.dispatch(this.manufacturingActions.GetStockWithRate(manufacturingObj.stockUniqueName));
        }
    }

    public initializeOtherExpenseObj() {
        this.otherExpenses.baseAccountUniqueName = '';
        this.otherExpenses.transactionAccountUniqueName = '';
    }

    public goBackToListPage() {
        this._location.back();
    }

    public addConsumption(data, ev?) {
        if (data.amount > 0 && data.rate && data.stockUniqueName && data.quantity) {
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
            this.needForceClearProductList$ = observableOf({ status: true });
        } else if (ev) {
            this._toasty.errorToast('Can not add raw material, amount is 0');
        }
    }

    public removeConsumptionItem(indx) {
        if (indx > -1) {
            this.manufacturingDetails.linkedStocks.splice(indx, 1);
        }
    }

    public addExpense(data) {
        if (data && data.transactionAccountUniqueName && data.baseAccountUniqueName && data.transactionAmount) {
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
            // manufacturingObj.manufacturingMultipleOf = manufacturingObj.manufacturingMultipleOf;
            this.manufacturingDetails = manufacturingObj;

            this.otherExpenses = {};
            this.needForceClearLiability$ = observableOf({ status: true });
            this.needForceClearGroup$ = observableOf({ status: true });

            this.initializeOtherExpenseObj();
        }
    }

    public removeExpenseItem(indx) {
        if (indx > -1) {
            this.manufacturingDetails.otherExpenses.splice(indx, 1);
        }
    }

    public createEntry() {
        let dataToSave = _.cloneDeep(this.manufacturingDetails);
        dataToSave.stockUniqueName = this.selectedProduct;
        if (dataToSave.date && !dataToSave.date.includes('-')) {
            dataToSave.date = (dataToSave.date).format(GIDDH_DATE_FORMAT);
        }
        dataToSave.linkedStocks.forEach((obj) => {
            obj.manufacturingUnit = obj.stockUnitCode;
            obj.manufacturingQuantity = obj.quantity;
            // delete obj.stockUnitCode;
            // delete obj.quantity;
        });
        // dataToSave.grandTotal = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
        // dataToSave.multipleOf = dataToSave.quantity;
        // delete dataToSave.manufacturingMultipleOf;
        this.store.dispatch(this.manufacturingActions.CreateMfItem(dataToSave));
    }

    public updateEntry() {
        let dataToSave = _.cloneDeep(this.manufacturingDetails);
        if (dataToSave.date && !dataToSave.date.includes('-')) {
            dataToSave.date = (dataToSave.date).format(GIDDH_DATE_FORMAT);
        }
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
        let quantity;
        if (manufacturingDetails.multipleOf) {
            quantity = manufacturingDetails.manufacturingMultipleOf * manufacturingDetails.multipleOf;
        } else {
            quantity = manufacturingDetails.manufacturingMultipleOf;
        }
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

    public onQuantityChange(val: any) {
        let value = val;
        let manufacturingObj = _.cloneDeep(this.manufacturingDetails);

        if (!this.initialQuantityObj.length) {
            this.initialQuantityObj = [];
            manufacturingObj.linkedStocks.forEach((o) => {
                this.initialQuantityObj.push(o);
            });
        }

        if (value && !isNaN(value)) {
            value = parseFloat(value);
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
            this._inventoryService.GetStockUniqueNameWithDetail(selectedItem).subscribe((res) => {

                if (res.status === 'success') {
                    let unitCode = res.body.stockUnit.code;

                    let data = {
                        stockUniqueName: selectedItem,
                        quantity: itemQuantity,
                        stockUnitCode: unitCode,
                        rate: null,
                        amount: null
                    };

                    this.linkedStocks.manufacturingUnit = unitCode;
                    this.linkedStocks.stockUnitCode = unitCode;

                    this._inventoryService.GetRateForStoke(selectedItem, data).subscribe((response) => {
                        if (response.status === 'success') {
                            this.linkedStocks.rate = _.cloneDeep(response.body.rate);
                            setTimeout(() => {
                                this.addConsumption(this.linkedStocks);
                            }, 10);
                        }
                    });
                }
            });
        } else {
            this.linkedStocks.manufacturingUnit = null;
            this.linkedStocks.stockUnitCode = null;
            this.linkedStocks.rate = null;
        }
    }

    /**
     * To set current date
     *
     * @memberof MfEditComponent
     */
    public setToday(): void {
        this.manufacturingDetails.date = String(moment(this.bsValue).format('DD-MM-YYYY'));
    }

    public clearDate() {
        this.manufacturingDetails.date = '';
    }

    // /**   will be useful in version 2
    //  *TODO:  To return account details
    //  *
    //  * @param {string} uniqueName Unique name of
    //  * @param {string} category
    //  * @returns
    //  * @memberof MfEditComponent
    //  */
    // public getAccountName(uniqueName: string, category: string) {
    //         let name;
    //         let uniqueNameOfAcc;
    //         if (category === 'liabilityGroupAccounts') {
    //             this.liabilityGroupAccounts$.subscribe((data) => {
    //                 let account = data.find((acc) => acc.value === uniqueName);
    //                 if (account) {
    //                     name = account.label;
    //                     uniqueNameOfAcc = account.value;
    //                 }
    //             });
    //         } else if (category === 'expenseGroupAccounts') {
    //             this.expenseGroupAccounts$.subscribe((data) => {
    //                 let account = data.find((acc) => acc.value === uniqueName);
    //                 if (account) {
    //                     name = account.label;
    //                     uniqueNameOfAcc = account.value;
    //                 }
    //             });
    //         }
    //         return observableOf(uniqueNameOfAcc);
    //     }

    /**
     * To toggle add expense entry block
     *
     * @param {boolean} isToggle True, if need to add an expense entry
     * @memberof MfEditComponent
     */
    public onToggleAddExpensesBlock(isToggle: boolean): void {
        this.toggleAddExpenses = !isToggle;
        this.needForceClearLiability$ = observableOf({ status: true });
        this.needForceClearGroup$ = observableOf({ status: true });
    }

    /**
     *To set menu title name
     *
     * @memberof MfEditComponent
     */
    public setCurrentPageTitle() {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Manufacturing";
        currentPageObj.url = "";
        currentPageObj.additional = "";
        this.store.dispatch(this.generalAction.setPageTitle(currentPageObj));
    }
}
