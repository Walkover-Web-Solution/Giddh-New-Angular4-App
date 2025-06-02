import { Component, OnDestroy, OnInit, ViewChild, Input, SimpleChanges, TemplateRef, ChangeDetectionStrategy,ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import * as dayjs from 'dayjs';
import { ContactComponentStore } from "../utility/contact.store";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
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
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Instance of advance search modal */
    @ViewChild('advanceSearchModal', { static: false }) public advanceSearchModal: any;
    /** Instance of mat paginator */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Instance of mat sort */
    @ViewChild(MatSort) sort!: MatSort;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold table displayed columns */
    public displayedColumns: string[] = ['Date', 'Transactions', 'Details', 'Amount', 'Payments', 'Balance'];
    /** Hold panel open state*/
    public panelOpenState: boolean = true;
    /** Hold account response table data */
    public accountListData: any[] = [];
    /** Hold account response */
    public responseAccountList: any = {};
    /** Hold account url request */
    public accountListRequest: any = {
        accountUniqueName: '',
        page: 1,
        count: '',
        sortBy: 'Date',
        sort: 'asc',
        q: '',
    }
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Count of total records for pagination */
    public totalRecords: number | null = null;
    /** Hold store data */
    public accountStatementList$: Observable<any> = this.contactComponentStore.getAccountStatementList$;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Holds transaction form control */
    public transactionInput: FormControl = new FormControl(null);
    /** Holds show transaction input visibility status */
    public showTransactionInput: boolean = false;
    /** True if searching is in progress */
    public isSearching: boolean = false;
    /** Holds advance Filters keys */
    public advanceFilters: any = {};
    /** Holds Advance Filters Applied Status */
    public advanceFiltersApplied: boolean = false;
    /** Instance of advance search modal dialog */
    public advanceSearchDialogRef: any;
    @Input() activeAccountUniqueName: string;
    @Input() from: string;
    @Input() to: string;
    public advanceSearchRequest: AdvanceSearchRequest;
    public isAdvanceSearchImplemented: boolean = false;


    constructor(
        public dialog: MatDialog,
        private contactComponentStore: ContactComponentStore,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef    
    ) {
        this.advanceSearchRequest = new AdvanceSearchRequest();
    }

    /**
     * This will be use for component initialization
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
            if (search || search === '') {
                this.accountListRequest.q = search;
                this.isSearching = true;
                this.accountListRequest.page = 1;
                this.getAccountStatementList();
            }
        });
    }

    /**
    * Toggle between table header title and search input field
    *
    * @param {*} event
    * @param {string} fieldName
    * @memberof AccountStatementComponent
    */
    public toggleSearch(event: any, fieldName: string): void {
        if (fieldName === "transactionsField") {
            this.showTransactionInput = true;
        }

        event.stopPropagation();
    }


    /**
  * Reset Advance Filter
  *
  * @memberof AccountStatementComponent
  */
    public setInitialAdvanceFilter(onlyResetValue: boolean = false): void {
        this.accountListRequest = {
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
     * This will be use for hanldle page changes
     *
     * @param {PageEvent} event
     * @memberof AccountStatementComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.accountListRequest.count = event.pageSize;
        this.accountListRequest.page = event.pageIndex + 1;
        this.getAccountStatementList();
    }

    /**
     * This will be use for get count page
     *
     * @memberof AccountStatementComponent
     */
    public setDefaultParam(): void {
        if (this.activeAccountUniqueName) {
            this.accountListRequest.accountUniqueName = this.activeAccountUniqueName;
            this.accountListRequest.count = this.pageSizeOptions[1];
            this.accountListRequest.sort = 'asc';
            this.accountListRequest.from = this.from;
            this.accountListRequest.to = this.to;
            this.selectedDateRangeUi = dayjs(this.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (!this.isLoading) {
                this.getAccountStatementList();
            }
        }
    }

    /**
   * closeAdvanceSearchPopup
   */
    public closeAdvanceSearchPopup(event: any) {
        console.log(event);
        this.advanceSearchDialogRef?.close();
        if (!event.isClose) {
            this.getAccountStatementList();
            if (event.advanceSearchData) {
                if (event.advanceSearchData['dataToSend']['bsRangeValue'] && event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                    this.selectedDateRange = { startDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]), endDate: dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]) };
                    this.selectedDateRangeUi = dayjs(event.advanceSearchData.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(event.advanceSearchData.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                }
            }
        }
    }

    /**
     * To open advance search modal
     *
     * @memberof LedgerComponent
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
     * This will be use for get payment list
     *
     * @memberof AccountStatementComponent
     */
    public getAccountStatementList(): void {
        this.isLoading = true;
        this.accountListData = [];
        console.log(this.accountListRequest);
        
        this.contactComponentStore.getAccountStatementList(this.accountListRequest);
    }

    /**
     * This will be use for sort table  data
     *
     * @param {any} event
     * @memberof AccountStatementComponent
     */
    public sortData(event: any): void {
        this.accountListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.accountListRequest.sortBy = event?.active;
        this.getAccountStatementList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.activeAccountUniqueName?.currentValue && changes?.from?.currentValue && changes?.to?.currentValue) {
            this.setDefaultParam();
        }
    }

    /**
* This will hide the datepicker
*
* @memberof ActivityLogsComponent
*/
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof ActivityLogsComponent
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
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
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
     * This will be use for click outsie for search field hidden
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @return {*}  {void}
     * @memberof AccountStatementComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        console.log(event, element, searchedFieldName);
        
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
     * This will be use for component destroy
     *
     * @memberof AccountStatementComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}