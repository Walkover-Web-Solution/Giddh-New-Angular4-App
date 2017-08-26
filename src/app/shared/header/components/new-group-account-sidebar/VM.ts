import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
export class GroupAccountSidebarVM {
  public columns: ColumnGroupsAccountVM[];
  public parentIndex: number;
  public currentIndex: number;
  public selectedType: string;
  public grpCategory: string;
  public selectedGrp: ColumnGroupsAccountVM;
  public keyWord: string;
  public selectGroup(item: IGroupsWithAccounts, currentIndex: number) {
    this.columns.splice(currentIndex + 1, this.columns.length - currentIndex + 1);
    this.columns.push(new ColumnGroupsAccountVM(item));
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
    }
  }

}
