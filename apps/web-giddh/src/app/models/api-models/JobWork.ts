export type JobWorkType = 'SEND' | 'RECEIVE';
export type JobworkerType = 'REGISTERED' | 'UNREGISTERED';
export type ScrapRetainedBy = 'JOBWORKER' | 'COMPANY';
export type ScrapTreatment = 'REDUCE_FROM_JOB_WORK_COST' | 'KEEP_AS_SCRAP_STOCK';
export type JobWorkActionType = 'RETURN' | 'MARK_SCRAP' | 'ADJUST' | 'PRINT' | 'CANCEL' | 'DELETE';

export interface JobWorkBatch {
    uniqueName?: string;
    name?: string;
    quantity?: number;
}

export interface JobWorkStockLine {
    stockUniqueName: string;
    variantUniqueName?: string;
    quantity: number;
    stockUnitCode?: string;
    stockUnitUniqueName?: string;
    rate?: number;
    amount?: number;
    batches?: JobWorkBatch[];
    /** UI-only helpers */
    stockName?: string;
    variantName?: string;
    stocks?: Array<{ label: string; value: string; additional?: Record<string, unknown> }>;
    stocksPageNumber?: number;
    stocksTotalPages?: number;
    stocksQ?: string;
    variants?: Array<{ label: string; value: string }>;
    unitsList?: Array<{ label: string; value: string }>;
}

export interface JobWorkExpenseLine {
    fromAccountUniqueName: string;
    toAccountUniqueName: string;
    tax?: string;
    amount: number;
    taxAmount?: number;
    /** UI-only */
    fromAccountName?: string;
    toAccountName?: string;
    /** Selected tax unique names for common-tax. */
    taxes?: string[];
}

export interface JobWorkScrapLine {
    stockUniqueName: string;
    variantUniqueName?: string;
    quantity: number;
    rate?: number;
    amount?: number;
    retainedBy?: ScrapRetainedBy;
    treatment?: ScrapTreatment;
    batches?: JobWorkBatch[];
    /** UI-only */
    stockName?: string;
    variantName?: string;
    stockUnitCode?: string;
    stockUnitUniqueName?: string;
    stocks?: Array<{ label: string; value: string; additional?: Record<string, unknown> }>;
    stocksPageNumber?: number;
    stocksTotalPages?: number;
    stocksQ?: string;
    variants?: Array<{ label: string; value: string }>;
    unitsList?: Array<{ label: string; value: string }>;
}

export interface JobWorkOrderRequest {
    jobWorkType: JobWorkType;
    date: string;
    warehouseUniqueName: string;
    accountUniqueName: string;
    jobworkerType: JobworkerType;
    gstin?: string;
    deliveryChallanUniqueName?: string;
    challanDate?: string;
    expectedReturnDate?: string;
    process?: string;
    contactPerson?: string;
    mobile?: string;
    isCapitalGoods?: boolean;
    alertEnabled?: boolean;
    alertBeforeDays?: number;
    increaseAssetValue?: boolean;
    claimItc?: boolean;
    scrapRetainedBy?: ScrapRetainedBy;
    scrapTreatment?: ScrapTreatment;
    finishedStock: JobWorkStockLine;
    rawStocks: JobWorkStockLine[];
    expenses: JobWorkExpenseLine[];
    scraps: JobWorkScrapLine[];
}

export interface JobWorkListRequest {
    from: string;
    to: string;
    accountUniqueName?: string;
    warehouseUniqueName?: string;
    q?: string;
    jobWorkType?: JobWorkType | '';
    status?: string;
    onlyOverdue?: boolean;
    onlyItcClaimed?: boolean;
    page?: number;
    count?: number;
    sort?: string;
    sortBy?: string;
}

export interface JobWorkActionRequest {
    action: JobWorkActionType;
    uniqueName?: string;
    uniqueNames?: string[];
    date?: string;
    warehouseUniqueName?: string;
    isFinal?: boolean;
    reason?: string;
    increaseAssetValue?: boolean;
    claimItc?: boolean;
    items?: Array<{
        lineRole: 'OUTPUT' | 'INPUT';
        stockUniqueName: string;
        variantUniqueName?: string;
        quantity: number;
        batches?: JobWorkBatch[];
    }>;
    scraps?: JobWorkScrapLine[];
    expenses?: JobWorkExpenseLine[];
}

/** Linked delivery challan returned by job-work challan GET. */
export interface JobWorkLinkedChallan {
    id?: number;
    uniqueName?: string;
    documentNo?: string;
    documentType?: string;
    documentDate?: string;
    status?: string;
    stockPosted?: boolean;
    isActive?: boolean;
    quantity?: number;
    warehouse?: {
        name?: string;
        uniqueName?: string;
    };
    documentItems?: Array<{
        id?: number;
        lineRole?: string;
        stock?: { name?: string; uniqueName?: string };
        variant?: { name?: string; uniqueName?: string };
        batch?: { name?: string; uniqueName?: string };
        batches?: JobWorkBatch[];
        quantity?: number;
        rate?: number;
        amount?: number;
    }>;
}

export class JobWorkFormModel implements JobWorkOrderRequest {
    jobWorkType: JobWorkType = 'SEND';
    date = '';
    warehouseUniqueName = '';
    accountUniqueName = '';
    jobworkerType: JobworkerType = 'REGISTERED';
    gstin = '';
    deliveryChallanUniqueName = '';
    challanDate = '';
    expectedReturnDate = '';
    process = '';
    contactPerson = '';
    mobile = '';
    isCapitalGoods = false;
    alertEnabled = true;
    alertBeforeDays = 15;
    increaseAssetValue = true;
    claimItc = true;
    scrapRetainedBy: ScrapRetainedBy = 'JOBWORKER';
    scrapTreatment: ScrapTreatment = 'REDUCE_FROM_JOB_WORK_COST';
    finishedStock: JobWorkStockLine = {
        stockUniqueName: '',
        variantUniqueName: '',
        quantity: 1,
        stockUnitCode: '',
        stockUnitUniqueName: '',
        batches: [],
        stocks: [],
        stocksPageNumber: 1,
        stocksTotalPages: 1,
        stocksQ: '',
        variants: [],
        unitsList: []
    };
    rawStocks: JobWorkStockLine[] = [];
    expenses: JobWorkExpenseLine[] = [];
    scraps: JobWorkScrapLine[] = [];
    /** UI labels */
    accountName = '';
    warehouseName = '';
}
