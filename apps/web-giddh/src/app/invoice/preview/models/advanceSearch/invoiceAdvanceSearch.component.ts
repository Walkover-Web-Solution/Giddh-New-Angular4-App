import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { InvoiceFilterClassForInvoicePreview } from '../../../../models/api-models/Invoice';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../../shared/helpers/defaultDateFormat';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from 'apps/web-giddh/src/app/app.constant';
import { Observable } from 'rxjs';

const COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' }
];

const PREVIEW_OPTIONS = [
    { label: 'Paid', value: 'paid' },
    { label: 'Partially Paid', value: 'partial-paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Hold', value: 'hold' },
    { label: 'Cancel', value: 'cancel' },
];

const DATE_OPTIONS = [
    { label: 'On', value: 'on' },
    { label: 'After', value: 'after' },
    { label: 'Before', value: 'before' },
];

const AMOUNT_COMPARISON_FILTER = [
    { label: 'Equals', value: 'equals' },
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Exclude', value: 'exclude' },
];

@Component({
    selector: 'invoice-advance-search-component',
    templateUrl: './invoiceAdvanceSearch.component.html',
    styleUrls: [`./invoiceAdvanceSearch.component.scss`]
})

export class InvoiceAdvanceSearchComponent implements OnInit, OnChanges {
    @Input() public type: 'invoice' | 'drcr' | 'receipt' | 'proforma' | 'purchase';
    @Input() public request: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
    @Output() public applyFilterEvent: EventEmitter<InvoiceFilterClassForInvoicePreview> = new EventEmitter<InvoiceFilterClassForInvoicePreview>();
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChildren(ShSelectComponent) public allShSelect: ShSelectComponent[];

    public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
    public filtersForAmount: IOption[] = AMOUNT_COMPARISON_FILTER;
    public statusDropdownOptions: IOption[] = PREVIEW_OPTIONS;
    public dateOptions: IOption[] = DATE_OPTIONS;

    public dateRangePickerOptions: any = {
        hideOnEsc: true,
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
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
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    constructor(private generalService: GeneralService, private modalService: BsModalService) {
        //
    }

    public ngOnInit() {

    }

    public invoiceTotalRangeChanged(item: IOption) {
        this.request.totalEqual = false;
        this.request.totalLessThan = false;
        this.request.totalMoreThan = false;

        switch (item.value) {
            case 'greaterThan':
                this.request.totalMoreThan = true;
                break;
            case 'lessThan':
                this.request.totalLessThan = true;
                break;
            case 'greaterThanOrEquals':
                this.request.totalMoreThan = true;
                this.request.totalEqual = true;
                break;
            case 'lessThanOrEquals':
                this.request.totalEqual = true;
                this.request.totalLessThan = true;
                break;
            case 'equals':
                this.request.totalEqual = true;
                break;
        }
    }

    public amountRangeChanged(item: IOption) {
        this.request.amountEquals = false;
        this.request.amountExclude = false;
        this.request.amountGreaterThan = false;
        this.request.amountLessThan = false;

        switch (item.value) {
            case 'greaterThan':
                this.request.amountGreaterThan = true;
                break;
            case 'lessThan':
                this.request.amountLessThan = true;
                break;
            case 'exclude':
                this.request.amountExclude = true;
                break;
            case 'equals':
                this.request.amountEquals = true;
                break;
        }
    }

    public dueTotalRangeChanged(item: IOption) {
        this.request.balanceEqual = false;
        this.request.balanceLessThan = false;
        this.request.balanceMoreThan = false;

        switch (item.value) {
            case 'greaterThan':
                this.request.balanceMoreThan = true;
                break;
            case 'lessThan':
                this.request.balanceLessThan = true;
                break;
            case 'greaterThanOrEquals':
                this.request.balanceMoreThan = true;
                this.request.balanceEqual = true;
                break;
            case 'lessThanOrEquals':
                this.request.balanceEqual = true;
                this.request.balanceLessThan = true;
                break;
            case 'equals':
                this.request.balanceEqual = true;
                break;
        }
    }

    public dateChanged(item: IOption, type: string) {
        if (type === 'invoice') {
            this.request.invoiceDateEqual = false;
            this.request.invoiceDateAfter = false;
            this.request.invoiceDateBefore = false;
            switch (item.value) {
                case 'on':
                    this.request.invoiceDateEqual = true;
                    break;
                case 'after':
                    this.request.invoiceDateAfter = true;
                    break;
                case 'before':
                    this.request.invoiceDateBefore = true;
                    break;
            }
        } else {
            this.request.dueDateEqual = false;
            this.request.dueDateAfter = false;
            this.request.dueDateBefore = false;
            switch (item.value) {
                case 'on':
                    this.request.dueDateEqual = true;
                    break;
                case 'after':
                    this.request.dueDateAfter = true;
                    break;
                case 'before':
                    this.request.dueDateBefore = true;
                    break;
            }
        }
    }

    public dateRangeChanged(event: any) {
        if (event) {
            this.request.expireFrom = moment(event.picker.startDate).format(GIDDH_DATE_FORMAT);
            this.request.expireTo = moment(event.picker.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    public parseAllDateField() {
        if (this.request.invoiceDate) {
            this.request.invoiceDate = moment(this.request.invoiceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        }

        if (this.request.dueDate) {
            this.request.dueDate = moment(this.request.dueDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        }
    }

    public save() {
        this.parseAllDateField();
        this.applyFilterEvent.emit(this.request);
        this.closeModelEvent.emit();
    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    /**
     * Lifecycle hook
     *
     * @param {SimpleChanges} changes
     * @memberof InvoiceAdvanceSearchComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('request' in changes && changes.request.currentValue) {
            if (changes.request.currentValue && changes.request.currentValue.from && changes.request.currentValue.to) {
                let dateRange = this.generalService.dateConversionToSetComponentDatePicker(changes.request.currentValue.from, changes.request.currentValue.to);
                this.selectedDateRange = { startDate: moment(dateRange.fromDate), endDate: moment(dateRange.toDate) };
                this.selectedDateRangeUi = moment(dateRange.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateRange.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(dateRange.fromDate).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(dateRange.toDate).format(GIDDH_DATE_FORMAT);
                this.request.expireFrom = this.fromDate;
                this.request.expireTo = this.toDate;
            }
        }
    }



    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof InvoiceAdvanceSearchComponent
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
     * This will hide the datepicker
     *
     * @memberof InvoiceAdvanceSearchComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof InvoiceAdvanceSearchComponent
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
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.request.expireFrom = this.fromDate;
            this.request.expireTo = this.toDate;
        }
    }

}
