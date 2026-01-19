/**
 * DayBookResponseModel interface definition
 * Defines the structure and contract for DayBookResponseModel objects
 */
export interface DayBookResponseModel {
    file?: any;
    type?: string;
    entries: Entry[];
    page: number;
    count: number;
    totalPages: number;
    totalItems: number;
    fromDate: string;
    toDate: string;
    creditTotal: number;
    debitTotal: number;
    name: string;
    data?: string;
}

/**
 * Entry interface definition
 * Defines the structure and contract for Entry objects
 */
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

/**
 * OtherTransaction interface definition
 * Defines the structure and contract for OtherTransaction objects
 */
export interface OtherTransaction {
    particular: Particular;
    amount: number;
    type: string;
    inventory: any
}

/**
 * Particular interface definition
 * Defines the structure and contract for Particular objects
 */
export interface Particular {
    uniqueName: string;
    name: string;
}
