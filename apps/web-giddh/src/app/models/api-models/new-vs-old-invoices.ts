export class NewVsOldInvoicesRequest {
    public type: string;
    public value: string;
}

export interface TotalSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

export interface NewSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

export interface OldSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    uniqueNames: string[];
    fromDate: string;
    toDate: string;
}

export interface NewVsOldInvoices {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
    fromDate: string;
    toDate: string;
}

export interface NewVsOldInvoicesResponse {
    totalSales: TotalSales;
    newSales: NewSales;
    oldSales: OldSales;
    carriedSales: NewVsOldInvoices[];
}