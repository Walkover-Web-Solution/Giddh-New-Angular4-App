import { INameUniqueName } from './nameUniqueName.interface';
import { IPagination } from './paginatedResponse.interface';

export interface IStocksItem extends INameUniqueName {
  mappedPurchaseAccount: INameUniqueName;
  mappedSalesAccount: INameUniqueName;
  stockGroup: INameUniqueName;
}

/**
 * interface for stocks-unit
 * Used in unitytypes api call also in stocks-unit api call
 */
export interface IStockItem {
  name: string;
  code: string;
}

export interface IStockReportItem {
  amount: number;
  quantity: number;
  stockUnit: string;
}

export interface IStockTransaction extends IStockReportItem {
  account: INameUniqueName;
  closingQuantity: number;
  entryDate: string;
  isManufacturingTransaction: boolean;
  rate: number;
  type: string;
  voucherNo: number;
  voucherType: string;
}

export interface IStockReport extends IPagination {
  closingBalance: IStockReportItem;
  openingBalance: IStockReportItem;
  stockUnit: string;
  stockUnitQtyMap: any;
  transactions: IStockTransaction[];
}
