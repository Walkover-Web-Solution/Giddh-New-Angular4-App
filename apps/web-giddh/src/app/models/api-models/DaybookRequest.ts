export class DaybookQueryRequest {
	public q: string = '';
	public page: number = 0;
	public count: number = 20;
	public from: string = '';
	public to: string = '';
	public format: 'pdf' | 'xlsx' = 'pdf';
	public type: string = 'admin-condensed';
	public sort: 'asc' | 'desc' = 'asc';
}

export interface DayBookRequestModel {
	amountLessThan: boolean;
	includeAmount: boolean;
	amountEqualTo: boolean;
	amountGreaterThan: boolean;
	amount: string;
	includeParticulars: boolean;
	includeVouchers: boolean;
	chequeNumber: string;
	dateOnCheque: string;
	particulars: any[];
	vouchers: any[];
	inventory: Inventory;
}

export interface Inventory {
	includeInventory: boolean;
	inventories: any[];
	quantity?: any;
	includeQuantity: boolean;
	quantityLessThan: boolean;
	quantityEqualTo: boolean;
	quantityGreaterThan: boolean;
	includeItemValue: boolean;
	itemValue?: any;
	includeItemLessThan: boolean;
	includeItemEqualTo: boolean;
	includeItemGreaterThan: boolean;
}
