export class VatReportRequest {
    from: string;
    to: string;
    taxNumber: string;
    branchUniqueName: string;
    currencyCode?: string;
}

export class VatReportSectionData {
    order: number;
    section: any;
    toolTip: string;
    description: string;
    amount: any;
    vatAmount: any;
    adjustmentAmount: any;
    totalVatAmount: any;
    totalAdjustmentAmount: any;
    totalAmount: any;
}

export class VatReportSections {
    order: number;
    section: string;
    toolTip: any;
    description: any;
    amount: any;
    vatAmount: any;
    adjustmentAmount: any;
    sections: VatReportSectionData[]
}

export class VatReportResponse {
    sections: VatReportSections[];
}

export class VatReportTransactionsRequest {
    from: string;
    to: string;
    taxNumber: string;
    section: any;
    page: any;
    count: any;
}

export class VatDetailedReportRequest extends VatReportTransactionsRequest {
    currencyCode?: string;
    branchUniqueName?: string;
}