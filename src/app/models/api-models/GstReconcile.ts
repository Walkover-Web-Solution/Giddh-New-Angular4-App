// tslint:disable:variable-name
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
    brb: B2BSummary[];
    b2cl: B2CLSummary[];
    cdnr: CDNRSummary[];
    b2cs: B2CSSummary[];
    exp: EXPSummary[];
    hsn: HSNSummary;
    nil: NilSummary;
    doc_issue: DocIssueSummary;
  };
}

export class Gstr1SummaryBaseInvItemDetails {
  public txval: number;
  public rt: number;
  public samt: number;
  public camt: number;
  public iamt: number;
}

export class Gstr1SummaryBaseInvItems {
  public num: number;
  public txval: number;
  public rt: number;
  public itm_det: Partial<Gstr1SummaryBaseInvItemDetails>;
  public csamt: number;
}

export class Gstr1SummaryBaseInv {
  public inum: string;
  public idt: string;
  public val: number;
  public pos: number;
  public rchrg: string;
  public inv_typ: string;
  public itms: Partial<Gstr1SummaryBaseInvItems[]>;
  public sply_ty: string;
  public expt_amt: number;
  public nil_amt: number;
  public ngsup_amt: number;
}

export class Gstr1SummaryBaseNt extends Gstr1SummaryBaseInv {
  public ntty: string;
  public nt_num: string;
  public nt_dt: string;
  public p_gst: string;
}

export class B2BSummary {
  public ctin: string;
  public inv: Partial<Gstr1SummaryBaseInv[]>;
}

export class B2CLSummary {
  public pos: number;
  public inv: Partial<Gstr1SummaryBaseInv[]>;
}

export class B2CSSummary extends Gstr1SummaryBaseInvItemDetails {
  public pos: number;
  public typ: string;
  public sply_typ: string;
}

export class CDNRSummary {
  public ctin: string;
  public nt: Partial<Gstr1SummaryBaseInv[]>;
}

export class EXPSummary {
  public exp_typ: string;
  public inv: Partial<Gstr1SummaryBaseInv[]>;
}

export class HSNSummaryDetails {
  public num: number;
  public hsn_sc: number;
  public desc: string;
  public uqc: string;
  public qty: number;
  public val: number;
  public txval: number;
  public camt: number;
  public samt: number;
}

export class HSNSummary {
  public data: Partial<HSNSummaryDetails[]>;
  public empty: boolean;
}

export class NilSummary {
  public inv: Partial<Gstr1SummaryBaseInv[]>;
}

export class DocIssueSummaryDetails {
  public doc_num: number;
  public docs: Array<{
    num: number;
    from: string;
    to: string;
    totnum: number;
    cancel: number;
    net_issues: number;
  }>;
}

export class DocIssueSummary {
  public doc_det: DocIssueSummaryDetails[];
}

export class CDNURSummary {
  public typ: string;
  public ntty: string;
  public nt_num: string;
  public nt_dt: string;
  public p_gst: string;
  public inum: string;
  public idt: string;
  public val: number;
  public itms: Partial<Gstr1SummaryBaseInvItems[]>;
}
