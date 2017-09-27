import { INameUniqueName } from './nameUniqueName.interface';
import { IAccountsInfo } from './accountInfo.interface';

export interface IFlattenAccountsResultItem extends IAccountsInfo {
  applicableTaxes: any[];
  isFixed: boolean;
  parentGroups: INameUniqueName[];
}

export interface IFlattenAccountItem extends IFlattenAccountsResultItem {
  stock: any;
}
