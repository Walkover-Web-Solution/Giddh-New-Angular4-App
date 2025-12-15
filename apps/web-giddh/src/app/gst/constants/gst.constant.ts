export enum GstReport {
    Gstr1 = 'gstr1',
    Gstr2 = 'gstr2',
    Gstr3b = 'gstr3b'
}

export interface GstReportData {
    reportType?: string;
    period?: string;
    fromDate?: string;
    toDate?: string;
    gstNumber?: string;
    companyUniqueName?: string;
}

export const GST_REPORT_TYPES = {
    GSTR1: 'gstr1',
    GSTR2: 'gstr2',
    GSTR3B: 'gstr3b',
    GSTR4: 'gstr4',
    GSTR9: 'gstr9'
};

export const GST_CONSTANTS = {
    DEFAULT_GST_RATE: 18,
    CGST_RATE: 9,
    SGST_RATE: 9,
    IGST_RATE: 18,
    CESS_RATE: 0
};

export interface GstReconcileRequest {
    fromDate?: string;
    toDate?: string;
    gstNumber?: string;
    action?: string;
}

export interface GstReconcileResponse {
    body?: any;
    status?: string;
    queryString?: any;
}
