import { INameUniqueName } from '../api-models/Inventory';
import { IAccountsInfo } from './accountInfo.interface';

export interface IFlattenAccountsResultItem extends IAccountsInfo {
  applicableTaxes: any[];
  isFixed: boolean;
  parentGroups: INameUniqueName[];
}

export interface IFlattenAccountItem extends IFlattenAccountsResultItem {
  stock: any;
}
