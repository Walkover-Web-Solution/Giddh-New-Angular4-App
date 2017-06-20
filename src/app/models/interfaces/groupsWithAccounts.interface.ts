import { INameUniqueName } from './nameUniqueName.interface';
import { IAccountsInfo } from './accountInfo.interface';

export interface IGroupsWithAccounts extends INameUniqueName {
  synonyms: string;
  accounts: IAccountsInfo[];
  category: string;
  groups: IGroupsWithAccounts[];
}
