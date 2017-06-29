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

export interface IUnitRateItem {
  rate: number;
  stockUnitCode: string;
}

export interface IAccountDetails {
  accountUniqueName: string;
  unitRates: IUnitRateItem[];
}

export interface IStockItemDetail {
  stockUniqueName: string;
  quantity: number;
  stockUnitCode: string;
  rate?: number;
  amount?: number;
}

export interface IManufacturingDetails {
  manufacturingQuantity: number;
  manufacturingUnitCode: string;
  linkedStocks: IStockItemDetail[];
  date?: string;
  grandTotal?: string;
  otherExpenses: any[]; // Not sure about this field so keeping it as any for now
  multipleOf: number;
}

export interface IStockUnitItem extends IStockItem {
  hierarchicalQuantity: number;
  quantityPerUnit: number;
}

export interface IStockDetail extends INameUniqueName {
  manufacturingDetails: IManufacturingDetails;
  openingAmount: number;
  openingQuantity: number;
  purchaseAccountDetails?: IAccountDetails;
  salesAccountDetails?: IAccountDetails;
  stockGroup: INameUniqueName;
  stockUnit: IStockUnitItem;
  stockUnitCde?: string;
}
