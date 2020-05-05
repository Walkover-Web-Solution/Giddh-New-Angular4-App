export interface DayBookResponseModel {
    entries: Entry[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    fromDate: string;
    toDate: string;
    creditTotal: number;
    debitTotal: number;
}

export interface Entry {
    uniqueName: string;
    voucherName: string;
    particular: Particular;
    voucherNo: number;
    otherTransactions: OtherTransaction[];
    createdAt: string;
    entryDate: string;
    creditAmount?: number;
    debitAmount?: number;
    isExpanded?: boolean;
}

export interface OtherTransaction {
    particular: Particular;
    amount: number;
    type: string;
    inventory: any
}

export interface Particular {
    uniqueName: string;
    name: string;
}
