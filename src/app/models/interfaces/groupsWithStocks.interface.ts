import { INameUniqueName } from './nameUniqueName.interface';

/*
 * Interface for groups-with-stocks-flatten api response result item
 */
export interface IGroupsWithStocksFlattenItem extends INameUniqueName {
  stocks?: INameUniqueName[];
}

export interface IGroupsWithStocksHierarchyMinItem extends INameUniqueName {
  childStockGroups: IGroupsWithStocksHierarchyMinItem[];
  isActive?: boolean;
  isOpen?: boolean;
  stocks: INameUniqueName[];
}
