import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';
import { GeneralService } from '../../services/general.service';

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
    @Input() public type: 'invoice' | 'drcr' | 'receipt' | 'proforma' | 'purchase';
    @Output() public applyFilterEvent: EventEmitter<InvoiceFilterClassForInvoicePreview> = new EventEmitter<InvoiceFilterClassForInvoicePreview>();
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group Instance */
    public searchForm: FormGroup;
    public filtersForEntryTotal: IOption[] = [];
    public filtersForAmount: IOption[] = [];
    public dateOptions: IOption[] = [];
    public dayjs = dayjs;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
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

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private formBuilder: FormBuilder,
        private generalService: GeneralService,
        private modalService: BsModalService
    ) {

    }

    public ngOnInit(): void {
        this.searchForm = this.formBuilder.group({
            total: [''],
            totalEqual: [''],
            totalLessThan: [''],
            totalMoreThan: [''],
            amountEquals: [''],
            amountExclude: [''],
            amountGreaterThan: [''],
            amountLessThan: [''],
            balanceEqual: [''],
            balanceLessThan: [''],
            balanceMoreThan: [''],
            voucherDateEqual: [''],
            voucherDateAfter: [''],
            voucherDateBefore: [''],
            dueDateEqual: [''],
            dueDateAfter: [''],
            dueDateBefore: [''],
            expireFrom: [''],
            expireTo: [''],
            voucherDate: [''],
            dueDate: [''],
            amountFieldSelector: [''],
            balanceDue: [''],
            balanceStatus: [''],
            eInvoiceStatus: [''],
            description: [''],
            amount: ['']
        });

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
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public invoiceTotalRangeChanged(item: IOption) {
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

    public amountRangeChanged(item: IOption) {
        this.searchForm.get('amountFieldSelector').patchValue(item?.value);

        this.searchForm.get('amountEquals')?.patchValue(false);
        this.searchForm.get('amountExclude')?.patchValue(false);
        this.searchForm.get('amountGreaterThan')?.patchValue(false);
        this.searchForm.get('amountLessThan')?.patchValue(false);

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

    public dueTotalRangeChanged(item: IOption) {
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

    public dateChanged(item: IOption, type: string) {
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

    public dateRangeChanged(event: any) {
        if (event) {
            this.searchForm.get('expiredFrom')?.patchValue(dayjs(event.picker.startDate).format(GIDDH_DATE_FORMAT));
            this.searchForm.get('expiredTo')?.patchValue(dayjs(event.picker.endDate).format(GIDDH_DATE_FORMAT));
        }
    }

    public parseAllDateField() {
        if (this.searchForm.get('voucherDate')?.value) {
            this.searchForm.get('voucherDate')?.patchValue((typeof this.searchForm.get('voucherDate')?.value === "object") ? dayjs(this.searchForm.get('voucherDate')?.value).format(GIDDH_DATE_FORMAT) : dayjs(this.searchForm.get('voucherDate')?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
        }

        if (this.searchForm.get('dueDate')?.value) {
            this.searchForm.get('dueDate')?.patchValue((typeof this.searchForm.get('dueDate')?.value === "object") ? dayjs(this.searchForm.get('dueDate')?.value).format(GIDDH_DATE_FORMAT) : dayjs(this.searchForm.get('dueDate')?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
        }
    }

    public search(): void {
        this.parseAllDateField();
        this.applyFilterEvent.emit(this.searchForm?.value);
        this.closeModelEvent.emit();
    }

    public onCancel(): void {
        this.closeModelEvent.emit(true);
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
            this.searchForm.get('expiredFrom')?.patchValue(this.fromDate);
            this.searchForm.get('expiredTo')?.patchValue(this.toDate);
        }
    }
}
