/**
 * VatReportRequest class
 * Implements VatReportRequest functionality
 */
export class VatReportRequest {
    from: string;
    to: string;
    taxNumber: string;
    branchUniqueName: string;
    currencyCode?: string;
}

/**
 * VatReportSectionData class
 * Implements VatReportSectionData functionality
 */
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

/**
 * VatReportSections class
 * Implements VatReportSections functionality
 */
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

/**
 * VatReportResponse class
 * Implements VatReportResponse functionality
 */
export class VatReportResponse {
    sections: VatReportSections[];
}

/**
 * VatReportTransactionsRequest class
 * Implements VatReportTransactionsRequest functionality
 */
export class VatReportTransactionsRequest {
    from: string;
    to: string;
    taxNumber: string;
    section: any;
    page: any;
    count: any;
    country?: string;
}

/**
 * VatDetailedReportRequest class
 * Implements VatDetailedReportRequest functionality
 */
export class VatDetailedReportRequest extends VatReportTransactionsRequest {
    currencyCode?: 'BWP' | 'USD' | 'GBP' | 'INR' | 'EUR';
    branchUniqueName?: string;
}