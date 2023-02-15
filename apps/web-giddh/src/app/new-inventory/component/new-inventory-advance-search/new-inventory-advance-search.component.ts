import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'new-inventory-advance-search',
    templateUrl: './new-inventory-advance-search.component.html',
    styleUrls: ['./new-inventory-advance-search.component.scss'],
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
            value: "INWARD_QUANTITY",
            label: "Inwards"
        },
        {
            value: "OUTWARD_QUANTITY",
            label: "Outwards "
        }
    ];

    public advanceSearchCatergoryOptions: any[] = [
        {
            value: "INWARD_AMOUNT",
            label: "Inwards"
        },
        {
            value: "OUTWARD_AMOUNT",
            label: "Outwards"
        }
    ];


    public advanceSearchValue: any[] = [
        {
            value: "EQUALS",
            label: "Equals"
        },
        {
            value: "GREATER_THAN",
            label: "Greater than"
        },
        {
            value: "LESS_THAN",
            label: "Less than"
        },
        {
            value: "NOT_EQUALS",
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
        public dialog: MatDialog,
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
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                // this.getStockTransactions(); This will use for intially api call
            }
        });
    }

    /**
 *Call back function for date/range selection in datepicker
 *
 * @param {*} [value]
 * @return {*}  {void}
 * @memberof InventoryTransactionListComponent
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
        }
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


    public initFormFields(): void {
        this.advanceSearchFormObj =
        {
            expression: null,
            param: null,
            value:null,
            val: 0
        }
    }


    public allowOnlyNumbers(event: any): boolean {
        return this.generalService.allowOnlyNumbers(event);
    }


    public selectCategory(category: any): void {
        if (category) {
            this.advanceSearchFormObj.param = category;
        }
    }
    public selectCategoryOptions(expression: any): void {
        if (expression) {
            this.advanceSearchFormObj.expression = expression;
        }
    }
    public selectValue(value: any): void {
        if (value) {
            this.advanceSearchFormObj.value = value;
        }
    }
    public advanceSearchAction(type?: string) {
        if (type === 'cancel') {
            this.advanceSearchFormObj.param = null;
            this.advanceSearchFormObj.expression = null;
            this.advanceSearchFormObj.value = null;
            this.advanceSearchFormObj.val = null;
            this.dialog?.closeAll();
            return;
        } else if (type === 'clear') {
            this.advanceSearchFormObj.param = null;
            this.advanceSearchFormObj.expression = null;
            this.advanceSearchFormObj.value = null;
            this.advanceSearchFormObj.val = null;
            return;
        }

            // this.getStockReport(true); // y  call krna pdega normal search krne pr

    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
