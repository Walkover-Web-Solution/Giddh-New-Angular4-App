import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, QueryList, ViewChildren } from "@angular/core";
import { GeneralService } from "../../../services/general.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../../app.constant";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { Observable, ReplaySubject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { debounceTime, distinctUntilChanged, map, startWith, take, takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { OrganizationType } from "../../../models/user-login-state";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { StockReportRequestNew, TransactionalStockReportResponse } from "../../../models/api-models/Inventory";
import { InventoryService } from "../../../services/inventory.service";
import { NewInventoryAdavanceSearch } from "../new-inventory-advance-search/new-inventory-advance-search.component";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsWarehouseService } from "../../../services/settings.warehouse.service";
import { SelectMultipleFieldsComponent } from "../../../theme/form-fields/select-multiple-fields/select-multiple-fields.component";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";

@Component({
    selector: "inventory-transaction-list",
    templateUrl: "./inventory-transaction-list.component.html",
    styleUrls: ["./inventory-transaction-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InventoryTransactionListComponent implements OnInit {

    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Instance of mail modal */
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    @ViewChild('searchBox', { static: true }) public searchBox: ElementRef;
    /** Instance of sort header */
    @ViewChild(MatSort) sort: MatSort;
    public dataSource = [];
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* dayjs object */
    public dayjs = dayjs;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold warehouse checked  */
    public selectedWarehouse: any[] = [];
    /** This will use for instance of lwarehouses Dropdown */
    public warehousesDropdown: FormControl = new FormControl();
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Hold warehouse checked  */
    public selectedBranch: any[] = [];
    /** This will use for instance of lwarehouses Dropdown */
    public branchesDropdown: FormControl = new FormControl();
    public VOUCHER_TYPES: any[] = [
        {
            "value": "SALES",
            "label": "Sales",
            "checked": false
        },
        {
            "value": "PURCHASE",
            "label": "Purchase",
            "checked": false
        },
        {
            "value": "MANUFACTURED",
            "label": "Manufactured",
            "checked": false
        },
        {
            "value": "TRANSFER",
            "label": "Transfer",
            "checked": false
        },
        {
            "value": "JOURNAL",
            "label": "Journal Voucher",
            "checked": false
        },
        {
            "value": "SALES_CREDIT_NOTE",
            "label": "Sales Credit note",
            "checked": false
        },
        {
            "value": "PURCHASE_DEBIT_NOTE",
            "label": "Purchase credit note",
            "checked": false
        },
        {
            "value": "RAW_MATERIAL",
            "label": "Raw Material",
            "checked": false
        },
    ];
    public displayedColumns: string[] = [];
    public REPORT_COLUMNS = [
        {
            "value": "date",
            "label": "Date",
            "checked": true
        },
        {
            "value": "voucherType",
            "label": "Voucher Type",
            "checked": true
        },
        {
            "value": "accountName",
            "label": "Account Name",
            "checked": true

        },
        {
            "value": "stockName",
            "label": "Stock Name",
            "checked": true

        },
        {
            "value": "variantName",
            "label": "Variant Name",
            "checked": true

        },
        {
            "value": "inwards",
            "label": "Invards",
            "checked": true

        },
        {
            "value": "outwards",
            "label": "Outwards",
            "checked": true

        },
        {
            "value": "rate",
            "label": "Rate",
            "checked": true

        },
        {
            "value": "value",
            "label": "Value",
            "checked": true

        }
    ];
    /** Thsi will use for searching for stock */
    public accountNameSearching: FormControl = new FormControl();
    /** Image path variable */
    public imgPath: string = '';
    public showAccountSearch: boolean = false;
    /** Current branches */
    public branches: any[] = [];
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** Hold all warehouses */
    public allBranches: any[] = [];
    public groupUniqueName: string;
    public stockUniqueName: string;
    public stockReportRequest: StockReportRequestNew = new StockReportRequestNew();
    public toDate: string;
    public fromDate: string;
    // public isFilterCorrect: boolean = false;
    public stockTransactionReportBalance: TransactionalStockReportResponse;
    public showAdvanceSearchModal: boolean = false;
    public allBranchWarehouses: any;
    /** List of field suggestions */
    public fieldsSuggestion: any[] = [];
    /** List of chips based on selected values */
    public chipList: any[] = [];
    /** Search field form control */
    public searchFormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Emit with seperate code for chiplist */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** True if we need to allow adding of new chips */
    private allowAddChip: boolean = true;
    /** CSS class name to add on the field */
    public showError: boolean = false;
    public currentWarehouses: any[] = [];




    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        public modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }


    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.stockReportRequest = Object.assign({}, this.stockReportRequest, {
                    dataToSend: Object.assign({}, this.stockReportRequest.dataToSend, {
                        bsRangeValue: [dateObj[0], dateObj[1]]
                    })
                });
                this.getStockTransactionalReport(true);
            }
        });

        this.accountNameSearching.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            // this.isFilterCorrect = true;
            this.stockReportRequest.accountName = s;
            this.getStockTransactionalReport(false);
            if (s === '') {
                this.showAccountSearch = false;
            }
        });

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

        this.searchFormControl?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined && typeof searchedText === 'string') {
                this.stockReportRequest.q = searchedText;
                this.getStockTransactionReportFilters();
            }
        });
        this.getBranchWiseWarehouse();
    }




    /**
     * Callback for select option from dropdown
     *
     * @param {*} option
     * @memberof SelectMultipleFieldsComponent
     */
    public selectOption(option: any): void {
        const selectOptionValue = option?.option?.value;
        this.allowAddChip = false;
        setTimeout(() => {
            this.allowAddChip = true;
        }, 300);
        if (option?.option?.value?.type === 'STOCK GROUP') {
            if (this.stockReportRequest.stockGroupUniqueNames.length > 0) {
                this.stockReportRequest.stockGroupUniqueNames = option?.option?.value?.uniqueName;
                return;
            } else {
                this.stockReportRequest.stockGroupUniqueNames.push(option?.option?.value?.uniqueName);
            }
        } else if (option?.option?.value?.type === 'STOCK') {

            const findStockColumnCheck = this.REPORT_COLUMNS.find(value => value?.value === "stockName");
            if (this.stockReportRequest.stockUniqueNames?.length == 0 && findStockColumnCheck.checked) {
                findStockColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns.filter(value => value !== "stockName");
            } else if (this.stockReportRequest.stockUniqueNames?.length > 0 && !findStockColumnCheck.checked) {
                findStockColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }

            this.stockReportRequest.stockUniqueNames?.push(option?.option?.value?.uniqueName);
        } else {

            const findVariantColumnCheck = this.REPORT_COLUMNS.find(value => value?.value === "variantName");
            if (this.stockReportRequest.variantUniqueNames?.length == 0 && findVariantColumnCheck.checked) {
                findVariantColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns.filter(value => value !== "variantName");
            } else if (this.stockReportRequest.variantUniqueNames?.length > 0 && !findVariantColumnCheck.checked) {
                findVariantColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }
            this.stockReportRequest.variantUniqueNames?.push(option?.option?.value?.uniqueName);
        }
        this.chipList.push(selectOptionValue);
        this.getStockTransactionReportFilters();
        this.getStockTransactionalReport(false);
    }

    /**
     * Callback for remove option from chip
     *
     * @param {number} index
     * @memberof SelectMultipleFieldsComponent
     */
    public removeOption(selectOptionValue: any, index: number): void {
        this.chipList.splice(index, 1);
        if (selectOptionValue) {
            if (selectOptionValue.type === "STOCK GROUP") {
                this.stockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames.filter(value => value != selectOptionValue.uniqueName);
            }
            if (selectOptionValue.type === "STOCK") {
                this.stockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.stockUniqueNames.length <= 1) {
                    this.REPORT_COLUMNS.find(value => value?.value === "stockName").checked = (this.stockReportRequest.stockUniqueNames.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            if (selectOptionValue.type === "VARIANT") {
                this.stockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.variantUniqueNames.length <= 1) {
                    this.REPORT_COLUMNS.find(value => value?.value === "variantName").checked = (this.stockReportRequest.variantUniqueNames.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            this.getStockTransactionReportFilters();
            this.getStockTransactionalReport(false);
            this.changeDetection.detectChanges();
        }
    }


    public getStockTransactionReportFilters(): void {
        delete this.stockReportRequest.totalPages;
        delete this.stockReportRequest.totalItems;
        delete this.stockReportRequest.branchUniqueNames;
        delete this.stockReportRequest.warehouseUniqueNames;
        delete this.stockReportRequest.accountName;
        delete this.stockReportRequest.dataToSend;
        delete this.stockReportRequest.expression;
        delete this.stockReportRequest.from;
        delete this.stockReportRequest.param;
        delete this.stockReportRequest.to;
        delete this.stockReportRequest.val;
        delete this.stockReportRequest.voucherTypes;
        this.inventoryService.searchStockTransactionReport(this.stockReportRequest).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.fieldFilteredOptions = response.body.results;
            }
            this.changeDetection.detectChanges();
        });

    }
    public getStockTransactionalReport(apiCall: boolean = true, type?: boolean): void {
        if (!this.showAdvanceSearchModal) {
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
        }
        if (!this.stockReportRequest.stockGroupUniqueNames || !this.stockReportRequest.stockUniqueNames) {
            return;
        }

        this.stockReportRequest.page = 1;
        this.stockReportRequest.count = PAGINATION_LIMIT;
        delete this.stockReportRequest.dataToSend;
        this.isLoading = true;
        this.dataSource = [];
        if (apiCall) {
            this.getReportColumns();
        }
        this.inventoryService.GetStockTransactionReport(cloneDeep(this.stockReportRequest)).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.dataSource = response.body.transactions;
                this.stockReportRequest.page = response.body.page;
                this.stockReportRequest.totalItems = response.body.totalItems;
                this.stockReportRequest.totalPages = response.body.totalPages;
                this.stockReportRequest.count = response.body.count;
            } else {
                this.dataSource = [];
                this.stockReportRequest.totalItems = 0;
                // this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
        delete this.stockReportRequest.count;
        delete this.stockReportRequest.page;
        delete this.stockReportRequest.transactionType;

        this.inventoryService.GetStockTransactionReportBalance(cloneDeep(this.stockReportRequest)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.stockTransactionReportBalance = response.body;
            } else {
                // this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     *Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.stockReportRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
        this.stockReportRequest = Object.assign({}, this.stockReportRequest, {
            dataToSend: Object.assign({}, this.stockReportRequest.dataToSend, {
                bsRangeValue: [value.startDate, value.endDate]
            })
        });
        // this.isFilterCorrect = true;
        this.getStockTransactionalReport(false);

    }

    /**
   * This will hide the datepicker
   *
   * @memberof InventoryTransactionListComponent
   */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof InventoryTransactionListComponent
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
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof InventoryTransactionListComponent
    */
    public pageChanged(event: any): void {
        if (this.stockReportRequest.page !== event.page) {
            this.stockReportRequest.page = event.page;
            this.getStockTransactionalReport(false);

        }
    }

    public openModal(): void {
        this.showAdvanceSearchModal = true;

        let dialogRef = this.dialog.open(NewInventoryAdavanceSearch, {
            panelClass: 'advance-search-container',
            data: {
                stockReportRequest: this.stockReportRequest
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.onShowAdvanceSearchFilter(response);
            }
        });
    }

    public onShowAdvanceSearchFilter(data: any): void {

        // let advanceSearch = cloneDeep(this.stockReportRequest);
        if (data) {
            this.stockReportRequest.param = data.stockReportRequest.param;
            this.stockReportRequest.expression = data.stockReportRequest.expression;
            this.stockReportRequest.from = data.stockReportRequest.fromDate;
            this.stockReportRequest.to = data.stockReportRequest.toDate;
            this.stockReportRequest.val = data.stockReportRequest.val;
            // this.isFilterCorrect = data.stockReportRequest.searching;
        }
        this.showAdvanceSearchModal = true;
        this.getStockTransactionalReport(false);

        this.changeDetection.detectChanges();
    }

    public sortChange(event: any): void {
        if (this.stockReportRequest.sort !== event?.direction) {
            this.stockReportRequest.sort = event?.direction;
            this.stockReportRequest.sortBy = event?.active;
            this.getStockTransactionalReport(false);
        }
    }


    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showAccountSearch = true;
        }
    }

    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name") {
            return "Account Name";
        }
        return "";
    }

    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.accountNameSearching?.value) {
                return;
            }
            if (this.generalService.childOf(event.target, element)) {
                return;
            } else {
                this.showAccountSearch = false;
            }
        }
    }


    public getBranchWiseWarehouse(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.allBranchWarehouses = response.body;
                this.allBranches = response.body.results;
                this.branches = response.body.results;
                this.allWarehouses = [];

                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
            }
            this.getBranches(false);

            this.changeDetection.detectChanges();
        });
    }

    public getWarehouses(): void {
        this.stockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.getStockTransactionalReport(false);

    }

    public getBranches(apiCall: boolean = true): void {

        this.selectedWarehouse = [];
        this.allBranches?.forEach((branches) => {
            this.allWarehouses = this.allWarehouses.concat(branches.warehouses);
        });
        if (this.selectedBranch.length === 0) {
            this.warehouses = this.allWarehouses;
        } else {
            let warehouses = [];
            this.branches.filter(value => this.selectedBranch.includes(value?.uniqueName)).forEach((branches) => {
                warehouses = warehouses.concat(branches.warehouses);
            });
            this.warehouses = warehouses;

        }
        this.currentWarehouses = this.warehouses;
        this.stockReportRequest.branchUniqueNames = this.selectedBranch;
        this.stockReportRequest.warehouseUniqueNames = [];
        if (apiCall) {
            this.getStockTransactionalReport(false);
        }
        this.changeDetection.detectChanges();

    }

    //******* Advance search modal *******//
    public resetFilter(isReset?: boolean) {
        this.accountNameSearching.reset();
        this.stockReportRequest.sort = null;
        this.stockReportRequest.sortBy = null;
        this.stockReportRequest.accountName = null;
        this.showAccountSearch = false;
        this.stockReportRequest.val = null;
        this.stockReportRequest.param = null;
        this.stockReportRequest.expression = null;

        // this.initVoucherType();
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.stockReportRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
            // this.isFilterCorrect = false;
        });
        this.changeDetection.detectChanges();
    }


    public filterByCheck(type: string) {
        setTimeout(() => {
            if (!this.stockReportRequest.voucherTypes?.includes(type)) {
                this.stockReportRequest.voucherTypes.push(type);
            } else {
                this.stockReportRequest.voucherTypes = this.stockReportRequest.voucherTypes.filter(value => value != type);
            }
            this.changeDetection.detectChanges();
            this.getStockTransactionalReport(false);
            this.changeDetection.detectChanges();
        });
    }

    public getReportColumns(): void {
        this.inventoryService.getStockTransactionReportColumns("INVENTORY_TRANSACTION_REPORT").subscribe(response => {
            if (response && response.body && response.status === 'success') {
                if (response.body?.columns) {
                    this.REPORT_COLUMNS.forEach(column => {
                        if (!response.body.columns.includes(column.value)) {
                            column.checked = false;
                        }
                    });
                }
                this.filteredDisplayColumns();
            }
        });
    }

    public saveColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            this.changeDetection.detectChanges();
            let saveColumnReq = {
                module: "INVENTORY_TRANSACTION_REPORT",
                columns: this.displayedColumns
            }
            this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).subscribe(response => {
            });
        });
    }

    public selectAllColumns(event: any): void {
        this.REPORT_COLUMNS.forEach(column => {
            column.checked = event;
        });
        this.filteredDisplayColumns();
        this.saveColumns();
        this.changeDetection.detectChanges();
    }

    public filteredDisplayColumns(): void {

        this.displayedColumns = this.REPORT_COLUMNS.filter(value => value.checked).map(column => column.value);
        this.changeDetection.detectChanges();
    }



    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }



}
