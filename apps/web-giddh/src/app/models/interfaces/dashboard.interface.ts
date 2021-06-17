import { IClosingBalance, IForwardBalance } from './ledger.interface';

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

export interface IBankAccount {
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
    isDatePickerOpen?: boolean;
    showAccList?: boolean;
    status?: string;
}