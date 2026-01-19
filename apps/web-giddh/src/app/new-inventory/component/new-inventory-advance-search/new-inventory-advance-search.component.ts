import { Component, OnInit, OnDestroy, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { cloneDeep } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'new-inventory-advance-search',

    templateUrl: './new-inventory-advance-search.component.html',
    standalone: false,
    styleUrls: ['./new-inventory-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * NewInventoryAdvanceSearch component
 * Handles newinventoryadvancesearch functionality and user interactions
 */
export class NewInventoryAdvanceSearch implements OnInit, OnDestroy {
    /** Reference of datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
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
/** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* dayjs object */
    public dayjs = dayjs;
    /* Show on transaction report and hold advance search category*/
    public advanceSearchCategoryTransaction: any[] = [];
    /* Hold advance search category   */
    public advanceSearchCategory: any[] = [];
    /* Hold advance search category options*/
    public advanceSearchCategoryOptions: any[] = [];
    /* Hold advance search vslue*/
    public advanceSearchValue: any[] = [];
    /** Instance of advance search form*/
    public advanceSearchFormObj: any = {};
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds report type for modules */
    public reportType: string = '';

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * This will use in component initialization
     *
     * @memberof NewInventoryAdvanceSearch
     */
    public ngOnInit() {
        this.reportType = this.inputData?.reportType;
        /**
         * Handles if functionality
         */
        if (this.inputData?.stockReportRequest) {
            /**
             * Handles if functionality
             */
            if (this.inputData?.advanceSearchResponse) {
                this.advanceSearchFormObj = cloneDeep(this.inputData.advanceSearchResponse?.stockReportRequest);
                /**
                 * Handles if functionality
                 */
                if (this.advanceSearchFormObj.expression === 'EQUALS') {
                    this.advanceSearchFormObj.expression = "Equals";
                } else if (this.advanceSearchFormObj.expression === 'NOT_EQUALS') {
                    this.advanceSearchFormObj.expression = "Excluded";
                } else if (this.advanceSearchFormObj.expression === "LESS_THAN") {
                    this.advanceSearchFormObj.expression = "Less than";
                } else if (this.advanceSearchFormObj.expression === "GREATER_THAN") {
                    this.advanceSearchFormObj.expression = "Greater than";
                }
                /**
                 * Handles if functionality
                 */
                if (this.advanceSearchFormObj.param === "OPENING_AMOUNT" || this.advanceSearchFormObj.param === "OPENING_QUANTITY") {
                    this.advanceSearchFormObj.param1 = "Opening Stock";
                }
                /**
                 * Handles if functionality
                 */
                if (this.advanceSearchFormObj.param === "CLOSING_AMOUNT" || this.advanceSearchFormObj.param === "CLOSING_QUANTITY") {
                    this.advanceSearchFormObj.param1 = "Closing Stock";
                }
            }
            let from = this.inputData?.stockReportRequest.from;
            let to = this.inputData?.stockReportRequest.to;
            this.selectedDateRange = { startDate: dayjs(from, GIDDH_DATE_FORMAT), endDate: dayjs(to, GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.advanceSearchFormObj.fromDate = dayjs(from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFormObj.toDate = dayjs(to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        } else {
            this.universalDate$.pipe(take(1)).subscribe(dateObj => {
                /**
                 * Handles if functionality
                 */
                if (dateObj) {
                    let universalDate = cloneDeep(dateObj);
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.advanceSearchFormObj.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.advanceSearchFormObj.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                }
            });
        }
    }

    /**
     * This will use for advance searhc fields
     *
     * @memberof NewInventoryAdvanceSearch
     */
    public initFormFields(): void {
        this.advanceSearchFormObj =
        {
            expression: null,
            param: null,
            param1: null,
            param2: null,
            val: 0,
            fromDate: null,
            toDate: null,
            searching: false
        }
    }
    /**
     * This will use for advance search  category
     *
     * @param {*} category
     * @memberof NewInventoryAdvanceSearch
     */
    public selectCategory(category: any): void {
        /**
         * Handles if functionality
         */
        if (category) {
            this.advanceSearchFormObj.param1 = category;
        }
    }

    /**
     * This will use for select category options
     *
     * @param {*} expression
     * @memberof NewInventoryAdvanceSearch
     */
    public selectCategoryOptions(expression: any): void {
        /**
         * Handles if functionality
         */
        if (expression) {
            this.advanceSearchFormObj.param2 = expression;
        }
    }

    /**
     * This will use for select advanced search value
     *
     * @param {*} value
     * @memberof NewInventoryAdvanceSearch
     */
    public selectValueType(value: any): void {
        /**
         * Handles if functionality
         */
        if (value) {
            this.advanceSearchFormObj.expression = value;
        }
    }

    /**
     *This will use for advanced search action
     *
     * @param {string} [type]
     * @return {*}  {void}
     * @memberof NewInventoryAdvanceSearch
     */
    public advanceSearchAction(type?: string): void {
        /**
         * Handles if functionality
         */
        if (this.advanceSearchFormObj.param1 && this.advanceSearchFormObj.param2) {
            /**
             * Handles if functionality
             */
            if (this.advanceSearchFormObj.param1 === 'Opening Stock') {
                this.advanceSearchFormObj.param1 = "OPENING";
            } else if (this.advanceSearchFormObj.param1 === 'Closing Stock') {
                this.advanceSearchFormObj.param1 = "CLOSING";
            }
            this.advanceSearchFormObj.param = this.advanceSearchFormObj.param1?.toUpperCase() + '_' + this.advanceSearchFormObj.param2?.toUpperCase();
        }
        /**
         * Handles if functionality
         */
        if (this.advanceSearchFormObj.expression === 'Equals') {
            this.advanceSearchFormObj.expression = "EQUALS";
        } else if (this.advanceSearchFormObj.expression === 'Excluded') {
            this.advanceSearchFormObj.expression = "NOT_EQUALS";
        } else if (this.advanceSearchFormObj.expression === "Less than") {
            this.advanceSearchFormObj.expression = "LESS_THAN";
        } else if (this.advanceSearchFormObj.expression === "Greater than") {
            this.advanceSearchFormObj.expression = "GREATER_THAN";
        }
        /**
         * Handles if functionality
         */
        if (type === 'cancel') {
            this.dialogRef.close();
            return;
        } else if (type === 'clear') {
            this.advanceSearchFormObj.param = null;
            this.advanceSearchFormObj.param1 = null;
            this.advanceSearchFormObj.param2 = null;
            this.advanceSearchFormObj.expression = null;
            this.advanceSearchFormObj.val = null;
            this.advanceSearchFormObj.searching = false;
            this.universalDate$.pipe(take(1)).subscribe(dateObj => {
                /**
                 * Handles if functionality
                 */
                if (dateObj) {
                    let universalDate = cloneDeep(dateObj);
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.advanceSearchFormObj.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.advanceSearchFormObj.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                }
            });
            return;
        }
        this.dialogRef.close({
            stockReportRequest: this.advanceSearchFormObj,
            stockReportRequestExport: this.advanceSearchFormObj
        });
        this.advanceSearchFormObj.searching = true;
    }

    /**
     * Callback function of datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof NewInventoryAdvanceSearch
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.advanceSearchFormObj.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFormObj.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen
     * @memberof NewInventoryAdvanceSearch
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
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
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof NewInventoryAdvanceSearch
     */
    public translationComplete(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.translationLoaded = true;
            this.advanceSearchCategoryTransaction= [
                {
                    value: "Inward",
                    label: this.localeData?.reports?.inwards,
                },
                {
                    value: "Outward",
                    label: this.localeData?.reports?.outwards,
                }
            ];
            this.advanceSearchCategory= [
                {
                    value: "Inward",
                    label: this.localeData?.reports?.inwards,
                },
                {
                    value: "Outward",
                    label: this.localeData?.reports?.outwards,
                },
                {
                    value: "Opening Stock",
                    label: this.localeData?.reports?.opening_stock,
                },
                {
                    value: "Closing Stock",
                    label: this.localeData?.reports?.closing_stock,
                }
            ];
            this.advanceSearchCategoryOptions= [
                {
                    value: "Amount",
                    label: this.localeData?.advance_search_filter?.amount,
                },
                {
                    value: "Quantity",
                    label: this.localeData?.advance_search_filter?.quantity,
                }
            ];
            this.advanceSearchValue = [
                {
                    value: "Equals",
                    label: this.localeData?.advance_search_filter?.equals,
                },
                {
                    value: "Greater than",
                    label: this.localeData?.advance_search_filter?.greater_than,
                },
                {
                    value: "Less than",
                    label: this.localeData?.advance_search_filter?.less_than,
                },
                {
                    value: "Excluded",
                    label: this.localeData?.advance_search_filter?.excluded,
                }
            ];
        }
    }

    /**
     * This hook will use for on destroyed the component
     *
     * @memberof NewInventoryAdvanceSearch
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
