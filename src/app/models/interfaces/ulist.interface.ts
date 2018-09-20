import { INameUniqueName } from '../api-models/Inventory';

export interface IHelpersForSearch {
  nameStr?: string;
  uNameStr?: string;
}

export interface IUlist extends INameUniqueName, IHelpersForSearch {
  additional?: any;
  type?: 'GROUP' | 'MENU' | 'A/C';
  time?: number;
  parentGroups?: INameUniqueName[];
}
