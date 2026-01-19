import { INameUniqueName } from '../api-models/Inventory';

/**
 * IAccountsInfo interface definition
 * Defines the structure and contract for IAccountsInfo objects
 */
export interface IAccountsInfo extends INameUniqueName {
    stocks?: any[];
    mergedAccounts?: string;
}
