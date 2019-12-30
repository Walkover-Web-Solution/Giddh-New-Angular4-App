import { INameUniqueName } from '../api-models/Inventory';

export interface IAccountsInfo extends INameUniqueName {
    stocks?: any[];
    mergedAccounts?: string;
}
