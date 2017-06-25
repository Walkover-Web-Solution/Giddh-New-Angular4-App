import { INameUniqueName } from './nameUniqueName.interface';

export interface IInheritedTaxes extends INameUniqueName {
  applicableTaxes: INameUniqueName[];
}
