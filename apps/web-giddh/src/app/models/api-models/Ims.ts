/**
 * IMS (Invoice Management System) client types.
 *
 * These describe what the frontend expects from the Giddh v2 IMS endpoints
 * (`ims-invoices`, `save-ims`, `save-ims-status`, `ims-referenceIds`).
 * They are not verified backend guarantees: see docs/CONTRACTS.md (IMS) and
 * docs/OPEN_QUESTIONS.md before relying on a field.
 */

/** IMS status of an invoice */
export type ImsStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING' | 'NO_ACTION';

/** Status a user can send to the portal (NO_ACTION is never sent) */
export type ImsActionStatus = Exclude<ImsStatus, 'NO_ACTION'>;

/** Sync state of an invoice between Giddh and the GST portal */
export type ImsSyncState = 'SYNCED' | 'LOCAL_PENDING_SYNC' | 'SYNC_FAILED';

/** ITC reduction required flag */
export type ImsItcReductionRequired = 'Y' | 'N';

/** Invoice row returned by `ims-invoices` */
export interface ImsInvoice {
    /** IMS section code as returned by the backend, for example B2B or CN */
    section: string;
    supplierGstin: string;
    supplierName: string;
    docNumber: string;
    docDate: string;
    originalDocNumber?: string;
    originalDocDate?: string;
    invTyp?: string;
    pos?: string;
    srcform?: string;
    rtnprd?: string;
    hash?: string;
    taxableValue: number;
    igst: number;
    cgst: number;
    sgst: number;
    cess: number;
    totalValue: number;
    imsStatus: ImsStatus;
    syncState: ImsSyncState;
    prevStatus?: 'A' | 'R' | 'P' | 'N';
    itcRedReq?: ImsItcReductionRequired;
    remarks?: string;
    lastReferenceId?: string;
}

/** Summary counts returned by `ims-invoices` */
export interface ImsSummary {
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
    noAction: number;
    gstin: string;
    returnPeriod: string;
    note: string;
}

/** Body of `ims-invoices` */
export interface ImsInvoicesResponse {
    summary: ImsSummary;
    invoices: ImsInvoice[];
    page: number;
    count: number;
    totalResults: number;
    note: string;
}

/** Query params of `ims-invoices` */
export interface ImsInvoicesRequest {
    gstin: string;
    /** Period in MM-yyyy, for example 10-2026 */
    monthYear: string;
    refresh: boolean;
    status?: ImsStatus;
    page: number;
    count: number;
}

/** One invoice action sent to `save-ims` */
export interface ImsAction {
    /** Not sent for reset */
    status?: ImsActionStatus;
    section: string;
    supplierGstin: string;
    docNumber: string;
    docDate?: string;
    hash?: string;
    itcRedReq?: ImsItcReductionRequired;
    remarks?: string;
}

/** Body of `save-ims` */
export interface ImsSaveRequest {
    actions: ImsAction[];
}

/** Query params of `save-ims` */
export interface ImsSaveParams {
    gstin: string;
    monthYear: string;
    reset: boolean;
}

/**
 * Body of `save-ims` and `save-ims-status`.
 * The recorded sandbox responses use the GSTR save shape (`referenceId`, `gstErrorCode`,
 * `gstResponseString`); the frontend guide describes a portal shape (`data.reference_id`).
 * Both are typed so the UI can read whichever the backend returns.
 */
export interface ImsSaveResponse {
    referenceId?: string;
    dataSaved?: boolean;
    gstErrorCode?: string;
    gstResponseString?: string;
    gstError?: unknown;
    gspErrors?: unknown[];
    systemErrors?: unknown[];
    status_cd?: string;
    status_desc?: string;
    /** Recorded save-ims-status shape returns these directly on the body, e.g. { transTypCd: 'RST', status_cd: 'P', proc_cnt: '1', err_cnt: '0' } */
    transTypCd?: string;
    proc_cnt?: string;
    err_cnt?: string;
    err_cd?: string;
    err_msg?: string;
    data?: {
        reference_id?: string;
        int_tran_id?: string;
        status_cd?: string;
        err_msg?: string;
        err_cd?: string;
    };
}

/** Portal JSON carried in `gstResponseString` */
export interface ImsPortalStatus {
    status_cd?: string;
    err_msg?: string;
    err_cd?: string;
    err_cnt?: string;
    proc_cnt?: string;
}

/** Query params of `save-ims-status` */
export interface ImsSaveStatusRequest {
    referenceId: string;
    gstin: string;
    /** Return period in MMyyyy */
    retPeriod: string;
}

/** Row of `ims-referenceIds` */
export interface ImsReferenceRow {
    retPeriod: string;
    referenceId: string;
    gstin: string;
    filingDateTime: string;
    type: string;
}
