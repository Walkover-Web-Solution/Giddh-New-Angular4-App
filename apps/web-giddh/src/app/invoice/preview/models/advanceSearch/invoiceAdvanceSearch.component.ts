import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { InvoiceFilterClassForInvoicePreview } from '../../../../models/api-models/Invoice';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../../shared/helpers/defaultDateFormat';

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

export class InvoiceAdvanceSearchComponent implements OnInit {
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

    constructor() {
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
            this.request.invoiceDate = moment(this.request.invoiceDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
        }

        if (this.request.dueDate) {
            this.request.dueDate = moment(this.request.dueDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
        }
    }

    public save() {
        this.parseAllDateField();
        this.applyFilterEvent.emit(this.request);
        this.closeModelEvent.emit();
    }

    public onCancel() {
        this.request = new InvoiceFilterClassForInvoicePreview();
        this.closeModelEvent.emit(true);
    }
}
