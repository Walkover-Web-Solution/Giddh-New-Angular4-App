import { INameUniqueName } from '../api-models/Inventory';

export interface IGroup extends INameUniqueName {
    synonyms?: string;
    description?: string;
    parentGroupUniqueName?: string;
}
