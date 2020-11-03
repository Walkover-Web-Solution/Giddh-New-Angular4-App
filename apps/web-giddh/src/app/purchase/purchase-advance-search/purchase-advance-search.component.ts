import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { IOption } from '../../theme/ng-select/ng-select';
import * as moment from 'moment/moment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { purchaseOrderStatus } from "../../shared/helpers/purchaseOrderStatus";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';

/* Amount comparision filters */
const AMOUNT_COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'GREATER_THAN' },
    { label: 'Greater Than or Equals', value: 'GREATER_THAN_OR_EQUALS' },
    { label: 'Less Than', value: 'LESS_THAN' },
    { label: 'Less Than or Equals', value: 'LESS_THAN_OR_EQUALS' },
    { label: 'Equals', value: 'EQUALS' },
    { label: 'Not Equals', value: 'NOT_EQUALS' }
];


@Component({
    selector: 'purchase-advance-search',
    templateUrl: './purchase-advance-search.component.html',
    styleUrls: ['./purchase-advance-search.component.scss']
})

export class PurchaseAdvanceSearchComponent implements OnInit, OnDestroy {
    /* This will hold the amount filter */
    public filtersForAmount: IOption[] = AMOUNT_COMPARISON_FILTER;
    /* This will hold the status filter */
    public filtersForStatus: IOption[] = [];
    /* This will input the filters to preselect them */
    @Input() public purchaseOrderPostRequest;
    /* Emitter for filters */
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();
    /* Datepicker template */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Moment object */
    public moment = moment;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected grand total operator */
    public selectedGrandTotalOperator: any = "";
    /* This will hold the default input search values */
    public defaultPurchaseOrderPostRequest: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private modalService: BsModalService, private breakPointObservar: BreakpointObserver, private store: Store<AppState>, private generalService: GeneralService) {

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public ngOnInit(): void {
        purchaseOrderStatus.map(status => {
            this.filtersForStatus.push({ label: status.label, value: status.value });
        });

        if (this.purchaseOrderPostRequest && this.purchaseOrderPostRequest.grandTotalOperation) {
            this.filtersForAmount.forEach(operator => {
                if (operator.value === this.purchaseOrderPostRequest.grandTotalOperation) {
                    this.selectedGrandTotalOperator = operator.label;
                }
            });
        }

        this.defaultPurchaseOrderPostRequest = _.cloneDeep(this.purchaseOrderPostRequest);

        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        if(this.purchaseOrderPostRequest && this.purchaseOrderPostRequest.dueFrom && this.purchaseOrderPostRequest.dueTo) {
            this.selectedDateRange = { startDate: moment(this.purchaseOrderPostRequest.dueFrom, GIDDH_DATE_FORMAT), endDate: moment(this.purchaseOrderPostRequest.dueTo, GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = moment(this.purchaseOrderPostRequest.dueFrom, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.purchaseOrderPostRequest.dueTo, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
        }
    }

    /**
     * This will show the datepicker
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );

        this.modalService.onHidden.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.hideGiddhDatepicker();
        });
    }

    /**
     * This will hide the datepicker
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof PurchaseAdvanceSearchComponent
     */
    public dateSelectedCallback(value?: any): void {
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }

        this.hideGiddhDatepicker();

        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.purchaseOrderPostRequest.dueFrom = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.purchaseOrderPostRequest.dueTo = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * This will emit the search data
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public onSearch(): void {
        this.closeModelEvent.emit(this.purchaseOrderPostRequest);
    }

    /**
     * This will emit false on cancel search
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public onCancel(): void {
        this.closeModelEvent.emit(false);
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}