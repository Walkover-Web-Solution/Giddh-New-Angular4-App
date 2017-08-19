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
  fromDate?: string;
  toDate?: string;
  refresh?: boolean;
}

export interface ProfitLossRequest extends TrialBalanceRequest {
  fy?: number;
}

export interface ProfitLossData {
  inProfit?: boolean;
  incArr?: ChildGroup[];
  expArr?: ChildGroup[];
  othArr?: ChildGroup[];
  expenseTotal?: number;
  incomeTotal?: number;
  closingBalance?: number;
}

export interface AccountDetails {
  forwardedBalance: ForwardedBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: ClosingBalance;
  openingBalance: OpeningBalance;
  groupDetails: ChildGroup[];
}
