import { INameUniqueName } from '../api-models/Inventory';
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

export interface IRevenueChartClosingBalanceResponse {
    revenuefromoperationsActiveyear?: ClosingBalanceResponse;
    revenuefromoperationsLastyear?: ClosingBalanceResponse;
    otherincomeActiveyear?: ClosingBalanceResponse;
    otherincomeLastyear?: ClosingBalanceResponse;
}

export interface ITotalOverDuesResponse {
    sundryDebtorsClosing?: IDashboardCbMainItem;
    sundryCreditorsClosing?: IDashboardCbMainItem;
}

export class IComparisionChartResponse {
    // Referesh
    public refresh?: boolean;
    // revenue
    public revenueActiveYear?: any[];
    public revenueActiveYearMonthly?: any[];
    public revenueActiveYearYearly?: any[];
    public revenueLastYear?: any[];
    public revenueLastYearMonthly?: any[];
    public revenueLastYearYearly?: any[];
    // expenses
    public ExpensesActiveYear?: any[];
    public ExpensesActiveYearMonthly?: any[];
    public ExpensesActiveYearYearly?: any[];
    public ExpensesLastYear?: any[];
    public ExpensesLastYearMonthly?: any[];
    public ExpensesLastYearYearly?: any[];
    // networth
    public NetworthActiveYear?: any;
    public NetworthActiveYearMonthly?: any[];
    public NetworthActiveYearYearly?: any[];
    public NetworthLastYear?: any;
    public NetworthLastYearMonthly?: any[];
    public NetworthLastYearYearly?: any[];
    // P/L
    public ProfitLossActiveYear?: any;
    public ProfitLossActiveYearMonthly?: any[];
    public ProfitLossActiveYearYearly?: any[];
    public ProfitLossLastYear?: any;
    public ProfitLossLastYearMonthly?: any[];
    public ProfitLossLastYearYearly?: any[];
}

export interface ProfitLossChart {
    networth: any[];
    profitLoss: any[];
    monthlyBalances?: any;
    yearlyBalances?: any;
}

export interface IBankAccount {
    /*  amount: number;
      transactionDate: string;
      loginId: string;
      reconnect: boolean;
      accountNumber?: any;
      currencyCode: string;
      accountId: number;
      linkedAccount: INameUniqueName;
      name: string; */
    itemId: number;
    itemAccountId: number;
    siteAccountId: number;
    accountName: string;
    balance: number;
    balanceCurrencyCode: string;
    currentBalance: number;
    currentBalanceCurrencyCode: string;
    availableBalance: number;
    availableBalanceCurrencyCode: string;
    siteName: string;
    contentServiceId: string;
    itemContainerTotal: string;
    itemContainerCurrencyCode?: string;
    giddhAccount?: any;
    isActive: number;
    transactionDate?: null;
    accountNumber: string;
    visible: boolean;
    providerAccount: { providerAccountId: string };
}

let cost = {
    // revenue
    revenueActiveYear: [],
    revenueActiveYearMonthly: [],
    revenueActiveYearYearly: [],
    revenueLastYear: [],
    revenueLastYearMonthly: [],
    revenueLastYearYearly: [],
    // expenses
    ExpensesActiveYear: [],
    ExpensesActiveYearMonthly: [],
    ExpensesActiveYearYearly: [],
    ExpensesLastYear: [],
    ExpensesLastYearMonthly: [],
    ExpensesLastYearYearly: [],
    // networth
    NetworthActiveYear: {
        networth: [],
        profitLoss: []
    },
    NetworthActiveYearMonthly: [],
    NetworthActiveYearYearly: [],
    NetworthLastYear: {
        networth: [],
        profitLoss: []
    },
    NetworthLastYearMonthly: [],
    NetworthLastYearYearly: [],
    // P/L
    ProfitLossActiveYear: {
        networth: [],
        profitLoss: []
    },
    ProfitLossActiveYearMonthly: [],
    ProfitLossActiveYearYearly: [],
    ProfitLossLastYear: {
        networth: [],
        profitLoss: []
    },
    ProfitLossLastYearMonthly: [],
    ProfitLossLastYearYearly: [],
};
