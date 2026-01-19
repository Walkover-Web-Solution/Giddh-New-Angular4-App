import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { ToasterService } from './../../services/toaster.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ManufacturingActions } from '../../actions/manufacturing/manufacturing.actions';
import { InventoryAction } from '../../actions/inventory/inventory.actions';
import { IStockItemDetail } from '../../models/interfaces/stocks-item.interface';
import * as dayjs from 'dayjs';
import { ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { createSelector } from 'reselect';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { CurrentPage } from '../../models/api-models/Common';
import { GeneralActions } from '../../actions/general/general.actions';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { SearchService } from '../../services/search.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { GeneralService } from '../../services/general.service';
import { IOption } from '../../app.constant';
import { cloneDeep, concat, find, findIndex, forEach, includes, map } from '../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    templateUrl: './mf.edit.component.html',
    styleUrls: [`./mf.edit.component.scss`],
    standalone:false
})

/**
 * MfEditComponent component
 * Handles mfedit functionality and user interactions
 */
export class MfEditComponent implements OnInit, OnDestroy {
    @ViewChild('manufacturingConfirmationTemplate', { static: true }) public manufacturingConfirmationTemplate: TemplateRef<any>;
    /** Dialog reference for manufacturing confirmation modal */
    private manufacturingConfirmationDialogRef: MatDialogRef<any>;

