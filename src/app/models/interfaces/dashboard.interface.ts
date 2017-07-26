import { INameUniqueName } from './nameUniqueName.interface';
import { IClosingBalance, IForwardBalance } from './ledger.interface';
import { ClosingBalanceResponse } from '../api-models/Dashboard';

export interface IPeriodBalances {
  periodBalances: IPeriodBalancesitem[];
}

export interface IPeriodBalancesitem {
  from: string;
  monthlyBalance: number;
  to: string;
  yearlyBalance: number;
}

export interface IGroupHistoryGroups extends INameUniqueName {
  category: string;
  intervalBalances: IIntervalBalancesItem[];
}

export interface IIntervalBalancesItem {
  closingBalance: IClosingBalance;
  creditTotal: number;
  debitTotal: number;
  from: string;
  openingBalance: IForwardBalance;
  to: string;
}

export interface IDashboardCbMainItem {
  forwardedBalance: IForwardBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: IClosingBalance;
  childGroups: IChildGroups[];
  accounts: ICbAccount[];
  uniqueName: string;
  category: string;
  groupName: string;
}

export interface IChildGroups {
  forwardedBalance: IForwardBalance;
  creditTotal: number;
  debitTotal: number;
  closingBalance: IClosingBalance;
  childGroups: IChildGroups[];
  accounts: ICbAccount[];
  uniqueName: string;
  groupName: string;
  category: any;
}

export interface ICbAccount {
  creditTotal: number;
  debitTotal: number;
  closingBalance: IClosingBalance;
  openingBalance: IForwardBalance;
  uniqueName: string;
  name: string;
}

export interface IExpensesChartClosingBalanceResponse {
  operatingcostActiveyear?: ClosingBalanceResponse;
  operatingcostLastyear?: ClosingBalanceResponse;
  indirectexpensesActiveyear?: ClosingBalanceResponse;
  indirectexpensesLastyear?: ClosingBalanceResponse;
}
