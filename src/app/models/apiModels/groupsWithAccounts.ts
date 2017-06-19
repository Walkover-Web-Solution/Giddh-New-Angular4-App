interface IAccountsInfo {
  uniqueName: string;
  stocks?: any[];
  mergedAccounts: string;
  name: string;
}

export class GroupsWithAccounts {
  public synonyms: string;
  public accounts: IAccountsInfo[];
  public name: string;
  public uniqueName: string;
  public category: string;
  public groups: GroupsWithAccounts[];

  constructor(synonyms: string, accounts: IAccountsInfo[], name: string, uniqueName: string,
              category: string, groups: GroupsWithAccounts[]) {
    this.synonyms = synonyms;
    this.accounts = accounts;
    this.name = name;
    this.uniqueName = uniqueName;
    this.category = category;
    this.groups = groups;
  }
}
