import { INameUniqueName } from '../api-models/Inventory';

// some common interface used in module everywhere
export interface IOnlyUniqueName {
	uniqueName: string;
}

export interface IOnlyAmount {
	amount: number;
}

export interface IStockItem {
	stockName: string;
	stockUniqueName: string;
}

export interface IMfItem {
	manufacturingQuantity: number;
	manufacturingUnit: string;
}

/*
 * Model for get manufacturing item details
 */

export interface ICommonResponseOfManufactureItem extends IStockItem, IMfItem, IOnlyUniqueName {
	consumptionCost: number;
	costPerProduct: number;
	date: string;
	grandTotal: number;
	linkedStocks: ILinkedStock[];
	otherExpenses: OtherExpenses[];
	voucher: string;
	voucherNumber: number;
}

export interface ILinkedStock extends IOnlyAmount, IStockItem, IMfItem {
	rate: number;
}

export interface ITransaction extends IOnlyAmount {
	account: INameUniqueName;
	type: string;
}

export interface OtherExpenses extends IOnlyUniqueName {
	baseAccount: INameUniqueName;
	transactions: ITransaction[];
}

export class COtherExpenses implements IOnlyUniqueName {
	public baseAccount: INameUniqueName;
	public transactions: ITransaction[];
	public uniqueName: string;
}

export interface IManufacturingUnqItemObj {
	stockUniqueName: string;
	manufacturingUniqueName: string;
}

/*
 * Model for create manufacturing item request
 */

export interface IManufacturingItemRequest {
	date: string;
	linkedStocks: ILinkedStockForCreate[];
	multipleOf?: number;
	manufacturingMultipleOf?: number;
	otherExpenses: IOtherExpensesForCreate[];
}

export interface ILinkedStockForCreate extends IStockItem {
	quantity: number;
	rate?: number;
	amount?: number;
	stockUnitCode?: string;
	manufacturingUnit?: string;
	manufacturingQuantity: number;
}

export interface Transaction extends IOnlyAmount {
	account: IOnlyUniqueName;
}

export interface IOtherExpensesForCreate {
	baseAccount: IOnlyUniqueName;
	transactions: Transaction[];
}

export class ManufacturingItemRequest {
	public uniqueName?: string;
	public date: string;
	public stockUniqueName?: string;
	public quantity?: number;
	public multipleOf?: number;
	public linkedStocks: ILinkedStockForCreate[];
	public otherExpenses: IOtherExpensesForCreate[];
	public voucherNumber?: string;
	public manufacturingMultipleOf?: number;
}

/*
 * Model for get stocks with rates and response of request
*/

// StocksResponse
// this.store.dispatch(this.inventoryAction.GetStock());

export interface IMfStockSearchRequest {
	product?: string;
	searchOperation?: string;
	searchBy?: string;
	searchValue?: string;
	from?: string;
	to?: string;
	count?: number;
	page?: number;
	dateRange?: Date[];
}

/*
product( string: uniquename stock ) ,
searchOperation(greaterThan , lessThan, greaterThanOrEquals, lessThanOrEquals, equals),
searchBy (quantityInward , quantityOutward, voucherNumber),
searchValue( any integer number),
from (date string),
to(date string)
*/
