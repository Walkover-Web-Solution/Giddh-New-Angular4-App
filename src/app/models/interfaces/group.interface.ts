import { INameUniqueName } from './nameUniqueName.interface';

export interface IGroup extends INameUniqueName {
  synonyms?: string;
  description?: string;
  parentGroupUniqueName?: string;
}
