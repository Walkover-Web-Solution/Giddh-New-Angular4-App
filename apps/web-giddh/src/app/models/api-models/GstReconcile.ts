// tslint:disable:variable-name
import { PAGINATION_LIMIT } from '../../app.constant';
import { INameUniqueName } from '../interfaces/name-unique-name.interface';

/**
 * VerifyOtpRequest class
 * Implements VerifyOtpRequest functionality
 */
export class VerifyOtpRequest {
    public otp: string;
}

/**
 * GstReconcileActionsEnum enumeration
 * Defines constant values for GstReconcileActionsEnum
 */
export enum GstReconcileActionsEnum {
    all = '',
    notfoundongiddh = 'notfoundongiddh',
    notfoundonportal = 'notfoundonportal',
    partiallymatched = 'partiallymatched',
    matched = 'matched',
    reconcile = 'reconcile'
}

/**
 * GstReconcileInvoiceRequest class
 * Implements GstReconcileInvoiceRequest functionality
 */
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
    public gstReturnType?: string;
}

/**
 * GstReconcileInvoiceResult interface definition
 * Defines the structure and contract for GstReconcileInvoiceResult objects
 */
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

/**
 * GstReconcileInvoiceResponse class
 * Implements GstReconcileInvoiceResponse functionality
 */
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

/**
 * GstReconcileInvoiceDetails class
 * Implements GstReconcileInvoiceDetails functionality
 */
export class GstReconcileInvoiceDetails {
    public page: number = 1;
    public count: number = PAGINATION_LIMIT;
    public totalPages: number;
    public totalItems: number;
    public results: GstReconcileInvoiceResult[];
    public size: number;
}

/**
 * GstOverViewRequest class
 * Implements GstOverViewRequest functionality
 */
export class GstOverViewRequest {
    public gstin: string;
    public from: string;
    public to: string;
    public currentDateTime?: string;
}

/**
 * GstrSheetDownloadRequest class
 * Implements GstrSheetDownloadRequest functionality
 */
export class GstrSheetDownloadRequest extends GstOverViewRequest {
    public type: string;
    public monthYear: string;
    public sheetType: string;
}

/**
 * FileGstr1Request class
 * Implements FileGstr1Request functionality
 */
export class FileGstr1Request extends GstOverViewRequest {
    public gsp: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
}

/**
 * GstSaveGspSessionRequest class
 * Implements GstSaveGspSessionRequest functionality
 */
export class GstSaveGspSessionRequest {
    public gstin: string;
    public userName: string;
    public gsp: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
    public otp?: string;
}

/**
 * GStTransactionRequest class
 * Implements GStTransactionRequest functionality
 */
export class GStTransactionRequest extends GstOverViewRequest {
    public entityType: string;
    public type: string;
    public status: string;
    public count: number;
    public page: number;
    public totalItems: number;
    public results: GstReconcileInvoiceResult[];
}

/**
 * Gstr1SummaryRequest class
 * Implements Gstr1SummaryRequest functionality
 */
export class Gstr1SummaryRequest extends GstOverViewRequest {
    public monthYear?: string;
}

/**
 * GstDatePeriod class
 * Implements GstDatePeriod functionality
 */
export class GstDatePeriod {
    public from: string;
    public to: string;
}

/**
 * GstTransactionResult class
 * Implements GstTransactionResult functionality
 */
export class GstTransactionResult {
    public page: number;
    public count: number;
    public totalPages: number;
    public totalItems: number;
    public results: GstTransactionSummary[];
    public size: number;
}

/**
 * GstTransactionSummary class
 * Implements GstTransactionSummary functionality
 */
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

/**
 * GstOverViewResult class
 * Implements GstOverViewResult functionality
 */
export class GstOverViewResult {
    public count: number;
    public summary: GstOverViewSummary[];
}

/**
 * GstOverViewSummary class
 * Implements GstOverViewSummary functionality
 */
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

/**
 * Gstr1SummaryResponse class
 * Implements Gstr1SummaryResponse functionality
 */
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

/**
 * Gstr1SummaryErrors class
 * Implements Gstr1SummaryErrors functionality
 */
export class Gstr1SummaryErrors {
    public number: number;
    public type: string;
    public messages: string[];
}

/**
 * Gstr1SummaryBaseInvItemDetails class
 * Implements Gstr1SummaryBaseInvItemDetails functionality
 */
export class Gstr1SummaryBaseInvItemDetails {
    public txval: number;
    public rt: number;
    public samt: number;
    public camt: number;
    public iamt: number;
    public csamt: number;
}

/**
 * Gstr1SummaryBaseInvItems class
 * Implements Gstr1SummaryBaseInvItems functionality
 */
export class Gstr1SummaryBaseInvItems {
    public num: number;
    public txval: number;
    public rt: number;
    public itm_det: Partial<Gstr1SummaryBaseInvItemDetails>;
    public csamt: number;
}

/**
 * Gstr1SummaryBaseInv class
 * Implements Gstr1SummaryBaseInv functionality
 */
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

