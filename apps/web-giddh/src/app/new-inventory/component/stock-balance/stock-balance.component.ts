import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { combineLatest, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { InventoryService } from "../../../services/inventory.service";
import { PAGINATION_LIMIT, PAGE_SIZE_OPTIONS, IOption } from '../../../app.constant';
import { VoucherSelectedBatch } from "../../../models/interfaces/batch-report.interface";
import { StockOpeningBatchDialogComponent, StockOpeningBatchDialogResult } from "../stock-opening-batch-dialog/stock-opening-batch-dialog.component";
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppState } from '../../../store';
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { GroupStockReportRequest } from "../../../models/api-models/Inventory";
import { SettingsFinancialYearActions } from "../../../actions/settings/financial-year/financial-year.action";
import { GeneralService } from "../../../services/general.service";
import { ToasterService } from "../../../services/toaster.service";
import { ReactiveDropdownFieldComponent } from "../../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { ServiceConfig } from "../../../services/service.config";
import { cloneDeep } from '../../../lodash-optimized';
@Component({
    selector: 'stock-balance',
    templateUrl: './stock-balance.component.html',
    styleUrls: ['./stock-balance.component.scss'],
    standalone:false
})


export class StockBalanceComponent implements OnInit, OnDestroy {
    /** Unit dropdowns currently in edit mode. */
    @ViewChildren("warehouseDropdown") public warehouseDropdowns: QueryList<ReactiveDropdownFieldComponent>;
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
    public showUniqueName: boolean = true;
    /** Hide/Show for group name list */
    public showGroupName: boolean = true;
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
    /** Warehouse options for the multi-select dropdown. */
    public warehouseOptions: IOption[] = [];
    /** Flattened mat-table rows for stocks and expanded variants. */
    public tableRows: MatTableDataSource<any> = new MatTableDataSource([]);
    /** Mat-table column ids. */
    public tableDisplayedColumns: string[] = ["stock", "unique_name", "stock_group"];
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** True when the stock header search is open. */
    public showStockSearchInput: boolean = false;
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
    /** True when company has batch tracking enabled. */
    public batchTrackingEnabled: boolean = false;
    /** Company currency symbol for opening amount. */
    public companyCurrencySymbol: string = "";
    /** Amount mask format from company profile. */
    public inputMaskFormat: string = "";

