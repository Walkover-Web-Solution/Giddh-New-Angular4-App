import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
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
    /** True if valid fields*/
    public mandatoryFields: any = {
        val: false
    }
    /** Instance of create trigger form*/
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
    public ngOnInit() {
        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
        if (this.inputData?.stockReportRequest?.dataToSend?.bsRangeValue) {
            let dateObj = this.inputData?.stockReportRequest?.dataToSend?.bsRangeValue;
            let universalDate = _.cloneDeep(dateObj);
            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.advanceSearchFormObj.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFormObj.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
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


    public allowOnlyNumbers(event: any): boolean {
        return this.generalService.allowOnlyNumbers(event);
    }


    public selectCategory(category: any): void {
        if (category) {
            this.advanceSearchFormObj.param1 = category;
        }
    }
    public selectCategoryOptions(expression: any): void {
        if (expression) {
            this.advanceSearchFormObj.param2 = expression;
        }
    }
    public selectValue(value: any): void {
        if (value) {
            this.advanceSearchFormObj.expression = value;
        }
    }
    public advanceSearchAction(type?: string): void {
        if (this.advanceSearchFormObj.param1 && this.advanceSearchFormObj.param2) { // creating value for key parma like "qty_cr", "amt_cr"
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
            this.advanceSearchFormObj.param = null;
            this.advanceSearchFormObj.param1 = null;
            this.advanceSearchFormObj.param2 = null;
            this.advanceSearchFormObj.expression = null;
            this.advanceSearchFormObj.val = null;
            this.advanceSearchFormObj.searching = false;
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

    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