/**
 * B2BSummary class
 * Implements B2BSummary functionality
 */
export class B2BSummary {
    public ctin: string;
    public inv: Partial<Gstr1SummaryBaseInv[]>;
}

/**
 * B2CLSummary class
 * Implements B2CLSummary functionality
 */
export class B2CLSummary {
    public pos: number;
    public inv: Partial<Gstr1SummaryBaseInv[]>;
}

/**
 * B2CSSummary class
 * Implements B2CSSummary functionality
 */
export class B2CSSummary extends Gstr1SummaryBaseInvItemDetails {
    public pos: number;
    public typ: string;
    public sply_typ: string;
}

/**
 * CDNRSummary class
 * Implements CDNRSummary functionality
 */
export class CDNRSummary {
    public ctin: string;
    public nt: Partial<Gstr1SummaryBaseInv[]>;
}

/**
 * EXPSummary class
 * Implements EXPSummary functionality
 */
export class EXPSummary {
    public exp_typ: string;
    public inv: Partial<Gstr1SummaryBaseInv[]>;
}

/**
 * HSNSummaryDetails class
 * Implements HSNSummaryDetails functionality
 */
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

/**
 * HSNSummary class
 * Implements HSNSummary functionality
 */
export class HSNSummary {
    public data: Partial<HSNSummaryDetails[]>;
    public empty: boolean;
}

/**
 * NilSummary class
 * Implements NilSummary functionality
 */
export class NilSummary {
    public inv: Partial<Gstr1SummaryBaseInv[]>;
}

/**
 * DocIssueSummaryDetailsDocs class
 * Implements DocIssueSummaryDetailsDocs functionality
 */
export class DocIssueSummaryDetailsDocs {
    public num: number;
    public from: string;
    public to: string;
    public totnum: number;
    public cancel: number;
    public net_issues: number;
    public doc: string;
}

/**
 * DocIssueSummaryDetails class
 * Implements DocIssueSummaryDetails functionality
 */
export class DocIssueSummaryDetails {
    public doc_num: number;
    public docs: DocIssueSummaryDetailsDocs[] = [];
}

/**
 * DocIssueSummary class
 * Implements DocIssueSummary functionality
 */
export class DocIssueSummary {
    public doc_det: DocIssueSummaryDetails[];
}

/**
 * GetGspSessionResponse class
 * Implements GetGspSessionResponse functionality
 */
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

/**
 * InterSupAmt interface definition
 * Defines the structure and contract for InterSupAmt objects
 */
export interface InterSupAmt {
    pos?: string;
    txval?: number;
    iamt?: number;
    csamt?: number;
    samt?: number;
    camt?: number;
}


/**
 * InterSup interface definition
 * Defines the structure and contract for InterSup objects
 */
export interface InterSup {
    unreg_details?: InterSupAmt[];
    comp_details?: InterSupAmt[];
    uin_details?: InterSupAmt[];
}

/**
 * ItcElgAmt interface definition
 * Defines the structure and contract for ItcElgAmt objects
 */
export interface ItcElgAmt {
    ty?: string;
    txval?: number;
    iamt?: number;
    camt?: number;
    samt?: number;
    csamt?: number;
}

/**
 * ItcElg interface definition
 * Defines the structure and contract for ItcElg objects
 */
export interface ItcElg {
    itc_avl?: ItcElgAmt[];
    itc_rev?: ItcElgAmt[];
    itc_net?: ItcElgAmt;
    itc_inelg?: ItcElgAmt[];
}

/**
 * IsupDetail interface definition
 * Defines the structure and contract for IsupDetail objects
 */
export interface IsupDetail {
    ty?: string;
    inter?: number;
    intra?: number;
}

/**
 * InwardSup interface definition
 * Defines the structure and contract for InwardSup objects
 */
export interface InwardSup {
    isup_details?: IsupDetail[];
}

/**
 * IntrLtfee interface definition
 * Defines the structure and contract for IntrLtfee objects
 */
export interface IntrLtfee {
    intr_details?: ItcElgAmt;
}

/**
 * Gstr3bOverviewResult2 class
 * Implements Gstr3bOverviewResult2 functionality
 */
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
/**
 * Gstr3bOverviewResult class
 * Implements Gstr3bOverviewResult functionality
 */
export class Gstr3bOverviewResult {
    status: string;
    body: Gstr3bOverviewResult2;
}
/**
 * GstrJsonDownloadRequest class
 * Implements GstrJsonDownloadRequest functionality
 */
export class GstrJsonDownloadRequest extends GstOverViewRequest {
    public type: string;
}

/**
 * Filing Status List Request
 *
 * @export
 * @class FilingStatusListRequest
 * @extends {GstOverViewRequest}
 */
export class FilingStatusListRequest extends GstOverViewRequest {
    public gsp: 'TAXPRO';
    public page: number;
    public count: number;
}

/**
 * Filing Status Request
 *
 * @export
 * @class FilingStatusRequest
 */
export class FilingStatusRequest {
    public referenceId: string;
}
