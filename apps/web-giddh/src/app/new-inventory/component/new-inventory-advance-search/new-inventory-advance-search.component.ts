import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'new-inventory-advance-search',
    templateUrl: './new-inventory-advance-search.component.html',
    styleUrls: ['./new-inventory-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewInventoryAdvanceSearch implements OnInit {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
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

    constructor(
        private _breakPointObservar: BreakpointObserver,
        private generalService: GeneralService,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        public modalService: BsModalService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * This will use in component initialization
     *
     * @memberof NewInventoryAdvanceSearch
     */
    public ngOnInit() {
        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
        this.reportType = this.inputData?.reportType;
        if (this.inputData?.stockReportRequest) {
            if (this.inputData?.advanceSearchResponse) {
                this.advanceSearchFormObj = cloneDeep(this.inputData.advanceSearchResponse?.stockReportRequest);
                if (this.advanceSearchFormObj.expression === 'EQUALS') {
                    this.advanceSearchFormObj.expression = "Equals";
                } else if (this.advanceSearchFormObj.expression === 'NOT_EQUALS') {
                    this.advanceSearchFormObj.expression = "Excluded";
                } else if (this.advanceSearchFormObj.expression === "LESS_THAN") {
                    this.advanceSearchFormObj.expression = "Less than";
                } else if (this.advanceSearchFormObj.expression === "GREATER_THAN") {
                    this.advanceSearchFormObj.expression = "Greater than";
                }
                if (this.advanceSearchFormObj.param === "OPENING_AMOUNT" || this.advanceSearchFormObj.param === "OPENING_QUANTITY") {
                    this.advanceSearchFormObj.param1 = "Opening Stock";
                }
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
                if (dateObj) {
                    let universalDate = _.cloneDeep(dateObj);
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
        if (this.advanceSearchFormObj.param1 && this.advanceSearchFormObj.param2) {
            if (this.advanceSearchFormObj.param1 === 'Opening Stock') {
                this.advanceSearchFormObj.param1 = "OPENING";
            } else if (this.advanceSearchFormObj.param1 === 'Closing Stock') {
                this.advanceSearchFormObj.param1 = "CLOSING";
            }
            this.advanceSearchFormObj.param = this.advanceSearchFormObj.param1?.toUpperCase() + '_' + this.advanceSearchFormObj.param2?.toUpperCase();
        }
        if (this.advanceSearchFormObj.expression === 'Equals') {
            this.advanceSearchFormObj.expression = "EQUALS";
        } else if (this.advanceSearchFormObj.expression === 'Excluded') {
            this.advanceSearchFormObj.expression = "NOT_EQUALS";
        } else if (this.advanceSearchFormObj.expression === "Less than") {
            this.advanceSearchFormObj.expression = "LESS_THAN";
        } else if (this.advanceSearchFormObj.expression === "Greater than") {
            this.advanceSearchFormObj.expression = "GREATER_THAN";
        }
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
                if (dateObj) {
                    let universalDate = _.cloneDeep(dateObj);
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
            this.advanceSearchFormObj.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFormObj.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * This will use for hide giddh datepicker
     *
     * @memberof NewInventoryAdvanceSearch
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }
    /**
     * This will use for show giddh datepicker
     *
     * @param {*} element
     * @memberof NewInventoryAdvanceSearch
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
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof NewInventoryAdvanceSearch
     */
    public translationComplete(event: any): void {
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
