import { INameUniqueName } from '../api-models/Inventory';

/**
 * IUserInfo interface definition
 * Defines the structure and contract for IUserInfo objects
 */
export interface IUserInfo extends INameUniqueName {
    email: string;
    mobileNo: string;
}