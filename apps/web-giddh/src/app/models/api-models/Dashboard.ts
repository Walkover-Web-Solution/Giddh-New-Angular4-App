import { IBankAccount, ICbAccount, IChildGroups, IDashboardCbMainItem } from '../interfaces/dashboard.interface';
import { IClosingBalance, IForwardBalance } from '../interfaces/ledger.interface';

/*
 * Model: for closing balance
 * API: /company/:companyUniqueName/groups/:groupUniqueName/closing-balance?fromDate=:date1&toDate=:date2&refresh=:refresh
*/

/**
 * ClosingBalanceResponse class
 * Implements ClosingBalanceResponse functionality
 */
export class ClosingBalanceResponse implements IDashboardCbMainItem, IChildGroups {
    public forwardedBalance: IForwardBalance;
    public creditTotal: number;
    public debitTotal: number;
    public closingBalance: IClosingBalance;
    public childGroups: IChildGroups[];
    public accounts: ICbAccount[];
    public uniqueName: string;
    public category: string;
    public groupName: string;
}

/**
 * BankAccountsResponse class
 * Implements BankAccountsResponse functionality
 */
export class BankAccountsResponse {
    public yodleeAccounts: IBankAccount[];
    public siteName: string;
    public siteId: number;
    public status: string;
    public reason: string;
    public isRefreshWithCredentials: boolean;
}

/**
 * GraphTypesResponse class
 * Implements GraphTypesResponse functionality
 */
export class GraphTypesResponse {
    public uniqueName?: any;
    public type: string;
}

/**
 * RevenueGraphDataRequest class
 * Implements RevenueGraphDataRequest functionality
 */
export class RevenueGraphDataRequest {
    public currentFrom?: string;
    public currentTo: string;
    public previousFrom: string;
    public previousTo: string;
    public interval: string;
    public type: string;
    public uniqueName: string;
    public refresh: any;
}

/**
 * RevenueGraphDataResponse class
 * Implements RevenueGraphDataResponse functionality
 */
export class RevenueGraphDataResponse {
    public currentClosingBalance: {
        amount: any;
        type: any;
    };

    public currentHighestClosingBalance: {
        amount: string;
        type: string;
        dateLabel: string;
    };

    public currentLowestClosingBalance: {
        amount: string;
        type: string;
        dateLabel: string;
    };

    public previousClosingBalance: {
        amount: string;
        type: string;
    };

    public previousHighestClosingBalance: {
        amount: string;
        type: string;
        dateLabel: string;
    };

    public previousLowestClosingBalance: {
        amount: string;
        type: string;
        dateLabel: string;
    };

    public balances: [{
        current: {
            openingBalance: {
                amount: string;
                type: string;
            };
            creditTotal: any;
            debitTotal: any;
            closingBalance: {
                amount: string;
                type: string;
            };
            dateLabel: string;
            balance: {
                amount: string;
                type: string;
            };
            from: string;
            to: string;
        };

        previous: {
            openingBalance: {
                amount: string;
                type: string;
            };
            creditTotal: any;
            debitTotal: any;
            closingBalance: {
                amount: string;
                type: string;
            };
            dateLabel: string;
            balance: {
                amount: string;
                type: string;
            };
            from: string;
            to: string;
        };

        percentageChange: any;
    }];
}
