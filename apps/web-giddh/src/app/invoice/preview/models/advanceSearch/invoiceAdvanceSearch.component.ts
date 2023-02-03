import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { InvoiceFilterClassForInvoicePreview } from '../../../../models/api-models/Invoice';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../../shared/helpers/defaultDateFormat';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from 'apps/web-giddh/src/app/app.constant';
import { Observable } from 'rxjs';

@Component({
    selector: 'invoice-advance-search-component',
    templateUrl: './invoiceAdvanceSearch.component.html',
    styleUrls: [`./invoiceAdvanceSearch.component.scss`]
})

export class InvoiceAdvanceSearchComponent implements OnInit, OnChanges {
    @Input() public type: 'invoice' | 'drcr' | 'receipt' | 'proforma' | 'purchase';
    @Input() public request: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True when E-invoice settings are turned on */
    @Input() public isEInvoiceEnabled: boolean;

    @Output() public applyFilterEvent: EventEmitter<InvoiceFilterClassForInvoicePreview> = new EventEmitter<InvoiceFilterClassForInvoicePreview>();
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChildren(ShSelectComponent) public allShSelect: ShSelectComponent[];

    public filtersForEntryTotal: IOption[] = [];
    public filtersForAmount: IOption[] = [];
    public statusDropdownOptions: IOption[] = [];
    public dateOptions: IOption[] = [];

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
    /** Stores the E-invoice status */
    public eInvoiceStatusDropdownOptions: IOption[] = [];
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;

    constructor(private generalService: GeneralService, private modalService: BsModalService) {

    }

    public ngOnInit() {
        this.filtersForEntryTotal = [
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
            { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' }
        ];

        this.filtersForAmount = [
            { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' },
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.exclude, value: 'exclude' },
        ];

        this.statusDropdownOptions = [
            { label: this.commonLocaleData?.app_payment_status?.paid, value: 'paid' },
            { label: this.commonLocaleData?.app_payment_status?.partially_paid, value: 'partial-paid' },
            { label: this.commonLocaleData?.app_payment_status?.unpaid, value: 'unpaid' },
            { label: this.commonLocaleData?.app_payment_status?.hold, value: 'hold' },
            { label: this.commonLocaleData?.app_payment_status?.cancel, value: 'cancel' },
        ];

        this.dateOptions = [
            { label: this.commonLocaleData?.app_date_options?.on, value: 'on' },
            { label: this.commonLocaleData?.app_date_options?.after, value: 'after' },
            { label: this.commonLocaleData?.app_date_options?.before, value: 'before' },
        ];

        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    public invoiceTotalRangeChanged(item: IOption) {
        this.request.totalEqual = false;
        this.request.totalLessThan = false;
        this.request.totalMoreThan = false;

        switch (item?.value) {
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

        switch (item?.value) {
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

        switch (item?.value) {
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
            if (this.generalService.voucherApiVersion === 2) {
                this.request.voucherDateEqual = false;
                this.request.voucherDateAfter = false;
                this.request.voucherDateBefore = false;
            } else {
                this.request.invoiceDateEqual = false;
                this.request.invoiceDateAfter = false;
                this.request.invoiceDateBefore = false;
            }
            switch (item?.value) {
                case 'on':
                    if (this.generalService.voucherApiVersion === 2) {
                        this.request.voucherDateEqual = true;
                    } else {
                        this.request.invoiceDateEqual = true;
                    }
                    break;
                case 'after':
                    if (this.generalService.voucherApiVersion === 2) {
                        this.request.voucherDateAfter = true;
                    } else {
                        this.request.invoiceDateAfter = true;
                    }
                    break;
                case 'before':
                    if (this.generalService.voucherApiVersion === 2) {
                        this.request.voucherDateBefore = true;
                    } else {
                        this.request.invoiceDateBefore = true;
                    }
                    break;
            }
        } else {
            this.request.dueDateEqual = false;
            this.request.dueDateAfter = false;
            this.request.dueDateBefore = false;
            switch (item?.value) {
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
            this.request.expireFrom = dayjs(event.picker.startDate).format(GIDDH_DATE_FORMAT);
            this.request.expireTo = dayjs(event.picker.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    public parseAllDateField() {
        if (this.request.invoiceDate) {
            this.request.invoiceDate = (typeof this.request.invoiceDate === "object") ? dayjs(this.request.invoiceDate).format(GIDDH_DATE_FORMAT) : dayjs(this.request.invoiceDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
        }

        if (this.request.dueDate) {
            this.request.dueDate = (typeof this.request.dueDate === "object") ? dayjs(this.request.dueDate).format(GIDDH_DATE_FORMAT) : dayjs(this.request.dueDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
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
                this.selectedDateRange = { startDate: dayjs(dateRange.fromDate), endDate: dayjs(dateRange.toDate) };
                this.selectedDateRangeUi = dayjs(dateRange.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(dateRange.fromDate).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateRange.toDate).format(GIDDH_DATE_FORMAT);
                this.request.expireFrom = this.fromDate;
                this.request.expireTo = this.toDate;
            }
        }
        if (changes.localeData && changes.localeData?.currentValue !== changes.localeData?.previousValue) {
            this.eInvoiceStatusDropdownOptions = [
                { label: this.localeData?.e_invoice_statuses_label?.yet_to_be_pushed, value: this.localeData?.e_invoice_statuses_label?.yet_to_be_pushed },
                { label: this.localeData?.e_invoice_statuses_label?.pushed, value: this.localeData?.e_invoice_statuses_label?.pushed },
                { label: this.localeData?.e_invoice_statuses_label?.push_initiated, value: this.localeData?.e_invoice_statuses_label?.push_initiated },
                { label: this.localeData?.e_invoice_statuses_label?.cancelled, value: this.localeData?.e_invoice_statuses_label?.cancelled },
                { label: this.localeData?.e_invoice_statuses_label?.mark_as_cancelled, value: this.localeData?.e_invoice_statuses_label?.mark_as_cancelled },
                { label: this.localeData?.e_invoice_statuses_label?.failed, value: this.localeData?.e_invoice_statuses_label?.failed },
                { label: this.localeData?.e_invoice_statuses_label?.na, value: this.localeData?.e_invoice_statuses_label?.na }
            ];
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.request.expireFrom = this.fromDate;
            this.request.expireTo = this.toDate;
        }
    }

}
