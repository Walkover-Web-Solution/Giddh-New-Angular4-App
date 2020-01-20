import { PagedResponse } from '../api-models/BaseResponse';

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

export interface RecurringInvoices extends PagedResponse {
    recurringVoucherDetails: RecurringInvoice[];
}
