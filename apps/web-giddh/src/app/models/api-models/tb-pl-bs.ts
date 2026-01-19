import { ChildGroup, ClosingBalance, ForwardedBalance, OpeningBalance } from './Search';

/**
 * TrialBalanceExportExcelRequest interface definition
 * Defines the structure and contract for TrialBalanceExportExcelRequest objects
 */
export interface TrialBalanceExportExcelRequest {
    fromDate?: string;
    toDate?: string;
    export?: string;
    filename?: string;
}

/**
 * TrialBalanceRequest interface definition
 * Defines the structure and contract for TrialBalanceRequest objects
 */
export interface TrialBalanceRequest {
    from?: string;
    to?: string;
    refresh?: boolean;
    selectedDateOption?: string;
    tagName?: string;
    branchUniqueName?: string;
    filename?: string;
    view?: string;
}
/**
 * ComparedProfitLossRequest interface definition
 * Defines the structure and contract for ComparedProfitLossRequest objects
 */
export interface ComparedProfitLossRequest {
    compareType?: 'month' |'year' |'quarter' |'period';
    compareValue?: number;
}

/**
 * ProfitLossRequest interface definition
 * Defines the structure and contract for ProfitLossRequest objects
 */
export interface ProfitLossRequest extends TrialBalanceRequest, ComparedProfitLossRequest {
    fy?: number;
    projectUniqueName?: string;
}

/**
 * GetCogsRequest class
 * Implements GetCogsRequest functionality
 */
export class GetCogsRequest {
    public from: string;
    public to: string;
}

/**
 * ProfitLossDateRangeResponse class
 * Implements ProfitLossDateRangeResponse functionality
 */
export class ProfitLossDateRangeResponse<T> {
    [dateRange: string]: T;
}

/**
 * GetCogsResponse class
 * Implements GetCogsResponse functionality
 */
export class GetCogsResponse {
    public closingInventory: number = 0;
    public cogs: number = 0;
    public fromDate: string = '';
    public manufacturingExpenses: number = 0;
    public openingInventory: number = 0;
    public purchasesStockAmount: number = 0;
    public debitNoteStockAmount: number = 0; /**This key refers to the total debit notes stock transaction amount for particular date period, added by Aditya Soni */
    public toDate: string = '';
}

/**
 * BalanceSheetData interface definition
 * Defines the structure and contract for BalanceSheetData objects
 */
export interface BalanceSheetData {
    assets?: ChildGroup[];
    liabilities?: ChildGroup[];
    othArr?: ChildGroup[];
    assetTotal?: number;
    assetTotalEnd?: number;
    liabTotal?: number;
    liabTotalEnd?: number;
    dates?: BalanceSheetRequest;
    message?: string;
}

/**
 * ProfitLossData interface definition
 * Defines the structure and contract for ProfitLossData objects
 */
export interface ProfitLossData {
    inProfit?: boolean;
    incArr?: ChildGroup[];
    expArr?: ChildGroup[];
    othArr?: ChildGroup[];
    expenseTotal?: number;
    expenseTotalEnd?: number;
    incomeTotal?: number;
    incomeTotalEnd?: number;
    closingBalance?: number;
    frowardBalance?: number;
    closingBalanceClass?: boolean;
    frowardBalanceClass?: boolean;
    dates?: ProfitLossRequest;
    incomeStatement?: any;
    message?: string;
    headers?: string[];
}

/**
 * AccountDetails interface definition
 * Defines the structure and contract for AccountDetails objects
 */
export interface AccountDetails {
    forwardedBalance: ForwardedBalance;
    creditTotal: number;
    debitTotal: number;
    closingBalance: ClosingBalance;
    openingBalance: OpeningBalance;
    groupDetails: ChildGroup[];
    message?: string;
}

/**
 * BalanceSheetRequest interface definition
 * Defines the structure and contract for BalanceSheetRequest objects
 */
export interface BalanceSheetRequest extends TrialBalanceRequest {
    fy?: number;
}

/**
 * BalanceSheetData interface definition
 * Defines the structure and contract for BalanceSheetData objects
 */
export interface BalanceSheetData {
    inProfit?: boolean;
    incArr?: ChildGroup[];
    expArr?: ChildGroup[];
    othArr?: ChildGroup[];
    expenseTotal?: number;
    incomeTotal?: number;
    closingBalance?: number;
    dates?: BalanceSheetRequest;
}

/**
 * GetRevenueResponse class
 * Implements GetRevenueResponse functionality
 */
export class GetRevenueResponse {
    public amount: number = 0;
    public type: string = '';
}

/**
 * GetTotalExpenseResponse class
 * Implements GetTotalExpenseResponse functionality
 */
export class GetTotalExpenseResponse {
    public amount: number = 0;
    public type: string = '';
}

/**
 * GetIncomeBeforeTaxes class
 * Implements GetIncomeBeforeTaxes functionality
 */
export class GetIncomeBeforeTaxes {
    public amount: number = 0;
    public type: string = '';
}