    public stockListDropDown$: Observable<IOption[]>;
    public allStocksDropDown$: Observable<IOption[]>;
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
    public dayjs = dayjs;
    public initialQuantityObj: any = [];
    /* To check page is not inventory page */
    public isInventoryPage: boolean = false;
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
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Stores the search results pagination details */
    public expenseAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultExpenseAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventExpenseDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultExpenseAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public expenseAccounts: IOption[];
    /** Stores the search results pagination details */
    public liabilitiesAssetAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultLiabilitiesAssetAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventLiabilitiesAssetDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultLiabilitiesAssetAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public liabilitiesAssetAccounts: IOption[];
    /* Stores warehouses for a company */
    public warehouses: Array<any> = [];
    /** Stores the current organization type */
    public currentOrganizationType: string;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private manufacturingActions: ManufacturingActions,
        private inventoryAction: InventoryAction,
        private router: Router,
        private _location: Location,
        private _inventoryService: InventoryService,
        private generalAction: GeneralActions,
        private generalService: GeneralService,
        private _toasty: ToasterService,
        private searchService: SearchService,
        private warehouseActions: WarehouseActions,
        private dialog: MatDialog
    ) {
        this.isGetManufactureStockInProgress$ = this.store.pipe(select(state => state.inventory.isGetManufactureStockInProgress), takeUntil(this.destroyed$));
        this.isStockWithRateInprogress$ = this.store.pipe(select(state => state.manufacturing.isStockWithRateInprogress), takeUntil(this.destroyed$));

        this.manufacturingDetails = new ManufacturingItemRequest();
        this.initializeOtherExpenseObj();

        this.manufacturingDetails.quantity = 1;
        this.setCurrentPageTitle();
        this.setToday();
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.store.dispatch(this.inventoryAction.GetManufacturingCreateStock());
        this.store.dispatch(this.inventoryAction.GetStock());

        // Update/Delete condition
        this.store.pipe(select(manufacturingStore => manufacturingStore.manufacturing), takeUntil(this.destroyed$)).subscribe((res: any) => {
            /**
             * Handles if functionality
             */
            if (res.stockToUpdate) {
                this.isUpdateCase = true;
                let manufacturingObj = cloneDeep(res.reportData.results.find((stock) => stock?.uniqueName === res.stockToUpdate));
                /**
                 * Handles if functionality
                 */
                if (manufacturingObj) {
                    this.selectedProductName = `${manufacturingObj.stockName} (${manufacturingObj.stockUniqueName})`;
                    manufacturingObj.quantity = manufacturingObj.manufacturingQuantity;
                    manufacturingObj.date = dayjs(manufacturingObj.date, GIDDH_DATE_FORMAT).toDate();
                    manufacturingObj.multipleOf = (manufacturingObj.manufacturingQuantity / manufacturingObj.manufacturingMultipleOf);
                    (Array.isArray(manufacturingObj.linkedStocks) ? manufacturingObj.linkedStocks : []).forEach((item) => {
                        item.quantity = (item.manufacturingQuantity / manufacturingObj.manufacturingMultipleOf);
                    });
                    (Array.isArray(manufacturingObj.otherExpenses) ? manufacturingObj.otherExpenses : []).forEach(expense => {
                        expense.baseAccount.defaultName = `${expense.baseAccount.name} (${expense.baseAccount?.uniqueName})`;
                        expense.transactions[0].account.defaultName = `${expense.transactions[0]?.account?.name} (${expense.transactions[0]?.account?.uniqueName})`;
                    });
                    /**
                     * Handles if functionality
                     */
                    if (!this.initialQuantityObj?.length) {
                        this.initialQuantityObj = manufacturingObj.linkedStocks;
                    }
                    manufacturingObj.warehouseUniqueName = manufacturingObj?.warehouse?.uniqueName;
                    this.manufacturingDetails = manufacturingObj;
                    /**
                     * Handles if functionality
                     */
                    if (this.manufacturingDetails.date && typeof this.manufacturingDetails.date === 'object') {
                        this.manufacturingDetails.date = String(dayjs(this.manufacturingDetails.date).format(GIDDH_DATE_FORMAT));
                    }
                    this.onQuantityChange(manufacturingObj.manufacturingMultipleOf);
                }
            }
        });

        this.isInventoryPage = this.router.url.includes('/pages/inventory');
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        /**
         * Handles if functionality
         */
        if (this.isUpdateCase) {
            let manufacturingDetailsObj = cloneDeep(this.manufacturingDetails);
            this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(manufacturingDetailsObj.stockUniqueName));
        }
        // dispatch stockList request
        this.store.pipe(select(p => p.inventory), takeUntil(this.destroyed$)).subscribe((o: any) => {
            /**
             * Handles if functionality
             */
            if (this.isUpdateCase && o.activeStock && o.activeStock.manufacturingDetails) {
                let manufacturingDetailsObj = cloneDeep(this.manufacturingDetails);
                manufacturingDetailsObj.multipleOf = o.activeStock.manufacturingDetails.manufacturingMultipleOf;
                this.manufacturingDetails = manufacturingDetailsObj;
            }
        });

        // get manufacturing stocks
        this.stockListDropDown$ = this.store.pipe(select(
            /**
             * Creates new selector
             */
            createSelector([(state: AppState) => state.inventory.manufacturingStockListForCreateMF], (manufacturingStockListForCreateMF) => {
                let data = cloneDeep(manufacturingStockListForCreateMF);
                let manufacturingDetailsObj = cloneDeep(this.manufacturingDetails);
                /**
                 * Handles if functionality
                 */
                if (data) {
                    /**
                     * Handles if functionality
                     */
                    if (data.results) {
                        let units = data.results;

                        return units.map(unit => {
                            let alreadyPushedElementindx = manufacturingDetailsObj?.linkedStocks?.findIndex((obj) => obj.stockUniqueName === unit?.uniqueName);
                            /**
                             * Handles if functionality
                             */
                            if (alreadyPushedElementindx > -1) {
                                return { label: ` ${unit?.name} (${unit?.uniqueName})`, value: unit?.uniqueName, isAlreadyPushed: true };
                            } else {
                                return { label: ` ${unit?.name} (${unit?.uniqueName})`, value: unit?.uniqueName, isAlreadyPushed: false };
                            }
                        });
                    }
                }
            })), takeUntil(this.destroyed$));
        // get All stocks
        this.allStocksDropDown$ = this.store.pipe(select(
            /**
             * Creates new selector
             */
            createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
                let data = cloneDeep(allStocks);

                let manufacturingDetailsObj = cloneDeep(this.manufacturingDetails);
                /**
                 * Handles if functionality
                 */
                if (data) {
                    /**
                     * Handles if functionality
                     */
                    if (data.results) {
                        let units = data.results;
                        return units.map(unit => {
                            let alreadyPushedElementindx = manufacturingDetailsObj?.linkedStocks?.findIndex((obj) => obj.stockUniqueName === unit?.uniqueName);
                            /**
                             * Handles if functionality
                             */
                            if (alreadyPushedElementindx > -1) {
                                return { label: ` ${unit?.name} (${unit?.uniqueName})`, value: unit?.uniqueName, isAlreadyPushed: true };
                            } else {
                                return { label: ` ${unit?.name} (${unit?.uniqueName})`, value: unit?.uniqueName, isAlreadyPushed: false };
                            }
                        });
                    }
                }
            })), takeUntil(this.destroyed$));
        // get stock with rate details
        this.store.pipe(select(manufacturingStore => manufacturingStore.manufacturing), takeUntil(this.destroyed$)).subscribe((res: any) => {
            let manufacturingDetailsObj = cloneDeep(this.manufacturingDetails);
            /**
             * Handles if functionality
             */
            if (!this.isUpdateCase) {
                /**
                 * Handles if functionality
                 */
                if (res.stockWithRate && res.stockWithRate.manufacturingDetails) {
                    this.initialQuantityObj = []; // Reset initaila quantity of selected stock
                    // In create only
                    let manufacturingDetailsObjData = cloneDeep(res.stockWithRate.manufacturingDetails);
                    manufacturingDetailsObj.linkedStocks = cloneDeep(res.stockWithRate.manufacturingDetails.linkedStocks);
                    manufacturingDetailsObj.multipleOf = (manufacturingDetailsObjData.manufacturingQuantity / manufacturingDetailsObjData.manufacturingMultipleOf);
                    manufacturingDetailsObj.manufacturingQuantity = manufacturingDetailsObjData.manufacturingQuantity;
                    manufacturingDetailsObj.manufacturingMultipleOf = manufacturingDetailsObjData.manufacturingMultipleOf;
                } else {
                    manufacturingDetailsObj.linkedStocks = [];
                    manufacturingDetailsObj.multipleOf = null;
                }
                manufacturingDetailsObj.warehouseUniqueName = manufacturingDetailsObj?.warehouse?.uniqueName;
                this.manufacturingDetails = manufacturingDetailsObj;
                this.onQuantityChange(1);
            }
        });

        this.loadExpenseAccounts();
        this.loadAssetsLiabilitiesAccounts();
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.initializeWarehouse();
    }

    /**
     * Retrieves stockswithrate data
     */
    public getStocksWithRate(data) {
        this.selectedProductName = data.label;
        this.manufacturingDetails.manufacturingMultipleOf = 1;
        /**
         * Handles if functionality
         */
        if (data.value) {
            let selectedValue = cloneDeep(data.value);
            this.selectedProduct = selectedValue;
            let manufacturingObj = cloneDeep(this.manufacturingDetails);
            manufacturingObj.uniqueName = selectedValue;
            this.manufacturingDetails = manufacturingObj;
            this.store.dispatch(this.manufacturingActions.GetStockWithRate(manufacturingObj.stockUniqueName));
        }
    }

    /**
     * Initializes ializeotherexpenseobj
     */
    public initializeOtherExpenseObj() {
        this.otherExpenses.baseAccountUniqueName = '';
        this.otherExpenses.transactionAccountUniqueName = '';
    }

    /**
     * Handles goBackToListPage functionality
     */
    public goBackToListPage() {
        this._location.back();
    }

    /**
     * Handles addConsumption functionality
     */
    public addConsumption(data, ev?) {
        /**
         * Handles if functionality
         */
        if (data.amount > 0 && data.rate && data.stockUniqueName && data.quantity) {
            let val: any = {
                amount: data.amount,
                rate: data.rate,
                stockName: data.stockUniqueName,
                stockUniqueName: data.stockUniqueName,
                quantity: data.quantity
            };

            /**
             * Handles if functionality
             */
            if (this.isUpdateCase) {
                val.stockUnitCode = data.manufacturingUnit;
                val.stockUnitUniqueName = data.stockUnitUniqueName;
            } else {
                val.stockUnitCode = data.stockUnitCode;
                val.stockUnitUniqueName = data.stockUnitUniqueName;
            }

            let manufacturingObj = cloneDeep(this.manufacturingDetails);

            /**
             * Handles if functionality
             */
            if (manufacturingObj.linkedStocks) {
                manufacturingObj.linkedStocks.push(val);
            } else {
                manufacturingObj.linkedStocks = [val];
            }

            this.manufacturingDetails = manufacturingObj;
            this.linkedStocks = new IStockItemDetail();
            this.needForceClearProductList$ = observableOf({ status: true });
        } else if (ev) {
            this._toasty.errorToast('Can not add raw material, amount is 0');
        }
    }

    /**
     * Deletes consumptionitem
     */
    public removeConsumptionItem(indx) {
        /**
         * Handles if functionality
         */
        if (indx > -1) {
            this.manufacturingDetails.linkedStocks.splice(indx, 1);
        }
    }

    /**
     * Handles addExpense functionality
     */
    public addExpense(data: any, event?: any, type?: string): void {
        /**
         * Handles if functionality
         */
        if (type === "transaction") {
            this.otherExpenses.transactionAccountDefaultName = event?.label;
        } else if (type === "base") {
            this.otherExpenses.baseAccountDefaultName = event?.label;
        }

        /**
         * Handles if functionality
         */
        if (data && data.transactionAccountUniqueName && data.baseAccountUniqueName && data.transactionAmount) {
            let objToPush = {
                baseAccount: {
                    uniqueName: data.transactionAccountUniqueName,
                    defaultName: data.transactionAccountDefaultName
                },
                transactions: [
                    {
                        account: {
                            uniqueName: data.baseAccountUniqueName,
                            defaultName: data.baseAccountDefaultName
                        },
                        amount: data.transactionAmount
                    }
                ]
            };
            let manufacturingObj = cloneDeep(this.manufacturingDetails);

            /**
             * Handles if functionality
             */
            if (manufacturingObj.otherExpenses) {
                manufacturingObj.otherExpenses.push(objToPush);
            } else {
                manufacturingObj.otherExpenses = [objToPush];
            }
            this.manufacturingDetails = manufacturingObj;

            this.otherExpenses = {};
            this.needForceClearLiability$ = observableOf({ status: true });
            this.needForceClearGroup$ = observableOf({ status: true });

            this.initializeOtherExpenseObj();
        }
    }

    /**
     * Deletes expenseitem
     */
    public removeExpenseItem(indx) {
        /**
         * Handles if functionality
         */
        if (indx > -1) {
            this.manufacturingDetails.otherExpenses.splice(indx, 1);
        }
    }

    /**
     * Creates new entry
     */
    public createEntry() {
        let dataToSave = cloneDeep(this.manufacturingDetails);
        dataToSave.stockUniqueName = this.selectedProduct;
        /**
         * Handles if functionality
         */
        if (dataToSave.date && typeof dataToSave.date === 'object') {
            dataToSave.date = String(dayjs(dataToSave.date).format(GIDDH_DATE_FORMAT));
        }
        delete dataToSave.warehouse;
        (Array.isArray(dataToSave.linkedStocks) ? dataToSave.linkedStocks : []).forEach((obj) => {
            obj.manufacturingUnit = obj.stockUnitCode;
            obj.manufacturingQuantity = obj.quantity;
        });
        this.store.dispatch(this.manufacturingActions.CreateMfItem(dataToSave));
    }

    /**
     * Updates existing entry
     */
    public updateEntry() {
        let dataToSave = cloneDeep(this.manufacturingDetails);
        /**
         * Handles if functionality
         */
        if (dataToSave.date && typeof dataToSave.date === 'object') {
            dataToSave.date = String(dayjs(dataToSave.date).format(GIDDH_DATE_FORMAT));
        }
        delete dataToSave.warehouse;
        this.store.dispatch(this.manufacturingActions.UpdateMfItem(dataToSave));
    }

    /**
     * Opens the manufacturing confirmation dialog
     *
     * @memberof MfEditComponent
     */
    public deleteEntry() {
        this.manufacturingConfirmationDialogRef = this.dialog.open(this.manufacturingConfirmationTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Retrieves total data
     */
    public getTotal(from, field) {
        let total: number = 0;
        let manufacturingDetails = cloneDeep(this.manufacturingDetails);
        /**
         * Handles if functionality
         */
        if (from === 'linkedStocks' && this.manufacturingDetails.linkedStocks) {
            /**
             * Handles forEach functionality
             */
            forEach(manufacturingDetails.linkedStocks, (item) => total = total + Number(item[field]));
        }
        /**
         * Handles if functionality
         */
        if (from === 'otherExpenses' && this.manufacturingDetails.otherExpenses) {
            /**
             * Handles forEach functionality
             */
            forEach(manufacturingDetails.otherExpenses, (item) => total = total + Number(item.transactions[0][field]));
        }

        return total;
    }

    /**
     * Retrieves costperproduct data
     */
    public getCostPerProduct() {
        let manufacturingDetails = cloneDeep(this.manufacturingDetails);
        let quantity;
        /**
         * Handles if functionality
         */
        if (manufacturingDetails.multipleOf) {
            quantity = manufacturingDetails.manufacturingMultipleOf * manufacturingDetails.multipleOf;
        } else {
            quantity = manufacturingDetails.manufacturingMultipleOf;
        }
        /**
         * Handles quantity functionality
         */
        quantity = (quantity && quantity > 0) ? quantity : 1;
        let amount = this.getTotal('otherExpenses', 'amount') + this.getTotal('linkedStocks', 'amount');
        let cost = (amount / quantity);
        /**
         * Handles if functionality
         */
        if (!isNaN(cost)) {
            return cost;
        }
        return 0;
    }

    /**
     * Closes the manufacturing confirmation dialog and handles user response
     *
     * @param {boolean} userResponse - User's confirmation response
     * @memberof MfEditComponent
     */
    public closeConfirmationPopup(userResponse: boolean) {
        /**
         * Handles if functionality
         */
        if (userResponse) {
            let manufacturingObj = cloneDeep(this.manufacturingDetails);
            this.store.dispatch(this.manufacturingActions.DeleteMfItem({
                stockUniqueName: manufacturingObj?.stockUniqueName,
                manufacturingUniqueName: manufacturingObj?.uniqueName
            }));
        }
        this.manufacturingConfirmationDialogRef?.close();
    }

    /**
     * Retrieves calculatedamount data
     */
    public getCalculatedAmount(quantity, rate) {
        /**
         * Handles if functionality
         */
        if (quantity.model && rate.model) {
            let amount = quantity.model * rate.model;
            this.linkedStocks.amount = amount;
            return amount;
        }
        return 0;
    }

    /**
     * Handles quantitychange event
     */
    public onQuantityChange(val: any) {
        let value = val;
        let manufacturingObj = cloneDeep(this.manufacturingDetails);

        /**
         * Handles if functionality
         */
        if (!this.initialQuantityObj?.length) {
            this.initialQuantityObj = [];
            (Array.isArray(manufacturingObj.linkedStocks) ? manufacturingObj.linkedStocks : []).forEach((o) => {
                this.initialQuantityObj.push(o);
            });
        }

        /**
         * Handles if functionality
         */
        if (value && !isNaN(value)) {
            value = parseFloat(value);
        } else {
            value = 1;
        }

        /**
         * Handles if functionality
         */
        if (manufacturingObj && manufacturingObj.linkedStocks) {
            (Array.isArray(manufacturingObj.linkedStocks) ? manufacturingObj.linkedStocks : []).forEach((stock) => {
                let selectedStock = this.initialQuantityObj.find((obj) => obj.stockUniqueName === stock.stockUniqueName);

                /**
                 * Handles if functionality
                 */
                if (selectedStock) {
                    stock.quantity = selectedStock.quantity * value;
                    stock.amount = stock.quantity * stock.rate;
                }
            });
            this.manufacturingDetails = manufacturingObj;
        }
    }

    /**
     * Retrieves stockunit data
     */
    public getStockUnit(selectedItem, itemQuantity) {
        /**
         * Handles if functionality
         */
        if (selectedItem && itemQuantity && Number(itemQuantity) > 0) {
            this._inventoryService.GetStockUniqueNameWithDetail(selectedItem).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                /**
                 * Handles if functionality
                 */
                if (res?.status === 'success') {
                    let unitCode = res.body?.stockUnit?.code;

                    let data = {
                        stockUniqueName: selectedItem,
                        quantity: itemQuantity,
                        stockUnitCode: unitCode,
                        rate: null,
                        amount: null,
                        stockUnitUniqueName: res.body?.stockUnit?.uniqueName
                    };

                    this.linkedStocks.manufacturingUnit = unitCode;
                    this.linkedStocks.stockUnitCode = unitCode;
                    this.linkedStocks.stockUnitUniqueName = res.body?.stockUnit?.uniqueName;

                    this._inventoryService.GetRateForStoke(selectedItem, data).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                        /**
                         * Handles if functionality
                         */
                        if (response?.status === 'success') {
                            this.linkedStocks.rate = cloneDeep(response.body?.rate);
                            /**
                             * Sets timeout value
                             */
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
            this.linkedStocks.stockUnitUniqueName = null;
            this.linkedStocks.rate = null;
        }
    }

    /**
     * To set current date
     *
     * @memberof MfEditComponent
     */
    public setToday(): void {
        this.manufacturingDetails.date = String(dayjs(this.bsValue).format(GIDDH_DATE_FORMAT));
    }

    /**
     * Handles clearDate functionality
     */
    public clearDate() {
        this.manufacturingDetails.date = '';
    }

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

    /**
     * Loads the default list of expense accounts
     *
     * @memberof MfEditComponent
     */
    public loadExpenseAccounts(): void {
        this.onExpenseAccountSearchQueryChanged('');
    }

    /**
     * Loads the default list of assets and liabilities accounts
     *
     * @memberof MfEditComponent
     */
    public loadAssetsLiabilitiesAccounts(): void {
        this.onLiabilitiesAssetAccountSearchQueryChanged('', 1, (response) => {
            this.defaultLiabilitiesAssetAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: `${result.name} (${result?.uniqueName})`
                }
            }) || [];
            this.defaultLiabilitiesAssetAccountPaginationData.page = this.liabilitiesAssetAccountsSearchResultsPaginationData.page;
            this.defaultLiabilitiesAssetAccountPaginationData.totalPages = this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages;
        });
    }

    /**
     * Search query change handler for expense account
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof MfEditComponent
     */
    public onExpenseAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.expenseAccountsSearchResultsPaginationData.query = query;
        /**
         * Handles if functionality
         */
        if (!this.preventExpenseDefaultScrollApiCall &&
            (query || (this.defaultExpenseAccountSuggestions && this.defaultExpenseAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('operatingcost, indirectexpenses')
            };
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result.name} (${result?.uniqueName})`
                        }
                    }) || [];
                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.expenseAccounts = searchResults;
                    } else {
                        this.expenseAccounts = [
                            ...this.expenseAccounts,
                            ...searchResults
                        ];
                    }
                    this.expenseGroupAccounts$ = observableOf(this.expenseAccounts);
                    this.expenseAccountsSearchResultsPaginationData.page = data.body.page;
                    this.expenseAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultExpenseAccountPaginationData.page = this.expenseAccountsSearchResultsPaginationData.page;
                        this.defaultExpenseAccountPaginationData.totalPages = this.expenseAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.expenseAccounts = [...this.defaultExpenseAccountSuggestions];
            this.expenseAccountsSearchResultsPaginationData.page = this.defaultExpenseAccountPaginationData.page;
            this.expenseAccountsSearchResultsPaginationData.totalPages = this.defaultExpenseAccountPaginationData.totalPages;
            this.preventExpenseDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventExpenseDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for expense account
     *
     * @returns null
     * @memberof MfEditComponent
     */
    public handleExpenseAccountScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.expenseAccountsSearchResultsPaginationData.page < this.expenseAccountsSearchResultsPaginationData.totalPages) {
            this.onExpenseAccountSearchQueryChanged(
                this.expenseAccountsSearchResultsPaginationData.query,
                this.expenseAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.expenseAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: `${result.name} (${result?.uniqueName})`
                            }
                        }) || [];
                        this.defaultExpenseAccountSuggestions = this.defaultExpenseAccountSuggestions.concat(...results);
                        this.defaultExpenseAccountPaginationData.page = this.expenseAccountsSearchResultsPaginationData.page;
                        this.defaultExpenseAccountPaginationData.totalPages = this.expenseAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Search query change handler on liabilities and assets account
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof MfEditComponent
     */
    public onLiabilitiesAssetAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.liabilitiesAssetAccountsSearchResultsPaginationData.query = query;
        /**
         * Handles if functionality
         */
        if (!this.preventLiabilitiesAssetDefaultScrollApiCall &&
            (query || (this.defaultLiabilitiesAssetAccountSuggestions && this.defaultLiabilitiesAssetAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('noncurrentassets, currentassets, fixedassets, currentliabilities, noncurrentliabilities, shareholdersfunds')
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result.name} (${result?.uniqueName})`
                        }
                    }) || [];
                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.liabilitiesAssetAccounts = searchResults;
                    } else {
                        this.liabilitiesAssetAccounts = [
                            ...this.liabilitiesAssetAccounts,
                            ...searchResults
                        ];
                    }
                    this.liabilityGroupAccounts$ = observableOf(this.liabilitiesAssetAccounts);
                    this.liabilitiesAssetAccountsSearchResultsPaginationData.page = data.body.page;
                    this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultLiabilitiesAssetAccountPaginationData.page = this.liabilitiesAssetAccountsSearchResultsPaginationData.page;
                        this.defaultLiabilitiesAssetAccountPaginationData.totalPages = this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.liabilitiesAssetAccounts = [...this.defaultLiabilitiesAssetAccountSuggestions];
            this.liabilitiesAssetAccountsSearchResultsPaginationData.page = this.defaultLiabilitiesAssetAccountPaginationData.page;
            this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages = this.defaultLiabilitiesAssetAccountPaginationData.totalPages;
            this.preventLiabilitiesAssetDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventLiabilitiesAssetDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for liabilities and assets account
     *
     * @returns null
     * @memberof MfEditComponent
     */
    public handleLiabilitiesAssetAccountScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.defaultLiabilitiesAssetAccountPaginationData.page < this.defaultLiabilitiesAssetAccountPaginationData.totalPages) {
            this.onLiabilitiesAssetAccountSearchQueryChanged(
                this.defaultLiabilitiesAssetAccountPaginationData.query,
                this.defaultLiabilitiesAssetAccountPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.defaultLiabilitiesAssetAccountPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: `${result.name} (${result?.uniqueName})`
                            }
                        }) || [];
                        this.defaultLiabilitiesAssetAccountSuggestions = this.defaultLiabilitiesAssetAccountSuggestions.concat(...results);
                        this.defaultLiabilitiesAssetAccountPaginationData.page = this.liabilitiesAssetAccountsSearchResultsPaginationData.page;
                        this.defaultLiabilitiesAssetAccountPaginationData.totalPages = this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Intializes the warehouse
     *
     * @private
     * @memberof MfEditComponent
     */
    private initializeWarehouse(): void {
        this.store.pipe(select(appState => appState.warehouse.warehouses), filter((warehouses) => !!warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            this.warehouses = [];
            /**
             * Handles if functionality
             */
            if (warehouses && warehouses.results) {
                let warehouseResults = cloneDeep(warehouses.results);
                warehouseResults = warehouseResults?.filter(warehouse => this.manufacturingDetails?.warehouseUniqueName === warehouse?.uniqueName || !warehouse.isArchived);
                (Array.isArray(warehouseResults) ? warehouseResults : []).forEach(warehouse => {
                    this.warehouses.push({ label: warehouse.name, value: warehouse?.uniqueName, additional: warehouse });
                });
            }
        });
    }

    /**
     * Releases memory
     *
     * @memberof MfEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
