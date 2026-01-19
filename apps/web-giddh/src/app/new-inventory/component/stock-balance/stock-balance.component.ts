import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { combineLatest, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";
import { PAGINATION_LIMIT, PAGE_SIZE_OPTIONS, IOption } from '../../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { AppState } from '../../../store';
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { StockGroupHelper } from '../../../shared/helpers/stock-group.helper';
import { GroupStockReportRequest } from "../../../models/api-models/Inventory";
import { SettingsFinancialYearActions } from "../../../actions/settings/financial-year/financial-year.action";
import { GeneralService } from "../../../services/general.service";
import { ToasterService } from "../../../services/toaster.service";
import { SelectFieldComponent } from "../../../theme/form-fields/select-field/select-field.component";
import { ServiceConfig } from "../../../services/service.config";
import { Configuration } from '../../../app.constant';
import { environment } from '../../../../environments/environment.generated';
import { cloneDeep, filter, forEach, includes, indexOf, map, remove } from '../../../lodash-optimized';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'stock-balance',
    templateUrl: './stock-balance.component.html',
    styleUrls: ['./stock-balance.component.scss'],
    standalone:false
})


/**
 * StockBalanceComponent component
 * Handles stockbalance functionality and user interactions
 */
export class StockBalanceComponent implements OnInit, OnDestroy {
    /**  Selector for warehouseInput1 input field */
    @ViewChild('warehouseInput1', { static: false }) warehouseInput1: ElementRef;
    /**  Selector for warehouseInput2 input field */
    @ViewChild('warehouseInput2', { static: false }) warehouseInput2: ElementRef;
    /** Open Account Selection Dropdown instance */
    @ViewChild('warehouseDropdown', { static: false }) public warehouseDropdown: SelectFieldComponent;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
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
    public voucherApiVersion: number;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(

        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig,
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
            /**
             * Handles if functionality
             */
            if (search) {
                warehousesClone = this.allWarehouses?.filter(branch => (branch.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.warehouses = warehousesClone;
        });
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.isLoading = true;
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.getStockUnits();
        this.getWarehouses();
        this.GroupStockReportRequest = new GroupStockReportRequest();
        document.querySelector('body').classList.add('stock-balance');

        /**
         * Handles combineLatest functionality
         */
        combineLatest([this.inventoryService.GetGroupsWithStocksFlatten(), this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.financialYearLimits))]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            /**
             * Handles if functionality
             */
            if (resp[0] && resp[1] && resp[2]) {
                this.isLoading = false;

                // Handle stock groups data
                /**
                 * Handles if functionality
                 */
                if (resp[0]?.status === "success") {
                    let stockGroups: IOption[] = [];
                    this.arrangeStockGroups(resp[0].body?.results, stockGroups);
                    this.stockGroups = stockGroups;
                }

                // Handle warehouses data
                this.warehouses = resp[1]?.results;
                this.allWarehouses = resp[1]?.results;
                let stockGroupUniqueName = resp[0]?.body?.results && resp[0]?.body?.results[0] ? resp[0]?.body?.results[0]?.uniqueName : null;
                let warehouseUniqueName = resp[1]?.results && resp[1]?.results[0] ? resp[1]?.results[0]?.uniqueName : null;
                let financialYearLimits = resp[2]?.startDate;
                /**
                 * Handles if functionality
                 */
                if (stockGroupUniqueName && warehouseUniqueName && financialYearLimits && !this.GroupStockReportRequest.from) {
                    this.GroupStockReportRequest.warehouseUniqueName = warehouseUniqueName;
                    this.GroupStockReportRequest.stockGroupUniqueName = stockGroupUniqueName;
                    this.GroupStockReportRequest.from = financialYearLimits;
                    this.GroupStockReportRequest.to = financialYearLimits;
                    /**
                     * Handles if functionality
                     */
                    if (!this.selectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
                        this.selectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
                    }
                    /**
                     * Handles if functionality
                     */
                    if (!this.allSelectedWarehouse.includes(this.GroupStockReportRequest.warehouseUniqueName)) {
                        this.allSelectedWarehouse.push(this.GroupStockReportRequest.warehouseUniqueName);
                    }
                    this.getStocks();
                }
            }
        });

        this.productNameSearching.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
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
        /**
         * Handles if functionality
         */
        if (!stock?.stock) {
            this.inventoryService.getStock(stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (response && response?.status === "success") {
                    stock.stock = response?.body;
                    stock.stockOriginal = cloneDeep(response?.body);
                    (Array.isArray(stock?.stock?.variants) ? stock?.stock?.variants : []).forEach(variant => {
                        (Array.isArray(this.warehouses) ? this.warehouses : []).forEach(warehouse => {
                            const warehouseFound = variant?.warehouseBalance?.filter(balance => balance?.warehouse?.uniqueName === warehouse?.uniqueName);
                            /**
                             * Handles if functionality
                             */
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
    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof StockBalanceComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.GroupStockReportRequest.page = this.GroupStockReportRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.GroupStockReportRequest.count = event.pageSize;
        this.getStocks();
    }



    /**
    * Get stock details
    *
    * @memberof StockBalanceComponent
    */
    public getStocks(): void {
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.stockGroupUniqueName && this.GroupStockReportRequest.warehouseUniqueName) {
            let groupStockReportRequest = cloneDeep(this.GroupStockReportRequest);
            delete groupStockReportRequest.warehouseUniqueName;
            this.inventoryService.GetGroupStocksReport_V3(groupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
                if (response && response.status === 'success') {
                    this.stocksList = response?.body?.stockReport;
                    this.stockGroupName = response?.body?.stockGroupName;
                    this.stocksList?.forEach(stock => {
                        stock.warehouses = [];
                        this.warehouses?.forEach(warehouse => {
                            stock.warehouses.push({ name: warehouse?.name, uniqueName: warehouse?.uniqueName });
                        });
                    });

                    (Array.isArray(this.allSelectedWarehouse) ? this.allSelectedWarehouse : []).forEach(warehouse => {
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
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (uniqueName) {
            this.GroupStockReportRequest.warehouseUniqueName = uniqueName;
            /**
             * Handles if functionality
             */
            if (this.GroupStockReportRequest.stockGroupUniqueName) {
                this.inventoryService.GetGroupStocksReport_V3(this.GroupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    /**
                     * Handles if functionality
                     */
                    if (response && response?.status === "success") {
                        let warehouseStocksList = response?.body?.stockReport;
                        /**
                         * Handles if functionality
                         */
                        if (warehouseStocksList?.length > 0) {
                            (Array.isArray(warehouseStocksList) ? warehouseStocksList : []).forEach(warehouseStock => {
                                const stockFound = this.stocksList?.filter(stock => stock?.stockUniqueName === warehouseStock?.stockUniqueName);
                                /**
                                 * Handles if functionality
                                 */
                                if (stockFound?.length > 0 && stockFound[0]) {
                                    /**
                                     * Handles if functionality
                                     */
                                    if (stockFound[0]?.warehouses?.length > 0) {
                                        const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse?.uniqueName === uniqueName);
                                        /**
                                         * Handles if functionality
                                         */
                                        if (warehouseFound?.length > 0 && warehouseFound[0]) {
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
        /**
         * Handles if functionality
         */
        if (uniqueName) {
            /**
             * Handles if functionality
             */
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
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.inventoryService.updateStock(stock?.stock, stock?.stock?.stockGroup?.uniqueName, stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles if functionality
             */
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
    * Arrange stock groups
    *
    * @private
    * @param {IGroupsWithStocksHierarchyMinItem[]} groups
    * @param {IOption[]} [parents=[]]
    * @memberof StockBalanceComponent
    */
    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        StockGroupHelper.arrangeStockGroups(groups, parents);
        this.cdr.detectChanges();
    }

    /**
     * This will use for focus on warehouse click
     *
     * @memberof StockBalanceComponent
     */
    public setInputFocus(event: any): void {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (event) {
            this.displayedColumns = event;
            /**
             * Handles if functionality
             */
            if (this.displayedColumns?.includes('unique_name')) {
                this.showUniqueName = true;
            } else {
                this.showUniqueName = false;
            }
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
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
