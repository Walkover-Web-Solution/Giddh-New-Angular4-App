import { Component, OnInit, Input } from '@angular/core';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import * as _ from 'lodash';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'group-account-list',
  templateUrl: './group-accounts-list.component.html'
})
export class GroupAccountsListComponent implements OnInit {
  public accountsList$: Observable<IAccountsInfo[]>;
  public activeGroupName$: Observable<string>;
  public searchLoad$: Observable<boolean>;
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.accountsList$ =  this.store.select(state => {
      let accountsList: IAccountsInfo[] = [];
      if (state.groupwithaccounts.groupswithaccounts) {
        if (state.groupwithaccounts.activeGroupName === null) {
          accountsList = this.genFlatterAccounts(_.cloneDeep(state.groupwithaccounts.groupswithaccounts), []);
        } else {
          accountsList = this.getAccountFromGroup(_.cloneDeep(state.groupwithaccounts.groupswithaccounts), _.cloneDeep(state.groupwithaccounts.activeGroupName), []);
        }
        accountsList = accountsList.filter(acn => {
          return acn.name.toLowerCase().indexOf(state.groupwithaccounts.accountSearchString.toLowerCase()) > -1;
        });
      }
      return accountsList;
    });

    this.activeGroupName$ = this.store.select(state => {
      return state.groupwithaccounts.activeGroupName;
    });
    this.searchLoad$ = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading);
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
//
  }

  public searchAccounts(e: any) {
    if (e.target.value.startsWith(' ')) {
      return;
    }
    this.store.dispatch(this.groupWithAccountsAction.setAccountsSearchString(e.target.value));
  }

  public genFlatterAccounts(groupList: IGroupsWithAccounts[], result: IAccountsInfo[]): IAccountsInfo[] {
    groupList.forEach((el) => {
      if (el.accounts) {
        el.accounts.forEach((e) => {
          result.push(e);
        });
      }
      if (el.groups) {
        this.genFlatterAccounts(el.groups, result);
      }
    });
    return result;
  }

  public getAccountFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: IAccountsInfo[]): IAccountsInfo[] {
    groupList.forEach(el => {
      if (el.accounts) {
        if (el.uniqueName === uniqueName) {
          result.push(...el.accounts);
        }
      }
      if (el.groups) {
        this.getAccountFromGroup(el.groups, uniqueName, result);
      }
    });
    return result;
  }
}
