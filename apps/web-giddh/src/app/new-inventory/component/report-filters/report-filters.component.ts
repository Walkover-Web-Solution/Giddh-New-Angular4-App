import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, ReplaySubject, of as observableOf } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from "../../../app.constant";
import { BalanceStockTransactionReportRequest, SearchStockTransactionReportRequest, StockTransactionReportRequest } from "../../../models/api-models/Inventory";
import { NewInventoryAdvanceSearch } from "../new-inventory-advance-search/new-inventory-advance-search.component";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { InventoryService } from "../../../services/inventory.service";
import { GeneralService } from "../../../services/general.service";
import { OrganizationType } from "../../../models/user-login-state";
import { ToasterService } from "../../../services/toaster.service";
import { cloneDeep } from "../../../lodash-optimized";
import { AppState } from "../../../store";
import { select, Store } from "@ngrx/store";

@Component({
    selector: "report-filters",
    templateUrl: "./report-filters.component.html",
    styleUrls: ["./report-filters.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportFiltersComponent implements OnInit, OnChanges, OnDestroy {
    /** Instance of datepicker */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds module name for customised columns */
    @Input() public moduleName: string = "";
    /** Holds default columns list for customised columns */
    @Input() public customiseColumns: any[] = [];
    /** Holds from/to date to show in universal date */
    @Input() public fromToDate: any = {};
    /** Stock Transactional Object */
    @Input() public stockReportRequest: StockTransactionReportRequest = new StockTransactionReportRequest();
    /** Stock Transactional Object */
    @Input() public balanceStockReportRequest: BalanceStockTransactionReportRequest = new BalanceStockTransactionReportRequest();
    /** Holds report type */
    @Input() public searchPage: string = "";

    /** Emits the selected filters */
    @Output() public filters: EventEmitter<any> = new EventEmitter();
    /** Emits true if filters are reset */
    @Output() public resetFilters: EventEmitter<boolean> = new EventEmitter();
    /** Emits true if api call in progress */
    @Output() public isLoading: EventEmitter<boolean> = new EventEmitter();
    /** Emits the selected filters */
    @Output() public selectedColumns: EventEmitter<any> = new EventEmitter();

    /** True if show advance search model*/
    public showAdvanceSearchModal: boolean = false;
    /** This will use for instance of warehouses Dropdown */
    public warehousesDropdown: FormControl = new FormControl();
    /** This will use for instance of branches Dropdown */
    public branchesDropdown: FormControl = new FormControl();
    /** Search field form control */
    public searchFilters: FormControl = new FormControl();
    /* This will store datepicker modal reference */
    public modalRef: BsModalRef;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock Transactional Object */
    public searchRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
    /** Hold advance search modal response */
    public advanceSearchModalResponse: object = null;
    /** This will store universalDate */
    public universalDate: any;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Hold warehouse checked  */
    public selectedWarehouse: any[] = [];
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Hold branches checked  */
    public selectedBranch: any[] = [];
    /**Hold branches */
    public branches: any[] = [];
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** Hold all warehouses */
    public allBranches: any[] = [];
    /** Hold current warehouses */
    public currentWarehouses: any[] = [];
    /** List of chips based on selected values */
    public filtersChipList: any[] = [];
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Hold all branch warehouses */
    public allBranchWarehouses: any;
    /** Emit with seperate code for filtersChipList */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** Hold group unique name */
    public groupUniqueName: string;
    /** Hold stockunique name */
    public stockUniqueName: string;
    /** Hold From Date*/
    public toDate: string;
    /** Hold To Date*/
    public fromDate: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if show clear */
    public showClearFilter: boolean = false;
    /* dayjs object */
    public dayjs = dayjs;
    /** This will hold if today is selected in universal */
    public todaySelected: boolean = false;
    /** Observable to subscribe and get today selected */
    public todaySelected$: Observable<boolean> = observableOf(false);
    /** This will use for stock report displayed columns */
    public displayedColumns: string[] = [];

    constructor(
        public dialog: MatDialog,
        public modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private generalService: GeneralService,
        private toaster: ToasterService,
        private store: Store<AppState>
    ) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Life cycle hook for init event
     *
     * @memberof ReportFiltersComponent
     */
    public ngOnInit(): void {
        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                    this.todaySelected = response;
                    if (universalDate && !this.todaySelected) {
                        this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                        this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                        this.stockReportRequest.from = this.fromDate;
                        this.stockReportRequest.to = this.toDate;
                        this.balanceStockReportRequest.from = this.fromDate;
                        this.balanceStockReportRequest.to = this.toDate;
                    } else if (this.todaySelected) {
                        this.selectedDateRange = { startDate: dayjs(), endDate: dayjs() };
                        this.selectedDateRangeUi = dayjs().format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs().format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.stockReportRequest.from = "";
                        this.stockReportRequest.to = "";
                        this.balanceStockReportRequest.from = "";
                        this.balanceStockReportRequest.to = "";
                    }
                    this.stockReportRequest.page = 1;
                    this.emitFilters();
                });
            }
        });

        this.getBranchWiseWarehouse();
        this.getReportColumns();

        this.branchesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let branchesClone = cloneDeep(this.allBranches);
            if (search) {
                branchesClone = this.allBranches?.filter(branch => (branch.alias?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.branches = branchesClone;
        });

        this.warehousesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let warehousesClone = cloneDeep(this.currentWarehouses);
            if (search) {
                warehousesClone = this.currentWarehouses?.filter(warehouse => (warehouse.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.warehouses = warehousesClone;
        });

        this.searchFilters?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined && typeof searchedText === 'string') {
                this.searchRequest.q = searchedText;
                this.searchInventory();
            }
        });
    }

    /**
     * Life cycle hook for change event
     *
     * @param {SimpleChanges} changes
     * @memberof ReportFiltersComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.fromToDate?.currentValue) {
            this.selectedDateRange = { startDate: dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT), endDate: dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;
        }

        this.isFilterActive();
        this.searchInventory();
    }

    /**
     * This will get customised columns
     *
     * @memberof ReportFiltersComponent
     */
    public getReportColumns(): void {
        this.inventoryService.getStockTransactionReportColumns(this.moduleName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                if (response.body?.columns) {
                    this.customiseColumns?.forEach(column => {
                        if (!response.body.columns?.includes(column?.value)) {
                            column.checked = false;
                        }
                    });
                }
            }
            this.filteredDisplayColumns();
        });
    }

    /**
     * This will use to save customised columns
     *
     * @memberof ReportFiltersComponent
     */
    public saveColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            let saveColumnReq = {
                module: this.moduleName,
                columns: this.displayedColumns
            }
            this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading.emit(false);
            });
        });
    }

    /**
     * This will use to select all customised columns
     *
     * @param {*} event
     * @memberof ReportFiltersComponent
     */
    public selectAllColumns(event: any): void {
        this.customiseColumns?.forEach(column => {
            if (column) {
                column.checked = event;
            }
        });
        this.filteredDisplayColumns();
        this.saveColumns();
        this.changeDetection.detectChanges();
    }

    /**
     * This will be used for filtering the display columns
     *
     * @memberof ReportFiltersComponent
     */
    public filteredDisplayColumns(): void {
        this.displayedColumns = this.customiseColumns?.filter(value => value?.checked).map(column => column?.value);
        this.selectedColumns.emit(this.displayedColumns);
        this.changeDetection.detectChanges();
    }

    /**
     * This hook will use for on destroyed component
     *
     * @memberof ReportFiltersComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens the advance search modal
     *
     * @memberof ReportFiltersComponent
     */
    public openModal(): void {
        this.showAdvanceSearchModal = true;
        let dialogRef = this.dialog?.open(NewInventoryAdvanceSearch, {
            panelClass: 'advance-search-container',
            data: {
                stockReportRequest: this.stockReportRequest,
                advanceSearchResponse: this.advanceSearchModalResponse
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.advanceSearchModalResponse = response;
                this.stockReportRequest.param = response.stockReportRequest?.param;
                this.stockReportRequest.expression = response.stockReportRequest?.expression;
                this.stockReportRequest.from = response.stockReportRequest?.fromDate;
                this.stockReportRequest.to = response.stockReportRequest?.toDate;
                this.stockReportRequest.val = response.stockReportRequest?.val;
                this.balanceStockReportRequest.param = response.stockReportRequest?.param;
                this.balanceStockReportRequest.expression = response.stockReportRequest?.expression;
                this.balanceStockReportRequest.val = response.stockReportRequest?.val;
                this.balanceStockReportRequest.from = response.stockReportRequest?.fromDate;
                this.balanceStockReportRequest.to = response.stockReportRequest?.toDate;
                this.stockReportRequest.page = 1;
                this.showAdvanceSearchModal = true;
                this.isFilterActive();
                this.emitFilters();
            }
        });
        this.changeDetection.detectChanges();
    }

    /**
     * Emits the filters and data to parent
     *
     * @private
     * @memberof ReportFiltersComponent
     */
    private emitFilters(): void {
        this.filters.emit({ stockReportRequest: this.stockReportRequest, balanceStockReportRequest: this.balanceStockReportRequest, displayedColumns: this.displayedColumns, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter });
    }

    /**
     * Shows/hides the clear button
     *
     * @memberof ReportFiltersComponent
     */
    public isFilterActive(): void {
        if (this.selectedBranch?.length || this.selectedWarehouse?.length || this.filtersChipList?.length || this.advanceSearchModalResponse || this.stockReportRequest?.voucherTypes?.length || this.stockReportRequest.accountName?.length) {
            this.showClearFilter = true;
        } else {
            this.showClearFilter = false;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Resets the filters
     *
     * @memberof ReportFiltersComponent
     */
    public resetFilter() {
        this.showClearFilter = false;
        this.advanceSearchModalResponse = null;
        this.stockReportRequest = new StockTransactionReportRequest();
        this.balanceStockReportRequest = new BalanceStockTransactionReportRequest();
        this.filtersChipList = [];
        this.selectedBranch = [];
        this.getBranches(false);
        //Reset Date with universal date
        this.universalDate$.subscribe(res => {
            if (res) {
                this.fromDate = dayjs(res[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(res[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = _.cloneDeep(res);
                if (universalDate && !this.todaySelected) {
                    this.selectedDateRange = { startDate: dayjs(res[0]), endDate: dayjs(res[1]) };
                    this.selectedDateRangeUi = dayjs(res[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(res[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.stockReportRequest.page = 1;
                    this.stockReportRequest.from = dayjs(res[0]).format(GIDDH_DATE_FORMAT);
                    this.stockReportRequest.to = dayjs(res[1]).format(GIDDH_DATE_FORMAT);
                    this.balanceStockReportRequest.from = dayjs(res[0]).format(GIDDH_DATE_FORMAT);
                    this.balanceStockReportRequest.to = dayjs(res[1]).format(GIDDH_DATE_FORMAT);
                } else {
                    this.stockReportRequest.page = 1;
                    this.stockReportRequest.from = "";
                    this.stockReportRequest.to = "";
                    this.balanceStockReportRequest.from = "";
                    this.balanceStockReportRequest.to = "";
                }
            }

            this.resetFilters.emit(true);
            this.emitFilters();
            this.changeDetection.detectChanges();
        });
    }

    /**
     *  This will use to get branch wise warehouse
     *
     * @memberof ReportFiltersComponent
     */
    public getBranchWiseWarehouse(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.allBranchWarehouses = response.body;
                this.allBranches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.branches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.allWarehouses = [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

                if (!this.isCompany) {
                    this.stockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
                    this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
                }
            }
            this.getBranches(false);
            this.changeDetection.detectChanges();
        });
    }

    /**
     * This will be used to get warehouses
     *
     * @memberof ReportFiltersComponent
     */
    public getWarehouses(): void {
        this.stockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.balanceStockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.stockReportRequest.page = 1;
        this.isFilterActive();
        this.emitFilters();
    }

    /**
     * This will be used to get branches
     *
     * @param {boolean} [apiCall=true]
     * @memberof ReportFiltersComponent
     */
    public getBranches(apiCall: boolean = true): void {
        this.selectedWarehouse = [];
        this.allWarehouses = [];
        if (!this.isCompany) {
            let currentBranch = this.allBranches?.filter(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
            this.allWarehouses = currentBranch[0]?.warehouses;
        } else {
            this.allBranches?.forEach((branches) => {
                this.allWarehouses = this.allWarehouses?.concat(branches?.warehouses);
            });
        }

        if (this.selectedBranch?.length === 0) {
            this.warehouses = this.allWarehouses;
        } else {
            let warehouses = [];
            this.branches?.filter(value => this.selectedBranch?.includes(value?.uniqueName))?.forEach((branches) => {
                warehouses = warehouses?.concat(branches?.warehouses);
            });
            this.warehouses = warehouses;
        }
        this.currentWarehouses = this.warehouses;
        this.stockReportRequest.branchUniqueNames = this.selectedBranch?.length ? this.selectedBranch : [];
        this.stockReportRequest.warehouseUniqueNames = [];
        this.balanceStockReportRequest.branchUniqueNames = cloneDeep(this.stockReportRequest.branchUniqueNames);
        this.balanceStockReportRequest.warehouseUniqueNames = cloneDeep(this.stockReportRequest.warehouseUniqueNames);
        this.stockReportRequest.page = 1;

        if (apiCall) {
            this.emitFilters();
        }

        this.isFilterActive();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof ReportFiltersComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.todaySelected = false;
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;

        }
        this.emitFilters();
    }

    /**
     * This will hide the datepicker
     *
     * @memberof ReportFiltersComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof ReportFiltersComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will use for select filters in chiplist
     *
     * @param {*} option
     * @return {*}  {void}
     * @memberof ReportFiltersComponent
     */
    public selectChiplistValue(option: any): void {
        const selectOptionValue = option?.option?.value;
        if (option?.option?.value?.type === 'STOCK GROUP') {
            this.stockReportRequest.stockGroupUniqueNames = [option?.option?.value?.uniqueName];
        } else if (option?.option?.value?.type === 'STOCK') {
            const findStockColumnCheck = this.customiseColumns?.find(value => value?.value === "stockName");
            if (this.stockReportRequest.stockUniqueNames?.length === 0 && findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns?.filter(value => value !== "stockName");
            } else if (this.stockReportRequest.stockUniqueNames?.length > 0 && !findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }
            this.stockReportRequest.stockUniqueNames?.push(option?.option?.value?.uniqueName);
        } else {
            const findVariantColumnCheck = this.customiseColumns?.find(value => value?.value === "variantName");
            if (this.stockReportRequest.variantUniqueNames?.length === 0 && findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns.filter(value => value !== "variantName");
            } else if (this.stockReportRequest.variantUniqueNames?.length > 0 && !findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }
            this.stockReportRequest.variantUniqueNames?.push(option?.option?.value?.uniqueName);
        }
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.filtersChipList?.push(selectOptionValue);
        this.isFilterActive();
        this.searchRequest.q = "";
        this.searchInventory();
        this.emitFilters();
    }

    /**
     * This will be used for remove chiplist from search filter
     *
     * @param {*} selectOptionValue
     * @param {number} index
     * @memberof ReportFiltersComponent
     */
    public removeOption(selectOptionValue: any, index: number): void {
        this.filtersChipList?.splice(index, 1);
        if (selectOptionValue) {
            if (selectOptionValue.type === "STOCK GROUP") {
                this.stockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
            }
            if (selectOptionValue.type === "STOCK") {
                this.stockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.stockUniqueNames.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "stockName").checked = (this.stockReportRequest.stockUniqueNames?.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            if (selectOptionValue.type === "VARIANT") {
                this.stockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.variantUniqueNames?.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "variantName").checked = (this.stockReportRequest.variantUniqueNames.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
            this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
            this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
            this.searchInventory();
            this.emitFilters();
            this.isFilterActive();
        }
    }

    /**
     * Searches the group/stock/variant
     *
     * @param {boolean} [loadMore]
     * @memberof ReportFiltersComponent
     */
    public searchInventory(loadMore?: boolean): void {
        this.searchRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.searchRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.searchRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        if (loadMore) {
            this.searchRequest.page++;
        } else {
            this.searchRequest.page = 1;
        }
        this.searchRequest.searchPage = this.searchPage;
        if (this.searchRequest.page === 1 || this.searchRequest.page <= this.searchRequest.totalPages) {
            delete this.searchRequest.totalItems;
            delete this.searchRequest.totalPages;
            this.inventoryService.searchStockTransactionReport(this.searchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body && response.status === 'success') {
                    if (loadMore) {
                        this.fieldFilteredOptions = this.fieldFilteredOptions.concat(response.body.results);
                    } else {
                        this.fieldFilteredOptions = response.body.results;
                    }
                    this.searchRequest.totalItems = response.body.totalItems;
                    this.searchRequest.totalPages = response.body.totalPages;
                } else {
                    this.fieldFilteredOptions = [];
                    this.searchRequest.totalItems = 0;
                    this.toaster.showSnackBar("warning", response?.body);
                }
                this.changeDetection.detectChanges();
            });
        }
    }
}
