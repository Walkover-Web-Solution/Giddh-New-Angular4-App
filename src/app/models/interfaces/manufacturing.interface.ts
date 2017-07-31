import { INameUniqueName } from './nameUniqueName.interface';
/*
 * Model for get manufacting item details
 * GET call
 * API:: (taxes) company/:companyUniqueName/stock/:stockUniqueName/manufacture/:manufacturingUniqueName
 * response will be object of CommonResponseOfManufactureItem
 */

export interface ICommonResponseOfManufactureItem {
  consumptionCost: number;
  costPerProduct: number;
  date: string;
  grandTotal: number;
  linkedStocks: ILinkedStock[];
  manufacturingQuantity: number;
  manufacturingUnit: string;
  otherExpenses: OtherExpenses[];
  stockName: string;
  stockUniqueName: string;
  uniqueName: string;
  voucher: string;
  voucherNumber: number;
}

export interface ILinkedStock {
    amount: number;
    manufacturingQuantity: number;
    manufacturingUnit: string;
    rate: number;
    stockName: string;
    stockUniqueName: string;
}

export interface ITransaction {
    account: INameUniqueName;
    amount: number;
    type: string;
}

export interface OtherExpenses {
    baseAccount: INameUniqueName;
    transactions: ITransaction[];
    uniqueName: string;
}

export interface IGetManufacturingItemDetailsObj {
    stockUniqueName: string;
    manufacturingUniqueName: string;
}
