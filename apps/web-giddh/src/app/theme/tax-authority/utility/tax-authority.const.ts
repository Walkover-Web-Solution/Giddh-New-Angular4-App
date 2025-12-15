export const TAX_AUTHORITY_TYPES = {
    GST: 'gst',
    VAT: 'vat',
    INCOME_TAX: 'income_tax',
    SERVICE_TAX: 'service_tax'
};

export const TAX_RATES = {
    GST_0: 0,
    GST_5: 5,
    GST_12: 12,
    GST_18: 18,
    GST_28: 28
};

export const TAX_AUTHORITY_CONSTANTS = {
    DEFAULT_TAX_RATE: 18,
    MAX_TAX_RATE: 28,
    MIN_TAX_RATE: 0
};

export interface CreateTaxAuthority {
    name?: string;
    taxType?: string;
    rate?: number;
    country?: string;
    isDefault?: boolean;
}

export enum SalesTaxReport {
    TaxAuthorityWise = 'tax-authority-wise',
    TaxWise = 'tax-wise',
    AccountWise = 'account-wise'
}

export interface SalesTaxReportData {
    period?: string;
    totalSales?: number;
    totalTax?: number;
    taxBreakdown?: any[];
}

export interface SalesTaxReportRequest {
    fromDate?: string;
    toDate?: string;
    taxType?: string;
    country?: string;
    includeDetails?: boolean;
    taxAuthorityUniqueName?: string;
    taxUniqueName?: string;
    taxNumber?: string;
    count?: number;
    page?: number;
    from?: string;
    to?: string;
}
