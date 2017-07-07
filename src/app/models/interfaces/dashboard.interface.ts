export interface IPeriodBalances {
  periodBalances: IPeriodBalancesitem[];
}

export interface IPeriodBalancesitem {
  from: string;
  monthlyBalance: number;
  to: string;
  yearlyBalance: number;
}
