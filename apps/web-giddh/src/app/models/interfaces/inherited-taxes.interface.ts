import { INameUniqueName } from '../api-models/Inventory';

export interface IInheritedTaxes extends INameUniqueName {
    applicableTaxes: INameUniqueName[];
}
