import { INameUniqueName } from './nameUniqueName.interface';

export interface IAccountsInfo extends INameUniqueName {
  stocks?: any[];
  mergedAccounts: string;
}
