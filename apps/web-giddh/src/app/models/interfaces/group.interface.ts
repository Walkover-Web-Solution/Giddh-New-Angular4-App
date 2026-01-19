import { INameUniqueName } from '../api-models/Inventory';

/**
 * IGroup interface definition
 * Defines the structure and contract for IGroup objects
 */
export interface IGroup extends INameUniqueName {
    synonyms?: string;
    description?: string;
    parentGroupUniqueName?: string;
}
