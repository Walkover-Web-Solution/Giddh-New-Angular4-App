import { IBankAccount, ICbAccount, IChildGroups, IDashboardCbMainItem, IGroupHistoryGroups, IPeriodBalances } from '../interfaces/dashboard.interface';
import { IClosingBalance, IForwardBalance } from '../interfaces/ledger.interface';

/**
 * Model for Audit Dashboard api request
 * API:: (Dashboard) company/:companyUniqueName/dashboard?from=:from&to=:to&interval=:interval&refresh=refresh
 * In Request Payload
 * A.   "from" and "to" params will be sent
 * interval values can be time unit we are seding monthly for now
 * refresh is boolean
 * NOTE:: we are sending an extra header called 'X-Forwarded-For': res.locales.remoteIp
 * NOTE:: its response will be a hash containing a key logs
 */
export class DashboardResponse {
	public networth: IPeriodBalances[];
	public profitLoss: IPeriodBalances[];
}

/**
 * Model for group-history api request
 * POST call
 * API:: (group-history) company/:companyUniqueName/group-history?from=:from&to=:to&interval=:interval&refresh=refresh
 * In Request Payload
 * A. "from" and "to" params will be sent
 * refresh is boolean
 * interval values can be time unit we are seding monthly for now
 * NOTE:: its response will be a hash containing a GroupHistoryResponse
 */

export class GroupHistoryRequest {
	public groups?: string[];
	public accounts?: string[];
	public category?: string[];
}

/**
 * NOTE:: as discussed accounts will be null always
 */
export class GroupHistoryResponse {
	public accounts?: any;
	public groups: IGroupHistoryGroups[];
}

/*
 * Model: for closing balance
 * API: /company/:companyUniqueName/groups/:groupUniqueName/closing-balance?fromDate=:date1&toDate=:date2&refresh=:refresh
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

export class BankAccountsResponse {
	public yodleeAccounts: IBankAccount[];
	public siteName: string;
	public siteId: number;
	public status: string;
	public reason: string;
	public isRefreshWithCredentials: boolean;
}

export class RefreshBankAccountResponse {
	public token: string;
	public connectUrl: string;
	// tslint:disable-next-line:variable-name
	public token_URL: string;
}

export class GraphTypesResponse {
	public uniqueName?: any;
	public type: string;
}

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

export class RevenueGraphDataResponse {
	public currentClosingBalance: {
		amount: any;
		type: any;
	};

	public currentHighestClosingBalance: {
		amount: string;
		type: string;
	};

	public currentLowestClosingBalance: {
		amount: string;
		type: string;
	};

	public previousClosingBalance: {
		amount: string;
		type: string;
	};

	public previousHighestClosingBalance: {
		amount: string;
		type: string;
	};

	public previousLowestClosingBalance: {
		amount: string;
		type: string;
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
