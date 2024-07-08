/** Sales Tax Report types  */
export enum SalesTaxReport {
    TaxAuthorityWise = 'tax-authority',
    TaxWise = 'tax',
    AccountWise = 'account',
}

/** Create Tax Authority Keys */
export class CreateTaxAuthority {
    name: string;
    stateCode: string;
    description?: string;
}

/** Create Tax Authority Keys */
export interface SalesTaxReportRequest {
    to: string;
    from: string;
    taxNumber: string;
    taxUniqueName?: string;
    taxAuthorityUniqueName?: string;
}