    constructor(

        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private toaster: ToasterService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof StockBalanceComponent
    */
    public ngOnInit(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.isLoading = true;
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.getStockUnits();
        this.getWarehouses();
        this.GroupStockReportRequest = new GroupStockReportRequest();
        document.querySelector('body').classList.add('stock-balance');

        combineLatest([this.inventoryService.GetGroupsWithStocksFlatten(), this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.financialYearLimits))]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (resp[0] && resp[1] && resp[2]) {
                this.isLoading = false;

                // Handle stock groups data
                if (resp[0]?.status === "success") {
                    let stockGroups: IOption[] = [];
                    this.arrangeStockGroups(resp[0].body?.results, stockGroups);
                    this.stockGroups = stockGroups;
                }

                // Handle warehouses data
                this.warehouses = resp[1]?.results;
                this.allWarehouses = resp[1]?.results;
                this.warehouseOptions = (this.allWarehouses || []).map(warehouse => ({
                    label: warehouse?.name,
                    value: warehouse?.uniqueName
                }));
                let stockGroupUniqueName = resp[0]?.body?.results && resp[0]?.body?.results[0] ? resp[0]?.body?.results[0]?.uniqueName : null;
                let warehouseUniqueName = resp[1]?.results && resp[1]?.results[0] ? resp[1]?.results[0]?.uniqueName : null;
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
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.batchTrackingEnabled = !!activeCompany.batchTrackingEnabled;
            }
        });
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.companyCurrencySymbol = profile.baseCurrencySymbol;
                this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : "";
            }
        });
    }

    /**
    * Get stock varients from stock unqiue name
    *
    * @param {string} uniquename
    * @memberof StockBalanceComponent
    */
    public getStockVariants(stock: any): void {
        if (stock?.stock || stock?.variantsLoading) {
            return;
        }
        stock.variantsLoading = true;
        this.inventoryService.getStock(stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            stock.variantsLoading = false;
            if (response && response?.status === "success") {
                    stock.stock = response?.body;
                    stock.stockOriginal = cloneDeep(response?.body);
                    (Array.isArray(stock?.stock?.variants) ? stock?.stock?.variants : []).forEach(variant => {
                        if (!Array.isArray(variant.warehouseBalance)) {
                            variant.warehouseBalance = [];
                        }
                        variant.warehouseBalance.forEach(balance => {
                            balance.batches = this.normalizeWarehouseBatches(balance.batches);
                        });
                        (Array.isArray(this.allWarehouses) ? this.allWarehouses : []).forEach(warehouse => {
                            const warehouseFound = variant?.warehouseBalance?.filter(balance => balance?.warehouse?.uniqueName === warehouse?.uniqueName);
                            if (!warehouseFound?.length) {
                                variant.warehouseBalance.push({
                                    openingAmount: 0,
                                    openingQuantity: 0,
                                    stockUnit: stock.stock.stockUnit,
                                    warehouse: { name: warehouse?.name, uniqueName: warehouse?.uniqueName },
                                    batches: []
                                });
                            }
                        });
                    });
                    stock.stock.stockUnitCode = response?.body?.stockUnit?.code;
                    stock.stock.stockUnitName = response?.body?.stockUnit?.name;
                    stock.stock.stockUnitUniqueName = response?.body?.stockUnit?.uniqueName;
                    this.refreshTableRows();
                    this.cdr.detectChanges();
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
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
        if (this.GroupStockReportRequest.stockGroupUniqueName && this.GroupStockReportRequest.warehouseUniqueName) {
            let groupStockReportRequest = cloneDeep(this.GroupStockReportRequest);
            delete groupStockReportRequest.warehouseUniqueName;
            this.inventoryService.GetGroupStocksReport_V3(groupStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.status === 'success') {
                    this.stocksList = response?.body?.stockReport;
                    this.stockGroupName = response?.body?.stockGroupName;
                    this.stocksList?.forEach(stock => {
                        stock.warehouses = [];
                        this.allWarehouses?.forEach(warehouse => {
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
                    this.updateTableDisplayedColumns();
                    this.refreshTableRows();
                    this.cdr.detectChanges();
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
                            (Array.isArray(warehouseStocksList) ? warehouseStocksList : []).forEach(warehouseStock => {
                                const stockFound = this.stocksList?.filter(stock => stock?.stockUniqueName === warehouseStock?.stockUniqueName);
                                if (stockFound?.length > 0 && stockFound[0]) {
                                    if (stockFound[0]?.warehouses?.length > 0) {
                                        const warehouseFound = stockFound[0]?.warehouses?.filter(warehouse => warehouse?.uniqueName === uniqueName);
                                        if (warehouseFound?.length > 0 && warehouseFound[0]) {
                                            warehouseFound[0].openingBalance = warehouseStock?.openingBalance;
                                            warehouseFound[0].batchCount = warehouseStock?.batchCount;
                                            warehouseFound[0].batch = warehouseStock?.batch;
                                            warehouseFound[0].batchName = warehouseStock?.batchName;
                                        }
                                    }
                                }
                            });
                        }
                        this.cdr.detectChanges();
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        }
    }

    /**
     * Apply warehouse multi-select changes and load newly selected warehouse balances.
     *
     * @param {Array<string | number>} values
     * @memberof StockBalanceComponent
     */
    public onWarehouseSelectionChange(values: Array<string | number>): void {
        const nextSelected = (values || []).map(value => String(value));
        const added = nextSelected.filter(uniqueName => !this.allSelectedWarehouse.includes(uniqueName));
        this.selectedWarehouse = nextSelected;
        this.allSelectedWarehouse = [...nextSelected];
        added.forEach(uniqueName => this.calculationWarehouse(uniqueName));
        this.updateTableDisplayedColumns();
        this.cdr.detectChanges();
    }

    /**
     * Visible warehouse columns for the mat-table.
     *
     * @readonly
     * @type {any[]}
     * @memberof StockBalanceComponent
     */
    public get visibleWarehouses(): any[] {
        return (this.allWarehouses || []).filter(warehouse => this.selectedWarehouse?.includes(warehouse?.uniqueName));
    }

    /**
     * Rebuild mat-table column ids from visible warehouses and customise columns.
     *
     * @private
     * @memberof StockBalanceComponent
     */
    private updateTableDisplayedColumns(): void {
        const columns = ["stock"];
        if (this.showUniqueName) {
            columns.push("unique_name");
        }
        if (this.showGroupName) {
            columns.push("stock_group");
        }
        this.visibleWarehouses.forEach(warehouse => {
            columns.push(this.getWarehouseColumn(warehouse.uniqueName));
        });
        this.tableDisplayedColumns = columns;
    }

    /**
     * Warehouse column id for mat-table.
     *
     * @param {string} uniqueName
     * @return {*}  {string}
     * @memberof StockBalanceComponent
     */
    public getWarehouseColumn(uniqueName: string): string {
        return "wh_" + uniqueName;
    }

    /**
     * Collapsed stock warehouse cell.
     *
     * @param {*} stock
     * @param {string} warehouseUniqueName
     * @return {*}  {*}
     * @memberof StockBalanceComponent
     */
    public getStockWarehouse(stock: any, warehouseUniqueName: string): any {
        return (stock?.warehouses || []).find(warehouse => warehouse?.uniqueName === warehouseUniqueName);
    }

    /**
     * Expanded variant warehouse cell.
     *
     * @param {*} variant
     * @param {string} warehouseUniqueName
     * @return {*}  {*}
     * @memberof StockBalanceComponent
     */
    public getVariantWarehouse(variant: any, warehouseUniqueName: string): any {
        return (variant?.warehouseBalance || []).find(balance => balance?.warehouse?.uniqueName === warehouseUniqueName);
    }

    /**
     * Expand or collapse a stock row and load variants.
     *
     * @param {*} stock
     * @memberof StockBalanceComponent
     */
    public toggleStockRow(stock: any): void {
        if (!stock || stock.variantsLoading) {
            return;
        }
        stock.display = !stock.display;
        if (stock.display) {
            this.getStockVariants(stock);
        }
        this.refreshTableRows();
    }

    /**
     * Show the stock header search.
     *
     * @param {string} fieldName
     * @memberof StockBalanceComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "stock") {
            this.showStockSearchInput = true;
        }
    }

    /**
     * Hide the stock header search when clicking outside and the field is empty.
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @memberof StockBalanceComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (this.generalService.childOf(event?.target, element)) {
            return;
        }
        if (searchedFieldName === "stock" && !this.productNameSearching?.value) {
            this.showStockSearchInput = false;
        }
    }

    /**
     * Rebuild flattened table rows.
     *
     * @private
     * @memberof StockBalanceComponent
     */
    private refreshTableRows(): void {
        const rows = [];
        (this.stocksList || []).forEach(stock => {
            rows.push({ rowType: "stock", stock });
            if (stock?.display && stock?.stock?.variants?.length) {
                stock.stock.variants.forEach(variant => {
                    rows.push({ rowType: "variant", stock, variant });
                });
            }
        });
        this.tableRows.data = rows;
    }

    /**
    * Callback for selection of group name
    *
    * @param {*} field
    * @memberof StockBalanceComponent
    */
    public selectGroupName(event: any): void {
        this.GroupStockReportRequest.stockGroupUniqueName = event?.value;
        this.stockGroupName = event?.label ?? "";
        this.getStocks();
    }

    /**
     * Update warehouse unit from the reactive dropdown.
     *
     * @param {*} warehouseVariant
     * @param {*} stock
     * @param {IOption} event
     * @memberof StockBalanceComponent
     */
    public selectStockUnit(warehouseVariant: any, stock: any, event: IOption): void {
        if (!warehouseVariant.stockUnit) {
            warehouseVariant.stockUnit = {};
        }
        warehouseVariant.stockUnit.uniqueName = event?.value;
        warehouseVariant.stockUnit.name = event?.label;
        warehouseVariant.stockUnit.code = event?.additional?.code;
        this.stockUpdate(stock, warehouseVariant);
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
        const payload = this.buildStockUpdatePayload(stock?.stock);
        setTimeout(() => {
            this.inventoryService.updateStock(payload, stock?.stock?.stockGroup?.uniqueName, stock?.stockUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
     * Close every unit dropdown that is currently open.
     *
     * @memberof StockBalanceComponent
     */
    public closeUnitDropdowns(): void {
        this.warehouseDropdowns?.forEach(dropdown => dropdown.closeDropdownPanel());
    }

    /**
     * Close the unit dropdown and leave warehouse edit mode.
     *
     * @param {*} event
     * @param {*} warehouseVariant
     * @memberof StockBalanceComponent
     */
    public closeWarehouseEdit(warehouseVariant: any): void {
        this.closeUnitDropdowns();
        warehouseVariant.display = false;
    }

    /**
     * Focus the opening amount, quantity, or unit field in the clicked row.
     *
     * @param {number} field
     * @param {Event} [clickEvent]
     * @memberof StockBalanceComponent
     */
    public setInputFocus(field: number, clickEvent?: Event): void {
        this.closeUnitDropdowns();
        const container = (clickEvent?.currentTarget as HTMLElement)?.closest('.warehouse-cols');
        this.cdr.detectChanges();
        setTimeout(() => {
            if (!container) {
                return;
            }
            if (field === 1) {
                container.querySelector<HTMLElement>('.warehouse-edit-input.col-opening')?.focus();
            } else if (field === 2) {
                container.querySelector<HTMLElement>('.warehouse-edit-input.col-qty')?.focus();
            } else if (field === 3) {
                const unitInput = container.querySelector<HTMLElement>('.select-field-input');
                const dropdown = this.warehouseDropdowns?.find(item => item.selectField?.nativeElement === unitInput);
                if (dropdown) {
                    dropdown.openDropdownPanel();
                } else {
                    unitInput?.focus();
                    unitInput?.click();
                }
            }
        });
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
        this.updateTableDisplayedColumns();
        this.refreshTableRows();
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
    /**
     * Batch count from a collapsed warehouse row.
     *
     * @param {*} warehouse
     * @return {*}  {number}
     * @memberof StockBalanceComponent
     */
    public getBatchCount(warehouse: any): number {
        return Number(warehouse?.batchCount) || 0;
    }

    /**
     * Label for the collapsed batch column (`-`, batch name, or `{count} Batch`).
     *
     * @param {*} warehouse
     * @return {*}  {string}
     * @memberof StockBalanceComponent
     */
    public getBatchDisplay(warehouse: any): string {
        const count = this.getBatchCount(warehouse);
        if (count <= 0) {
            return "-";
        }
        if (count === 1) {
            return warehouse?.batchName || warehouse?.batch?.name || "-";
        }
        return `${count} ${this.localeData?.warehouse_opening_balance?.batch || this.localeData?.batch || "Batch"}`;
    }

    /**
     * Opens the batch report filtered by stock and warehouse.
     *
     * @param {*} stock
     * @param {*} warehouse
     * @param {Event} [event]
     * @memberof StockBalanceComponent
     */
    public openBatchReport(stock: any, warehouse: any, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (this.getBatchCount(warehouse) <= 0) {
            return;
        }
        const inventoryType = stock?.type || stock?.stock?.type || "PRODUCT";
        const type = inventoryType.toUpperCase() === "FIXED_ASSETS" ? "fixedassets" : inventoryType.toLowerCase();
        const queryParams: any = {};
        if (stock?.stockUniqueName) {
            queryParams.stockUniqueNames = stock.stockUniqueName;
        }
        if (warehouse?.uniqueName) {
            queryParams.warehouseUniqueNames = warehouse.uniqueName;
        }
        if (this.GroupStockReportRequest?.from) {
            queryParams.from = this.GroupStockReportRequest.from;
        }
        if (this.GroupStockReportRequest?.to) {
            queryParams.to = this.GroupStockReportRequest.to;
        }
        this.router.navigate(["/pages/inventory/v2", type, "batch"], { queryParams });
    }

    /**
     * Batches on an expanded variant warehouse.
     *
     * @param {*} warehouseBalance
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof StockBalanceComponent
     */
    public getWarehouseBalanceBatches(warehouseBalance: any): VoucherSelectedBatch[] {
        return Array.isArray(warehouseBalance?.batches) ? warehouseBalance.batches : [];
    }

    /**
     * Open Add Batch for a variant warehouse opening balance.
     *
     * @param {*} stock
     * @param {*} variant
     * @param {*} warehouseBalance
     * @param {Event} [event]
     * @memberof StockBalanceComponent
     */
    public openAddBatchDialog(stock: any, variant: any, warehouseBalance: any, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (!this.batchTrackingEnabled || !stock?.stockUniqueName || !variant) {
            return;
        }

        const warehouse = warehouseBalance?.warehouse;
        this.dialog.open(StockOpeningBatchDialogComponent, {
            width: "1200px",
            maxWidth: "94vw",
            disableClose: true,
            data: {
                stockName: stock?.stockName || stock?.stock?.name,
                stockUniqueName: stock?.stockUniqueName,
                variantName: variant?.name,
                variantUniqueName: variant?.uniqueName,
                warehouseName: warehouse?.name,
                warehouseUniqueName: warehouse?.uniqueName,
                openingAmount: warehouseBalance?.openingAmount,
                openingQuantity: warehouseBalance?.openingQuantity,
                stockUnit: warehouseBalance?.stockUnit || stock?.stock?.stockUnit,
                stockUnits: this.stockUnits,
                batches: cloneDeep(this.getWarehouseBalanceBatches(warehouseBalance)),
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                currencySymbol: this.companyCurrencySymbol,
                inputMaskFormat: this.inputMaskFormat
            }
        }).afterClosed().pipe(take(1)).subscribe((result?: StockOpeningBatchDialogResult) => {
            if (!result) {
                return;
            }
            warehouseBalance.batches = result.batches ?? [];
            warehouseBalance.openingAmount = result.openingAmount;
            warehouseBalance.openingQuantity = result.openingQuantity;
            if (result.stockUnit) {
                warehouseBalance.stockUnit = {
                    ...(warehouseBalance.stockUnit ?? {}),
                    ...result.stockUnit
                };
            }
            this.stockUpdate(stock, warehouseBalance);
            this.cdr.detectChanges();
        });
    }

    /**
     * Clone stock and send only payload-safe opening batches.
     *
     * @private
     * @param {*} stock
     * @return {*}  {*}
     * @memberof StockBalanceComponent
     */
    private buildStockUpdatePayload(stock: any): any {
        const payload = cloneDeep(stock);
        if (!this.batchTrackingEnabled) {
            payload?.variants?.forEach((variant: any) => {
                variant?.warehouseBalance?.forEach((balance: any) => {
                    delete balance.batches;
                    delete balance.display;
                });
            });
            return payload;
        }
        payload?.variants?.forEach((variant: any) => {
            variant?.warehouseBalance?.forEach((balance: any) => {
                balance.batches = this.mapBatchesForPayload(balance.batches);
                delete balance.display;
            });
        });
        return payload;
    }

    /**
     * Opening-balance batches for the stock update API.
     *
     * @private
     * @param {any[]} [batches]
     * @return {*}  {any[]}
     * @memberof StockBalanceComponent
     */
    private mapBatchesForPayload(batches?: any[]): any[] {
        return (Array.isArray(batches) ? batches : [])
            .filter(batch => (batch?.uniqueName || String(batch?.batchNumber ?? "").trim()) && (Number(batch.quantity) > 0 || Number(batch.openingQuantity) > 0))
            .map(batch => {
                const quantity = Number(batch.openingQuantity ?? batch.quantity) || 0;
                const mapped: any = {
                    name: batch.name ?? "",
                    batchNumber: batch.batchNumber ?? batch.name ?? "",
                    quantity,
                    openingQuantity: quantity,
                    openingAmount: Number(batch.openingAmount) || 0
                };
                if (batch.uniqueName) {
                    mapped.uniqueName = batch.uniqueName;
                }
                if (batch.manufacturingDate) {
                    mapped.manufacturingDate = batch.manufacturingDate;
                }
                if (batch.expiryDate) {
                    mapped.expiryDate = batch.expiryDate;
                }
                return mapped;
            });
    }

    /**
     * Normalize get-stock warehouse batches for chips and the add-batch dialog.
     *
     * @private
     * @param {any[]} [batches]
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof StockBalanceComponent
     */
    private normalizeWarehouseBatches(batches?: any[]): VoucherSelectedBatch[] {
        return (Array.isArray(batches) ? batches : []).reduce((list: VoucherSelectedBatch[], batch: any) => {
            const uniqueName = String(batch?.uniqueName ?? batch?.batchUniqueName ?? "").trim();
            const batchNumber = String(batch?.batchNumber ?? "").trim();
            if (!uniqueName && !batchNumber) {
                return list;
            }
            const quantity = Number(batch?.openingQuantity ?? batch?.quantity) || 0;
            list.push({
                uniqueName: uniqueName || batchNumber,
                name: batch?.name ?? "",
                batchNumber: batchNumber || uniqueName,
                quantity,
                openingQuantity: quantity,
                availableQuantity: Number(batch?.quantity ?? batch?.availableQuantity) || 0,
                expiryDate: batch?.expiryDate,
                manufacturingDate: batch?.manufacturingDate,
                warehouse: batch?.warehouse,
                openingAmount: Number(batch?.openingAmount) || 0
            } as VoucherSelectedBatch);
            return list;
        }, []);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('stock-balance');
    }
}
