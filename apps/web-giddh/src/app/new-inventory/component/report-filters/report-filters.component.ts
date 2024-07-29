import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, ReplaySubject, of as observableOf, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from "../../../app.constant";
import { BalanceStockTransactionReportRequest, SearchStockTransactionReportRequest, StockTransactionReportRequest, StockTransactionReportRequestExport } from "../../../models/api-models/Inventory";
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
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { InventoryModuleName, InventoryReportType } from "../../inventory.enum";
import { InventoryComponentStore } from "../inventory.store";

@Component({
    selector: "report-filters",
    templateUrl: "./report-filters.component.html",
    styleUrls: ["./report-filters.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InventoryComponentStore]
})
export class ReportFiltersComponent implements OnInit, OnChanges, OnDestroy {
    /** Instance of datepicker */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
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
    /** Stock Export Table Data*/
    @Input() public stockReportRequestExport: StockTransactionReportRequestExport = new StockTransactionReportRequestExport();
    /** Stock Transactional Object */
    @Input() public balanceStockReportRequest: BalanceStockTransactionReportRequest = new BalanceStockTransactionReportRequest();
    /** Holds report type */
    @Input() public searchPage: string = "";
    /** Hold advance search modal response */
    @Input() public advanceSearchModalResponse: any = null;
    /** False if pull unitversal date  */
    @Input() public pullUniversalDate: boolean = true;
    /** Holds module name for customised columns */
    @Input() public reportUniqueName: string = "";
    /** Holds inventory type module  */
    @Input() public moduleType: string = "";
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
    public warehousesDropdown: UntypedFormControl = new UntypedFormControl();
    /** This will use for instance of branches Dropdown */
    public branchesDropdown: UntypedFormControl = new UntypedFormControl();
    /** Search field form control */
    public searchFilters: UntypedFormControl = new UntypedFormControl();
    /* This will store datepicker modal reference */
    public modalRef: BsModalRef;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock Transactional Object */
    public searchRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
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
    /** This will auto select the option which is coming from url */
    public autoSelectSearchOption: boolean = false;
    /** Observable to subscribe for refresh columns on select chiplist */
    public refreshColumns = new Subject<void>();
    /** This will hold if variant is selected on chip list */
    public isVariantSelected: boolean = false;
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;

    constructor(
        public dialog: MatDialog,
        private location: Location,
        public modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private generalService: GeneralService,
        private toaster: ToasterService,
        private store: Store<AppState>,
        public router: Router,
        private componentStore: InventoryComponentStore
    ) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Life cycle hook for init event
     *
     * @memberof ReportFiltersComponent
     */
    public ngOnInit(): void {
        if (this.reportUniqueName && this.searchPage !== "GROUP") {
            this.autoSelectSearchOption = true;
            this.searchRequest.q = this.reportUniqueName;
        }
        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                if (this.pullUniversalDate) {
                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;
                        if (this.universalDate && !this.todaySelected) {
                            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            this.fromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.toDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
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
                        if (!this.autoSelectSearchOption) {
                            setTimeout(() => {
                                this.emitFilters();
                            }, 100);
                        }
                    });
                } else {
                    this.selectedBranch = this.stockReportRequest?.branchUniqueNames || [];
                    this.selectedWarehouse = this.stockReportRequest?.warehouseUniqueNames || [];
                    this.stockReportRequest.page = 1;
                    if (!this.autoSelectSearchOption) {
                        setTimeout(() => {
                            this.emitFilters();
                        }, 100);
                    }
                }
            }
        });

        this.getBranchWiseWarehouse();

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
        this.searchInventory();
    }

    /**
     * Life cycle hook for change event
     *
     * @param {SimpleChanges} changes
     * @memberof ReportFiltersComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.fromToDate?.currentValue?.from) {
            this.selectedDateRange = { startDate: dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT), endDate: dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(changes?.fromToDate?.currentValue?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(changes?.fromToDate?.currentValue?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;
        }
        if (this.moduleName !== InventoryModuleName.transaction && changes?.moduleName?.currentValue !== this.moduleName) {
            if (changes?.searchPage?.currentValue || changes?.moduleType?.currentValue) {
                this.searchInventory();
            }
        }
        if (changes?.stockReportRequest?.currentValue) {
            if (changes?.stockReportRequest?.currentValue?.stockGroups) {
                changes?.stockReportRequest?.currentValue?.stockGroups?.forEach(group => {
                    this.filtersChipList.push(group);
                });
            }
            if (changes?.stockReportRequest?.currentValue?.stocks) {
                changes?.stockReportRequest?.currentValue?.stocks?.forEach(stock => {
                    if (stock?.uniqueName !== this.reportUniqueName) {
                        this.filtersChipList.push(stock);
                    }
                });
            }
            if (changes?.stockReportRequest?.currentValue?.variants) {
                changes?.stockReportRequest?.currentValue?.variants?.forEach(variant => {
                    if (variant?.uniqueName !== this.reportUniqueName) {
                        this.filtersChipList.push(variant);
                    }
                });
            }

            if (changes?.stockReportRequest?.currentValue?.branchUniqueNames?.length) {
                this.selectedBranch = changes?.stockReportRequest?.currentValue?.branchUniqueNames;
                this.stockReportRequest.branchUniqueNames = this.selectedBranch;
                this.balanceStockReportRequest.branchUniqueNames = this.selectedBranch;
                this.selectedBranch = changes?.stockReportRequestExport?.currentValue?.branchUniqueNames;
                this.stockReportRequestExport.branchUniqueNames = this.selectedBranch;
            }
            if (changes?.stockReportRequest?.currentValue?.warehouseUniqueNames?.length) {
                this.selectedWarehouse = changes?.stockReportRequest?.currentValue?.warehouseUniqueNames;
                this.stockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
                this.selectedWarehouse = changes?.stockReportRequestExport?.currentValue?.warehouseUniqueNames;
                this.stockReportRequestExport.warehouseUniqueNames = this.selectedWarehouse;
            }
        }
        this.isFilterActive();
    }

    /**
     * This will be used for filtering the display columns
     *
     * @memberof ReportFiltersComponent
     */
    public setDisplayColumns(columns: string[]): void {
        this.displayedColumns = columns;
        this.selectedColumns.emit(this.displayedColumns);
        this.changeDetection.detectChanges();

        /* This will use for table header from customise columns for export table */
        this.stockReportRequestExport = {
            ...this.stockReportRequestExport,
            showStockName: false,
            showGroupName: false,
            showUnitName: false,
            showOpeningStockQty: false,
            showOpeningStockValue: false,
            showInwardsQty: false,
            showInwardsValue: false,
            showOutwardsQty: false,
            showOutwardsValue: false,
            showClosingStockQty: false,
            showClosingStockValue: false,
            showVariantName: false,
            showDate: false,
            showAccountUniqueName: false,
            showRate: false,
            showValue: false
        }

        /* for column value filter selected common */
        this.displayedColumns?.forEach(column => {
            if (column === 'inward_quantity') {
                this.stockReportRequestExport.showInwardsQty = true;
            }
            else if (column === 'outward_quantity') {
                this.stockReportRequestExport.showOutwardsQty = true;
            }
            /* for value filter selected in item, variant & group */
            if (InventoryReportType.stock || InventoryReportType.variant || InventoryReportType.group) {
                if (column === 'group_name') {
                    this.stockReportRequestExport.showGroupName = true;
                }
                else if (column === 'opening_quantity') {
                    this.stockReportRequestExport.showOpeningStockQty = true;
                }
                else if (column === 'opening_amount') {
                    this.stockReportRequestExport.showOpeningStockValue = true;
                }
                else if (column === 'inward_amount') {
                    this.stockReportRequestExport.showInwardsValue = true;
                }
                else if (column === 'outward_amount') {
                    this.stockReportRequestExport.showOutwardsValue = true;
                }
                else if (column === 'closing_quantity') {
                    this.stockReportRequestExport.showClosingStockQty = true;
                }
                else if (column === 'closing_amount') {
                    this.stockReportRequestExport.showClosingStockValue = true;
                }
            }
            /* for value filter selected in item, variant & transaction */
            if ((InventoryReportType.stock || InventoryReportType.variant || InventoryReportType.transaction) && column === 'stock_name') {
                this.stockReportRequestExport.showStockName = true;
            }
            /* for value filter selected in item & variant both */
            if ((InventoryReportType.stock || InventoryReportType.variant) && column === 'unit_name') {
                this.stockReportRequestExport.showUnitName = true;
            }
            /* for value filter selected in variant & transaction both */
            if ((InventoryReportType.variant || InventoryReportType.transaction) && column === 'variant_name') {
                this.stockReportRequestExport.showVariantName = true;
            }
            /* for value filter selected in Transaction */
            if (InventoryReportType.transaction) {
                if (column === 'entry_date') {
                    this.stockReportRequestExport.showDate = true;
                }
                else if (column === 'account_name') {
                    this.stockReportRequestExport.showAccountUniqueName = true;
                }
                else if (column === 'rate') {
                    this.stockReportRequestExport.showRate = true;
                }
                else if (column === 'transaction_val') {
                    this.stockReportRequestExport.showValue = true;
                }
            }
        });
    }

    /**
     * Opens the advance search modal
     *
     * @memberof ReportFiltersComponent
     */
    public openModal(): void {
        this.showAdvanceSearchModal = true;
        this.stockReportRequest.from = dayjs(this.selectedDateRange.startDate).format(GIDDH_DATE_FORMAT);
        this.stockReportRequest.to = dayjs(this.selectedDateRange.endDate).format(GIDDH_DATE_FORMAT);
        let dialogRef = this.dialog?.open(NewInventoryAdvanceSearch, {
            panelClass: 'advance-search-container',
            data: {
                stockReportRequest: this.stockReportRequest,
                advanceSearchResponse: this.advanceSearchModalResponse,
                reportType: this.searchPage
            },
            width: '500px',
            role: 'alertdialog',
            ariaLabel: 'Advance search Dialog'
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

                this.stockReportRequestExport.param = response.stockReportRequestExport?.param;
                this.stockReportRequestExport.expression = response.stockReportRequestExport?.expression;
                this.stockReportRequestExport.val = response.stockReportRequestExport?.val;

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
        this.filters.emit({ stockReportRequest: this.stockReportRequest, balanceStockReportRequest: this.balanceStockReportRequest, displayedColumns: this.displayedColumns, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter, advanceSearchModalResponse: this.advanceSearchModalResponse, stockReportRequestExport: this.stockReportRequestExport});
    }

    /**
     * Shows/hides the clear button
     *
     * @memberof ReportFiltersComponent
     */
    public isFilterActive(): void {
        if ((this.isCompany && this.selectedBranch?.length) || this.selectedWarehouse?.length || this.filtersChipList?.length || this.advanceSearchModalResponse || this.stockReportRequest?.voucherTypes?.length || this.stockReportRequest.accountName?.length) {
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
        this.stockReportRequestExport = new StockTransactionReportRequestExport();
        this.balanceStockReportRequest = new BalanceStockTransactionReportRequest();
        this.searchInventory();
        this.filtersChipList = [];
        this.selectedBranch = [];
        this.selectedWarehouse = [];
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

            if (!this.isCompany) {
                this.stockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                this.balanceStockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
            }
            this.resetFilters.emit(true);
            this.emitFilters();
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
        this.stockReportRequestExport.warehouseUniqueNames = this.selectedWarehouse;
        this.balanceStockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.stockReportRequest.page = 1;
        this.isFilterActive();
        this.emitFilters();
    }

    /**
     *This will be used to get branch wise warehouses
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
                    this.stockReportRequestExport.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
                    this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
                }
            }
            this.getBranches(false);
            this.changeDetection.detectChanges();
        });
    }

    /**
     * This will be used to get branches
     *
     * @param {boolean} [apiCall=true]
     * @memberof ReportFiltersComponent
     */
    public getBranches(apiCall: boolean = true): void {
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
        this.stockReportRequestExport.branchUniqueNames = this.selectedBranch?.length ? this.selectedBranch : [];
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

        if (!this.isCompany) {
            this.stockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
            this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
            this.stockReportRequestExport.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
        }
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
            this.stockReportRequest.page = 1;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;
        }
        this.emitFilters();
        this.changeDetection.detectChanges();
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
        this.stockReportRequest.page = 1;
        const selectOptionValue = option?.option?.value;
        if (option?.option?.value?.type === 'STOCK GROUP') {
            this.stockReportRequest.stockGroupUniqueNames = [option?.option?.value?.uniqueName];
            this.stockReportRequest.stockGroups = [option?.option?.value];
        } else if (option?.option?.value?.type === 'STOCK') {
            const findStockColumnCheck = this.customiseColumns?.find(value => value?.value === "stock_name");
            if (this.stockReportRequest.stockUniqueNames?.length === 0 && findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = false;
                this.refreshColumns.next();
            } else if (this.stockReportRequest.stockUniqueNames?.length > 0 && !findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = true;
                this.refreshColumns.next();
            }
            if (this.stockReportRequest.stockUniqueNames?.length) {
                this.stockReportRequest.stockUniqueNames.push(option?.option?.value?.uniqueName);
            } else {
                this.stockReportRequest.stockUniqueNames = [option?.option?.value?.uniqueName];
            }
            if (this.stockReportRequest.stocks?.length) {
                this.stockReportRequest.stocks.push(option?.option?.value);
            } else {
                this.stockReportRequest.stocks = [option?.option?.value];
            }
        } else {
            const findVariantColumnCheck = this.customiseColumns?.find(value => value?.value === "variant_name");
            if (this.stockReportRequest.variantUniqueNames?.length === 0 && findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = false;
                this.refreshColumns.next();
            } else if (this.stockReportRequest.variantUniqueNames?.length > 0 && !findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = true;
                this.refreshColumns.next();
            }
            if (this.stockReportRequest.variantUniqueNames?.length) {
                this.stockReportRequest.variantUniqueNames.push(option?.option?.value?.uniqueName);
            } else {
                this.stockReportRequest.variantUniqueNames = [option?.option?.value?.uniqueName];
            }
            if (this.stockReportRequest.variants?.length) {
                this.stockReportRequest.variants.push(option?.option?.value);
            } else {
                this.stockReportRequest.variants = [option?.option?.value];
            }
        }
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.stockReportRequestExport.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.stockReportRequestExport.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.stockReportRequestExport.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.filtersChipList?.push(selectOptionValue);
        this.searchRequest.q = "";
        this.searchInventory();
        this.isFilterActive();
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
        this.stockReportRequest.page = 1;
        this.filtersChipList?.splice(index, 1);
        if (selectOptionValue) {
            if (selectOptionValue.type === "STOCK GROUP") {
                this.stockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
                this.stockReportRequest.stockGroups = this.stockReportRequest.stockGroups?.filter(value => value?.uniqueName != selectOptionValue.uniqueName);
            }
            if (selectOptionValue.type === "STOCK") {
                this.stockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames.filter(value => value != selectOptionValue.uniqueName);
                this.stockReportRequest.stocks = this.stockReportRequest.stocks?.filter(value => value?.uniqueName != selectOptionValue.uniqueName);
                if (this.stockReportRequest.stockUniqueNames.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "stock_name").checked = (this.stockReportRequest.stockUniqueNames?.length === 1 ? false : true);
                    this.refreshColumns.next();
                }
            }
            if (selectOptionValue.type === "VARIANT") {
                this.stockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
                this.stockReportRequest.variants = this.stockReportRequest.variants?.filter(value => value?.uniqueName != selectOptionValue.uniqueName);
                if (this.stockReportRequest.variantUniqueNames?.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "variant_name").checked = (this.stockReportRequest.variantUniqueNames.length === 1 ? false : true);
                    this.refreshColumns.next();
                }
            }
            this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
            this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
            this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
            this.searchRequest.q = "";
            this.searchInventory();
            this.isFilterActive();
            this.emitFilters();
        }
    }

    /**
     * Searches the group/stock/variant
     *
     * @param {boolean} [loadMore]
     * @memberof ReportFiltersComponent
     */
    public searchInventory(autoSelectSearchOption?: boolean, loadMore?: boolean): void {
        this.searchRequest.inventoryType = this.moduleType;
        this.searchRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames ? this.stockReportRequest.stockGroupUniqueNames : [];
        this.searchRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames ? this.stockReportRequest.stockUniqueNames : [];
        this.searchRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames ? this.stockReportRequest.variantUniqueNames : [];
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames ? this.stockReportRequest.stockGroupUniqueNames : [];
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames ? this.stockReportRequest.stockUniqueNames : [];
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames ? this.stockReportRequest.variantUniqueNames : [];
        if (loadMore) {
            this.searchRequest.page++;
        } else {
            this.searchRequest.page = 1;
        }
        this.searchRequest.searchPage = this.searchPage;
        if (this.searchRequest.page === 1 || this.searchRequest.page <= this.searchRequest.totalPages) {
            delete this.searchRequest.totalItems;
            delete this.searchRequest.totalPages;
            if (this.searchRequest.variantUniqueNames?.length) {
                this.isVariantSelected = true;
            } else {
                this.isVariantSelected = false;
            }
            let searchRequest = cloneDeep(this.searchRequest);

            if (this.autoSelectSearchOption) {
                searchRequest.searchPage = searchRequest.searchPage === 'STOCK' ? 'GROUP' : searchRequest.searchPage === 'VARIANT' ? 'STOCK' : searchRequest.searchPage === 'TRANSACTION' ? 'VARIANT' : 'GROUP';
            }
            this.inventoryService.searchStockTransactionReport(searchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body && response.status === 'success') {
                    if (loadMore) {
                        this.fieldFilteredOptions = this.fieldFilteredOptions.concat(response.body.results);
                    } else {
                        this.fieldFilteredOptions = response.body.results;
                    }
                    this.searchRequest.totalItems = response.body.totalItems;
                    this.searchRequest.totalPages = response.body.totalPages;
                    if (this.autoSelectSearchOption) {
                        this.autoSelectSearchOption = false;
                        let selectedOption = this.fieldFilteredOptions?.filter(option => option?.uniqueName === this.reportUniqueName);
                        if (selectedOption?.length) {
                            this.selectChiplistValue({ option: { value: selectedOption[0] } });
                        } else {
                            this.emitFilters();
                        }
                    } else if (autoSelectSearchOption) {
                        this.emitFilters();
                    }
                    this.autoSelectSearchOption = false;
                } else {
                    this.fieldFilteredOptions = [];
                    this.searchRequest.totalItems = 0;
                    if (this.autoSelectSearchOption) {
                        this.autoSelectSearchOption = false;
                        this.searchRequest.q = '';
                        this.searchInventory(true);
                    } else {
                        this.toaster.showSnackBar("warning", response?.message);
                    }
                }
                this.changeDetection.detectChanges();
            });
        }
    }

    /**
     * This will use for back to previous page
     *
     * @memberof ReportFiltersComponent
     */
    public backToPreviousPage(): void {
        this.location.back();
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
     * Resets warehouses
     *
     * @memberof ReportFiltersComponent
     */
    public resetWarehouse(): void {
        this.stockReportRequest.warehouseUniqueNames = [];
    }

    /**
     * Edit transactions of stock , group , and variant
     *
     * @memberof ReportFiltersComponent
     */
    public editInventory(): void {
        let type = this.filtersChipList[0]?.type;
        let uniqueName = this.filtersChipList[0]?.uniqueName;
        if (type === 'STOCK GROUP') {
            this.router.navigate(['/pages/inventory/v2/group', this.moduleType?.toLowerCase(), 'edit', uniqueName]);
        }
        if (type === 'STOCK') {
            this.router.navigate(['/pages/inventory/v2/stock', this.moduleType?.toLowerCase(), 'edit', uniqueName]);
        }
    }

    /**
     * This will use for export stock report data
     *
     * @return {*}  {void}
     * @memberof ReportFiltersComponent
    */
    public exportReport(): void {
        let stockReportRequestExport = this.stockReportRequestExport;
        let queryParams = {
            from: this.fromDate,
            to: this.toDate
        };
        delete stockReportRequestExport.from;
        delete stockReportRequestExport.to;

        stockReportRequestExport.inventoryType = this.moduleType;

        // this is for Item wise export
        if (this.searchPage === InventoryReportType.stock) {
            // data is coming from inventory store
            this.componentStore.exportStock({
                stockReportRequest: stockReportRequestExport,
                queryParams: queryParams
            });
        }

        // this is for Variant wise export
        else if (this.searchPage === InventoryReportType.variant) {
            // data is coming from inventory store
            this.componentStore.exportVariant({
                stockReportRequest: stockReportRequestExport,
                queryParams: queryParams
            });
        }

        // this is for Group wise export
        else if (this.searchPage === InventoryReportType.group) {
            // data is coming from inventory store
            this.componentStore.exportGroup({
                stockReportRequest: stockReportRequestExport,
                queryParams: queryParams
            });
        }

        // this is for Transaction wise export
        else if (this.searchPage === InventoryReportType.transaction) {
            stockReportRequestExport.accountName = this.balanceStockReportRequest.accountName;
            // data is coming from inventory store
            this.componentStore.exportTransaction({
                stockReportRequest: stockReportRequestExport,
                queryParams: queryParams
            });
        }
    }
}

