import { INameUniqueName } from './nameUniqueName.interface';

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