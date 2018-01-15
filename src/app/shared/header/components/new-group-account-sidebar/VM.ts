import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { INameUniqueName } from '../../../../models/interfaces/nameUniqueName.interface';
export class GroupAccountSidebarVM {
  public columns: ColumnGroupsAccountVM[];
  public parentIndex: number;
  public currentIndex: number;
  public selectedType: string;
  public grpCategory: string;
  public selectedGrp: ColumnGroupsAccountVM;
  public keyWord: string;
  public selectGroup(item: IGroupsWithAccounts, currentIndex: number, isSearching: boolean = false) {
    this.columns.splice(currentIndex + 1, this.columns.length - currentIndex + 1);
    this.columns.push(new ColumnGroupsAccountVM(item));

    if (isSearching) {
      let colLength = this.columns.length;
      this.columns[colLength - 1].IsCreateNewBtnShowable = true;
    }
  }
}

export class ColumnGroupsAccountVM implements IGroupsWithAccounts {
  public synonyms: string;
  public accounts: IAccountsInfo[];
  public name: string;
  public uniqueName: string;
  public category: string;
  public isActive: boolean;
  public isOpen: boolean;
  public isVisible: boolean = true;
  public groups: IGroupsWithAccounts[];
  public hLevel: number;
  public Items: IGroupOrAccount[];
  public SelectedItem: IGroupOrAccount;
  public IsCreateNewBtnShowable: boolean = false;
  // tslint:disable-next-line:no-empty
  constructor(grp: IGroupsWithAccounts) {
    if (grp) {
      this.accounts = grp.accounts;
      this.synonyms = grp.synonyms;
      this.name = grp.name;
      this.uniqueName = grp.uniqueName;
      this.category = grp.category;
      this.isActive = grp.isActive;
      this.isOpen = grp.isOpen;
      this.isVisible = grp.isVisible;
      this.groups = grp.groups;
      let grps = this.groups || [];
      let accs = this.accounts || [];
      let grps2 = grps.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
      let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));

      this.Items = [...grps2, ...accs2] as IGroupOrAccount[];
    }
  }

}

export interface IGroupOrAccount extends INameUniqueName {
  isGroup: boolean;
  // Groups prop
  synonyms?: string;
  accounts?: IAccountsInfo[];
  category?: string;
  groups?: IGroupsWithAccounts[];
  isActive?: boolean;
  isOpen?: boolean;
  isVisible?: boolean;
  // accounts prop
  stocks?: any[];
  mergedAccounts?: string;
}
