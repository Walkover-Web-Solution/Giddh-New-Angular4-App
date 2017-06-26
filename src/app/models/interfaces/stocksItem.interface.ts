import { INameUniqueName } from './nameUniqueName.interface';

export interface IStocksItem extends INameUniqueName {
  mappedPurchaseAccount: INameUniqueName;
  mappedSalesAccount: INameUniqueName;
  stockGroup: INameUniqueName;
}
