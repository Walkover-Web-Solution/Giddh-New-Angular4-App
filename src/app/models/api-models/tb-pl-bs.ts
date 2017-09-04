import { ChildGroup, ClosingBalance, ForwardedBalance, OpeningBalance } from './Search';

export interface TrialBalanceExportRequest {
  fromDate?: string;
  toDate?: string;
  export?: string;
}

export interface TrialBalanceExportResponse {
  fromDate?: string;
  toDate?: string;
  export?: string;
}

export interface TrialBalanceRequest {
  from?: string;
  to?: string;
  refresh?: boolean;
}

export interface ProfitLossRequest extends TrialBalanceRequest {
  fy?: number;
}

export interface BalanceSheetData {
  assets?: ChildGroup[];
  liabilities?: ChildGroup[];
  othArr?: ChildGroup[];
  assetTotal?: number;
  liabTotal?: number;
  dates?: BalanceSheetRequest;
}

export interface ProfitLossData {
  inProfit?: boolean;
  incArr?: ChildGroup[];
  expArr?: ChildGroup[];
  othArr?: ChildGroup[];
  expenseTotal?: number;
  incomeTotal?: number;
  closingBalance?: number;
  dates?: ProfitLossRequest;
}

export interface AccountDetails {
  forwardedBalance: ForwardedBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: ClosingBalance;
  openingBalance: OpeningBalance;
  groupDetails: ChildGroup[];
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
