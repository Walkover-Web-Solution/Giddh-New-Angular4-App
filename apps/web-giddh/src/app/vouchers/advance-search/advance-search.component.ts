import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { filter, Observable, of as observableOf, ReplaySubject, take, takeUntil, tap } from 'rxjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD } from '../../shared/helpers/defaultDateFormat';
import { API_BULK_FETCH_LIMIT, ASIDE_PANE_CONFIG, BranchHierarchyType, DATE_REGEX, IOption } from '../../app.constant';
import * as dayjs from 'dayjs';
import { InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';
import { SalesPersonComponentStore } from '../../shared/sales-person/utility/sales-person.store';
import { SalesPersonComponent } from '../../shared/sales-person/sales-person.component';
import { GeneralService } from '../../services/general.service';
import { SearchService } from '../../services/search.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { AppState } from '../../store';
import { VouchersUtilityService } from '../utility/vouchers.utility.service';
import { SearchType } from '../utility/vouchers.const';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'app-advance-search',
    templateUrl: './advance-search.component.html',
    styleUrls: ['./advance-search.component.scss'],
    providers: [SalesPersonComponentStore],
    standalone:false
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds Voucher Type */
    @Input() public type: 'invoice' | 'drcr' | 'receipt' | 'proforma' | 'purchase' | 'purchase-order' | 'payment' | 'inventory-document';
    /** Actual voucher type (e.g. delivery-challan / receipt-note) for inventory-document labels */
    @Input() public voucherType: string;
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
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /** Stores the E-invoice status */
    public eInvoiceStatusDropdownOptions: IOption[] = [];
    /** Payment status options for invoice advance search */
    public paymentStatusOptions: IOption[] = [];
    /** Purchase order status options */
    public purchaseOrderStatusOptions: IOption[] = [];
    /** Delivery challan/receipt note document statuses */
    public inventoryDocumentStatusOptions: IOption[] = [];
    /** Delivery challan/receipt note invoice statuses */
    public inventoryInvoiceStatusOptions: IOption[] = [];
    /** Operators supported by inventory document filters */
    public inventoryAmountOperators: IOption[] = [];
    public linkedInvoiceOptions: any[] = [];
    /** Warehouse dropdown options */
    public warehouses: IOption[] = [];
    /** Branch dropdown options */
    public branches: IOption[] = [];
    /** Selected warehouse label for dropdown display */
    public selectedWarehouseName: string = '';
    /** Selected branch label for dropdown display */
    public selectedBranchName: string = '';
    /** Current organization type */
    public currentOrganizationType: string;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Account search request state */
    public accountSearchRequest: any;
    /** Account dropdown options */
    public accounts$: Observable<IOption[]>;
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
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private salesPersonStore: SalesPersonComponentStore,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsBranchAction: SettingsBranchActions,
        private searchService: SearchService,
        private changeDetectorRef: ChangeDetectorRef,
        private vouchersUtilityService: VouchersUtilityService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof AdvanceSearchComponent
     */
    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.pipe(select(state => state.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
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

        this.paymentStatusOptions = [
            { label: this.commonLocaleData?.app_payment_status?.paid, value: 'paid' },
            { label: this.commonLocaleData?.app_payment_status?.partially_paid, value: 'partial-paid' },
            { label: this.commonLocaleData?.app_payment_status?.unpaid, value: 'unpaid' },
            { label: this.commonLocaleData?.app_payment_status?.hold, value: 'hold' },
            { label: this.commonLocaleData?.app_payment_status?.cancel, value: 'cancel' }
        ];

        this.purchaseOrderStatusOptions = [
            { label: this.commonLocaleData?.app_payment_status?.open, value: 'open' },
            { label: this.commonLocaleData?.app_payment_status?.converted, value: 'converted' },
            { label: this.commonLocaleData?.app_payment_status?.partially_converted, value: 'partially-converted' },
            { label: this.commonLocaleData?.app_payment_status?.expired, value: 'expired' }
        ];

        this.inventoryDocumentStatusOptions = [
            { label: this.localeData?.inventory_document_status?.open, value: 'OPEN' },
            { label: this.localeData?.inventory_document_status?.closed, value: 'CLOSED' },
            { label: this.localeData?.inventory_document_status?.expired, value: 'EXPIRED' },
            { label: this.localeData?.inventory_document_status?.cancelled, value: 'CANCELLED' }
        ];
        const isReceiptNote = this.voucherType === 'receipt-note';
        this.inventoryInvoiceStatusOptions = [
            {
                label: isReceiptNote
                    ? this.localeData?.inventory_invoice_status?.billed
                    : this.localeData?.inventory_invoice_status?.invoiced,
                value: 'FULLY_INVOICED'
            },
            {
                label: isReceiptNote
                    ? this.localeData?.inventory_invoice_status?.partially_billed
                    : this.localeData?.inventory_invoice_status?.partially_invoiced,
                value: 'PARTIALLY_INVOICED'
            },
            {
                label: isReceiptNote
                    ? this.localeData?.inventory_invoice_status?.not_billed
                    : this.localeData?.inventory_invoice_status?.not_invoiced,
                value: 'NOT_INVOICED'
            }
        ];
        this.inventoryAmountOperators = this.filtersForEntryTotal;
        this.linkedInvoiceOptions = [
            { label: this.commonLocaleData?.app_all, value: null },
            { label: this.localeData?.linked_invoice_filter?.linked, value: true },
            { label: this.localeData?.linked_invoice_filter?.not_linked, value: false }
        ];

        this.eInvoiceStatusDropdownOptions = [
            { label: this.localeData?.e_invoice_statuses_label?.yet_to_be_pushed, value: this.localeData?.e_invoice_statuses_label?.yet_to_be_pushed },
            { label: this.localeData?.e_invoice_statuses_label?.pushed, value: this.localeData?.e_invoice_statuses_label?.pushed },
            { label: this.localeData?.e_invoice_statuses_label?.push_initiated, value: this.localeData?.e_invoice_statuses_label?.push_initiated },
            { label: this.localeData?.e_invoice_statuses_label?.cancelled, value: this.localeData?.e_invoice_statuses_label?.cancelled },
            { label: this.localeData?.e_invoice_statuses_label?.mark_as_cancelled, value: this.localeData?.e_invoice_statuses_label?.mark_as_cancelled },
            { label: this.localeData?.e_invoice_statuses_label?.failed, value: this.localeData?.e_invoice_statuses_label?.failed },
            { label: this.localeData?.e_invoice_statuses_label?.na, value: this.localeData?.e_invoice_statuses_label?.na }
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
            balanceStatus: [this.advanceFilters?.balanceStatus ?? []],
            eInvoiceStatus: [this.advanceFilters?.eInvoiceStatus ?? []],
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
            receiptType: [''],
            salesPersonName: [this.advanceFilters?.salesPersonName ?? ''],
            salesPersonUniqueNames: [this.advanceFilters?.salesPersonUniqueNames ?? []],
            invoiceStatuses: [this.advanceFilters?.invoiceStatuses ?? []],
            amountOperator: [this.advanceFilters?.amountOperator ?? 'EQUALS'],
            warehouseUniqueName: [this.advanceFilters?.warehouseUniqueName ?? ''],
            branchUniqueName: [this.advanceFilters?.branchUniqueName ?? ''],
            accountUniqueNames: [this.normalizePartyUniqueNameValue(this.advanceFilters?.accountUniqueNames)]
        });

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
        this.getSalesPersonList();
        if (this.type === 'inventory-document') {
            this.getWarehouses();
            this.getBranches();
            this.searchAccount();
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
        const allDateControlNames: string[] = ['voucherDate', 'dueDate', 'expireFrom', 'expireTo', 'dueFrom', 'dueTo'];
        const dueVoucherDates: string[] = ['voucherDate', 'dueDate']; // For Sales | CR | DR | Bill
        const expiryDateRanges: string[] = ['expireFrom', 'expireTo']; // For Estimate | Proforma
        const dueDateRanges: string[] = ['dueFrom', 'dueTo']; // For Purchase-order

        const formatDateField = (fieldName: string): void => {
            let fieldValue = this.searchForm.get(fieldName)?.value;
            if (fieldValue) {
                if (typeof fieldValue === 'string' && DATE_REGEX.test(fieldValue)) {
                    // If the field value is a string in the format YYYY-MM-DD, reformat it
                    fieldValue = dayjs(fieldValue, GIDDH_DATE_FORMAT_YYYY_MM_DD).format(GIDDH_DATE_FORMAT);
                } else if (typeof fieldValue === 'object') {
                    fieldValue = dayjs(fieldValue).format(GIDDH_DATE_FORMAT);
                    if (DATE_REGEX.test(fieldValue)) {
                        // If the field value is a string in the format YYYY-MM-DD, reformat it
                        fieldValue = dayjs(fieldValue, GIDDH_DATE_FORMAT_YYYY_MM_DD).format(GIDDH_DATE_FORMAT);
                    }
                }

                // Check if the fieldName exists in advanceFilters, and update it
                if (this.advanceFilters.hasOwnProperty(fieldName)) {
                    this.advanceFilters[fieldName] = fieldValue;
                    // Update the form control with the new advanceFilters value
                    this.searchForm.get(fieldName)?.patchValue(this.advanceFilters[fieldName]);
                }
                this.searchForm.get(fieldName)?.patchValue(fieldValue);
            }
        };

        // Helper function to clear specific date fields
        const clearDateFields = (controlNames: string[]): void => {
            controlNames.forEach(controlName => {
                this.searchForm.get(controlName)?.patchValue(null);
            });
        };

        if (this.type === 'inventory-document') {
            formatDateField('date');
            clearDateFields(allDateControlNames);
            return;
        }

        // Process each date control based on the type
        allDateControlNames.forEach(controlName => {
            switch (this.type) {
                case 'drcr':
                case 'invoice':
                case 'purchase':
                    if (dueVoucherDates.includes(controlName)) {
                        formatDateField('voucherDate');
                        formatDateField('dueDate');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['expireFrom', 'expireTo', 'dueFrom', 'dueTo']);
                    break;

                case 'proforma':
                    if (expiryDateRanges.includes(controlName)) {
                        formatDateField('expireFrom');
                        formatDateField('expireTo');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['voucherDate', 'dueDate', 'dueFrom', 'dueTo']);
                    break;

                case 'purchase-order':
                    if (dueDateRanges.includes(controlName)) {
                        formatDateField('dueFrom');
                        formatDateField('dueTo');
                    } else {
                        this.searchForm.get(controlName)?.patchValue(null);
                    }
                    clearDateFields(['voucherDate', 'dueDate', 'expireFrom', 'expireTo']);
                    break;

                default:
                    clearDateFields(allDateControlNames);
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
        const formValue = { ...this.searchForm?.value };
        if (this.type === 'inventory-document') {
            formValue.accountUniqueNames = this.normalizePartyUniqueNameValue(formValue.accountUniqueNames);
            const showBranchDropdown = this.branches?.length > 1 &&
                (this.currentOrganizationType === 'COMPANY' || this.isConsolidatedBranch);
            if (!showBranchDropdown) {
                formValue.branchUniqueName = '';
            }
        }
        this.applyFilterEvent.emit(formValue);
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

    /**
     * Open sales person dialog
     *
     * @memberof AdvanceSearchComponent
     */
    public openSalesPersonDialog(): void {
        const dialogRef = this.dialog.open(SalesPersonComponent, ASIDE_PANE_CONFIG);
        dialogRef.afterClosed().pipe(filter(Boolean), take(1), tap(() => this.getSalesPersonList())).subscribe();
    }

    /**
     * Get sales person list as label value
     *
     * @memberof AdvanceSearchComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT, archive: '' } });
    }

    /**
     * Loads warehouses for inventory document filters
     *
     * @private
     * @memberof AdvanceSearchComponent
     */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses?.results?.length) {
                this.warehouses = warehouses.results
                    .filter(warehouse => !warehouse.isArchived)
                    .map(warehouse => ({ label: warehouse?.name, value: warehouse?.uniqueName }));
                const selectedWarehouse = this.warehouses.find(warehouse => warehouse.value === this.searchForm?.get('warehouseUniqueName')?.value);
                this.selectedWarehouseName = selectedWarehouse?.label ?? '';
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Loads branches for inventory document filters
     *
     * @private
     * @memberof AdvanceSearchComponent
     */
    private getBranches(): void {
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
        this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.length) {
                this.branches = response.map(branch => ({
                    label: branch?.name,
                    value: branch?.uniqueName
                }));
                const selectedBranch = this.branches.find(branch => branch.value === this.searchForm?.get('branchUniqueName')?.value);
                this.selectedBranchName = selectedBranch?.label ?? '';
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Normalizes party unique name filter into multi-select array value
     *
     * @private
     * @param {*} value
     * @return {string[]}
     * @memberof AdvanceSearchComponent
     */
    private normalizePartyUniqueNameValue(value: any): string[] {
        if (Array.isArray(value)) {
            return value.filter(Boolean);
        }
        return value ? [value] : [];
    }

    /**
     * Gets list of accounts with searching (DC: sundrydebtors, RN: sundrycreditors)
     *
     * @param {string} [query='']
     * @param {number} [page=1]
     * @memberof AdvanceSearchComponent
     */
    public searchAccount(query: string = '', page: number = 1): void {
        if (this.accountSearchRequest?.isLoading) {
            return;
        }

        const accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(
            this.voucherType,
            query,
            page,
            SearchType.CUSTOMER
        );
        this.accountSearchRequest = cloneDeep(accountSearchRequest);
        this.accountSearchRequest.isLoading = true;

        this.searchService
            .searchAccountV3(accountSearchRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.body?.results?.length) {
                    this.accountSearchRequest.loadMore = true;
                    let existingAccounts = [];
                    if (page > 1) {
                        this.accounts$?.subscribe((res) => (existingAccounts = res || []));
                    }
                    const newResults = response.body.results.map((res) => ({
                        label: res.name,
                        value: res.uniqueName,
                        additional: res
                    }));
                    this.accounts$ = observableOf(existingAccounts.concat(...newResults));
                } else {
                    this.accountSearchRequest.loadMore = false;
                    if (page === 1) {
                        this.accounts$ = observableOf([]);
                    }
                }
                this.accountSearchRequest.isLoading = false;
                this.changeDetectorRef.detectChanges();
            });
    }

    /**
     * Search accounts for party dropdown
     *
     * @param {string} query
     * @memberof AdvanceSearchComponent
     */
    public onAccountSearchQueryChanged(query: string): void {
        this.searchAccount(query, 1);
    }

    /**
     * Handles account dropdown scroll end
     *
     * @memberof AdvanceSearchComponent
     */
    public handleAccountScrollEnd(): void {
        if (this.accountSearchRequest?.loadMore) {
            const page = (this.accountSearchRequest.page || 1) + 1;
            this.searchAccount(decodeURIComponent(this.accountSearchRequest.q || ''), page);
        }
    }
}
