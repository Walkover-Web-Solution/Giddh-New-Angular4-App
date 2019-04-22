import { INameUniqueName } from '../api-models/Inventory';

export interface IHelpersForSearch {
  nameStr?: string;
  uNameStr?: string;
}

export interface IUlist extends INameUniqueName, IHelpersForSearch {
  additional?: any;
  type?: 'GROUP' | 'MENU' | 'ACCOUNT';
  time?: number;
  parentGroups?: INameUniqueName[];
  pIndex?: number;
  isRemoved?: boolean;
  isInvalidState?: boolean;
}

export interface ICompAidata extends INameUniqueName {
  aidata: Igtbl;
}

export interface Igtbl {
  menus: IUlist[];
  groups: IUlist[];
  accounts: IUlist[];
}
