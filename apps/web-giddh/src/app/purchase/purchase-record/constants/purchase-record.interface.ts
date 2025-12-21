export interface PurchaseRecordRequest {
    page?: number;
    count?: number;
    sort?: string;
    sortBy?: string;
    q?: string;
    from?: string;
    to?: string;
}

export interface PurchaseRecordResponse {
    body?: any;
    queryString?: any;
    status?: string;
}

export interface PurchaseRecord {
    uniqueName?: string;
    voucherNumber?: string;
    voucherDate?: string;
    account?: any;
    total?: number;
    grandTotal?: number;
}

export interface PurchaseRecordUpdateModel {
    uniqueName?: string;
    voucherNumber?: string;
    voucherDate?: string;
    account?: any;
    entries?: any[];
    total?: number;
    grandTotal?: number;
    status?: string;
    updateMode?: string;
}

export const PURCHASE_RECORD_DATE_OPERATION = {
    EQUALS: 'equals',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    BETWEEN: 'between',
    AFTER: 'after',
    BEFORE: 'before',
    ON: 'on'
};

export const PURCHASE_RECORD_DUE_DATE_OPERATION = {
    EQUALS: 'equals',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    BETWEEN: 'between',
    ON: 'on',
    AFTER: 'after',
    BEFORE: 'before'
};

export const PURCHASE_RECORD_GRAND_TOTAL_OPERATION = {
    EQUALS: 'equals',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    BETWEEN: 'between',
    GREATER_THAN_OR_EQUALS: 'greater_than_or_equals',
    LESS_THAN_OR_EQUALS: 'less_than_or_equals'
};

export interface IPurchaseRecordAdvanceSearch {
    dateOperation?: string;
    fromDate?: string;
    toDate?: string;
    dueDateOperation?: string;
    dueFromDate?: string;
    dueToDate?: string;
    dueDate?: string;
    purchaseDate?: string;
    purchaseDateOperation?: string;
    grandTotalOperation?: string;
    grandTotalFrom?: number;
    grandTotalTo?: number;
    grandTotal?: string | number;
    accountUniqueNames?: string[];
    voucherNumbers?: string[];
    purchaseOrderNumber?: string;
}

export class PurchaseRecordAdvanceSearch implements IPurchaseRecordAdvanceSearch {
    dateOperation?: string;
    fromDate?: string;
    toDate?: string;
    dueDateOperation?: string;
    dueFromDate?: string;
    dueToDate?: string;
    dueDate?: string;
    purchaseDate?: string;
    purchaseDateOperation?: string;
    grandTotalOperation?: string;
    grandTotalFrom?: number;
    grandTotalTo?: number;
    grandTotal?: string | number;
    accountUniqueNames?: string[];
    voucherNumbers?: string[];
    purchaseOrderNumber?: string;

    constructor() {
        this.accountUniqueNames = [];
        this.voucherNumbers = [];
    }
}
