import { INameUniqueName } from '../api-models/Inventory';

export interface IUlist extends INameUniqueName {
  additional?: any;
  type?: 'GROUP' | 'MENU' | 'A/C';
  parentGroups?: INameUniqueName[];
}
