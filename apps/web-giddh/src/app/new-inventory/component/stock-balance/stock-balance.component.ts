import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { combineLatest, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";
import { AppState } from "../../../store";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { GroupStockReportRequest } from "../../../models/api-models/Inventory";
import { SettingsFinancialYearActions } from "../../../actions/settings/financial-year/financial-year.action";
import { GeneralService } from "../../../services/general.service";
import { ToasterService } from "../../../services/toaster.service";
import { SelectFieldComponent } from "../../../theme/form-fields/select-field/select-field.component";
@Component({
    selector: 'stock-balance',
    templateUrl: './stock-balance.component.html',
    styleUrls: ['./stock-balance.component.scss']
})


export class StockBalanceComponent implements OnInit, OnDestroy {
    /**  Selector for warehouseInput1 input field */
    @ViewChild('warehouseInput1', { static: false }) warehouseInput1: ElementRef;
    /**  Selector for warehouseInput2 input field */
    @ViewChild('warehouseInput2', { static: false }) warehouseInput2: ElementRef;
    /** Open Account Selection Dropdown instance */
    @ViewChild('warehouseDropdown', { static: false }) public warehouseDropdown: SelectFieldComponent;
    /** Image path variable */
    public imgPath: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock units list */
    public stockUnits: IOption[] = [];
    /** Holds stock unit name */
    public stockUnitName: string = "";
    /** Warehouse data for warehouse drop down */
    public warehouses: Array<any>;
    /** Stock groups list */
    public stockGroups: IOption[] = [];
    /** Holds stock group unique name */
    public stockGroupUniqueName: string = "";
    /** Holds stock group name */
    public stockGroupName: string = "";
    /** Hide/Show for unique name list */
    public showUniqueName: boolean = false;
    /** Hide/Show for group name list */
    public showGroupName: boolean = false;
    /** Hold group stock report request */
    public GroupStockReportRequest: GroupStockReportRequest;
    /** Hold stocks report */
    public stocksList: any[] = [];
    /** Hold stocks variants  */
    public stocksVariants: any[] = [];
    /** Thsi will use for searching for stock */
    public productNameSearching: UntypedFormControl = new UntypedFormControl();
    /** Hold warehouse checked  */
    public selectedWarehouse: any[] = [];
    /** Holded all selected warehouse checked  */
    public allSelectedWarehouse: any[] = [];
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if click on particular unit dropdown */
    public isOpen: boolean = false;
    /** This will use for instance of lwarehouses Dropdown */
    public warehousesDropdown: UntypedFormControl = new UntypedFormControl();
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** Hold module type */
    public moduleType = 'INVENTORY_WAREHOUSE_OPENING_BALANCE';
    /** This will use for stock balance column check values */
    public customiseColumns = [];
    /** This will use for stock balance displayed columns */
    public displayedColumns: any[] = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;

    constructor(

        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private generalService: GeneralService,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private toaster: ToasterService
    ) {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof StockBalanceComponent
    */
    public ngOnInit(): void {
        /** This will use for filter link purchase orders  */
        this.warehousesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let warehousesClone = cloneDeep(this.allWarehouses);
            if (search) {
                warehousesClone = this.allWarehouses?.filter(branch => (branch.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.warehouses = warehousesClone;
        });

        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.isLoading = true;
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.getStockUnits();
        this.getStockGroups();
        this.getWarehouses();
        this.GroupStockReportRequest = new GroupStockReportRequest();
        document.querySelector('body').classList.add('stock-balance');

        combineLatest([this.inventoryService.GetGroupsWithStocksFlatten(), this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.financialYearLimits))]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (resp[0] && resp[1] && resp[2]) {
                this.isLoading = false;
                this.warehouses = resp[1]?.results;
                this.allWarehouses = resp[1]?.results;
                let stockGroupUniqueName = resp[0]?.body?.results[0]?.uniqueName;
                let warehouseUniqueName = resp[1]?.results[0]?.uniqueName;
                let financialYearLimits = resp[2]?.startDate;
                if (stockGroupUniqueName && warehouseUniqueName && financialYearLimits && !this.GroupStockReportRequest.from) {
                    this.GroupStockReportRequest.warehouseUniqueName = warehouseUniqueName;
                    this.GroupStockReportRequest.stockGroupUniqueName = stockGroupUniqueName;
                    this.GroupStockReportRequest.from = financialYearLimits;
                    this.GroupStockReportRequest.to = financialYearLimits;
                    if (!this.selectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
                        this.selectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
                    }
                    if (!this.allSelectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
                        this.allSelectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
                    }
                    this.getStocks();
                }
            }
        });

        this.productNameSearching.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.GroupStockReportRequest.stockName = s;
            this.getStocks();
        });
        this.customiseColumns = [
            {
                "value": "unique_name",
                "label": "Unique Name",
                "checked": true
            },
            {
                "value": "stock_group",
                "label": "Stock Group",
                "checked": true
            }
        ];
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    /**
    * Get stock varients from stock unqiue name
    *
    * @param {string} uniquename
    * @memberof StockBalanceComponent
    */
    public getStockVariants(stock: any): void {
        if (!stock?.stock) {
            this.inventoryService.getStock(stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response?.status === "success") {
                    stock.stock = response?.body;
                    stock.stockOriginal = cloneDeep(response?.body);
                    stock?.stock?.variants.forEach(variant => {
                        this.warehouses.forEach(warehouse => {
                            const warehouseFound = variant?.warehouseBalance?.filter(balance => balance?.warehouse?.uniqueName === warehouse?.uniqueName);
                            if (!warehouseFound?.length) {
                                variant.warehouseBalance.push({
                                    openingAmount: 0, openingQuantity: 0, stockUnit: stock.stock.stockUnit, warehouse: { name: warehouse?.name, uniqueName: warehouse?.uniqueName }
                                });
                            }
                        });
                    });
                    stock.stock.stockUnitCode = response?.body?.stockUnit?.code;
                    stock.stock.stockUnitName = response?.body?.stockUnit?.name;
                    stock.stock.stockUnitUniqueName = response?.body?.stockUnit?.uniqueName;
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        }
    }

    /**
   * This function will change the page of activity logs
   *
   * @param {*} event
   * @memberof StockBalanceComponent
   */
    public pageChanged(event: any): void {
        if (this.GroupStockReportRequest.page !== event.page) {
            this.GroupStockReportRequest.page = event.page;
            this.getStocks();
        }
    }

    /**
    * Get stock details
    *
    * @memberof StockBalanceComponent
    */
    public getStocks(): void {
        if (this.GroupStockReportRequest.stockGroupUniqueName && this.GroupStockReportRequest.warehouseUniqueName) {
            let groupStockReportRequest = cloneDeep(this.GroupStockReportRequest);
            delete groupStockReportRequest.warehouseUniqueName;
            this.inventoryService.GetGroupStocksReport_V3(groupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.status === 'success') {
                    this.stocksList = response?.body?.stockReport;
                    this.stockGroupName = response?.body?.stockGroupName;
                    this.stocksList?.forEach(stock => {
                        stock.warehouses = [];
                        this.warehouses?.forEach(warehouse => {
                            stock.warehouses.push({ name: warehouse?.name, uniqueName: warehouse?.uniqueName });
                        });
                    });

                    this.allSelectedWarehouse.forEach(warehouse => {
                        this.calculationWarehouse(warehouse);
                    });
                    this.GroupStockReportRequest.page = response.body?.page;
                    this.GroupStockReportRequest.totalItems = response.body?.totalItems;
                    this.GroupStockReportRequest.totalPages = response.body?.totalPages;
                    this.GroupStockReportRequest.count = response.body?.count;
                } else {
                    groupStockReportRequest.totalItems = 0;
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        }
    }

    /**
    * Get warehouses
    *
    * @memberof StockBalanceComponent
    */
    public getWarehouses(): void {
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (!warehouses?.results?.length) {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            }
        });
    }

    /**
    * Get warehouse calculations by warehouse unique name
    *
    * @param {*} uniqueName
    * @memberof StockBalanceComponent
    */
    public calculationWarehouse(uniqueName: any): void {
        if (uniqueName) {
            this.GroupStockReportRequest.warehouseUniqueName = uniqueName;
            if (this.GroupStockReportRequest.stockGroupUniqueName) {
                this.inventoryService.GetGroupStocksReport_V3(this.GroupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response?.status === "success") {
                        let warehouseStocksList = response?.body?.stockReport;
                        if (warehouseStocksList?.length > 0) {
                            warehouseStocksList.forEach(warehouseStock => {
                                const stockFound = this.stocksList?.filter(stock => stock?.stockUniqueName === warehouseStock?.stockUniqueName);
                                if (stockFound?.length > 0) {
                                    if (stockFound[0]?.warehouses?.length > 0) {
                                        const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse?.uniqueName === uniqueName);
                                        if (warehouseFound?.length > 0) {
                                            warehouseFound[0].openingBalance = warehouseStock?.openingBalance;
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        }
    }

    /**
    * This function will use for update calculation by warehouse uniquename
    *
    * @memberof StockBalanceComponent
    */
    public updateCalculationWarehouse(uniqueName: any): void {
        if (uniqueName) {
            if (this.allSelectedWarehouse?.includes(uniqueName)) {
                this.allSelectedWarehouse = this.generalService.removeValueFromArray(this.allSelectedWarehouse, uniqueName);
            } else {
                this.allSelectedWarehouse.push(uniqueName);
            }
        }
    }

    /**
    * Callback for selection of group name
    *
    * @param {*} field
    * @memberof StockBalanceComponent
    */
    public selectGroupName(event: any): void {
        this.GroupStockReportRequest.stockGroupUniqueName = event?.value;
        this.getStocks();
    }

    /**
    * Update a stock according to warehouse
    *
    * @memberof StockBalanceComponent
    */
    public stockUpdate(stock: any, warehouse: any): void {
        stock.stock.stockUnitCode = stock?.stock?.stockUnit?.code;
        stock.stock.stockUnitName = stock?.stock?.stockUnit?.name;
        stock.stock.stockUnitUniqueName = stock?.stock?.stockUnit?.uniqueName;
        setTimeout(() => {
            this.inventoryService.updateStock(stock?.stock, stock?.stock?.stockGroup?.uniqueName, stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response?.status === "success") {
                    this.toaster.showSnackBar("success", "Stock updated successfully");
                    this.calculationWarehouse(warehouse?.warehouse?.uniqueName);
                    stock.stockOriginal = cloneDeep(stock?.stock);
                } else {
                    stock.stock = cloneDeep(stock?.stockOriginal);
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        }, 3000);
    }

    /**
    * Get stock units
    *
    * @memberof StockBalanceComponent
    */
    public getStockUnits(): void {
        this.inventoryService.GetStockUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response?.status === "success") {
                this.stockUnits = response?.body?.map(result => {
                    return {
                        value: result?.uniqueName,
                        label: result?.name + ` (${result?.code})`,
                        additional: result
                    };
                }) || [];
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
    * Get stock groups
    *
    * @memberof StockBalanceComponent
    */
    public getStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response?.status === "success") {
                let stockGroups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results, stockGroups);
                this.stockGroups = stockGroups;
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }

    /**
    * Arrange stock groups
    *
    * @private
    * @param {IGroupsWithStocksHierarchyMinItem[]} groups
    * @param {IOption[]} [parents=[]]
    * @memberof StockBalanceComponent
    */
    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        groups.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '', additional: {} };
                newOption.label = group?.name;
                newOption.value = group?.uniqueName;
                newOption.additional = group;
                parents.push(newOption);
                if (group?.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group?.childStockGroups, parents);
                }
            }
        });
    }

    /**
     * This will use for focus on warehouse click
     *
     * @memberof StockBalanceComponent
     */
    public setInputFocus(event: any): void {
        setTimeout(() => {
            if (event === 1) {
                this.warehouseInput1.nativeElement.focus();
                this.isOpen = false;
                this.warehouseDropdown?.closeDropdownPanel();
            } else if (event === 2) {
                this.warehouseInput2.nativeElement.focus();
                this.isOpen = false;
                this.warehouseDropdown?.closeDropdownPanel();
            } else if (event === 3) {
                this.isOpen = true;
                this.warehouseDropdown?.openDropdownPanel();
            }
            this.cdr.detectChanges();
        }, 20);
    }

    /**
     * This will use for show hide main table headers from customise columns
     *
     * @param {*} event
     * @memberof StockBalanceComponent
     */
    public showSelectedTableColumns(event: any): void {
        if (event) {
            this.displayedColumns = event;
            if (this.displayedColumns?.includes('unique_name')) {
                this.showUniqueName = true;
            } else {
                this.showUniqueName = false;
            }
            if (this.displayedColumns?.includes("stock_group")) {
                this.showGroupName = true;
            } else {
                this.showGroupName = false;
            }
        }
        this.cdr.detectChanges();
    }

    /**
    * This will use for translation complete
    *
    * @param {*} event
    * @memberof StockBalanceComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.customiseColumns = this.customiseColumns?.map(column => {
                column.label = this.localeData?.warehouse_opening_balance[column.value];
                return column;
            });
            this.cdr.detectChanges();
        }
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof StockBalanceComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('stock-balance');
    }
}
