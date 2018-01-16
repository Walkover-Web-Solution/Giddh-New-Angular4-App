import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { INameUniqueName } from '../../../../models/interfaces/nameUniqueName.interface';
import { eventsConst } from 'app/shared/header/components/eventsConst';
import { GroupCreateRequest, GroupResponse, GroupUpateRequest } from 'app/models/api-models/Group';
import { BaseResponse } from 'app/models/api-models/BaseResponse';
import { ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { GroupsWithAccountsResponse } from 'app/models/api-models/GroupsWithAccounts';
export class GroupAccountSidebarVM {
  public columns: ColumnGroupsAccountVM[];
  public parentIndex: number;
  public currentIndex: number;
  public selectedType: string;
  public grpCategory: string;
  public selectedGrp: ColumnGroupsAccountVM;
  public keyWord: string;

  constructor(private _cdRef: ChangeDetectorRef) {

  }
  public selectGroup(item: IGroupsWithAccounts, currentIndex: number, isSearching: boolean = false) {
    this.columns.splice(currentIndex + 1, this.columns.length - currentIndex + 1);
    this.columns.push(new ColumnGroupsAccountVM(item));

    if (isSearching) {
      let colLength = this.columns.length;
      this.columns[colLength - 1].IsCreateNewBtnShowable = true;
    }
  }

  public handleEvents(eventType: eventsConst, payload: any) {
    let columnLength = this.columns.length;
    switch (eventType) {
      case eventsConst.groupAdded: {
        let resp: BaseResponse<GroupResponse, GroupCreateRequest> = payload;
        let grp: IGroupOrAccount = {
          accounts: [],
          groups: [],
          isGroup: true,
          name: resp.body.name,
          uniqueName: resp.body.uniqueName,
          isVisible: true
        };
        let Items = _.cloneDeep(this.columns[columnLength - 1].Items);
        Items.push(grp);
        this.columns[columnLength - 1].Items = Items;
        break;
      }

      case eventsConst.groupUpdated: {
        let resp: BaseResponse<GroupResponse, GroupUpateRequest> = payload;
        let Items = _.cloneDeep(this.columns[columnLength - 2].Items);
        this.columns[columnLength - 2].Items = Items.map(p => {
          if (p.uniqueName === resp.queryString.groupUniqueName) {
            p = {
              ...p,
              name: resp.body.name,
              uniqueName: resp.body.uniqueName
            };
          }
          return p;
        });
        break;
      }

      case eventsConst.groupDeleted: {
        let resp: BaseResponse<string, string> = payload;
        let cols = _.cloneDeep(this.columns);
        this.columns = cols.map(col => {
          let findItemIndex = col.Items.findIndex(f => f.uniqueName === resp.queryString.parentUniqueName);

          if (findItemIndex > -1) {
            col.Items[findItemIndex].groups = col.Items[findItemIndex].groups.filter(p => p.uniqueName !== resp.request);
          }

          if (col.uniqueName === resp.queryString.parentUniqueName) {
            col.Items = col.Items.filter(p => p.uniqueName !== resp.request);
            col.groups = col.groups.filter(p => p.uniqueName !== resp.request);
          }
          return col;
        });
        this.columns.pop();
        break;
      }

      default:
        break;
    }
  }

  public activeGroupFromGroupListBackup(groups: GroupsWithAccountsResponse[], uniqueName: string, result: GroupsWithAccountsResponse) {
    for (let grp of groups) {
      if (grp.uniqueName === uniqueName) {
        result = grp;
        return result;
      }

      if (grp.groups) {
        result = this.activeGroupFromGroupListBackup(grp.groups, uniqueName, result);
        if (result) {
          return result;
        }
      }
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
