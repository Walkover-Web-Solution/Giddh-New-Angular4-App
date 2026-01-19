import { ProfitLossDateRangeResponse } from "./tb-pl-bs";

/**
 * ForwardedBalance interface definition
 * Defines the structure and contract for ForwardedBalance objects
 */
export interface ForwardedBalance {
    amount: number;
    type: string;
}

/**
 * ClosingBalance interface definition
 * Defines the structure and contract for ClosingBalance objects
 */
export interface ClosingBalance {
    amount: number;
    type: string;
}

/**
 * OpeningBalance interface definition
 * Defines the structure and contract for OpeningBalance objects
 */
export interface OpeningBalance {
    amount: number;
    type: string;
}

/**
 * Account class
 * Implements Account functionality
 */
export class Account {
    public creditTotal: number;
    public debitTotal: number;
    public closingBalance: ClosingBalance;
    public openingBalance: OpeningBalance;
    public uniqueName: string;
    public name: string;
    public isVisible: boolean = false;
    public isIncludedInSearch: boolean = true;
    public isCreated: boolean = false;
    public category?: string;
}

/**
 * AccountFlat interface definition
 * Defines the structure and contract for AccountFlat objects
 */
export interface AccountFlat {
    creditTotal: number;
    debitTotal: number;
    closeBalanceType: string;
    openBalanceType: string;
    closingBalance: number;
    openingBalance: number;
    uniqueName: string;
    name: string;
    parent: string;
    isSelected?: boolean;
}

/**
 * ChildGroup class
 * Implements ChildGroup functionality
 */
export class ChildGroup {
    public forwardedBalance: ForwardedBalance;
    public creditTotal: number;
    public debitTotal: number;
    public closingBalance: ProfitLossDateRangeResponse<ClosingBalance>;
    public childGroups: ChildGroup[];
    public accounts: Account[];
    public uniqueName: string;
    public category?: any;
    public groupName: string;
    public isIncludedInSearch: boolean = true;
    public isCreated: boolean = false;
    public isVisible: boolean = false;
    public level1?: boolean = false;
    public isOpen?: boolean = false;
    public checked?: boolean = false;
    public isSelfCreatedGroup?: boolean = false;
}

/**
 * SearchResponse interface definition
 * Defines the structure and contract for SearchResponse objects
 */
export interface SearchResponse {
    forwardedBalance: ForwardedBalance;
    creditTotal: number;
    debitTotal: number;
    closingBalance: ClosingBalance;
    childGroups: ChildGroup[];
    accounts: any[];
    uniqueName: string;
    category: string;
    groupName: string;
}

/**
 * SearchRequest interface definition
 * Defines the structure and contract for SearchRequest objects
 */
export interface SearchRequest {
    groupName: string;
    fromDate: string;
    toDate: string;
    refresh: boolean;
    page: number;
    branchUniqueName?: string;
}

/**
 * SearchDataSet class
 * Implements SearchDataSet functionality
 */
export class SearchDataSet {
    public queryType: string = null;
    public balType: string = 'CREDIT';
    public queryDiffer: string = null;
    public amount: string = null;
    public closingBalanceType?: string = 'DEBIT';
    public openingBalanceType?: string = 'DEBIT';
}

/**
 * BulkEmailRequest interface definition
 * Defines the structure and contract for BulkEmailRequest objects
 */
export interface BulkEmailRequest {
    params: BulkEmailRequestParams;
    data: BulkEmailRequestData;
    branchUniqueName?: string;
}

/**
 * BulkEmailRequestData interface definition
 * Defines the structure and contract for BulkEmailRequestData objects
 */
export interface BulkEmailRequestData {
    subject: string;
    message: string;
    accounts: string[];
}

/**
 * BulkEmailRequestParams interface definition
 * Defines the structure and contract for BulkEmailRequestParams objects
 */
export interface BulkEmailRequestParams {
    from: string;
    to: string;
    groupUniqueName: string;
    sortBy?: string;
    sort?: string;
}
