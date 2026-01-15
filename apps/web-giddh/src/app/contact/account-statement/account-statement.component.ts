import { Component, OnDestroy, OnInit, ViewChild, Input, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { ContactComponentStore } from "../utility/contact.store";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../app.constant";
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from "../../services/general.service";
import { FormControl } from "@angular/forms";
import { AdvanceSearchRequest } from "../../models/interfaces/advance-search-request";
import { cloneDeep } from "../../lodash-optimized";
import { TransactionType } from "../../models/api-models/Ledger";
import { saveAs } from 'file-saver';
import { GiddhNumberFormatPipe } from "../../shared/helpers/pipes/number-format/number-format.pipe";

@Component({
    selector: "account-statement",
    templateUrl: "account-statement.component.html",
    styleUrls: ["account-statement.component.scss"],
    providers: [ContactComponentStore],
    standalone:false
})
export class AccountStatementComponent implements OnInit, OnDestroy {
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Template reference for the advance search modal */
    @ViewChild('advanceSearchModal', { static: false }) public advanceSearchModal: any;
    /** Reference to the Material paginator component */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Unique name of the active account (input from parent) */
    @Input() public activeAccountUniqueName: string;
    /** Start date for the statement (input from parent) */
    @Input() public from: string;
    /** End date for the statement (input from parent) */
    @Input() public to: string;
    /** Branch unique name (input from parent) */
    @Input() public branchUniqueName: string;
    /** Active tab (input from parent) */
    @Input() public contactActiveTab: string;
    /** Reference to the Material sort component */
    @ViewChild(MatSort) sort!: MatSort;
    /** Holds localized JSON data specific to this module */
    public localeData: any = {};
    /** Holds common localized JSON data shared across modules */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Used to unsubscribe all store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Array of column names displayed in the account statement table */
    public displayedColumns: string[] = ['date', 'transactions', 'details', 'amount', 'payments', 'balance'];
    /** Whether the panel is open (for expansion panels, etc.) */
    public panelOpenState: boolean = true;
    /** Data array for the account statement table rows */
    public accountListData: any[] = [];
    /** Stores the full account response object from the API */
    public responseAccountList: any = {};
    /** Request object for fetching account statement data */
    public accountListRequest: any = {
        accountUniqueName: '',
        page: 1,
        count: PAGINATION_LIMIT,
        sortBy: 'date',
        sort: '',
        q: '',
    };
    /** Options for the number of rows shown per page */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Total number of records available for pagination */
    public totalRecords: number | null = null;
    /** Observable for the list of account statements from the store */
    public accountStatementList$: Observable<any> = this.contactComponentStore.getAccountStatementList$;
    /** Observable for the loading state of account statement list */
    public getAccountStatementInProgress$: Observable<any> = this.contactComponentStore.getAccountStatementInProgress$;
    /** Stores the selected date range for API queries */
    public selectedDateRange: any;
    /** Stores the selected date range formatted for UI display */
    public selectedDateRangeUi: any;
    /** Available date range options for the datepicker */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Label for the currently selected date range */
    public selectedRangeLabel: any = "";
    /** Form control for the transaction search input */
    public transactionInput: FormControl = new FormControl(null);
    /** Whether the transaction search input is visible */
    public showTransactionInput: boolean = false;
    /** True if a search is currently in progress */
    public isSearching: boolean = false;
    /** Stores the current set of applied advance filter keys */
    public advanceFilters: any = {};
    /** True if any advance filters are currently applied */
    public advanceFiltersApplied: boolean = false;
    /** Reference to the currently open advance search dialog */
    public advanceSearchDialogRef: any;
    /** Request object for advance search filters */
    public advanceSearchRequest: AdvanceSearchRequest;
    /** True if the advance search feature is implemented and enabled */
    public isAdvanceSearchImplemented: boolean = false;
    /** True if any filters are currently applied on report */
    public clearFilter: boolean = false;
    /** Holds transaction type */
    public transactionType: typeof TransactionType = TransactionType;
    /** Balance due */
    public balanceDue: string = '';

    constructor(
        public dialog: MatDialog,
        private contactComponentStore: ContactComponentStore,
        private generalService: GeneralService,
        private giddhNumberFormatPipe: GiddhNumberFormatPipe
    ) {
        this.advanceSearchRequest = new AdvanceSearchRequest();
    }

    /**
     * Lifecycle hook that is called after data-bound properties are initialized.
     * Subscribes to account statement and transaction input changes.
     *
     * @memberof AccountStatementComponent
     */
    public ngOnInit(): void {
        this.accountStatementList$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            this.isLoading = false;
            if (response && response.transactionDetailList?.length) {
                this.accountListData = response.transactionDetailList;
                this.responseAccountList = response;
                this.totalRecords = response.totalItems;
                this.balanceDue = this.responseAccountList.accountSummary?.closingBalance?.amount >= 0
                    ? (this.responseAccountList.accountSummary.closingBalance.type ===
                        this.transactionType.Credit
                        ? this.contactActiveTab === 'vendor' ? '' : '-'
                        : "") +
                    (this.responseAccountList.accountAddress?.currency?.symbol ?? "") +
                    this.giddhNumberFormatPipe.transform(this.responseAccountList.accountSummary.closingBalance.amount)
                    : "";
            }
        });


        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [dayjs(this.from, GIDDH_DATE_FORMAT).toDate(), dayjs(this.to, GIDDH_DATE_FORMAT).toDate()]
            })
        });

        this.advanceSearchRequest.to = this.to;
        this.advanceSearchRequest.page = 0;

        this.transactionInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            const searchValue = search?.trim();

            if (searchValue || searchValue === '') {
                this.accountListRequest.q = searchValue;
                this.isSearching = true;
                this.accountListRequest.page = 1;
                this.advanceFiltersApplied = false;
                this.clearFilter = true;
                if (!this.isLoading) {
                    this.getAccountStatementList();
                }
            }
        });

        this.contactComponentStore.exportAccountStatementResponse$.pipe(takeUntil(this.destroyed$)).subscribe(exportResponse => {
            if (exportResponse?.data) {
                const data = this.generalService.base64ToBlob(exportResponse.data, 'application/xml', 512);
                saveAs(data, exportResponse.name);
            }
        });
    }

    /**
     * Shows the search input for a given table field (e.g., transactions).
     *
     * @param {*} event DOM event
     * @param {string} fieldName Name of the field to activate search for
     * @memberof AccountStatementComponent
     */
    public toggleSearch(event: any, fieldName: string): void {
        if (fieldName === "transactionsField") {
            this.showTransactionInput = true;
        }
        event.stopPropagation();
    }

    /**
     * Resets all applied advance filters and optionally fetches the account statement list.
     *
     * @param {boolean} [onlyResetValue=false] If true, only resets values without fetching data
     * @memberof AccountStatementComponent
     */
    public setInitialAdvanceFilter(onlyResetValue: boolean = false): void {
        this.accountListRequest = {
            accountUniqueName: this.activeAccountUniqueName,
            sortBy: '',
            sort: 'asc',
            from: this.from ?? '',
            to: this.to ?? '',
            page: 1,
            count: PAGINATION_LIMIT,
            q: ''
        };
        this.transactionInput.patchValue(null, { emitEvent: false });
        this.showTransactionInput = false;
        this.advanceFiltersApplied = false;
        this.clearFilter = false;
        this.isSearching = false;
        let dateRange = { fromDate: '', toDate: '' };
        dateRange = this.generalService.dateConversionToSetComponentDatePicker(this.from, this.to);
        this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
        this.selectedDateRangeUi = dayjs(this.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.advanceSearchRequest.accountUniqueName = this.activeAccountUniqueName;

        if (!onlyResetValue) {
            this.getAccountStatementList();
        }
    }

    /**
     * Handles page change events from the paginator and fetches new data.
     *
     * @param {PageEvent} event Page event from paginator
     * @memberof AccountStatementComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.accountListRequest.page = this.accountListRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.accountListRequest.count = event.pageSize;
        this.getAccountStatementList(true);
    }

    /**
     * Sets default parameters for account statement request and initializes date range values.
     *
     * @memberof AccountStatementComponent
     */
    public setDefaultParam(): void {
        if (this.activeAccountUniqueName) {
            this.transactionInput.patchValue(null, { emitEvent: false });
            this.showTransactionInput = false;
            this.advanceFiltersApplied = false;
            this.clearFilter = false;
            this.isSearching = false;
            this.accountListRequest.accountUniqueName = this.activeAccountUniqueName;
            this.accountListRequest.count = PAGINATION_LIMIT;
            this.accountListRequest.page = 1;
            this.accountListRequest.q = '';
            this.accountListRequest.sort = 'asc';
            this.accountListRequest.from = this.from;
            this.accountListRequest.to = this.to;
            let dateRange = { fromDate: '', toDate: '' };
            this.advanceSearchRequest = new AdvanceSearchRequest();
            this.advanceSearchRequest.accountUniqueName = this.activeAccountUniqueName;
            this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [dayjs(this.from, GIDDH_DATE_FORMAT).toDate(), dayjs(this.to, GIDDH_DATE_FORMAT).toDate()]
                })
            });
            this.advanceSearchRequest.to = this.to;
            this.advanceSearchRequest.page = 0;
            dateRange = this.generalService.dateConversionToSetComponentDatePicker(this.from, this.to);
            this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
            this.selectedDateRangeUi = dayjs(this.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (!this.isLoading) {
                this.getAccountStatementList();
            }
        }
    }

    /**
     * Closes the advance search popup and applies filters if provided.
     *
     * @param {*} event Event containing advance search data and close status
     * @memberof AccountStatementComponent
     */
    public closeAdvanceSearchPopup(event: any) {
        this.advanceSearchDialogRef?.close();
        if (!event.isClose && event.advanceSearchData) {
            this.advanceFiltersApplied = true;
            this.clearFilter = true;
            if (event.advanceSearchData['dataToSend']['bsRangeValue'] && event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                this.selectedDateRange = { startDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]), endDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]) };
                this.selectedDateRangeUi = dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
            this.advanceSearchRequest = cloneDeep(event.advanceSearchData);
            this.getAccountStatementList();
        }
    }

    /**
     * Opens the advance search modal dialog.
     *
     * @memberof AccountStatementComponent
     */
    public onOpenAdvanceSearch(): void {
        if (this.advanceSearchRequest && this.advanceSearchRequest.dataToSend && this.selectedDateRange && this.selectedDateRange.startDate && this.selectedDateRange.endDate) {
            this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                page: 0,
                dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                    bsRangeValue: [this.selectedDateRange.startDate, this.selectedDateRange.endDate]
                })
            });
        }
        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearchModal, {
                    width: '980px',
                    role: 'alertdialog',
                    ariaLabel: 'advance'
                });
    }

    /**
     * Fetches the account statement list, applying filters if needed.
     *
     * @memberof AccountStatementComponent
     */
    public getAccountStatementList(isAdvanceSearch: boolean = false): void {
        this.isLoading = true;
        this.accountListData = [];
        const advReq = this.advanceSearchRequest.dataToSend;
        if (this.advanceFiltersApplied) {
            if (!isAdvanceSearch) {
                this.accountListRequest.page = 1;
            }
            this.accountListRequest.from = this.selectedDateRange.startDate.format(GIDDH_DATE_FORMAT);
            this.accountListRequest.to = this.selectedDateRange.endDate.format(GIDDH_DATE_FORMAT);
            const requestObj = {
                body: advReq,
                method: 'POST',
                model: this.accountListRequest,
                branchUniqueName: this.branchUniqueName
            };
            this.contactComponentStore.getAccountStatementList(requestObj);
        } else {
            if (this.branchUniqueName) {
                this.accountListRequest.branchUniqueName = this.branchUniqueName;
            }
            this.contactComponentStore.getAccountStatementList(this.accountListRequest);
        }
    }

    /**
     * Handles sort events for the account statement table and fetches sorted data.
     *
     * @param {any} event Sort event from Material table
     * @memberof AccountStatementComponent
     */
    public sortData(event: any): void {
        this.accountListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.accountListRequest.sortBy = event?.active;
        this.getAccountStatementList();
    }

    /**
     * Lifecycle hook that is called when any data-bound property changes.
     * Updates the component when activeAccountUniqueName input changes.
     *
     * @memberof AccountStatementComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.activeAccountUniqueName?.currentValue && changes?.activeAccountUniqueName?.currentValue !== changes?.activeAccountUniqueName?.previousValue) {
            this.setDefaultParam();
        }
    }

    /**
     * Toggles the datepicker menu open/close state.
     *
     * @param {boolean} isOpen Whether to open or close the datepicker menu
     * @memberof AccountStatementComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Callback for date/range selection in the datepicker.
     * Updates date range and fetches account statement list.
     *
     * @param {*} value Selected date range value
     * @memberof AccountStatementComponent
     */
    public dateSelectedCallback(value?: any): void {
        let from = dayjs(value.startDate, GIDDH_DATE_FORMAT).toDate();
        let to = dayjs(value.endDate, GIDDH_DATE_FORMAT).toDate();
        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            page: 0,
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [from, to]
            })
        });
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.accountListRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.accountListRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.clearFilter = true;
            this.getAccountStatementList();
        }
    }

    /**
     * Handles click outside events to hide search fields if needed.
     *
     * @param {*} event DOM event
     * @param {*} element Reference element for comparison
     * @param {string} searchedFieldName Name of the search field
     * @memberof AccountStatementComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'transactions') {
            if (this.transactionInput.value !== null && this.transactionInput.value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === 'transactions') {
                this.showTransactionInput = false;
            }
        }
    }

    /**
     * Export account statement
     *
     * @memberof AccountStatementComponent
     */
    public exportAccountStatement(): void {
        const requestObj = {
            queryParam: {
                accountUniqueName: this.accountListRequest.accountUniqueName,
                query: this.accountListRequest.q,
                from: this.accountListRequest.from,
                to: this.accountListRequest.to
            },
            payload: this.advanceFiltersApplied ? this.advanceSearchRequest.dataToSend : {}
        }
        this.contactComponentStore.exportAccountStatement(requestObj);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Cleans up subscriptions to prevent memory leaks.
     *
     * @memberof AccountStatementComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
