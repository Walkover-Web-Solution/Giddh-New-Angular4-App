/**
 * Created by ad on 07-07-2017.
 */

export interface ForwardedBalance {
	amount: number;
	type: string;
}

export interface ClosingBalance {
	amount: number;
	type: string;
}

export interface OpeningBalance {
	amount: number;
	type: string;
}

export class Account {
	public creditTotal: number;
	public debitTotal: number;
	public closingBalance: ClosingBalance;
	public openingBalance: OpeningBalance;
	public uniqueName: string;
	public name: string;
	public isVisible: boolean = false;
	public isIncludedInSearch: boolean = true;
	public isCreated: boolean = false;
}

export interface AccountFlat {
	creditTotal: number;
	debitTotal: number;
	closeBalanceType: string;
	openBalanceType: string;
	closingBalance: number;
	openingBalance: number;
	uniqueName: string;
	name: string;
	parent: string;
	isSelected?: boolean;
}

export interface GroupFlat {
	creditTotal: number;
	debitTotal: number;
	closeBalanceType: string;
	openBalanceType: string;
	closingBalance: number;
	openingBalance: number;
	uniqueName: string;
	name: string;
	parent: string;
}

export class ChildGroup {
	public forwardedBalance: ForwardedBalance;
	public creditTotal: number;
	public debitTotal: number;
	public closingBalance: ClosingBalance;
	public childGroups: ChildGroup[];
	public accounts: Account[];
	public uniqueName: string;
	public category?: any;
	public groupName: string;
	public isIncludedInSearch: boolean = true;
	public isCreated: boolean = false;
	public isVisible: boolean = false;
	public level1?: boolean = false;
	public isOpen?: boolean = false;
}

export interface SearchResponse {
	forwardedBalance: ForwardedBalance;
	creditTotal: number;
	debitTotal: number;
	closingBalance: ClosingBalance;
	childGroups: ChildGroup[];
	accounts: any[];
	uniqueName: string;
	category: string;
	groupName: string;
}

export interface SearchRequest {
	groupName: string;
	fromDate: string;
	toDate: string;
	refresh: boolean;
	page: number;
}

export class SearchDataSet {
	public queryType: string = null;
	public balType: string = 'CREDIT';
	public queryDiffer: string = null;
	public amount: string = null;
	public closingBalanceType?: string = 'DEBIT';
	public openingBalanceType?: string = 'DEBIT';
}

export interface BulkEmailRequest {
	params: BulkEmailRequestParams;
	data: BulkEmailRequestData;
}

export interface BulkEmailRequestData {
	subject: string;
	message: string;
	accounts: string[];
}

export interface BulkEmailRequestParams {
	from: string;
	to: string;
	groupUniqueName: string;
}
