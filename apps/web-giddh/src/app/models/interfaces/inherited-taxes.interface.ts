import { INameUniqueName } from '../api-models/Inventory';

/**
 * IInheritedTaxes interface definition
 * Defines the structure and contract for IInheritedTaxes objects
 */
export interface IInheritedTaxes extends INameUniqueName {
    applicableTaxes: INameUniqueName[];
}
