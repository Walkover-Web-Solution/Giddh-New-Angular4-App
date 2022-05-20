import { ChildGroup, ClosingBalance, ForwardedBalance, OpeningBalance } from './Search';

export interface TrialBalanceExportExcelRequest {
    fromDate?: string;
    toDate?: string;
    export?: string;
    filename?: string;
}

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

export interface ProfitLossRequest extends TrialBalanceRequest {
    fy?: number;
}

export class GetCogsRequest {
    public from: string;
    public to: string;
}

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
    incomeStatment?: any;
    message?: string;
}

export interface AccountDetails {
    forwardedBalance: ForwardedBalance;
    creditTotal: number;
    debitTotal: number;
    closingBalance: ClosingBalance;
    openingBalance: OpeningBalance;
    groupDetails: ChildGroup[];
    message?: string;
}

export interface BalanceSheetRequest extends TrialBalanceRequest {
    fy?: number;
}

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

export class GetRevenueResponse {
    public amount: number = 0;
    public type: string = '';
}

export class GetTotalExpenseResponse {
    public amount: number = 0;
    public type: string = '';
}

export class GetIncomeBeforeTaxes {
    public amount: number = 0;
    public type: string = '';
}
