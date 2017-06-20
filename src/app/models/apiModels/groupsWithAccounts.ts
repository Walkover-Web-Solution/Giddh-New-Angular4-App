import { IAccountsInfo } from '../../interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../../interfaces/groupsWithAccounts.interface';

export class GroupsWithAccounts implements IGroupsWithAccounts {
  public synonyms: string;
  public accounts: IAccountsInfo[];
  public name: string;
  public uniqueName: string;
  public category: string;
  public groups: IGroupsWithAccounts[];

  constructor(synonyms: string, accounts: IAccountsInfo[], name: string, uniqueName: string,
              category: string, groups: IGroupsWithAccounts[]) {
    this.synonyms = synonyms;
    this.accounts = accounts;
    this.name = name;
    this.uniqueName = uniqueName;
    this.category = category;
    this.groups = groups;
  }
}
