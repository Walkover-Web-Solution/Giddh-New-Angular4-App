import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { BranchHierarchyType } from 'apps/web-giddh/src/app/app.constant';
import { isEqual } from 'apps/web-giddh/src/app/lodash-optimized';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { CreateManufacturing } from 'apps/web-giddh/src/app/models/api-models/Manufacturing';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { giddhRoundOff } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'create-manufacturing',
    templateUrl: './create-manufacturing.component.html',
    styleUrls: ['./create-manufacturing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateManufacturingComponent implements OnInit, OnDestroy {
    /**  This will use for universal date */
    public universalDate: any;
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Create Manufacturing form object */
    public manufacturingObject: CreateManufacturing = new CreateManufacturing();
    /** New Linked stocks object */
    public totals: any = { totalRate: 0, totalAmount: 0, costPerItem: 0, expensePerItem: 0, totalStockAmount: 0, totalStockQuantity: 0 };
    /** Index of active linked item */
    public activeLinkedStockIndex: number = null;
    /** Index of active other expense item */
    public activeOtherExpenseIndex: number = null;
    /** Index of active by product  item */
    public activeByProductLinkedStockIndex: number = null;
    /** List of required fields */
    public errorFields: any = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false };
    /** True if is loading */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds selected warehouse name */
    public selectedWarehouseName: string = "";
    /** Holds selected inventory type */
    public selectedInventoryType: string = "";
    /** This will hold api calls if one is already in progress */
    public preventStocksApiCall: boolean = false;
    /** This will hold api calls if one is already in progress for by product */
    public preventByProductStocksApiCall: boolean = false;
    /** True if recipe exists for finished stock */
    private recipeExists: boolean = false;
    /** Holds existing recipe */
    private existingRecipe: any = [];
    /** Holds unique name in edit mode */
    public manufactureUniqueName: string = '';
    /** True if we need to redirect to report page after update manufacturing */
    private readyToRedirect: boolean = false;
    /** Holds list of linked stocks fetched initially in edit */
    public initialLinkedStocks: any[] = [];
    /** Holds list of linked stocks fetched initially in edit */
    public initialByProductLinkedStocks: any[] = [];
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if get manufacturing in progress */
    public isLoadingManufacturing: boolean = false;
    // /** Stores the default search results pagination details */
    public defaultExpenseAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventExpenseDefaultScrollApiCall: boolean = false;
    /** Default search suggestion list to be shown for search */
    public defaultExpenseAccountSuggestions: Array<IOption> = [];
    /** Stores the search results pagination details */
    public expenseAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Activity log form's company operations list */
    public expenseAccounts: IOption[] = [];
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
    /** Index of active linked item */
    public activeExpenseIndex: number = null;
    /** True if increase assets value*/
    private increaseExpenseAmount: boolean;
    /** True ifi is by product expanded*/
    private isByProductExpanded: boolean;
    /** True ifi is by other expenses expanded*/
    private isOtherExpenseExpanded: boolean;

    constructor(
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions,
        private changeDetectionRef: ChangeDetectorRef,
        private ledgerService: LedgerService,
        private manufacturingService: ManufacturingService,
        private toasterService: ToasterService,
        private inventoryService: InventoryService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private searchService: SearchService
    ) {
    }

    /**
     * Initializes the component
     *
     * @memberof CreateManufacturingComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.uniqueName) {
                this.manufactureUniqueName = params?.uniqueName;
                this.getManufacturingDetails(params?.uniqueName);
            }
            if (!this.manufactureUniqueName) {
                this.increaseExpenseAmount = this.manufacturingObject.manufacturingDetails[0].increaseAssetValue;
            }
        });

        this.loadExpenseAccounts();
        this.loadAssetsLiabilitiesAccounts();
        this.initializeOtherExpenseObj();
        this.showBorder(this.manufacturingObject.manufacturingDetails[0].otherExpenses[0]);
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.manufacturingObject.manufacturingDetails[0].date = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                } catch (e) {
                    this.manufacturingObject.manufacturingDetails[0].date = dayjs().format(GIDDH_DATE_FORMAT);
                }

                this.universalDate = cloneDeep(this.manufacturingObject.manufacturingDetails[0].date);
            }
        });
        this.getProfile();
        this.getWarehouses();
        this.getStocks(this.manufacturingObject.manufacturingDetails[0], 1, "");

        this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.length) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length >= 2;
                this.changeDetectionRef.detectChanges();
            } else {
                if (this.generalService.companyUniqueName) {
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof CreateManufacturingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get warehouses
     *
     * @memberof CreateManufacturingComponent
     */
    public getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));

        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses?.results?.length) {
                this.warehouses = [];
                const warehouseResults = warehouses?.results?.filter(warehouse => !warehouse.isArchived);
                warehouseResults?.forEach(warehouse => {
                    this.warehouses.push({ label: warehouse?.name, value: warehouse?.uniqueName });
                });
                this.selectedWarehouseName = this.warehouses[0].label;
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Get stocks
     *
     * @memberof CreateManufacturingComponent
     */
    public getStocks(stockObject: any, page: number = 1, q?: string, inventoryType?: string, callback?: Function): void {
        if (page > stockObject.stocksTotalPages || this.preventStocksApiCall || q === undefined) {
            return;
        }

        this.preventStocksApiCall = true;

        if (q) {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }

        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: inventoryType, page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                if (!callback) {
                    stockObject.stocksTotalPages = response.body.totalPages;
                    if (page === 1) {
                        stockObject.stocks = [];
                    }
                    response?.body?.results?.forEach(stock => {
                        let unitsList = [];

                        stock?.stockUnits?.forEach(unit => {
                            unitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        stockObject.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: unitsList } });
                    });
                } else {
                    callback(response);
                }
            } else {
                stockObject.stocks = [];
                stockObject.stocksTotalPages = 1;
            }
            this.changeDetectionRef.detectChanges();

            setTimeout(() => {
                this.preventStocksApiCall = false;
            }, 500);
        });

    }

    /**
     * This will be use for get all stock list fo products
     *
     * @param {*} stockObject
     * @param {number} [page=1]
     * @param {string} [q]
     * @param {Function} [callback]
     * @return {*}  {void}
     * @memberof CreateManufacturingComponent
     */
    public getAllStocks(stockObject: any, page: number = 1, q?: string, callback?: Function): void {
        if (page > stockObject.stocksTotalPages || this.preventByProductStocksApiCall || q === undefined) {
            return;
        }

        this.preventByProductStocksApiCall = true;

        if (q) {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }

        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: '', page: page, q: q }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.results?.length) {
                if (!callback) {
                    stockObject.stocksTotalPages = response.body.totalPages;
                    if (page === 1) {
                        stockObject.stocks = [];
                    }
                    response?.body?.results?.forEach(stock => {
                        let unitsList = [];

                        stock?.stockUnits?.forEach(unit => {
                            unitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        stockObject.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: unitsList } });
                    });
                } else {
                    callback(response);
                }
            } else {
                stockObject.stocks = [];
                stockObject.stocksTotalPages = 1;
            }
            this.changeDetectionRef.detectChanges();

            setTimeout(() => {
                this.preventByProductStocksApiCall = false;
            }, 500);
        });

    }

    /**
     * Get stock variants
     *
     * @param {*} object
     * @param {*} event
     * @param {boolean} [loadRecipe=false]
     * @param {number} [index]
     * @returns {void}
     * @memberof CreateManufacturingComponent
     */
    public getStockVariants(object: any, event: any, loadRecipe: boolean = false, index: number, isEdit: boolean = false, isRawStock: boolean = true, isByProductLinkedStock: boolean = false): void {
        object.stockUniqueName = event?.value;
        object.stockName = event?.label;
        object.stockUnitCode = event?.additional?.stockUnitCode;
        object.stockUnitUniqueName = event?.additional?.stockUnitUniqueName;

        if (!object.stockUniqueName) {
            return;
        }

        object.variants = [];
        if (!this.manufacturingObject.manufacturingDetails[0].otherExpenses.length) {
            this.manufacturingObject.manufacturingDetails[0].otherExpenses = [];
            this.initializeOtherExpenseObj();
        }
        this.ledgerService.loadStockVariants(object.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(variants => {
            if (variants?.length) {
                variants?.forEach(variant => {
                    object.variants.push({ label: variant?.name, value: variant?.uniqueName });
                });

                if (object.variants?.length === 1) {
                    if (!isEdit) {
                        object.variant = {
                            name: object.variants[0].label,
                            uniqueName: object.variants[0].value
                        };

                        if (loadRecipe) {
                            this.getVariantRecipe();
                        } else if (isRawStock) {
                            this.getRateForStock(object, index);
                        }
                    }
                } else {
                    if (!isEdit) {
                        object.variant = {
                            name: "",
                            uniqueName: ""
                        };
                    }
                }
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Get variant recipe
     *
     * @memberof CreateManufacturingComponent
     */
    public getVariantRecipe(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = [];
        this.manufacturingObject.manufacturingDetails[0].byProducts = [];
        this.manufacturingService.getVariantRecipe(this.manufacturingObject.manufacturingDetails[0].stockUniqueName, [this.manufacturingObject.manufacturingDetails[0].variant.uniqueName], true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                this.recipeExists = true;
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitCode = response.body.manufacturingDetails[0].manufacturingUnitCode;
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitUniqueName = response.body.manufacturingDetails[0].manufacturingUnitUniqueName;
                this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf = response.body.manufacturingDetails[0].manufacturingQuantity;
                this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity = response.body.manufacturingDetails[0].manufacturingQuantity;

                response.body.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                    let amount = linkedStock.rate * linkedStock.quantity;
                    let unitsList = [];
                    linkedStock?.stockUnits?.forEach(unit => {
                        unitsList.push({ label: unit.code, value: unit.uniqueName });
                    });

                    this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                        {
                            selectedStock: { label: linkedStock.stockName, value: linkedStock.stockUniqueName, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName, unitsList: unitsList } },
                            stockUniqueName: linkedStock.stockUniqueName,
                            quantity: linkedStock.quantity,
                            stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                            stockUnitCode: linkedStock.stockUnitCode,
                            rate: linkedStock.rate,
                            amount: isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces),
                            variant: linkedStock.variant
                        }
                    );
                });

                this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                    if (linkedStock.selectedStock.value) {
                        this.getStockVariants(linkedStock, { label: linkedStock.selectedStock.label, value: linkedStock.selectedStock.value, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName } }, false, 0, true);
                    }
                });

                this.manufacturingObject.manufacturingDetails[0].byProducts = [];
                if (!response.body.manufacturingDetails[0].byProducts?.length) {
                    this.manufacturingObject.manufacturingDetails[0].byProducts.push(
                        {
                            selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                            stockUniqueName: "",
                            quantity: 1,
                            stockUnitUniqueName: "",
                            stockUnitCode: "",
                            rate: 0,
                            amount: 0,
                            variant: { name: '', uniqueName: '' }
                        }
                    );
                } else {
                    response.body.manufacturingDetails[0].byProducts?.forEach(linkedStock => {
                        let amount = linkedStock.rate * linkedStock.quantity;

                        let unitsList = [];

                        linkedStock?.stockUnits?.forEach(unit => {
                            unitsList.push({ label: unit.code, value: unit.uniqueName });
                        });
                        this.manufacturingObject.manufacturingDetails[0].byProducts.push(
                            {
                                selectedStock: { label: linkedStock.stockName, value: linkedStock.stockUniqueName, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName, unitsList: unitsList } },
                                stockUniqueName: linkedStock.stockUniqueName,
                                quantity: linkedStock.quantity,
                                stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                                stockUnitCode: linkedStock.stockUnitCode,
                                rate: linkedStock.rate,
                                amount: isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces),
                                variant: linkedStock.variant
                            }
                        );
                    });

                    this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(linkedStock => {
                        if (linkedStock.selectedStock.value) {
                            this.getStockVariants(linkedStock, { label: linkedStock.selectedStock.label, value: linkedStock.selectedStock.value, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName } }, false, 0, true);
                        }
                    });
                }
                this.existingRecipe = this.formatRecipeRequest();
            } else {
                this.recipeExists = false;
                this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                        stockUniqueName: "",
                        quantity: 1,
                        stockUnitUniqueName: "",
                        stockUnitCode: "",
                        rate: 0,
                        amount: 0,
                        variant: { name: '', uniqueName: '' }
                    }
                );
                this.manufacturingObject.manufacturingDetails[0].byProducts.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                        stockUniqueName: "",
                        quantity: 1,
                        stockUnitUniqueName: "",
                        stockUnitCode: "",
                        rate: 0,
                        amount: 0,
                        variant: { name: '', uniqueName: '' },
                    }
                );

                this.showBorder(this.manufacturingObject.manufacturingDetails[0].linkedStocks[0]);
                this.showBorder(this.manufacturingObject.manufacturingDetails[0].byProducts[0]);
            }
            if (!this.manufactureUniqueName) {
                this.initialLinkedStocks = cloneDeep(this.manufacturingObject.manufacturingDetails[0].linkedStocks);
                this.initialByProductLinkedStocks = cloneDeep(this.manufacturingObject.manufacturingDetails[0].byProducts);
            }

            this.isByProductExpanded = this.manufacturingObject.manufacturingDetails[0].byProducts[0]
                ?.variant.uniqueName ? true : false;
            this.isOtherExpenseExpanded = this.manufacturingObject.manufacturingDetails[0].otherExpenses[0]
                .baseAccount.uniqueName
                ? true
                : false
            this.preventStocksApiCall = false;
            this.preventByProductStocksApiCall = false;
            if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks.length) {
                this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                        stockUniqueName: "",
                        quantity: 1,
                        stockUnitUniqueName: "",
                        stockUnitCode: "",
                        rate: 0,
                        amount: 0,
                        variant: { name: '', uniqueName: '' }
                    }
                );
            }
            if (!this.manufacturingObject.manufacturingDetails[0].byProducts.length) {
                this.manufacturingObject.manufacturingDetails[0].byProducts.push(
                    {
                        selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                        stockUniqueName: "",
                        quantity: 1,
                        stockUnitUniqueName: "",
                        stockUnitCode: "",
                        rate: 0,
                        amount: 0,
                        variant: { name: '', uniqueName: '' },
                    }
                );
            }
            this.getStocks(this.manufacturingObject.manufacturingDetails[0].linkedStocks[0], 1, '', this.selectedInventoryType);
            this.getAllStocks(this.manufacturingObject.manufacturingDetails[0].byProducts[0], 1, '');
            this.calculateTotals();
        });
    }

    /**
     * Get rate for stock
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public getRateForStock(linkedStock: any, index: number): void {
        this.manufacturingService.getRateForStockV2(linkedStock.stockUniqueName, { quantity: 1, stockUnitUniqueName: (linkedStock?.stockUnitUniqueName || linkedStock.selectedStock?.additional?.stockUnitUniqueName), variant: { uniqueName: linkedStock.variant.uniqueName } }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response.body) {
                linkedStock.quantity = 1;
                linkedStock.rate = response.body.rate;

                if (!linkedStock.stockUnitUniqueName) {
                    linkedStock.stockUnitCode = linkedStock.selectedStock?.additional?.stockUnitCode;
                    linkedStock.stockUnitUniqueName = linkedStock.selectedStock?.additional?.stockUnitUniqueName;
                }

                let amount = linkedStock.rate * linkedStock.quantity;
                linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
            }
            this.checkLinkedStockValidation(index);
            if (this.activeLinkedStockIndex === null) {
                this.hideBorder('linkedStock', linkedStock);
            }

            if (this.activeByProductLinkedStockIndex === null) {
                this.hideBorder('byProductLinkedStock', linkedStock);
            }

            this.calculateTotals();
        });
    }

    /**
     * Removes the unnecessary keys
     *
     * @returns {*}
     * @memberof CreateManufacturingComponent
     */
    public formatRequest(): any {
        let manufacturingObject = cloneDeep(this.manufacturingObject);
        delete manufacturingObject.manufacturingDetails[0].stocks;
        delete manufacturingObject.manufacturingDetails[0].stocksPageNumber
        delete manufacturingObject.manufacturingDetails[0].stocksTotalPages
        delete manufacturingObject.manufacturingDetails[0].stocksQ
        delete manufacturingObject.manufacturingDetails[0].variants;
        delete manufacturingObject.manufacturingDetails[0].manufacturingUnitCode;
        delete manufacturingObject.manufacturingDetails[0].manufacturingUnitUniqueName;

        if (manufacturingObject.manufacturingDetails[0].date) {
            manufacturingObject.manufacturingDetails[0].date = (typeof manufacturingObject.manufacturingDetails[0].date === "object") ? dayjs(manufacturingObject.manufacturingDetails[0].date).format(GIDDH_DATE_FORMAT) : dayjs(manufacturingObject.manufacturingDetails[0].date, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        }

        manufacturingObject.manufacturingDetails[0].increaseAssetValue = this.increaseExpenseAmount;
        let filteredData = manufacturingObject.manufacturingDetails[0].otherExpenses.filter(expense => expense.baseAccount.defaultName !== '');
        if (filteredData.length) {
            manufacturingObject.manufacturingDetails[0].otherExpenses = filteredData;
        } else {
            manufacturingObject.manufacturingDetails[0].otherExpenses = []
        }
        manufacturingObject.manufacturingDetails[0].linkedStocks = manufacturingObject.manufacturingDetails[0].linkedStocks?.filter(linkedStock => linkedStock?.variant?.uniqueName);
        manufacturingObject.manufacturingDetails[0].byProducts = manufacturingObject.manufacturingDetails[0].byProducts?.filter(linkedStock => linkedStock?.variant?.uniqueName);
        manufacturingObject.manufacturingDetails[0].linkedStocks?.map(linkedStock => {
            delete linkedStock.stocks;
            delete linkedStock.stocksPageNumber;
            delete linkedStock.stocksTotalPages;
            delete linkedStock.stocksQ;
            delete linkedStock.stockUnitCode;
            delete linkedStock.variants;
            delete linkedStock.selectedStock;
            delete linkedStock.cssClass;
            return linkedStock;
        });
        manufacturingObject.manufacturingDetails[0].byProducts?.map(linkedStock => {
            delete linkedStock.stocks;
            delete linkedStock.stocksPageNumber;
            delete linkedStock.stocksTotalPages;
            delete linkedStock.stocksQ;
            delete linkedStock.stockUnitCode;
            delete linkedStock.variants;
            delete linkedStock.selectedStock;
            delete linkedStock.cssClass;
            return linkedStock;
        });
        return manufacturingObject;
    }

    /**
     * Creates recipe request
     *
     * @returns {*}
     * @memberof CreateManufacturingComponent
     */
    public formatRecipeRequest(): any {
        let recipeObject = { manufacturingDetails: [] };

        this.manufacturingObject.manufacturingDetails?.forEach(manufacturingDetail => {
            let linkedStocks = [];
            let byProducts = [];

            manufacturingDetail.linkedStocks?.forEach(linkedStock => {
                linkedStocks.push({
                    stockUniqueName: linkedStock.stockUniqueName,
                    stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                    quantity: Number(linkedStock.quantity),
                    variant: {
                        uniqueName: linkedStock.variant?.uniqueName
                    }
                });
            });

            manufacturingDetail.byProducts?.forEach(linkedStock => {
                if (linkedStock.selectedStock.value) {
                    byProducts.push({
                        stockUniqueName: linkedStock.stockUniqueName,
                        stockUnitUniqueName: linkedStock.stockUnitUniqueName,
                        quantity: Number(linkedStock.quantity),
                        variant: {
                            uniqueName: linkedStock.variant?.uniqueName
                        }
                    });
                }
            });

            recipeObject.manufacturingDetails.push({
                manufacturingQuantity: Number(manufacturingDetail.manufacturingQuantity),
                manufacturingUnitUniqueName: manufacturingDetail.manufacturingUnitUniqueName,
                variant: {
                    uniqueName: manufacturingDetail.variant.uniqueName
                },
                linkedStocks: linkedStocks,
                byProducts: byProducts
            });
        });


        return recipeObject;
    }

    /**
     * Save manufacturing
     *
     * @returns {void}
     * @memberof CreateManufacturingComponent
     */
    public createManufacturing(): void {
        const isFormValid = this.isFormValid();
        if (!isFormValid) {
            return;
        }
        this.isLoading = true;
        const manufacturingObject = this.formatRequest();
        const recipeObject = this.formatRecipeRequest();
        if (this.recipeExists) {
            if (!isEqual(this.existingRecipe, recipeObject)) {
                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                        title: this.commonLocaleData?.app_confirmation,
                        body: this.localeData?.confirm_update_recipe,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no
                    }
                });

                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    if (response) {
                        this.saveRecipe(manufacturingObject, recipeObject);
                    }
                });
            }
        } else {
            let dialogRef = this.dialog.open(ConfirmModalComponent, {
                width: '585px',
                data: {
                    title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_save_recipe,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response) {
                    this.saveRecipe(manufacturingObject, recipeObject);
                }
            });
        }
        this.manufacturingService.saveManufacturing(manufacturingObject.manufacturingDetails[0].stockUniqueName, manufacturingObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.manufacturing_saved);
                this.resetForm();
            } else {
                this.toasterService.showSnackBar("error", response?.body || response?.message);
            }
            this.isLoading = false;

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Save recipe
     *
     * @private
     * @param {*} manufacturingObject
     * @param {*} recipeObject
     * @memberof CreateManufacturingComponent
     */
    private saveRecipe(manufacturingObject: any, recipeObject: any): void {
        this.manufacturingService.saveRecipe(manufacturingObject.manufacturingDetails[0].stockUniqueName, recipeObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.recipe_saved);

                if (this.manufactureUniqueName) {
                    this.redirectToReport();
                }
            } else {
                this.toasterService.showSnackBar("error", response?.body || response?.message);
            }
        });
    }

    /**
     * Gets profile information
     *
     * @private
     * @memberof CreateManufacturingComponent
     */
    private getProfile(): void {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /**
     * Add new linked stock row
     *
     * @memberof CreateManufacturingComponent
     */
    public addNewLinkedStock(): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks.push(
            {
                selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                stockUniqueName: "",
                quantity: 1,
                stockUnitUniqueName: "",
                stockUnitCode: "",
                rate: 0,
                amount: 0,
                variant: { name: '', uniqueName: '' }
            }
        );
        this.preventStocksApiCall = false;
        this.getStocks(this.manufacturingObject.manufacturingDetails[0].linkedStocks[(this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length - 1)], 1, '', this.selectedInventoryType);
    }

    /**
 * Add new linked stock row
 *
 * @memberof CreateManufacturingComponent
 */
    public addNewByProductsLinkedStock(): void {
        this.manufacturingObject.manufacturingDetails[0].byProducts.push(
            {
                selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                stockUniqueName: "",
                quantity: 1,
                stockUnitUniqueName: "",
                stockUnitCode: "",
                rate: 0,
                amount: 0,
                variant: { name: '', uniqueName: '' }
            }
        );
        this.preventByProductStocksApiCall = false;
        this.getAllStocks(this.manufacturingObject.manufacturingDetails[0].byProducts[(this.manufacturingObject.manufacturingDetails[0].byProducts?.length - 1)], 1, '');
    }

    /**
     * This will use for initialization manufacturing other expense object
     *
     * @memberof CreateManufacturingComponent
     */
    public initializeOtherExpenseObj() {
        this.manufacturingObject.manufacturingDetails[0].otherExpenses.push(
            {
                baseAccount: {
                    uniqueName: '',
                    defaultName: ''
                },
                transactions: [
                    {
                        account: {
                            uniqueName: '',
                            defaultName: ''
                        },
                        amount: 0
                    }
                ],
            }
        );
    }

    /**
     * This will be use for load expense accounts list
     *
     * @memberof CreateManufacturingComponent
     */
    public loadExpenseAccounts(): void {
        this.onExpenseAccountSearchQueryChanged('');
    }

    /**
     * This will be use for load assets libialities accounts list
     *
     * @memberof CreateManufacturingComponent
     */
    public loadAssetsLiabilitiesAccounts(): void {
        this.onLiabilitiesAssetAccountSearchQueryChanged('', 1, (response) => {
            this.defaultLiabilitiesAssetAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name + ' (' + result?.uniqueName + ')'
                }
            }) || [];
            this.defaultLiabilitiesAssetAccountPaginationData.page = this.liabilitiesAssetAccountsSearchResultsPaginationData.page;
            this.defaultLiabilitiesAssetAccountPaginationData.totalPages = this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages;
        });
    }
    /**
     * This will be use for add expense item
     *
     * @memberof CreateManufacturingComponent
     */
    public addExpense(): void {
        this.initializeOtherExpenseObj();
        this.loadAssetsLiabilitiesAccounts();
        this.loadExpenseAccounts();
    }
    /**
     * This will be use for remove expense item
     *
     * @param {number} index
     * @memberof CreateManufacturingComponent
     */
    public removeExpenseItem(index: number) {
        if (this.manufacturingObject.manufacturingDetails[0].otherExpenses.length === 1) {
            this.manufacturingObject.manufacturingDetails[0].otherExpenses = [
                {
                    baseAccount: {
                        uniqueName: '',
                        defaultName: ''
                    },
                    transactions: [
                        {
                            account: {
                                uniqueName: '',
                                defaultName: ''
                            },
                            amount: 0
                        }
                    ],
                }
            ]
        } else {
            this.manufacturingObject.manufacturingDetails[0].otherExpenses = this.manufacturingObject.manufacturingDetails[0].otherExpenses?.filter((expense, i) => i !== index);
        }
        this.calculateTotals();
    }

    /**
     * Remove linked stock row
     *
     * @param {number} index
     * @memberof CreateManufacturingComponent
     */
    public removeLinkedStock(index: number): void {
        this.manufacturingObject.manufacturingDetails[0].linkedStocks = this.manufacturingObject.manufacturingDetails[0].linkedStocks?.filter((linkedStock, i) => i !== index);
        this.calculateTotals();
    }

    /**
    * Remove by product linked stock row
    *
    * @param {number} index
    * @memberof CreateManufacturingComponent
    */
    public removeByProductLinkedStock(index: number): void {
        if (this.manufacturingObject.manufacturingDetails[0].byProducts.length === 1) {
            this.manufacturingObject.manufacturingDetails[0].byProducts = [
                {
                    selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                    stockUniqueName: "",
                    quantity: 1,
                    stockUnitUniqueName: "",
                    stockUnitCode: "",
                    rate: 0,
                    amount: 0,
                    variant: { name: '', uniqueName: '' }
                }
            ]
        } else {
            this.manufacturingObject.manufacturingDetails[0].byProducts = this.manufacturingObject.manufacturingDetails[0].byProducts?.filter((byProductLinkedStock, i) => i !== index);
        }
        this.calculateTotals();
    }

    /**
     * Calculates row total for linked stock
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public calculateRowTotal(linkedStock: any): void {
        let amount = linkedStock.rate * linkedStock.quantity;
        linkedStock.amount = isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces);
        this.calculateTotals();
    }

    /**
     * This will be use for calculating the expense row totals
     *
     * @memberof CreateManufacturingComponent
     */
    public calculateExpenseRowTotal(expense: any): void {
        this.calculateTotals();
    }


    /**
     * Calculates grand total
     *
     * @memberof CreateManufacturingComponent
     */
    public calculateTotals(): void {
        let totalRate = 0;
        let totalAmount = 0;
        let expenseAmount = 0;
        let totalStockAmount = 0;
        let totalStockQuantity = 0;
        this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
            totalRate += Number(linkedStock.rate) || 0;
            totalAmount += Number(linkedStock.amount) || 0;
            totalStockAmount += Number(linkedStock.amount) || 0;
        });

        this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(byProductLinkedStock => {
            totalStockQuantity += Number(byProductLinkedStock.quantity) || 0;
        });

        this.manufacturingObject.manufacturingDetails[0].otherExpenses?.forEach(expense => {
            expense.transactions.forEach(res => {
                expenseAmount += Number(res.amount) || 0;
            });
        });

        if (this.increaseExpenseAmount) {
            let updatedAmount = giddhRoundOff(((totalAmount + expenseAmount) / this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity), this.giddhBalanceDecimalPlaces);
            this.totals.costPerItem = updatedAmount;
        } else {
            let updatedAmount = giddhRoundOff((totalAmount / this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity), this.giddhBalanceDecimalPlaces);
            this.totals.costPerItem = updatedAmount;

        }
        this.totals.totalStockAmount = totalStockAmount
        this.totals.totalRate = totalRate;
        this.totals.totalAmount = totalAmount + expenseAmount;
        this.totals.expensePerItem = expenseAmount;
        this.totals.totalStockQuantity = totalStockQuantity;
        this.changeDetectionRef.detectChanges();
    }

    public toggleExpenseSetting(event: Event) {
        this.calculateTotals();
    }

    /**
     * Resets form
     *
     * @memberof CreateManufacturingComponent
     */
    public resetForm(): void {
        this.manufacturingObject = new CreateManufacturing();
        this.initializeOtherExpenseObj();
        this.manufacturingObject.manufacturingDetails[0].date = cloneDeep(this.universalDate);
        this.increaseExpenseAmount = true;
        this.initialLinkedStocks = [];
        this.initialByProductLinkedStocks = [];
        this.selectedWarehouseName = (this.warehouses?.length) ? this.warehouses[0].label : "";
        this.selectedInventoryType = "";
        this.preventStocksApiCall = false;
        this.preventByProductStocksApiCall = false;
        this.errorFields = { date: false, finishedStockName: false, finishedStockVariant: false, finishedQuantity: false };

        this.calculateTotals();
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Show border around linked fields on hover in
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public showBorder(dataType: any): void {
        if (!this.isCompany) {
            dataType.cssClass = 'form-control mat-field-border';
        }
    }

    /**
     * Hide border around linked fields on hover out
     *
     * @param {*} linkedStock
     * @memberof CreateManufacturingComponent
     */
    public hideBorder(type: any, dataType: any): void {
        if (type === 'linkedStock') {
            if (!dataType?.variant?.uniqueName && !this.isCompany) {
                dataType.cssClass = 'form-control mat-field-border';
            } else {
                dataType.cssClass = 'form-control';
            }
        }
        if (type === 'expense') {
            if (!dataType?.baseAccount?.uniqueName && !this.isCompany) {
                dataType.cssClass = 'form-control mat-field-border';
            } else {
                dataType.cssClass = 'form-control';
            }
        }
        if (type === 'byProductLinkedStock') {
            if (!dataType?.baseAccount?.uniqueName && !this.isCompany) {
                dataType.cssClass = 'form-control mat-field-border';
            } else {
                dataType.cssClass = 'form-control';
            }
        }
    }

    public hideByProductLinkedStockBorder(expense: any): void {
        if (!expense.baseAccount.uniqueName && !this.isCompany) {
            expense.cssClass = 'form-control mat-field-border';
        } else {
            expense.cssClass = 'form-control';
        }
    }

    public showByProductLinkedStockBorder(expense: any): void {
        if (!this.isCompany) {
            expense.cssClass = 'form-control mat-field-border';
        }
    }
    public hideExpenseBorder(expense: any): void {
        if (!expense.baseAccount.uniqueName && !this.isCompany) {
            expense.cssClass = 'form-control mat-field-border';
        } else {
            expense.cssClass = 'form-control';
        }
    }

    public showExpenseBorder(expense: any): void {
        if (!this.isCompany) {
            expense.cssClass = 'form-control mat-field-border';
        }
    }

    /**
     * Validates form
     *
     * @returns {boolean}
     * @memberof CreateManufacturingComponent
     */
    public isFormValid(): boolean {
        let isValidForm = true;
        if (!this.manufacturingObject.manufacturingDetails[0].date) {
            this.errorFields.date = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].stockUniqueName) {
            this.errorFields.finishedStockName = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].variant?.uniqueName) {
            this.errorFields.finishedStockVariant = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity) {
            this.errorFields.finishedQuantity = true;
            isValidForm = false;
        }
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length) {
            isValidForm = false;
        }
        if (this.manufacturingObject.manufacturingDetails[0].linkedStocks?.length) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks.forEach(linkedStock => {
                if (!linkedStock?.selectedStock?.value) {
                    linkedStock.stockNameError = true;
                    isValidForm = false;
                }
                if (!linkedStock?.variant?.uniqueName) {
                    linkedStock.variantNameError = true;
                    isValidForm = false;
                }
                if (!linkedStock?.quantity) {
                    linkedStock.quantityError = true;
                    isValidForm = false;
                }
            });
        }
        return isValidForm;
    }

    /**
     * Validates linked stock fields
     *
     * @param {number} index
     * @memberof CreateManufacturingComponent
     */
    public checkLinkedStockValidation(index: number): void {
        this.validateSelectedStock(index);
        this.validateSelectedVariant(index);
        this.validateQuantity(index);
    }

    /**
     * Validates linked stock
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateSelectedStock(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex]?.selectedStock?.value) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].stockNameError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].stockNameError = false;
        }
    }

    /**
     * Validates linked variant
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateSelectedVariant(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variant?.uniqueName) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variantNameError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].variantNameError = false;
        }
    }

    /**
     * Validates linked quantity
     *
     * @param {number} linkedStockIndex
     * @memberof CreateManufacturingComponent
     */
    public validateQuantity(linkedStockIndex: number): void {
        if (!this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantity) {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantityError = true;
        } else {
            this.manufacturingObject.manufacturingDetails[0].linkedStocks[linkedStockIndex].quantityError = false;
        }
    }

    /**
     * Callback for scroll end event
     *
     * @param {*} stockObject
     * @memberof CreateManufacturingComponent
     */
    public stockScrollEnd(stockObject: any): void {
        stockObject.stocksPageNumber = stockObject.stocksPageNumber + 1;
        this.getStocks(stockObject, stockObject.stocksPageNumber, stockObject.stocksQ ?? '', this.selectedInventoryType);
    }

    /**
   * Callback for scroll by product stock end event
   *
   * @param {*} stockObject
   * @memberof CreateManufacturingComponent
   */
    public byProductStockScrollEnd(stockObject: any): void {
        stockObject.stocksPageNumber = stockObject.stocksPageNumber + 1;
        this.getAllStocks(stockObject, stockObject.stocksPageNumber, stockObject.stocksQ ?? '');
    }

    /**
     * Resets the stock list
     *
     * @param {*} stockObject
     * @param {string} [inventoryType]
     * @memberof CreateManufacturingComponent
     */
    public resetStocks(stockObject: any, inventoryType?: string, type?: any): void {
        stockObject.stocksQ = "";
        stockObject.stocksPageNumber = 1;
        stockObject.stocksTotalPages = 1;
        if (type === 'byProduct') {
            this.getAllStocks(stockObject, 1, "");
        } else {
            this.getStocks(stockObject, 1, "", inventoryType);
        }
    }

    /**
     * Get manufacturing details
     *
     * @param {string} uniqueName
     * @memberof CreateManufacturingComponent
     */
    public getManufacturingDetails(uniqueName: string): void {
        this.isLoadingManufacturing = true;
        this.changeDetectionRef.detectChanges();

        this.manufacturingService.getManufacturingDetails(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response.body) {
                this.manufacturingObject.manufacturingDetails[0].date = dayjs(response.body.date, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.manufacturingObject.manufacturingDetails[0].warehouseUniqueName = response.body.warehouse.uniqueName;
                this.selectedWarehouseName = response.body.warehouse.name;
                this.manufacturingObject.manufacturingDetails[0].manufacturingUnitCode = response.body.manufacturingUnitCode;
                this.manufacturingObject.manufacturingDetails[0].stockName = response.body.stockName;
                this.manufacturingObject.manufacturingDetails[0].stockUniqueName = response.body.stockUniqueName;
                this.manufacturingObject.manufacturingDetails[0].variants = [{ label: response.body?.variant?.name, value: response.body?.variant?.uniqueName }];
                this.manufacturingObject.manufacturingDetails[0].variant.name = response.body.variant.name;
                this.manufacturingObject.manufacturingDetails[0].variant.uniqueName = response.body.variant.uniqueName;
                this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity = Number(response.body.manufacturingQuantity);
                this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf = Number(response.body.manufacturingQuantity);
                this.increaseExpenseAmount = response.body.increaseAssetValue;

                this.selectedInventoryType = response.body.inventoryType;

                let linkedStocks = [];
                response.body.linkedStocks?.forEach(linkedStock => {
                    let amount = linkedStock.rate * linkedStock.manufacturingQuantity;

                    let unitsList = [];

                    linkedStock?.stockUnits?.forEach(unit => {
                        unitsList.push({ label: unit.code, value: unit.uniqueName });
                    });

                    linkedStocks.push({
                        selectedStock: { label: linkedStock.stockName, value: linkedStock.stockUniqueName, additional: { stockUnitCode: linkedStock.manufacturingUnitCode, stockUnitUniqueName: linkedStock.manufacturingUnitUniqueName, unitsList: unitsList } },
                        stockUniqueName: linkedStock.stockUniqueName,
                        quantity: linkedStock.manufacturingQuantity,
                        stockUnitUniqueName: linkedStock.manufacturingUnitUniqueName,
                        stockUnitCode: linkedStock.manufacturingUnitCode,
                        rate: linkedStock.rate,
                        amount: isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces),
                        variant: linkedStock.variant
                    });
                });

                this.manufacturingObject.manufacturingDetails[0].linkedStocks = cloneDeep(linkedStocks);
                this.initialLinkedStocks = cloneDeep(linkedStocks);
                this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkStocks => {
                    if (linkStocks.selectedStock.value) {
                        this.getStockVariants(linkStocks, { label: linkStocks.selectedStock.label, value: linkStocks.selectedStock.value, additional: { stockUnitCode: linkStocks.stockUnitCode, stockUnitUniqueName: linkStocks.stockUnitUniqueName } }, false, 0, true);
                    }
                });

                if (!response.body.byProducts.length) {
                    this.manufacturingObject.manufacturingDetails[0].byProducts = [];
                    this.manufacturingObject.manufacturingDetails[0].byProducts.push(
                        {
                            selectedStock: { label: "", value: "", additional: { stockUnitCode: "", stockUnitUniqueName: "", unitsList: [] } },
                            stockUniqueName: "",
                            quantity: 1,
                            stockUnitUniqueName: "",
                            stockUnitCode: "",
                            rate: 0,
                            amount: 0,
                            variant: { name: '', uniqueName: '' }
                        }
                    );

                } else {
                    let byProductLinkedStocks = [];
                    response.body.byProducts?.forEach(byProduct => {
                        let amount = byProduct.rate * byProduct.manufacturingQuantity;

                        let unitsList = [];

                        byProduct?.stockUnits?.forEach(unit => {
                            unitsList.push({ label: unit.code, value: unit.uniqueName });
                        });

                        byProductLinkedStocks.push({
                            selectedStock: { label: byProduct.stockName, value: byProduct.stockUniqueName, additional: { stockUnitCode: byProduct.manufacturingUnitCode, stockUnitUniqueName: byProduct.manufacturingUnitUniqueName, unitsList: unitsList } },
                            stockUniqueName: byProduct.stockUniqueName,
                            quantity: byProduct.manufacturingQuantity,
                            stockUnitUniqueName: byProduct.manufacturingUnitUniqueName,
                            stockUnitCode: byProduct.manufacturingUnitCode,
                            rate: byProduct.rate,
                            amount: isNaN(amount) ? 0 : giddhRoundOff(amount, this.giddhBalanceDecimalPlaces),
                            variant: byProduct.variant
                        });
                    });
                    this.manufacturingObject.manufacturingDetails[0].byProducts = byProductLinkedStocks;
                    this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(byProduct => {
                        if (byProduct.selectedStock.value) {
                            this.getStockVariants(byProduct, { label: byProduct.selectedStock.label, value: byProduct.selectedStock.value, additional: { stockUnitCode: byProduct.stockUnitCode, stockUnitUniqueName: byProduct.stockUnitUniqueName } }, false, 0, true);
                        }
                    });

                    this.initialByProductLinkedStocks = cloneDeep(byProductLinkedStocks);

                }

                let otherExpenses = [];
                response.body.otherExpenses?.forEach(responseItem => {
                    let transactions = [];
                    responseItem.transactions?.forEach(value => {
                        transactions.push({
                            account: {
                                defaultName: value.account.name,
                                uniqueName: value.account.uniqueName
                            },
                            amount: value.amount
                        });
                    });

                    otherExpenses.push({
                        baseAccount: {
                            uniqueName: responseItem.baseAccount?.uniqueName,
                            defaultName: responseItem.baseAccount?.name
                        },
                        transactions: transactions
                    });
                    if (this.activeOtherExpenseIndex === null) {
                        this.hideBorder('expense', responseItem);
                    }
                });

                if (response.body.otherExpenses.length) {
                    this.manufacturingObject.manufacturingDetails[0].otherExpenses = otherExpenses;
                }
                this.preventStocksApiCall = false;
                this.getStocks(this.manufacturingObject.manufacturingDetails[0].linkedStocks[0], 1, '', this.selectedInventoryType, (response: any) => {
                    if (response?.status === "success" && response.body?.results?.length) {
                        this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                            linkedStock.stocksPageNumber = 1;
                            linkedStock.stocksQ = '';
                            linkedStock.stocksTotalPages = response.body.totalPages;
                            linkedStock.stocks = [];
                            response?.body?.results?.forEach(stock => {
                                let unitsList = [];
                                stock?.stockUnits?.forEach(unit => {
                                    unitsList.push({ label: unit.code, value: unit.uniqueName });
                                });

                                linkedStock.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: unitsList } });
                            });
                        });
                    }
                    this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
                        this.getStockVariants(linkedStock, { label: linkedStock.selectedStock.label, value: linkedStock.selectedStock.value, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName } }, false, 0, true);
                    });
                });
                this.preventByProductStocksApiCall = false;
                this.getAllStocks(this.manufacturingObject.manufacturingDetails[0].byProducts[0], 1, '', (response: any) => {
                    if (response?.status === "success" && response.body?.results?.length) {
                        this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(byProducts => {
                            byProducts.stocksPageNumber = 1;
                            byProducts.stocksQ = '';
                            byProducts.stocksTotalPages = response.body.totalPages;
                            byProducts.stocks = [];
                            response?.body?.results?.forEach(stock => {
                                let unitsList = [];
                                stock?.stockUnits?.forEach(unit => {
                                    unitsList.push({ label: unit.code, value: unit.uniqueName });
                                });

                                byProducts.stocks.push({ label: stock?.name, value: stock?.uniqueName, additional: { stockUnitCode: stock?.stockUnits[0]?.code, stockUnitUniqueName: stock?.stockUnits[0]?.uniqueName, inventoryType: stock.inventoryType, unitsList: unitsList } });
                            });
                        });
                    }
                    this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(linkedStock => {
                        this.getStockVariants(linkedStock, { label: linkedStock.selectedStock.label, value: linkedStock.selectedStock.value, additional: { stockUnitCode: linkedStock.stockUnitCode, stockUnitUniqueName: linkedStock.stockUnitUniqueName } }, false, 0, true);
                    });
                });
                this.calculateTotals();
                this.manufacturingService.getVariantRecipe(this.manufacturingObject.manufacturingDetails[0].stockUniqueName, [this.manufacturingObject.manufacturingDetails[0].variant.uniqueName], true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success" && response?.body?.manufacturingDetails?.length) {
                        this.recipeExists = true;
                        this.existingRecipe = this.formatRecipeRequest();
                    } else {
                        this.recipeExists = false;
                    }
                });
                this.isLoadingManufacturing = false;
                this.isByProductExpanded = this.manufacturingObject.manufacturingDetails[0].byProducts[0]
                    ?.variant.uniqueName ? true : false;
                this.isOtherExpenseExpanded = this.manufacturingObject.manufacturingDetails[0].otherExpenses[0]
                    .baseAccount.uniqueName
                    ? true
                    : false
                this.changeDetectionRef.detectChanges();
            } else {
                this.isLoadingManufacturing = false;
                this.toasterService.showSnackBar("error", response.message);
                this.router.navigate(['/pages/inventory/v2/manufacturing/list']);
            }
        });
    }

    /**
     * Delete manufacturing
     *
     * @memberof CreateManufacturingComponent
     */
    public deleteManufacturing(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.confirm_delete_manufacturing,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.manufacturingService.deleteManufacturing(this.manufactureUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toasterService.showSnackBar("success", response.body);
                        this.router.navigate(['/pages/inventory/v2/manufacturing/list']);
                    } else {
                        this.toasterService.showSnackBar("error", response.message);
                    }
                });
            }
        });
    }

    /**
     * Updates manufacturing
     *
     * @returns {void}
     * @memberof CreateManufacturingComponent
     */
    public updateManufacturing(): void {
        const isFormValid = this.isFormValid();
        if (!isFormValid) {
            return;
        }

        this.readyToRedirect = false;
        this.isLoading = true;
        const manufacturingObject = this.formatRequest();
        const recipeObject = this.formatRecipeRequest();

        if (this.recipeExists) {
            if (!isEqual(this.existingRecipe, recipeObject)) {
                let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                        title: this.commonLocaleData?.app_confirmation,
                        body: this.localeData?.confirm_update_recipe,
                        ok: this.commonLocaleData?.app_yes,
                        cancel: this.commonLocaleData?.app_no
                    }
                });

                dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                    if (response) {
                        this.saveRecipe(manufacturingObject, recipeObject);
                    } else {
                        this.redirectToReport();
                    }
                });
            } else {
                this.redirectToReport();
            }
        } else {
            let dialogRef = this.dialog.open(ConfirmModalComponent, {
                width: '585px',
                data: {
                    title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.confirm_save_recipe,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
            });

            dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                if (response) {
                    this.saveRecipe(manufacturingObject, recipeObject);
                } else {
                    this.redirectToReport();
                }
            });
        }

        this.manufacturingService.updateManufacturing(this.manufactureUniqueName, manufacturingObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.manufacturing_updated);
                this.redirectToReport();
            } else {
                this.toasterService.showSnackBar("error", response?.body || response?.message);
                this.isLoading = false;
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Redirects to report page after success
     *
     * @memberof CreateManufacturingComponent
     */
    public redirectToReport(): void {
        if (this.readyToRedirect) {
            this.readyToRedirect = false;
            this.router.navigate(['/pages/inventory/v2/manufacturing/list']);
        } else {
            this.readyToRedirect = true;
        }
    }

    /**
     * Updates raw stock quantity if finished stock quantity changes
     *
     * @memberof CreateManufacturingComponent
     */
    public updateRawStocksQuantity(): void {
        const finishedStockQuantity = ((Number(this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity)) ? Number(this.manufacturingObject.manufacturingDetails[0].manufacturingQuantity) : 1) / this.manufacturingObject.manufacturingDetails[0].manufacturingMultipleOf;

        this.manufacturingObject.manufacturingDetails[0].linkedStocks?.forEach(linkedStock => {
            let selectedStock = this.initialLinkedStocks?.find(stock => stock.variant?.uniqueName === linkedStock.variant?.uniqueName);

            if (selectedStock) {
                linkedStock.quantity = giddhRoundOff(selectedStock.quantity * finishedStockQuantity, this.giddhBalanceDecimalPlaces);
                linkedStock.amount = giddhRoundOff(linkedStock.quantity * linkedStock.rate, this.giddhBalanceDecimalPlaces);
            }
        });

        this.manufacturingObject.manufacturingDetails[0].byProducts?.forEach(byProduct => {
            let selectedStock = this.initialByProductLinkedStocks?.find(stock => stock.variant?.uniqueName === byProduct.variant?.uniqueName);

            if (selectedStock) {
                byProduct.quantity = giddhRoundOff(selectedStock.quantity * finishedStockQuantity, this.giddhBalanceDecimalPlaces);
                byProduct.amount = giddhRoundOff(byProduct.quantity * byProduct.rate, this.giddhBalanceDecimalPlaces);
            }
        });
    }

    /**
     * This will be use for handle expense accounts scroll end
     *
     * @memberof CreateManufacturingComponent
     */
    public handleExpenseAccountScrollEnd(): void {
        if (this.expenseAccountsSearchResultsPaginationData.page < this.expenseAccountsSearchResultsPaginationData.totalPages) {
            this.onExpenseAccountSearchQueryChanged(
                this.expenseAccountsSearchResultsPaginationData.query,
                this.expenseAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.expenseAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name + ' (' + result?.uniqueName + ')'
                            }
                        }) || [];
                        this.defaultExpenseAccountSuggestions = this.defaultExpenseAccountSuggestions.concat(...results);
                        this.defaultExpenseAccountPaginationData.page = this.expenseAccountsSearchResultsPaginationData.page;
                        this.defaultExpenseAccountPaginationData.totalPages = this.expenseAccountsSearchResultsPaginationData.totalPages;
                        this.changeDetectionRef.detectChanges();
                    }
                });
        }
    }

    /**
     * This will be use for handle liability assets account scroll end
     *
     * @memberof CreateManufacturingComponent
     */
    public handleLiabilitiesAssetAccountScrollEnd(): void {
        if (this.defaultLiabilitiesAssetAccountPaginationData.page < this.defaultLiabilitiesAssetAccountPaginationData.totalPages) {
            this.onLiabilitiesAssetAccountSearchQueryChanged(
                this.defaultLiabilitiesAssetAccountPaginationData.query,
                this.defaultLiabilitiesAssetAccountPaginationData.page + 1,
                (response) => {
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
     * This will be use for on liabilies assets account search
     *
     * @param {string} query
     * @param {number} [page=1]
     * @param {Function} [successCallback]
     * @memberof CreateManufacturingComponent
     */
    public onLiabilitiesAssetAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.liabilitiesAssetAccountsSearchResultsPaginationData.query = query;
        if (!this.preventLiabilitiesAssetDefaultScrollApiCall &&
            (query || (this.defaultLiabilitiesAssetAccountSuggestions && this.defaultLiabilitiesAssetAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('noncurrentassets, currentassets, fixedassets, currentliabilities, noncurrentliabilities, shareholdersfunds')
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name + ' (' + result?.uniqueName + ')'
                        }
                    }) || [];
                    if (page === 1) {
                        this.liabilitiesAssetAccounts = searchResults;
                    } else {
                        this.liabilitiesAssetAccounts = [
                            ...this.liabilitiesAssetAccounts,
                            ...searchResults
                        ];
                    }
                    this.liabilitiesAssetAccounts = this.liabilitiesAssetAccounts;
                    this.liabilitiesAssetAccountsSearchResultsPaginationData.page = data.body.page;
                    this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultLiabilitiesAssetAccountPaginationData.page = this.liabilitiesAssetAccountsSearchResultsPaginationData.page;
                        this.defaultLiabilitiesAssetAccountPaginationData.totalPages = this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages;
                    }
                    this.changeDetectionRef.detectChanges();
                }
            });
        } else {
            this.liabilitiesAssetAccounts = [...this.defaultLiabilitiesAssetAccountSuggestions];
            this.liabilitiesAssetAccountsSearchResultsPaginationData.page = this.defaultLiabilitiesAssetAccountPaginationData.page;
            this.liabilitiesAssetAccountsSearchResultsPaginationData.totalPages = this.defaultLiabilitiesAssetAccountPaginationData.totalPages;
            this.preventLiabilitiesAssetDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventLiabilitiesAssetDefaultScrollApiCall = false;
                this.changeDetectionRef.detectChanges();
            }, 500);
        }
    }

    /**
     * This will be use for other expense account search results
     *
     * @param {string} query
     * @param {number} [page=1]
     * @param {Function} [successCallback]
     * @memberof CreateManufacturingComponent
     */
    public onExpenseAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.expenseAccountsSearchResultsPaginationData.query = query;
        if (!this.preventExpenseDefaultScrollApiCall &&
            (query || (this.defaultExpenseAccountSuggestions && this.defaultExpenseAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('operatingcost, indirectexpenses,revenuefromoperations,otherincome')
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name + ' (' + result?.uniqueName + ')'
                        }
                    }) || [];
                    if (page === 1) {
                        this.expenseAccounts = searchResults;
                    } else {
                        this.expenseAccounts = [
                            ...this.expenseAccounts,
                            ...searchResults
                        ];
                    }
                    this.expenseAccounts = this.expenseAccounts;
                    this.expenseAccountsSearchResultsPaginationData.page = data.body.page;
                    this.expenseAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultExpenseAccountPaginationData.page = this.expenseAccountsSearchResultsPaginationData.page;
                        this.defaultExpenseAccountPaginationData.totalPages = this.expenseAccountsSearchResultsPaginationData.totalPages;
                    }
                    this.changeDetectionRef.detectChanges();
                }
            });
        } else {
            this.expenseAccounts = [...this.defaultExpenseAccountSuggestions];
            this.expenseAccountsSearchResultsPaginationData.page = this.defaultExpenseAccountPaginationData.page;
            this.expenseAccountsSearchResultsPaginationData.totalPages = this.defaultExpenseAccountPaginationData.totalPages;
            this.preventExpenseDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventExpenseDefaultScrollApiCall = false;
                this.changeDetectionRef.detectChanges();
            }, 500);
        }
    }
}
