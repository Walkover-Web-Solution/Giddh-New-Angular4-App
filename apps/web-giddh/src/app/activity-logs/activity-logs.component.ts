import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogsService } from '../services/activity-logs.service';
import { API_BULK_FETCH_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES, IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { takeUntil } from 'rxjs/operators';
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
import { LogsService } from '../services/logs.service';
import { CompanyService } from '../services/company.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivityCompareJsonComponent } from './components/activity-compare-json/activity-compare-json.component';
import { ToasterService } from '../services/toaster.service';
import { SearchService } from '../services/search.service';
import { cloneDeep, concat, filter, forEach, map, remove, slice } from '../lodash-optimized';

/** This will use for interface */
/**
 * GetActivityLogs interface definition
 * Defines the structure and contract for GetActivityLogs objects
 */
export interface GetActivityLogs {
    name: any;
    time: any;
    ip: any;
    entity: any;
    operation: any;
}
/** Hold information of activity logs */
const ELEMENT_DATA: GetActivityLogs[] = [];
/**
 * Handles Component functionality
 */
@Component({
    selector: 'activity-logs',
    templateUrl: './activity-logs.component.html',
    styleUrls: [`./activity-logs.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:false
})
/**
 * ActivityLogsComponent component
 * Handles activitylogs functionality and user interactions
 */
export class ActivityLogsComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Instance of entry datepicker menu trigger */
    @ViewChild('entryDatepickerTrigger', { read: MatMenuTrigger }) public entryDatepickerTrigger: MatMenuTrigger;
    /** Instance of voucher datepicker menu trigger */
    @ViewChild('voucherDatepickerTrigger', { read: MatMenuTrigger }) public voucherDatepickerTrigger: MatMenuTrigger;
    /** This will use for table heading */
    public displayedColumns: string[] = ['name', 'time', 'ip', 'entity', 'operation', 'history'];
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** This will use for activity logs object */
    public activityObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalPages: 0,
        totalItems: 0,
        entity: "",
        operation: "",
        userUniqueNames: [],
        accountUniqueNames: [],
        fromDate: "",
        toDate: "",
        entityId: "",
        isChecked: false,
        entryFromDate: "",
        entryToDate: "",
        voucherFromDate: "",
        voucherToDate: ""
    }
    /** This will use for activity fields object */
    public activityFieldsObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        entity: undefined,
        operation: undefined,
        userUniqueNames: [],
        accountUniqueNames: [],
        fromDate: undefined,
        toDate: undefined,
        entityId: undefined,
        isChecked: false,
        entryFromDate: undefined,
        entryToDate: undefined,
        voucherFromDate: undefined,
        voucherToDate: undefined
    }
    /** Activity log form's company entity type list */
    public entities: IOption[] = [];
    /** Activity log form's company operations list */
    public filters: any[] = [];
    /** Activity log form's company operations list */
    public users: IOption[] = [];
    /** Activity log form's company operations list */
    public accounts: IOption[] = [];
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store selected date range to use in api */
    public selectedEntryDateRange: any;
    /** This will store selected entry date range to show on UI */
    public selectedEntryDateRangeUi: any;
    /** This will store selected date range to use in api */
    public selectedVoucherDateRange: any;
    /** This will store selected entry date range to show on UI */
    public selectedVoucherDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** This will store available date ranges */
    public entryDatePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** This will store available date ranges */
    public voucherDatePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Selected entry range label */
    public selectedEntryRangeLabel: any = "";
    /** Selected entry range label */
    public selectedVoucherRangeLabel: any = "";
    /** This will store universalDate */
    public universalDate: any;
    /** To show clear filter */
    public showDateReport: boolean = false;
    /** To show entry datepicker clear filter */
    public entryShowDateReport: boolean = false;
    /** To show voucher datepicker clear filter */
    public voucherShowDateReport: boolean = false;
    /** Holds label of selected values */
    public activityObjLabels: any = {
        entity: "",
        operation: "",
        user: "",
        account: ""
    };
    /** To show entry date filter */
    public isShowEntryDatepicker: boolean = false;
    /** Activity log  fields  list */
    public fields: IOption[] = [];
    /** Activity log  operations  list */
    public activityOperations: IOption[] = [];
    /** Activity log  select Fields  list */
    public selectedFields: any[] = [];
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True if initial api got called */
    public initialApiCalled: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        public activityService: ActivityLogsService,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private ActivityLogsService: LogsService,
        private companyService: CompanyService,
        private searchService: SearchService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * This function will use for on initialization
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("activity-log-page");
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 1) {
            this.router.navigate(['/pages/home']);
            return;
        }
        this.getFormFilter();
        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                let users: IOption[] = [];
                data.body?.map((item) => {
                    users.push({ label: item.userName, value: item.userUniqueName, additional: item });
                });
                this.users = users;
            }
        });

        this.loadDefaultAccountsSuggestions();

        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.activityObj.fromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.activityObj.toDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.selectedEntryDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedEntryDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.activityObj.entryFromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.activityObj.entryToDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.selectedVoucherDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedVoucherDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.activityObj.voucherFromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.activityObj.voucherToDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getActivityLogs();
            }
        });
    }

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof ActivityLogsComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }

    /**
    * Scroll end handler
    *
    * @returns null
    * @memberof ActivityLogsComponent
    */
    public handleScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                        this.changeDetection.detectChanges();
                    }
                });
        }
    }

    /**
   * Search query change handler
   *
   * @param {string} query Search query
   * @param {number} [page=1] Page to request
   * @param {boolean} withStocks True, if search should include stocks in results
   * @param {Function} successCallback Callback to carry out further operation
   * @memberof ActivityLogsComponent
   */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        /**
         * Handles if functionality
         */
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [
                            ...this.accounts,
                            ...searchResults
                        ];
                    }
                    this.accounts = this.accounts;
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                    this.changeDetection.detectChanges();
                }
            });
        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
                this.changeDetection.detectChanges();
            }, 500);
        }
    }

    /**
     * This function will use for get log details
     *
     * @param {*} element
     * @memberof ActivityLogsComponent
     */
    public getLogsDetails(event: any, element: any): void {
        this.dialog.open(ActivityLogsJsonComponent, {
            data: element?.details,
            panelClass: 'logs-sidebar',
            role: 'alertdialog',
            ariaLabel: 'Activity Logs'

        });
        this.addZindexCdkOverlay();
    }


    /**
    * Handles pagination events and updates API parameters
    *
    * @param {PageEvent} event - Contains pagination details
    * @memberof ActivityLogsComponent
    */
    public handlePageEvent(event: PageEvent): void {
        let newPage = this.activityObj.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.activityObj.page = newPage;
        this.activityObj.count = event.pageSize;
        this.getActivityLogs();
    }

    /**
     * This function will be called when get the activity log
     *
     * @memberof ActivityLogsComponent
     */
    public getActivityLogs(resetPage?: boolean): void {
        /**
         * Handles if functionality
         */
        if (resetPage) {
            this.activityObj.page = 1;
        }
        this.activityFieldsObj.entity = undefined;
        this.activityFieldsObj.operation = undefined;
        this.activityFieldsObj.userUniqueNames = undefined;
        this.activityFieldsObj.accountUniqueNames = undefined;
        this.activityFieldsObj.fromDate = undefined;
        this.activityFieldsObj.toDate = undefined;
        this.activityFieldsObj.entityId = undefined;
        this.activityFieldsObj.isChecked = undefined;
        this.activityFieldsObj.entryFromDate = undefined;
        this.activityFieldsObj.entryToDate = undefined;
        this.activityFieldsObj.voucherFromDate = undefined;
        this.activityFieldsObj.voucherToDate = undefined;

        (Array.isArray(this.selectedFields) ? this.selectedFields : []).forEach(field => {
            /**
             * Handles if functionality
             */
            if (field?.value === "LOG_DATE") {
                this.activityFieldsObj.fromDate = this.activityObj.fromDate;
                this.activityFieldsObj.toDate = this.activityObj.toDate;
            } else if (field?.value === "ENTITY") {
                this.activityFieldsObj.entity = this.activityObj.entity;
            } else if (field?.value === "OPERATION") {
                this.activityFieldsObj.operation = this.activityObj.operation;
            } else if (field?.value === "USERS") {
                this.activityFieldsObj.userUniqueNames = this.activityObj.userUniqueNames;
            } else if (field?.value === "ENTRY_DATE") {
                this.activityFieldsObj.entryFromDate = this.activityObj.entryFromDate;
                this.activityFieldsObj.entryToDate = this.activityObj.entryToDate;
            } else if (field?.value === "VOUCHER_DATE") {
                this.activityFieldsObj.voucherFromDate = this.activityObj.voucherFromDate;
                this.activityFieldsObj.voucherToDate = this.activityObj.voucherToDate;
            } else if (field?.value === "ACCOUNTS") {
                this.activityFieldsObj.accountUniqueNames = this.activityObj.accountUniqueNames;
            }
        });


        /**
         * Handles if functionality
         */
        if (!this.initialApiCalled) {
            this.initialApiCalled = true;
            this.activityFieldsObj.fromDate = this.activityObj.fromDate;
            this.activityFieldsObj.toDate = this.activityObj.toDate;
        }

        this.activityFieldsObj.page = this.activityObj.page;
        this.activityFieldsObj.count = this.activityObj.count;
        this.isLoading = true;
        this.activityService.getActivityLogs(this.activityFieldsObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            /**
             * Handles if functionality
             */
            if (response && response.status === 'success') {
                response.body?.results?.forEach((result, index) => {
                    /**
                     * Handles if functionality
                     */
                    if (result) {
                        result.index = index;
                        result.timeonly = dayjs(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format("HH:mm:ss");
                        result.time = dayjs(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    }
                });
                this.activityObj.page = response.body?.page;
                this.activityObj.totalItems = response.body?.totalItems;
                this.activityObj.totalPages = response.body?.totalPages;
                this.activityObj.count = response.body?.count;
                this.dataSource = response.body?.results;
            } else {
                this.dataSource = [];
                this.activityObj.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     * To select user type
     *
     * @param {IOption} event Selected item object
     * @memberof ActivityLogsComponent
     */
    public selecteUserType(event: IOption): void {
        /**
         * Handles if functionality
         */
        if (event && event.value) {
            this.activityObj.userUniqueNames = [];
            this.activityObj.userUniqueNames.push(event.value);
        } else {
            this.activityObj.userUniqueNames = [];
        }
    }

    /**
     * To select account type
     *
     * @param {IOption} event Selected item object
     * @memberof ActivityLogsComponent
     */
    public selecteAccountType(event: IOption): void {
        /**
         * Handles if functionality
         */
        if (event && event.value) {
            this.activityObj.accountUniqueNames = [];
            this.activityObj.accountUniqueNames.push(event.value);
        } else {
            this.activityObj.accountUniqueNames = [];
        }
    }

    /**
     * To select entity type
     *
     * @param {IOption} event Selected item object
     * @memberof ActivityLogsComponent
     */
    public selecteEntityType(event: IOption): void {
        /**
         * Handles if functionality
         */
        if (event && (event.value === 'ENTRY' || event.value === 'VOUCHER')) {
            this.isShowEntryDatepicker = true;
        } else {
            this.isShowEntryDatepicker = false;
        }
    }

    /**
     * To get activity log form filter
     *
     * @memberof ActivityLogsComponent
     */
    public getFormFilter(): void {
        this.ActivityLogsService.getAuditLogFormFilters().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            /**
             * Handles if functionality
             */
            if (response && response.status === 'success') {
                this.entities = [];
                response.body?.forEach(res => {
                    this.entities.push(res.entity);
                });
            }
        });
        this.changeDetection.detectChanges();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
     */
    public dateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.showDateReport = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.activityObj.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.activityObj.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Call back function for date/range selection in entry datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
     */
    public entryDateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleEntryGiddhDatepicker(false);
            return;
        }
        this.selectedEntryRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedEntryRangeLabel = value.name;
        }
        this.toggleEntryGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.entryShowDateReport = true;
            this.selectedEntryDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedEntryDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.activityObj.entryFromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.activityObj.entryToDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Call back function for date/range selection in voucher datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
     */
    public voucherDateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleVoucherGiddhDatepicker(false);
            return;
        }
        this.selectedVoucherRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedVoucherRangeLabel = value.name;
        }
        this.toggleVoucherGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.voucherShowDateReport = true;
            this.selectedVoucherDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedVoucherDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.activityObj.voucherFromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.activityObj.voucherToDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Toggles the universal datepicker menu
     *
     * @param {boolean} isOpen
     * @memberof ActivityLogsComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Toggles the entry datepicker menu
     *
     * @param {boolean} isOpen
     * @memberof ActivityLogsComponent
     */
    public toggleEntryGiddhDatepicker(isOpen: boolean = true): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.entryDatepickerTrigger?.openMenu();
        } else {
            this.entryDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Toggles the voucher datepicker menu
     *
     * @param {boolean} isOpen
     * @memberof ActivityLogsComponent
     */
    public toggleVoucherGiddhDatepicker(isOpen: boolean = true): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.voucherDatepickerTrigger?.openMenu();
        } else {
            this.voucherDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * To check is entry expanded
     *
     * @param {*} entry Transaction object
     * @memberof ActivityLogsComponent
     */
    public getHistory(event: any, row: any): void {
        /**
         * Handles if functionality
         */
        if (!row.hasHistory) {
            let activityObj = { entityId: row.entityId, entity: row.entity, count: API_BULK_FETCH_LIMIT };
            this.activityService.getActivityLogs(activityObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                row.hasHistory = true;
                /**
                 * Handles if functionality
                 */
                if (response && response.status === 'success') {
                    /**
                     * Handles if functionality
                     */
                    if (response.body?.results?.length > 1) {
                        response.body?.results?.forEach((result, index) => {
                            /**
                             * Handles if functionality
                             */
                            if (result) {
                                result.index = index;
                                result.timeonly = dayjs(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format("HH:mm:ss");
                                result.time = dayjs(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                            }
                        });
                        row.history = response.body.results;
                        row.isExpanded = !row.isExpanded;
                    } else {
                        this.toaster.showSnackBar('info', this.localeData?.no_history);
                        row.history = [];
                        row.isExpanded = false;
                        this.addZindexCdkOverlay();
                        /**
                         * Sets timeout value
                         */
                        setTimeout(() => {
                            this.removeZindexCdkOverlay();
                        }, 3000);
                    }
                } else {
                    row.history = [];
                }
                this.changeDetection.detectChanges();
            });
        } else if (row.history?.length) {
            row.isExpanded = !row.isExpanded;
            this.removeZindexCdkOverlay();
        } else {
            this.toaster.showSnackBar('info', this.localeData?.no_history);
            this.addZindexCdkOverlay();
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.removeZindexCdkOverlay();
            }, 3000);
        }
    }

    /**
     * This function will use for selected items
     *
     * @param {MatCheckboxChange} event
     * @param {*} rowHistory
     * @param {*} details
     * @memberof ActivityLogsComponent
     */
    public selectedItems(event: MatCheckboxChange, rowHistory: any, details: any): void {
        /**
         * Handles if functionality
         */
        if (!rowHistory.selectedItems) {
            rowHistory.selectedItems = [];
        }
        /**
         * Handles if functionality
         */
        if (event?.checked) {
            details.isChecked = true;
            rowHistory.selectedItems.push(details);
            /**
             * Handles if functionality
             */
            if (rowHistory.selectedItems?.length > 2) {
                const firstElement = rowHistory.selectedItems[0];
                rowHistory.selectedItems = rowHistory.selectedItems.slice(1);
                firstElement.isChecked = false;
            }
        } else {
            rowHistory.selectedItems.pop(details);
            details.isChecked = false;
        }
        this.changeDetection.detectChanges();
    }

    /**
     *This function will use for compare json key values
     *
     * @param {*} rowHistory
     * @param {*} details
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public compareHistoryJson(rowHistory: any, details: any, event: any): void {

        let data;
        /**
         * Handles if functionality
         */
        if (rowHistory.selectedItems[0]?.index === details.index) {
            data = [rowHistory.selectedItems[1]?.details, rowHistory.selectedItems[0]?.details];
        } else {
            data = [rowHistory.selectedItems[0]?.details, rowHistory.selectedItems[1]?.details];
        }

        this.dialog.open(ActivityCompareJsonComponent, {
            data: data,
            panelClass: 'json-sidebar'
        });
        this.addZindexCdkOverlay();
    }

    /**
     *This function will use for component destroy
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.body?.classList?.remove("activity-log-page");
    }
    /**
     * TrackBy function for selectedFields ngFor to improve Angular 21 performance
     *
     * @param index - Index of the item
     * @param item - The item being tracked
     * @returns Unique identifier for the item
     * @memberof ActivityLogsComponent
     */
    public trackBySelectedField(index: number, item: any): any {
        return item?.value || index;
    }

    /**
     * Adds Z-index class to cdk-overlay element
     *
     * @memberof ActivityLogsComponent
     */
    public addZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.add('cdk-overlay-container-z-index');
    }

    /**
     * Removes Z-index class to cdk-overlay element
     *
     * @memberof ActivityLogsComponent
     */
    public removeZindexCdkOverlay(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.remove('cdk-overlay-container-z-index');
    }

    /**
     * This will use for on clear value of operations
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public resetEntity(event: any): void {
        /**
         * Handles if functionality
         */
        if (!event?.value) {
            this.activityObjLabels.entity = '';
            this.activityObj.entity = '';
        }
    }

    /**
     * This will use for on clear value of operations
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public resetUser(event: any): void {
        /**
         * Handles if functionality
         */
        if (!event?.value) {
            this.activityObjLabels.user = '';
            this.activityObj.userUniqueNames = [];
        }
    }

    /**
     * This will use for on clear value of operations
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public resetAccounts(event: any): void {
        /**
         * Handles if functionality
         */
        if (!event?.value) {
            this.activityObjLabels.account = '';
            this.activityObj.accountUniqueNames = [];
            this.loadDefaultAccountsSuggestions();
        }
    }

    /**
    * This will use for on clear value of operations
    *
    * @param {*} event
    * @memberof ActivityLogsComponent
    */
    public resetOperation(event: any): void {
        /**
         * Handles if functionality
         */
        if (!event?.value) {
            this.activityObjLabels.operation = '';
            this.activityObj.operation = '';
        }
    }

    /**
     * This will use for add default feature
     *
     * @return {*}  {void}
     * @memberof ActivityLogsComponent
     */
    public addDefaultFilter(): void {
        /**
         * Handles if functionality
         */
        if (this.selectedFields.length > 0) {
            this.selectedFields.push({
                label: '',
                value: ''
            });
        } else {
            this.selectedFields.push(this.fields[0]);
        }
    }

    /**
    *This will use for  remove default filter
    *
    * @param {*} event
    * @param {number} index
    * @memberof ActivityLogsComponent
    */
    public removeFilter(event: any, index: number): void {
        /**
         * Handles if functionality
         */
        if (index >= 0) {
            this.selectedFields?.splice(index, 1);
        }
        /**
         * Handles if functionality
         */
        if (event?.value === "ENTITY") {
            this.activityObjLabels.entity = '';
            this.activityObj.entity = '';
        }
        /**
         * Handles if functionality
         */
        if (event?.value === "OPERATION") {
            this.activityObjLabels.operation = '';
            this.activityObj.operation = '';
        }
        /**
         * Handles if functionality
         */
        if (event?.value === "USERS") {
            this.activityObjLabels.user = '';
            this.activityObj.userUniqueNames = [];
        }
        /**
         * Handles if functionality
         */
        if (event?.value === "ACCOUNTS") {
            this.activityObjLabels.account = '';
            this.activityObj.accountUniqueNames = [];
        }
    }

    /**
     * This will use for select field
     *
     * @param {*} index
     * @param {*} selectedValue
     * @memberof ActivityLogsComponent
     */
    public selectField(index: number, selectedValue: any): void {
        let newValue = this.selectedFields.filter(val => val?.value === selectedValue?.value);
        /**
         * Handles if functionality
         */
        if (this.selectedFields[index]?.value !== selectedValue?.value) {
            /**
             * Handles if functionality
             */
            if (newValue?.length > 0) {
                this.toaster.showSnackBar('warning', selectedValue.label + ' ' + this.localeData?.duplicate_values);
                this.selectedFields[index] = {
                    label: '',
                    value: ''
                };
            } else {
                this.selectedFields[index] = selectedValue;
                this.changeDetection.detectChanges();
            }
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public translationComplete(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.translationLoaded = true;
            this.fields = [
                {
                    label: this.localeData?.log_date,
                    value: "LOG_DATE",
                },
                {
                    label: this.localeData?.entity,
                    value: "ENTITY"
                },
                {
                    label: this.localeData?.operation,
                    value: "OPERATION"
                },
                {
                    label: this.localeData?.users,
                    value: "USERS"
                },
                {
                    label: this.localeData?.entry_date,
                    value: "ENTRY_DATE"
                },
                {
                    label: this.localeData?.voucher_date,
                    value: "VOUCHER_DATE"
                },
                {
                    label: this.commonLocaleData?.app_import_type?.base_accounts,
                    value: "ACCOUNTS"
                },
            ];
            this.activityOperations = [
                {
                    label: this.localeData?.create,
                    value: "CREATE",
                },
                {
                    label: this.localeData?.update,
                    value: "UPDATE"
                },
                {
                    label: this.localeData?.delete,
                    value: "DELETE"
                },
                {
                    label: this.localeData?.merge,
                    value: "MERGE"
                },
                {
                    label: this.localeData?.unmerge,
                    value: "UNMERGE",
                },
                {
                    label: this.localeData?.move,
                    value: "MOVE"
                }
            ];
            this.addDefaultFilter();
            this.changeDetection.detectChanges();
        }
    }
}
