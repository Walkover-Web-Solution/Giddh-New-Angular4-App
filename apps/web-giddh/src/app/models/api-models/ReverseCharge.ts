/**
 * ReverseChargeReportGetRequest class
 * Implements ReverseChargeReportGetRequest functionality
 */
export class ReverseChargeReportGetRequest {
    from: string;
    to: string;
    sort: string;
    sortBy: string;
    page: any;
    count: any;
    branchUniqueName?: string;
}

/**
 * ReverseChargeReportPostRequest class
 * Implements ReverseChargeReportPostRequest functionality
 */
export class ReverseChargeReportPostRequest {
    supplierName: any;
    invoiceNumber: any;
    supplierCountry: any;
    voucherType: any;
}
