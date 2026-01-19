/**
 * NewVsOldInvoicesRequest class
 * Implements NewVsOldInvoicesRequest functionality
 */
export class NewVsOldInvoicesRequest {
    public type: string;
    public value: string;
}

/**
 * TotalSales interface definition
 * Defines the structure and contract for TotalSales objects
 */
export interface TotalSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

/**
 * NewSales interface definition
 * Defines the structure and contract for NewSales objects
 */
export interface NewSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

/**
 * OldSales interface definition
 * Defines the structure and contract for OldSales objects
 */
export interface OldSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    uniqueNames: string[];
    fromDate: string;
    toDate: string;
}

/**
 * NewVsOldInvoices interface definition
 * Defines the structure and contract for NewVsOldInvoices objects
 */
export interface NewVsOldInvoices {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

/**
 * NewVsOldInvoicesResponse interface definition
 * Defines the structure and contract for NewVsOldInvoicesResponse objects
 */
export interface NewVsOldInvoicesResponse {
    totalSales: TotalSales;
    newSales: NewSales;
    oldSales: OldSales;
    carriedSales: NewVsOldInvoices[];
}