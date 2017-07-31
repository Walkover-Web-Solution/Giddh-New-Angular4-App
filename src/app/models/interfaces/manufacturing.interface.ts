import { INameUniqueName } from './nameUniqueName.interface';

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
  quantity: string;
}

export interface Transaction extends IOnlyAmount {
  account: IOnlyUniqueName;
}

export interface IOtherExpensesForCreate {
  baseAccount: IOnlyUniqueName;
  transactions: Transaction[];
}
