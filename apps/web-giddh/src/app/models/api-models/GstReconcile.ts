// tslint:disable:variable-name
import { INameUniqueName } from '../interfaces/name-unique-name.interface';

export class VerifyOtpRequest {
    public otp: string;
}

export enum GstReconcileActionsEnum {
    all = '',
    notfoundongiddh = 'notfoundongiddh',
    notfoundonportal = 'notfoundonportal',
    partiallymatched = 'partiallymatched',
    matched = 'matched',
    reconcile = 'reconcile'
}

export class GstReconcileInvoiceRequest {
    public monthYear: string;
    public from: string;
    public to: string;
    public page: number = 1;
    public count: number = 20;
    public action: GstReconcileActionsEnum;
    public refresh: boolean;
    public category: string;
    public gstin?: string;
}

export interface GstReconcileInvoiceResult {
    invoiceNumber: string;
    taxableAmount: number;
    grandTotal: number;
    placeOfSupply: string;
    stateCode: string;
    invoiceDate: string;
    isError: boolean;
    ctin: string;
    sgst: number;
    cgst: number;
    igst: any;
    cess: number;
    accountName: string;
    dataInGiddh: GstReconcileInvoiceResult;
    chksum: string;
    pos: number;
    rchrg: string;
    accountUniqueName: string;
    entryUniqueNames: string[];
    reconciledData: any;
    invoice_number: string;
    invoice_date: string;
    grand_total: number;
    invoice_type: string;
    note_number: string;
    note_dates: string;
    note_type: string;
    taxable_amount: number;
    igst_amount: number;
    cgst_amount: number;
    sgst_amount: number;
    cess_amount: number;
    data_in_giddh: Partial<GstReconcileInvoiceResult>;
}

export class GstReconcileInvoiceResponse {
    public notFoundOnGiddh: number;
    public notFoundOnPortal: number;
    public matchedCount: number;
    public partiallyMatched: number;
    public reconcileCount: number;
    public not_found_on_giddh: GstReconcileInvoiceDetails;
    public not_found_on_portal: GstReconcileInvoiceDetails;
    public matched: GstReconcileInvoiceDetails;
    public partially_matched: GstReconcileInvoiceDetails;
    public reconcile: GstReconcileInvoiceDetails;
}

export class GstReconcileInvoiceDetails {
    public page: number = 1;
    public count: number;
    public totalPages: number;
    public totalItems: number;
    public results: GstReconcileInvoiceResult[];
    public size: number;
}

export class GstOverViewRequest {
    public gstin: string;
    public from: string;
    public to: string;
}

export class GstrSheetDownloadRequest extends GstOverViewRequest {
    public type: string;
    public monthYear: string;
    public sheetType: string;
}

export class FileGstr1Request extends GstOverViewRequest {
    public gsp: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
}

export class GstSaveGspSessionRequest {
    public gstin: string;
    public userName: string;
    public gsp: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
    public otp?: string;
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
    public voucherUniqueName?: string;
    public uniqueName?: string;
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

export class Gstr1SummaryResponse {
    public type: string;
    public validatedAgainstSchema: boolean;
    public b2csErrors: any[] = [];
    public errors: Gstr1SummaryErrors[] = [];
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
    } = { gstin: '', fp: 0, brb: [], b2cl: [], cdnr: [], b2cs: [], exp: [], hsn: null, nil: null, doc_issue: null };
}

export class Gstr1SummaryErrors {
    public number: number;
    public type: string;
    public messages: string[];
}

export class Gstr1SummaryBaseInvItemDetails {
    public txval: number;
    public rt: number;
    public samt: number;
    public camt: number;
    public iamt: number;
    public csamt: number;
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
    public iamt: number;
    public samt: number;
    public csamt: number;
}

export class HSNSummary {
    public data: Partial<HSNSummaryDetails[]>;
    public empty: boolean;
}

export class NilSummary {
    public inv: Partial<Gstr1SummaryBaseInv[]>;
}

export class DocIssueSummaryDetailsDocs {
    public num: number;
    public from: string;
    public to: string;
    public totnum: number;
    public cancel: number;
    public net_issues: number;
    public doc: string;
}

export class DocIssueSummaryDetails {
    public doc_num: number;
    public docs: DocIssueSummaryDetailsDocs[] = [];
}

export class DocIssueSummary {
    public doc_det: DocIssueSummaryDetails[];
}

export class GetGspSessionResponse {
    public vayana: boolean;
    public taxpro: boolean;
}

/**
 *
 * Model for GSTR3B data of a company
 */

export interface SupDetails {
    osup_det?: ItcElgAmt;
    osup_zero?: InterSupAmt;
    osup_nil_exmp?: ItcElgAmt;
    isup_rev?: ItcElgAmt;
    osup_nongst?: ItcElgAmt;
}

export interface InterSupAmt {
    pos?: string;
    txval?: number;
    iamt?: number;
    csamt?: number;
    samt?: number;
    camt?: number;
}


export interface InterSup {
    unreg_details?: InterSupAmt[];
    comp_details?: InterSupAmt[];
    uin_details?: InterSupAmt[];
}

export interface ItcElgAmt {
    ty?: string;
    txval?: number;
    iamt?: number;
    camt?: number;
    samt?: number;
    csamt?: number;
}

export interface ItcElg {
    itc_avl?: ItcElgAmt[];
    itc_rev?: ItcElgAmt[];
    itc_net?: ItcElgAmt;
    itc_inelg?: ItcElgAmt[];
}

export interface IsupDetail {
    ty?: string;
    inter?: number;
    intra?: number;
}

export interface InwardSup {
    isup_details?: IsupDetail[];
}

export interface IntrLtfee {
    intr_details?: ItcElgAmt;
}

export class Gstr3bOverviewResult2 {
    gstin?: string;
    ret_period?: string;
    sup_details?: SupDetails;
    inter_sup?: InterSup;
    itc_elg?: ItcElg;
    inward_sup?: InwardSup;
    intr_ltfee?: IntrLtfee;
    sumTaxVal?: number;
    sumIamtVal?: number;
    sumCamtval?: number;
    sumSamtval?: number;
    sumCsamtval?: number;

}
export class Gstr3bOverviewResult {
    status: string;
    body: Gstr3bOverviewResult2;
}
export class GstrJsonDownloadRequest extends GstOverViewRequest {
    public type: string;
}
