import { INameUniqueName } from './nameUniqueName.interface';
import { IClosingBalance, IForwardBalance } from './ledger.interface';

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
