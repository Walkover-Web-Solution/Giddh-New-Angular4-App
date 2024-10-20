import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';

@Component({
    selector: 'app-advance-search',
    templateUrl: './advance-search.component.html',
    styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds Voucher Type */
    @Input() public type: 'invoice' | 'drcr' | 'receipt' | 'proforma' | 'purchase' | 'purchase-order' | 'payment';
    /** Holds Advance Filter Values */
    @Input() public advanceFilters: any;
    /** Holds true if  EInvoice is enabled */
    @Input() public isEInvoiceEnabled: boolean;
    /** Emits Apply Filter Event */
    @Output() public applyFilterEvent: EventEmitter<InvoiceFilterClassForInvoicePreview> = new EventEmitter<InvoiceFilterClassForInvoicePreview>();
    /** Emits Close Dailog Event */
    @Output() public closeDialogEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group Instance */
    public searchForm: FormGroup;
    /** Holds Filters For Entry Total list items */
    public filtersForEntryTotal: IOption[] = [];
    /** Holds Filters for Amount */
    public filtersForAmount: IOption[] = [];
    /** Holds date options list items */
    public dateOptions: IOption[] = [];
    /** Holds Day js reference */
    public dayjs: any = dayjs;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Directive to get reference of element */
    @ViewChild('filterDatepickerTemplate') public datepickerTemplate: TemplateRef<any>;
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
    /** Holds field label values */
    public fieldLabelValues: any = {
        invoiceDateRange: '',
        invoiceTotalAmount: '',
        dueDateRange: '',
        dueAmount: '',
        dateRange: '',
        amountFieldSelector: '',
        adjustmentVoucherOptions: ''
    };
    /** Holds true if API call is in progress */
    public isLoading: boolean = true;
    /** Holds date adjustment Voucher list items */
    public adjustmentVoucherOptions: IOption[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private formBuilder: FormBuilder
    ) { }

    /**
     * Initializes the component
     *
     * @memberof AdvanceSearchComponent
     */
    public ngOnInit(): void {
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

        this.dateOptions = [
            { label: this.commonLocaleData?.app_date_options?.on, value: 'on' },
            { label: this.commonLocaleData?.app_date_options?.after, value: 'after' },
            { label: this.commonLocaleData?.app_date_options?.before, value: 'before' },
        ];

        this.adjustmentVoucherOptions = [
            { label: this.localeData?.receipt_types?.normal_receipts, value: 'NORMAL_RECEIPT' },
            { label: this.localeData?.receipt_types?.advance_receipts, value: 'ADVANCE_RECEIPT' }
        ];


        this.searchForm = this.formBuilder.group({
            total: [this.advanceFilters?.total ?? ''],
            totalEqual: [this.advanceFilters?.totalEqual ?? ''],
            totalLessThan: [this.advanceFilters?.totalLessThan ?? ''],
            totalMoreThan: [this.advanceFilters?.totalMoreThan ?? ''],
            amountEquals: [this.advanceFilters?.amountEquals ?? ''],
            amountExclude: [this.advanceFilters?.amountExclude ?? ''],
            amountGreaterThan: [this.advanceFilters?.amountGreaterThan ?? ''],
            amountLessThan: [this.advanceFilters?.amountLessThan ?? ''],
            balanceEqual: [this.advanceFilters?.balanceEqual ?? ''],
            balanceLessThan: [this.advanceFilters?.balanceLessThan ?? ''],
            balanceMoreThan: [this.advanceFilters?.balanceMoreThan ?? ''],
            voucherDateEqual: [this.advanceFilters?.voucherDateEqual ?? ''],
            voucherDateAfter: [this.advanceFilters?.voucherDateAfter ?? ''],
            voucherDateBefore: [this.advanceFilters?.voucherDateBefore ?? ''],
            dueDateEqual: [this.advanceFilters?.dueDateEqual ?? ''],
            dueDateAfter: [this.advanceFilters?.dueDateAfter ?? ''],
            dueDateBefore: [this.advanceFilters?.dueDateBefore ?? ''],
            expireFrom: [(this.advanceFilters?.expireFrom && dayjs(this.advanceFilters?.expireFrom, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD)) ?? dayjs(this.advanceFilters?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD) ?? ''],
            expireTo: [(this.advanceFilters?.expireTo && dayjs(this.advanceFilters?.expireTo, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD)) ?? dayjs(this.advanceFilters?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD) ?? ''],
            invoiceDateRange: [this.advanceFilters?.invoiceDateRange ?? ''],
            voucherDate: [this.advanceFilters?.voucherDate ?? ''],
            dueDate: [this.advanceFilters?.dueDate ?? ''],
            amountFieldSelector: [this.advanceFilters?.amountFieldSelector ?? ''],
            balanceDue: [this.advanceFilters?.balanceDue ?? ''],
            balanceStatus: [this.advanceFilters?.balanceStatus ?? ''],
            eInvoiceStatus: [this.advanceFilters?.eInvoiceStatus ?? ''],
            description: [this.advanceFilters?.description ?? ''],
            amount: [this.advanceFilters?.amount ?? ''],
            invoiceTotalAmount: [this.advanceFilters?.invoiceTotalAmount ?? ''],
            dueDateRange: [this.advanceFilters?.dueDateRange ?? ''],
            dueAmount: [this.advanceFilters?.dueAmount ?? ''],
            dateRange: [this.advanceFilters?.dateRange ?? ''],
            grandTotal: [this.advanceFilters?.grandTotal ?? ''],
            grandTotalOperation: [this.advanceFilters?.grandTotalOperation ?? ''],
            statuses: [this.advanceFilters?.statuses ?? []],
            dueFrom: [(this.advanceFilters?.dueFrom && dayjs(this.advanceFilters?.dueFrom, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD)) ?? dayjs(this.advanceFilters?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD) ?? ''],
            dueTo: [(this.advanceFilters?.dueTo && dayjs(this.advanceFilters?.dueTo, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD)) ?? dayjs(this.advanceFilters?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD) ?? ''],
            receiptType: ['']
        });

        this.selectedDateRange = { startDate: this.advanceFilters.from, endDate: this.advanceFilters.to };
        this.selectedDateRangeUi = this.advanceFilters.from + " - " + this.advanceFilters.to;

        const invoiceDateRange = this.dateOptions?.filter(option => option.value === this.advanceFilters?.invoiceDateRange);
        if (invoiceDateRange?.length) {
            this.fieldLabelValues.invoiceDateRange = invoiceDateRange[0]?.label;
        }
        const invoiceTotalAmount = this.filtersForEntryTotal?.filter(option => option.value === this.advanceFilters?.invoiceTotalAmount);
        if (invoiceTotalAmount?.length) {
            this.fieldLabelValues.invoiceTotalAmount = invoiceTotalAmount[0]?.label;
        }
        const dueDateRange = this.dateOptions?.filter(option => option.value === this.advanceFilters?.dueDateRange);
        if (dueDateRange?.length) {
            this.fieldLabelValues.dueDateRange = dueDateRange[0]?.label;
        }
        const dueAmount = this.filtersForEntryTotal?.filter(option => option.value === this.advanceFilters?.dueAmount);
        if (dueAmount?.length) {
            this.fieldLabelValues.dueAmount = dueAmount[0]?.label;
        }
        const dateRange = this.dateOptions?.filter(option => option.value === this.advanceFilters?.dateRange);
        if (dateRange?.length) {
            this.fieldLabelValues.dateRange = dateRange[0]?.label;
        }
        const amountFieldSelector = this.dateOptions?.filter(option => option.value === this.advanceFilters?.amountFieldSelector);
        if (amountFieldSelector?.length) {
            this.fieldLabelValues.amountFieldSelector = amountFieldSelector[0]?.label;
        }
        const adjustmentVoucherOptions = this.adjustmentVoucherOptions?.filter(option => option.value === this.advanceFilters?.receiptType);
        if (adjustmentVoucherOptions?.length) {
            this.fieldLabelValues.adjustmentVoucherOptions = adjustmentVoucherOptions[0]?.label;
        }
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof AdvanceSearchComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Update search form value based on invoice total range changed value
     *
     * @param {IOption} item
     * @memberof AdvanceSearchComponent
     */
    public invoiceTotalRangeChanged(item: IOption): void {
        this.searchForm.get('totalEqual')?.patchValue(false);
        this.searchForm.get('totalLessThan')?.patchValue(false);
        this.searchForm.get('totalMoreThan')?.patchValue(false);

        switch (item?.value) {
            case 'greaterThan':
                this.searchForm.get('totalMoreThan')?.patchValue(true);
                break;
            case 'lessThan':
                this.searchForm.get('totalLessThan')?.patchValue(true);
                break;
            case 'greaterThanOrEquals':
                this.searchForm.get('totalMoreThan')?.patchValue(true);
                this.searchForm.get('totalEqual')?.patchValue(true);
                break;
            case 'lessThanOrEquals':
                this.searchForm.get('totalEqual')?.patchValue(true);
                this.searchForm.get('totalLessThan')?.patchValue(true);
                break;
            case 'equals':
                this.searchForm.get('totalEqual')?.patchValue(true);
                break;
        }
    }

    /**
     * Update search form value based on total range changed value
     *
     * @param {IOption} item
     * @memberof AdvanceSearchComponent
     */
    public estimateProformaAmountRangeChanged(item: IOption): void {
        this.searchForm.get('amountGreaterThan')?.patchValue(false);
        this.searchForm.get('amountLessThan')?.patchValue(false);
        this.searchForm.get('amountExclude')?.patchValue(false);
        this.searchForm.get('amountEquals')?.patchValue(false);

        switch (item?.value) {
            case 'greaterThan':
                this.searchForm.get('amountGreaterThan')?.patchValue(true);
                break;
            case 'lessThan':
                this.searchForm.get('amountLessThan')?.patchValue(true);
                break;
            case 'exclude':
                this.searchForm.get('amountExclude')?.patchValue(true);
                break;
            case 'equals':
                this.searchForm.get('amountEquals')?.patchValue(true);
                break;
        }
    }

    /**
     * Update search form value based on due total range changed value
     *
     * @param {IOption} item
     * @memberof AdvanceSearchComponent
     */
    public dueTotalRangeChanged(item: IOption): void {
        this.searchForm.get('balanceEqual')?.patchValue(false);
        this.searchForm.get('balanceLessThan')?.patchValue(false);
        this.searchForm.get('balanceMoreThan')?.patchValue(false);

        switch (item?.value) {
            case 'greaterThan':
                this.searchForm.get('balanceMoreThan')?.patchValue(true);
                break;
            case 'lessThan':
                this.searchForm.get('balanceLessThan')?.patchValue(true);
                break;
            case 'greaterThanOrEquals':
                this.searchForm.get('balanceMoreThan')?.patchValue(true);
                this.searchForm.get('balanceEqual')?.patchValue(true);
                break;
            case 'lessThanOrEquals':
                this.searchForm.get('balanceEqual')?.patchValue(true);
                this.searchForm.get('balanceLessThan')?.patchValue(true);
                break;
            case 'equals':
                this.searchForm.get('balanceEqual')?.patchValue(true);
                break;
        }
    }

    /**
     * Update search form value based on date changed value
     *
     * @param {IOption} item
     * @memberof AdvanceSearchComponent
     */
    public dateChanged(item: IOption, type: string): void {
        if (type === 'invoice') {
            this.searchForm.get('voucherDateEqual')?.patchValue(false);
            this.searchForm.get('voucherDateAfter')?.patchValue(false);
            this.searchForm.get('voucherDateBefore')?.patchValue(false);

            switch (item?.value) {
                case 'on':
                    this.searchForm.get('voucherDateEqual')?.patchValue(true);
                    break;
                case 'after':
                    this.searchForm.get('voucherDateAfter')?.patchValue(true);
                    break;
                case 'before':
                    this.searchForm.get('voucherDateBefore')?.patchValue(true);
                    break;
            }
        } else {
            this.searchForm.get('dueDateEqual')?.patchValue(false);
            this.searchForm.get('dueDateAfter')?.patchValue(false);
            this.searchForm.get('dueDateBefore')?.patchValue(false);

            switch (item?.value) {
                case 'on':
                    this.searchForm.get('dueDateEqual')?.patchValue(true);
                    break;
                case 'after':
                    this.searchForm.get('dueDateAfter')?.patchValue(true);
                    break;
                case 'before':
                    this.searchForm.get('dueDateBefore')?.patchValue(true);
                    break;
            }
        }
    }

    /**
     * Parse All Date Field in to required format
     *
     * @memberof AdvanceSearchComponent
     */
    public parseAllDateField(): void {
        const allDateControlName: string[] = ['voucherDate', 'dueDate', 'expireFrom', 'expireTo', 'dueFrom', 'dueTo'];
        const dueVoucherDate: string[] = ['voucherDate', 'dueDate'];    // For Sales | CR | DR | Bill
        const expiryDateRange: string[] = ['expireFrom', 'expireTo'];   // For Estimate | Proforma
        const dueDateRange: string[] = ['dueFrom', 'dueTo'];            // For Purchase-order

        // Helper function to format and patch date fields
        const formatDateField = (fieldName: string): void => {
            const fieldValue = this.searchForm.get(fieldName)?.value;
            if (fieldValue) {
                this.searchForm.get(fieldName)?.patchValue(
                    typeof fieldValue === 'object'
                        ? dayjs(fieldValue).format(GIDDH_DATE_FORMAT)
                        : this.advanceFilters[(fieldName?.indexOf('From') > -1 ? 'from' : 'to')]
                );
            }
        };

        // Helper function to clear the date fields
        const clearDateFields = (controlNames: string[]): void => {
            controlNames.forEach(controlName => {
                this.searchForm.get(controlName)?.patchValue(null);
            });
        };

        // Take one control from range date i.e from and to
        const allDateFormControlName: string[] = ['voucherDate', 'dueDate', 'expireFrom', 'dueFrom'];
        allDateFormControlName.forEach(controlName => {
            switch (this.type) {
                case 'drcr':
                case 'invoice':
                case 'purchase':
                    if (dueVoucherDate.includes(controlName)) {
                        formatDateField('voucherDate');
                        formatDateField('dueDate');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['expireFrom', 'expireTo', 'dueFrom', 'dueTo']);
                    break;

                case 'proforma':
                    if (expiryDateRange.includes(controlName)) {
                        formatDateField('expireFrom');
                        formatDateField('expireTo');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['voucherDate', 'dueDate', 'dueFrom', 'dueTo']);
                    break;

                case 'purchase-order':
                    if (dueDateRange.includes(controlName)) {
                        formatDateField('dueFrom');
                        formatDateField('dueTo');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['voucherDate', 'dueDate', 'expireFrom', 'expireTo']);
                    break;

                default:
                    clearDateFields(allDateControlName);
                    break;
            }
        });
    }

    /**
     * Emits search event
     *
     * @memberof AdvanceSearchComponent
     */
    public search(): void {
        this.parseAllDateField();
        this.applyFilterEvent.emit(this.searchForm?.value);
        this.closeDialogEvent.emit();
    }

    /**
     * Emits close dialog event
     *
     * @memberof AdvanceSearchComponent
     */
    public onCancel(): void {
        this.closeDialogEvent.emit(true);
    }

    /**
     * Handle Expiry Date Changes
     *
     * @memberof AdvanceSearchComponent
     */
    public expiryDateChanges(): void {
        this.fromDate = dayjs(this.searchForm.get('expireFrom')?.value).format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs(this.searchForm.get('expireTo')?.value).format(GIDDH_DATE_FORMAT);
    }
}
