import { PagedResponse } from '../api-models/BaseResponse';

/**
 * RecurringInvoice interface definition
 * Defines the structure and contract for RecurringInvoice objects
 */
export interface RecurringInvoice {
    isSelected?: boolean;
    voucherNumber: string;
    duration: string;
    nextCronDate: string;
    cronEndDate: string;
    uniqueName: string;
    customerName?: string;
    status?: string;
    voucherTotal?: number;
    lastInvoiceDate?: string;
    voucherType?: string;
}

/**
 * RecurringInvoices interface definition
 * Defines the structure and contract for RecurringInvoices objects
 */
export interface RecurringInvoices extends PagedResponse {
    recurringVoucherDetails: RecurringInvoice[];
}
