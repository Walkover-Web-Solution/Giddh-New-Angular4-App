import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { take, takeUntil } from 'rxjs/operators';
import { from, Observable, ReplaySubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { I } from '@angular/cdk/keycodes';
import { cloneDeep } from '../../../lodash-optimized';


@Component({
    selector: 'new-inventory-advance-search',
    templateUrl: './new-inventory-advance-search.component.html',
    styleUrls: ['./new-inventory-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewInventoryAdavanceSearch implements OnInit {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
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
    /* Hold advance search category*/
    public advanceSearchCatergory: any[] = [
        {
            value: "Inward",
            label: "Inwards"
        },
        {
            value: "Outward",
            label: "Outwards "
        }
    ];
    /* Hold advance search category options*/
    public advanceSearchCatergoryOptions: any[] = [
        {
            value: "Amount",
            label: "Amount"
        },
        {
            value: "Quantity",
            label: "Quantity",
        }
    ];
    /* Hold advance search vslue*/
    public advanceSearchValue: any[] = [
        {
            value: "Equals",
            label: "Equals"
        },
        {
            value: "Greater than",
            label: "Greater than"
        },
        {
            value: "Less than",
            label: "Less than"
        },
        {
            value: "Excluded",
            label: "Excluded"
        }
    ];
    /** Instance of advance search form*/
    public advanceSearchFormObj: any = {};

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
     * @memberof NewInventoryAdavanceSearch
     */
    public ngOnInit() {
     this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
        if (this.inputData?.stockReportRequest) {
            if(this.inputData?.advanceSearchResponse){
                this.advanceSearchFormObj = cloneDeep(this.inputData.advanceSearchResponse?.stockReportRequest);
            }
            let from = this.inputData?.stockReportRequest.from;
            let to = this.inputData?.stockReportRequest.to;
            this.selectedDateRange = { startDate: dayjs(from, GIDDH_DATE_FORMAT), endDate: dayjs(to,GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(from,GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(to,GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.advanceSearchFormObj.fromDate = dayjs(from,GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFormObj.toDate = dayjs(to,GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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
     * @memberof NewInventoryAdavanceSearch
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
            searching: Boolean
        }
    }

    /**
     * This will use for allow only number
     *
     * @param {*} event
     * @return {*}  {boolean}
     * @memberof NewInventoryAdavanceSearch
     */
    public allowOnlyNumbers(event: any): boolean {
        return this.generalService.allowOnlyNumbers(event);
    }

    /**
     * This will use for advance search  category
     *
     * @param {*} category
     * @memberof NewInventoryAdavanceSearch
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
     * @memberof NewInventoryAdavanceSearch
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
     * @memberof NewInventoryAdavanceSearch
     */
    public selectValue(value: any): void {
        if (value) {
            this.advanceSearchFormObj.expression = value;
        }
    }

    /**
     *This will use for advanced search action
     *
     * @param {string} [type]
     * @return {*}  {void}
     * @memberof NewInventoryAdavanceSearch
     */
    public advanceSearchAction(type?: string): void {
        if (this.advanceSearchFormObj.param1 && this.advanceSearchFormObj.param2) {
            this.advanceSearchFormObj.param = this.advanceSearchFormObj.param1?.toUpperCase() + '_' + this.advanceSearchFormObj.param2?.toUpperCase();
        }
        if (this.advanceSearchFormObj.expression == 'Equals') {
            let expression = this.advanceSearchFormObj.expression?.toUpperCase();
            this.advanceSearchFormObj.expression = expression;
        } else if (this.advanceSearchFormObj.expression == 'Excluded') {
            this.advanceSearchFormObj.expression = "NOT_EQUALS";
        } else if (this.advanceSearchFormObj.expression == "Less Than") {
            this.advanceSearchFormObj.expression = "LESS_THAN";
        } else if (this.advanceSearchFormObj.expression == "Greater Than") {
            this.advanceSearchFormObj.expression = "GEATER_THAN";
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
            stockReportRequest: this.advanceSearchFormObj
        });
        this.advanceSearchFormObj.searching = true;
    }

    /**
     * Callback function of datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof NewInventoryAdavanceSearch
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
     * @memberof NewInventoryAdavanceSearch
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }
    /**
     * This will use for show giddh datepicker
     *
     * @param {*} element
     * @memberof NewInventoryAdavanceSearch
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
     * This hook will use for on destroyed the component
     *
     * @memberof NewInventoryAdavanceSearch
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
