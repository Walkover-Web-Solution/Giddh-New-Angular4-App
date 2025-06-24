import { Component, OnDestroy, OnInit, ViewChild, Input, SimpleChanges, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { ContactComponentStore } from "../utility/contact.store";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS } from "../../app.constant";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from "../../services/general.service";
import { FormControl } from "@angular/forms";
import { AdvanceSearchRequest } from "../../models/interfaces/advance-search-request";


@Component({
    selector: "account-statement",
    templateUrl: "account-statement.component.html",
    styleUrls: ["account-statement.component.scss"],
    providers: [ContactComponentStore]
})
export class AccountStatementComponent implements OnInit, OnDestroy {
    /** Template reference for the datepicker modal */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Template reference for the advance search modal */
    @ViewChild('advanceSearchModal', { static: false }) public advanceSearchModal: any;
    /** Reference to the Material paginator component */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Reference to the Material sort component */
    @ViewChild(MatSort) sort!: MatSort;
    /** Holds localized JSON data specific to this module */
    public localeData: any = {};
    /** Holds common localized JSON data shared across modules */
    public commonLocaleData: any = {};
    /** True if API call is in progress */
    public isLoading: boolean = false;
    /** Used to unsubscribe all store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Array of column names displayed in the account statement table */
    public displayedColumns: string[] = ['Date', 'Transactions', 'Details', 'Amount', 'Payments', 'Balance'];
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
        count: '',
        sortBy: 'Date',
        sort: 'asc',
        q: '',
    };
    /** Current page index for the paginator */
    public pageIndex: number = 0;
    /** Options for the number of rows shown per page */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Total number of records available for pagination */
    public totalRecords: number | null = null;
    /** Observable for the list of account statements from the store */
    public accountStatementList$: Observable<any> = this.contactComponentStore.getAccountStatementList$;
    /** Stores the selected date range for API queries */
    public selectedDateRange: any;
    /** Stores the selected date range formatted for UI display */
    public selectedDateRangeUi: any;
    /** Reference to the currently open modal */
    public modalRef: BsModalRef;
    /** Stores the x/y position for displaying the datepicker under its field */
    public dateFieldPosition: any = { x: 0, y: 0 };
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
    /** Unique name of the active account (input from parent) */
    @Input() activeAccountUniqueName: string;
    /** Start date for the statement (input from parent) */
    @Input() from: string;
    /** End date for the statement (input from parent) */
    @Input() to: string;
    /** Request object for advance search filters */
    public advanceSearchRequest: AdvanceSearchRequest;
    /** True if the advance search feature is implemented and enabled */
    public isAdvanceSearchImplemented: boolean = false;


    constructor(
        public dialog: MatDialog,
        private contactComponentStore: ContactComponentStore,
        private generalService: GeneralService,
        private modalService: BsModalService
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
            if (response) {
                this.accountListData = response.transactionDetailList;
                this.responseAccountList = response;
                this.totalRecords = response.totalItems;
            }
        });

        this.transactionInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            const searchValue = search?.trim();
            if (searchValue || searchValue === '') {
                this.accountListRequest.q = searchValue;
                this.isSearching = true;
                this.accountListRequest.page = 1;
                this.getAccountStatementList();
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
            count: this.pageSizeOptions[2], // Set default Count 50
            q: ''
        };
        this.transactionInput.patchValue(null, { emitEvent: false });
        this.showTransactionInput = false;
        this.advanceFiltersApplied = false;
        this.isSearching = false;

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
        this.pageIndex = event.pageIndex;
        this.accountListRequest.count = event.pageSize;
        this.accountListRequest.page = event.pageIndex + 1;
        this.getAccountStatementList();
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
            this.isSearching = false;
            this.accountListRequest.accountUniqueName = this.activeAccountUniqueName;
            this.accountListRequest.count = this.pageSizeOptions[1];
            this.accountListRequest.page = 1;
            this.accountListRequest.q = '';
            this.accountListRequest.sort = 'asc';
            this.accountListRequest.from = this.from;
            this.accountListRequest.to = this.to;
            let dateRange = { fromDate: '', toDate: '' };
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
            if (event.advanceSearchData['dataToSend']['bsRangeValue'] && event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                this.selectedDateRange = { startDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]), endDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]) };
                this.selectedDateRangeUi = dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
            this.advanceSearchRequest = event.advanceSearchData.dataToSend;
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
    public getAccountStatementList(): void {
        this.isLoading = true;
        this.accountListData = [];
        if (this.advanceFiltersApplied) {
            const requestObj = {
                body: this.advanceSearchRequest,
                method: 'POST',
                model: this.accountListRequest
            };
            this.contactComponentStore.getAccountStatementList(requestObj);
        } else {
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
        this.accountListRequest.sort = event?.direction ?? 'asc';
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
     * Hides the datepicker modal.
     *
     * @memberof AccountStatementComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     * Shows the datepicker modal at the position of the provided element.
     *
     * @param {*} element DOM element triggering the datepicker
     * @memberof AccountStatementComponent
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
     * Callback for date/range selection in the datepicker.
     * Updates date range and fetches account statement list.
     *
     * @param {*} value Selected date range value
     * @memberof AccountStatementComponent
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
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.accountListRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.accountListRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
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