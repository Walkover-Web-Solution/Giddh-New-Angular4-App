/** List of advance receipt report filters */
export const ADVANCE_RECEIPT_REPORT_FILTERS = {
    RECEIPT_FILTER: 'receipt',
    CUSTOMER_FILTER: 'customerName',
    PAYMENT_FILTER: 'paymentMode',
    INVOICE_FILTER: 'invoiceNumber'
}

export const RECEIPT_TYPES = [
    { label: 'Normal Receipts', value: 'normal receipt' },
    { label: 'Advance Receipts', value: 'advance receipt' }
];

export const ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS = [
    { label: 'Greater Than', value: 'GREATER_THAN' },
    { label: 'Greater Than or Equals', value: 'GREATER_THAN_OR_EQUALS' },
    { label: 'Less Than or Equals', value: 'LESS_THAN_OR_EQUALS' },
    { label: 'Equals', value: 'EQUALS' },
    { label: 'Not Equals', value: 'NOT_EQUALS' }
];

export interface AdjustmentVoucher {
    vouchers: Array<any>;
    selectedValue: string;
    isDisabled?: boolean;
}

export interface AmountFilter {
    filterValues: Array<any>;
    selectedValue: string;
    amount: any;
}
export interface ReceiptAdvanceSearchModel {
    adjustmentVoucherDetails: AdjustmentVoucher;
    totalAmountFilter: AmountFilter;
    unusedAmountFilter: AmountFilter;
}
