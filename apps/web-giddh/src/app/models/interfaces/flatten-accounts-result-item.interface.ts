import { INameUniqueName } from '../api-models/Inventory';
import { IAccountsInfo } from './account-info.interface';
import { IHelpersForSearch } from './ulist.interface';

export interface IFlattenAccountsResultItem extends IAccountsInfo, IHelpersForSearch {
    applicableTaxes?: any[];
    isFixed?: boolean;
    parentGroups?: INameUniqueName[] | Array<any>;
    currency?: string;
    currencySymbol?: string;
    isDummy?: boolean; // added for when we need to add dummy account and want to identify that this is dummy account
}