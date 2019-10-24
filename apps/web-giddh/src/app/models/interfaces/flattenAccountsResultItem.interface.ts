import { INameUniqueName } from '../api-models/Inventory';
import { IAccountsInfo } from './accountInfo.interface';
import { IHelpersForSearch } from './ulist.interface';

export interface IFlattenAccountsResultItem extends IAccountsInfo, IHelpersForSearch {
  applicableTaxes: any[];
  isFixed: boolean;
  parentGroups: INameUniqueName[];
  currency?: string;
  currencySymbol?: string;
}

export interface IFlattenAccountItem extends IFlattenAccountsResultItem {
  stock: any;
}
