import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { Component, OnInit, Input } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { GroupAccountSidebarVM, ColumnGroupsAccountVM } from './VM';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';

@Component({
  selector: 'groups-account-sidebar',
  templateUrl: './groups-account-sidebar.component.html',
})
export class GroupsAccountSidebarComponent implements OnInit {
  public mc: GroupAccountSidebarVM;

  @Input() public groups: GroupsWithAccountsResponse[];
  @Input() public padLeft: number = 30;

  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private accountsAcction: AccountsAction) {
    this.mc = new GroupAccountSidebarVM();
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.mc.columns = [];
    this.mc.columns.push(new ColumnGroupsAccountVM(new GroupsWithAccountsResponse()));
    this.mc.columns[0].groups = [];
    if (this.groups) {
      for (let key of this.groups) {
        this.mc.columns[0].groups.push(key);
      }
    }
  }

  public onGroupClick(item: IGroupsWithAccounts, currentIndex: number) {
    this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
    this.store.dispatch(this.accountsAcction.resetActiveAccount());
    this.mc.selectedType = 'grp';
    this.mc.selectGroup(item, currentIndex);
  }
  public onAccountClick(item: IAccountsInfo, currentIndex: number) {
    this.store.dispatch(this.accountsAcction.getAccountDetails(item.uniqueName));
    this.mc.selectedType = 'acc';

  }

}
