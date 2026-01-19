/** Sales Tax Report types  */
/**
 * SalesTaxReport enumeration
 * Defines constant values for SalesTaxReport
 */
export enum SalesTaxReport {
    TaxAuthorityWise = 'tax-authority',
    TaxWise = 'tax',
    AccountWise = 'account',
}

/** Create Tax Authority Keys */
/**
 * CreateTaxAuthority class
 * Implements CreateTaxAuthority functionality
 */
export class CreateTaxAuthority {
    name: string;
    stateCode: string;
    description?: string;
}

/** Create Tax Authority Keys */
/**
 * SalesTaxReportRequest interface definition
 * Defines the structure and contract for SalesTaxReportRequest objects
 */
export interface SalesTaxReportRequest {
    page: number;
    count: number;
    to: string;
    from: string;
    taxNumber: string;
    taxUniqueName?: string;
    taxAuthorityUniqueName?: string;
}