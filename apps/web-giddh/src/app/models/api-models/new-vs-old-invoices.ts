export class NewVsOldInvoicesRequest {
    public type: string;
    public value: string;
}

export interface TotalSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
}

export interface NewSales {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
}

export interface NewVsOldInvoices {
    invoiceCount: number;
    total: number;
    month: string;
    uniqueCount: number;
}

export interface NewVsOldInvoicesResponse {
    totalSales: TotalSales;
    newSales: NewSales;
    carriedSales: NewVsOldInvoices[];
}
