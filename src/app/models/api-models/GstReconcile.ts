import { INameUniqueName } from '../interfaces/nameUniqueName.interface';

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

export class GstOverViewRequest {
  public gstin: string;
  public from: string;
  public to: string;
}

export class GStTransactionRequest extends GstOverViewRequest {
  public entityType: string;
  public type: string;
  public status: string;
}

export class Gstr1SummaryRequest extends GstOverViewRequest {
  public monthYear?: string;
}

export class GstDatePeriod {
  public from: string;
  public to: string;
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
  public transactionSummary: GstTransactionSummary[];
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

export class GstTransactionResult {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: GstTransactionSummary[];
  public size: number;
}

export class GstTransactionSummary {
  public voucherDate: string;
  public voucherNumber: string;
  public accountName: string;
  public accountGstin: string;
  public invoiceNumberForVoucher: string;
  public category: string;
  public status: string;
  public actionOnGstin: string;
  public pos: string;
  public invoiceType: string;
  public reason: string;
  public reverseCharge: string;
  public taxableAmount: number;
  public igstAmount: number;
  public cgstAmount: number;
  public sgstAmount: number;
  public cessAmount: number;
  public totalAmount: number;
  public amountReceived: number;
  public voucherType: string;
  public supplyType: string;
  public account: INameUniqueName;
}

export class GstOverViewResult {
  public count: number;
  public summary: GstOverViewSummary[];
}

export class GstOverViewSummary {
  public gstReturnType: string;
  public totalTransactions: number;
  public taxableAmount: number;
  public igstAmount: number;
  public cgstAmount: number;
  public sgstAmount: number;
  public cessAmount: number;
  public rate: number;
  public type?: string;
  public entityType: string;
  public pos: any;
  public name: string;
  public transactions?: GstOverViewSummary[];
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

export class Gstr1SummaryResponse {
  public type: string;
  public validatedAgainstSchema: boolean;
  public b2csErrors: any[];
  public errors: {
    number: number,
    type: string,
    messages: string[]
  };
  public data: {
    gstin: string;
    fp: number;
    brb: B2BSummary[]
  };
}

export class Gstr1SummaryBaseInvItemDetails {
  public txval: number;
  public rt: number;
  public samt: number;
  public camt: number;
}

export class Gstr1SummaryBaseInvItems {
  public num: number;
  // tslint:disable-next-line:variable-name
  public itm_det: Gstr1SummaryBaseInvItemDetails;
}

export class Gstr1SummaryBaseInv {
  public inum: string;
  public idt: string;
  public val: number;
  public pos: number;
  public rchrg: string;
  // tslint:disable-next-line:variable-name
  public inv_typ: string;
  public itms: Gstr1SummaryBaseInvItems[];
}

export class B2BSummary {
  public ctin: string;
  public inv: Gstr1SummaryBaseInv;
}
