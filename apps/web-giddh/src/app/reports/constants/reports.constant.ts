/** List of advance receipt report filters */
export const ADVANCE_RECEIPT_REPORT_FILTERS = {
    RECEIPT_FILTER: 'receipt',
    CUSTOMER_FILTER: 'customerName',
    PAYMENT_FILTER: 'paymentMode',
    INVOICE_FILTER: 'invoiceNumber'
}

/** Interface for advance search voucher field */
export interface AdjustmentVoucher {
    vouchers: Array<any>;
    selectedValue: string;
    isDisabled?: boolean;
}

/** Interface for amount search voucher field */
export interface AmountFilter {
    filterValues: Array<any>;
    selectedValue: string;
    amount: any;
}

/** Receipt modal for advance search */
export interface ReceiptAdvanceSearchModel {
    adjustmentVoucherDetails: AdjustmentVoucher;
    totalAmountFilter: AmountFilter;
    unusedAmountFilter: AmountFilter;
}

/** Payment modal for advance search */
export interface PaymentAdvanceSearchModel {
    totalAmountFilter: AmountFilter;
    unusedAmountFilter: AmountFilter;
}

/** List of payment report filters */
export const PAYMENT_REPORT_FILTERS = {
    PAYMENT_FILTER: 'payment',
    CUSTOMER_FILTER: 'customerName',
    VENDOR_FILTER: 'vendorName'
}