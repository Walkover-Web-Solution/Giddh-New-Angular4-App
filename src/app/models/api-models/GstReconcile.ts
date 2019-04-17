export class VerifyOtpRequest {
  public otp: string;
}

export interface GstReconcileInvoiceResult {
  invoiceNumber: string;
  taxableAmount: number;
  grandTotal: number;
  placeOfSupply: string;
  stateCode: string;
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

export class GstOverViewResponse {
  public totalTransactions: number;
  public transactionSummary: TransactionSummary;
}

export class HsnSummaryResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: HsnSummaryResult[];
  public size: number;
}
export class HsnSummaryResult {
  public totalTransactions: number;
  public transactionSummary: TransactionSummary[];
  public hsnsac: number;
  public desc: number;
  public qty: number;
  public txval: number;
  public iamt: number;
  public camt: number;
  public csamt: number;
  public samt: number;
  public total: number;
  public uqc: string;
}

export class NilSummaryResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: NilSummaryResult[];
  public size: number;
}
export class NilSummaryResult {
  public supplyType: string;
  public registrationType: string;
  public nilAmount: number;
  public exemptAmount: number;
  public nonGstAmount: number;
}
export class TransactionSummary {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: OverViewResult[];
  public size: number;
}

export class OverViewResult {
  public gstReturnType: string;
  public totalTransactions: number;
  public taxableAmount: number;
  public igstAmount: number;
  public cgstAmount: number;
  public sgstAmount: number;
  public cessAmount: number;
  public rate: number;
  public type: string;
  public entityType: string;
  public pos: any;
  public name: string;
  public transactions?: OverViewResult[];
}

export class TransactionCounts {
  public gstr1Transactions: number;
  public gstr2Transactions: number;
  public uncategorized: number;
}

export class DocumentIssuedResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: DocumentIssuedResult[];
  public size: number;
}

export class DocumentIssuedResult {
  public num: number;
  public doc: string;
  public from: string;
  public to: string;
  public totnum: number;
  public cancel: number;
  public netIssue: any;
  public action: string;
  public custom: string;
}
