export interface DueRangeRequest {
	range: string[];
}

export class DueAmountReportQueryRequest {
	public q: string = '';
	public from?: string = '';
	public to?: string = '';
	public page: number = 0;
	public count: number = 20;
	public sortBy: string = 'name';
	public sort: 'asc' | 'desc' = 'asc';
	public rangeCol: number = 0;
}

export interface DueAmountReportRequest {
	totalDueAmountGreaterThan: boolean;
	totalDueAmountLessThan: boolean;
	totalDueAmountEqualTo: boolean;
	totalDueAmount: number;
	includeTotalDueAmount: boolean;
	name: string[];
}

export interface CurrentAndPastDueAmount {
	dueAmount: number;
	range: string;
}

export interface Result {
	name: string;
	groupName: string;
	totalDueAmount: number;
	futureDueAmount: number;
	currentAndPastDueAmount: CurrentAndPastDueAmount[];
}

export interface DueAmountReportResponse {
	page: number;
	count: number;
	totalPages: number;
	totalItems: number;
	results: Result[];
	size: number;
	overAllDueAmount?: number;
	overAllFutureDueAmount?: number;
}

export interface AgingDropDownoptions {
	fourth: number;
	fifth: number;
	sixth: number;
}

export class ContactAdvanceSearchCommonModal {
	category: string;
	amountType: string;
	amount: number;
}

export class ContactAdvanceSearchModal {
	openingBalance: number;
	openingBalanceType: string;
	openingBalanceGreaterThan: boolean;
	openingBalanceLessThan: boolean;
	openingBalanceEqual: boolean;
	closingBalance: number;
	closingBalanceType: string;
	closingBalanceGreaterThan: boolean;
	closingBalanceLessThan: boolean;
	closingBalanceEqual: boolean;
	creditTotal: number;
	creditTotalGreaterThan: boolean;
	creditTotalLessThan: boolean;
	creditTotalEqual: boolean;
	debitTotal: number;
	debitTotalGreaterThan: boolean;
	debitTotalLessThan: boolean;
	debitTotalEqual: boolean;
	openingBalanceNotEqual: boolean;
	closingBalanceNotEqual: boolean;
	creditTotalNotEqual: boolean;
	debitTotalNotEqual: boolean;
}

export class AgingAdvanceSearchModal {
	includeTotalDueAmount: boolean = false;
	totalDueAmountGreaterThan: boolean = false;
	totalDueAmountLessThan: boolean = false;
	totalDueAmountEqualTo: boolean = false;
	totalDueAmountNotEqualTo: boolean = false;
	totalDueAmount: number;
	name: string[];
}

export class CustomerAdvanceSearchModal {
	openingBalance: number;
	openingBalanceType: string = "debit";
	openingBalanceGreaterThan: boolean;
	openingBalanceLessThan: boolean;
	openingBalanceEqual: boolean;
	closingBalance: number;
	closingBalanceType: string = "debit";
	closingBalanceGreaterThan: boolean;
	closingBalanceLessThan: boolean;
	closingBalanceEqual: boolean;
	creditTotal: number;
	creditTotalGreaterThan: boolean;
	creditTotalLessThan: boolean;
	creditTotalEqual: boolean;
	debitTotal: number;
	debitTotalGreaterThan: boolean;
	debitTotalLessThan: boolean;
	debitTotalEqual: boolean;
	openingBalanceNotEqual: boolean;
	closingBalanceNotEqual: boolean;
	creditTotalNotEqual: boolean;
	debitTotalNotEqual: boolean;
}

export class CustomerVendorFiledFilter {
	public parentGroup: boolean = false;
	public email: boolean = false;
	public mobile: boolean = false;
	public state: boolean = false;
	public gstin: boolean = false;
	public comment: boolean = false;
	public openingBalance: boolean = false;
	public closingBalance: boolean = false;
}
