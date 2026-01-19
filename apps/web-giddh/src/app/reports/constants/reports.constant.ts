/** List of advance receipt report filters */
export const ADVANCE_RECEIPT_REPORT_FILTERS = {
    RECEIPT_FILTER: 'receipt',
    CUSTOMER_FILTER: 'customerName',
    PAYMENT_FILTER: 'paymentMode',
    INVOICE_FILTER: 'invoiceNumber'
}

/** Interface for advance search voucher field */
/**
 * AdjustmentVoucher interface definition
 * Defines the structure and contract for AdjustmentVoucher objects
 */
export interface AdjustmentVoucher {
    vouchers: Array<any>;
    selectedValue: string;
    isDisabled?: boolean;
}

/** Interface for amount search voucher field */
/**
 * AmountFilter interface definition
 * Defines the structure and contract for AmountFilter objects
 */
export interface AmountFilter {
    filterValues: Array<any>;
    selectedValue: string;
    amount: any;
}

/** Receipt modal for advance search */
/**
 * ReceiptAdvanceSearchModel interface definition
 * Defines the structure and contract for ReceiptAdvanceSearchModel objects
 */
export interface ReceiptAdvanceSearchModel {
    adjustmentVoucherDetails: AdjustmentVoucher;
    totalAmountFilter: AmountFilter;
    unusedAmountFilter: AmountFilter;
}

/** Payment modal for advance search */
/**
 * PaymentAdvanceSearchModel interface definition
 * Defines the structure and contract for PaymentAdvanceSearchModel objects
 */
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

/**
 * DurationEnum enumeration
 * Defines constant values for DurationEnum
 */
export enum DurationEnum {
    Monthly = 'monthly',
    Quarterly = 'quarterly',
    Weekly = 'weekly'
}

/** Group by enum */
/**
 * GroupBy enumeration
 * Defines constant values for GroupBy
 */
export enum GroupBy {
    Duration = 'duration',
    SalesPerson = 'salesPerson'
}