export class ReverseChargeReportGetRequest {
    from: string;
    to: string;
    sort: string;
    sortBy: string;
    page: any;
    count: any;
    branchUniqueName?: string;
}

export class ReverseChargeReportPostRequest {
    supplierName: any;
    invoiceNumber: any;
    supplierCountry: any;
    voucherType: any;
}
