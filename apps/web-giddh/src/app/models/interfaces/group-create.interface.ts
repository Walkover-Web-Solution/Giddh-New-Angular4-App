import { IUserInfo } from './user-info.interface';
import { INameUniqueName } from '../api-models/Inventory';
import { IGroup } from './group.interface';

/**
 * ICreateGroup interface definition
 * Defines the structure and contract for ICreateGroup objects
 */
export interface ICreateGroup extends IGroup {
    applicableTaxes: INameUniqueName[];
    fixed: boolean;
    groups: ICreateGroup[];
    hsnNumber?: string;
    role: INameUniqueName;
    ssnNumber?: string;
    createdAt: string;
    createdBy: IUserInfo;
    updatedAt: string;
    updatedBy: IUserInfo;
}
