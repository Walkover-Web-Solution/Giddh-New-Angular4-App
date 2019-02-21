import { PagedResponse } from '../api-models/BaseResponse';

export interface RecurringInvoice {
  voucherNumber: string;
  duration: string;
  nextCronDate: string;
  cronEndDate: string;
  uniqueName: string;
  customerName?: string;
  status?: string;
  voucherTotal?: string;
  lastInvoiceDate?: string;
  voucherType?: string;
  isSelected?: boolean;
}

export interface RecurringInvoices extends PagedResponse {
  recurringVoucherDetails: RecurringInvoice[];
}
