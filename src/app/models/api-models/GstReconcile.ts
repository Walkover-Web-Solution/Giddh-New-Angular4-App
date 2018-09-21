export class VerifyOtpRequest {
  public otp: string;
}

export interface GstReconcileInvoiceResult {
  invoiceNumber: string;
  taxableAmount: number;
  grandTotal: number;
  placeOfSupply: string;
  invoiceDate: string;
  ctin: string;
  sgst: number;
  cgst: number;
  igst: any;
  cess: number;
  accountName: string;
  dataInGiddh: GstReconcileInvoiceResult;
}

export interface GstReconcileInvoiceResponse {
  details: GstReconcileInvoiceDetails;
  notFoundOnGiddh: number;
  notFoundOnPortal: number;
  matched: number;
  partiallyMatched: number;
}

export interface GstReconcileInvoiceDetails {
  page: number;
  count: number;
  totalPages: number;
  totalItems: number;
  results: GstReconcileInvoiceResult[];
  size: number;
}
