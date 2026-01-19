import { INameUniqueName } from '../api-models/Inventory';
import { IAccountsInfo } from './account-info.interface';

/**
 * IGroupsWithAccounts interface definition
 * Defines the structure and contract for IGroupsWithAccounts objects
 */
export interface IGroupsWithAccounts extends INameUniqueName {
    synonyms: string;
    accounts: IAccountsInfo[];
    category: string;
    groups: IGroupsWithAccounts[];
    isActive: boolean;
    isOpen: boolean;
    isVisible: boolean;
}
