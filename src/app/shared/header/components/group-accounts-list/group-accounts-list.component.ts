import { GroupResponse } from './../../../../models/api-models/Group';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  public isRootLevlGroup$: Observable<boolean>;
  public accountsList$: Observable<IAccountsInfo[]>;
  public activeGroup$: Observable<GroupResponse>;
  public searchLoad$: Observable<boolean>;

  public showAddAccountForm$: Observable<boolean>;
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
    this.accountsList$ =  this.store.select(state => {
      let accountsList: IAccountsInfo[] = [];
      if (state.groupwithaccounts.groupswithaccounts) {
        if (state.groupwithaccounts.activeGroup === null) {
          accountsList = this.genFlatterAccounts(_.cloneDeep(state.groupwithaccounts.groupswithaccounts), []);
        } else {
          accountsList = this.getAccountFromGroup(_.cloneDeep(state.groupwithaccounts.groupswithaccounts), _.cloneDeep(state.groupwithaccounts.activeGroup.uniqueName), []);
        }
        accountsList = accountsList.filter(acn => {
          return acn.name.toLowerCase().indexOf(state.groupwithaccounts.accountSearchString.toLowerCase()) > -1;
        });
      }
      return accountsList;
    });

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup);
    this.searchLoad$ = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading);
    this.showAddAccountForm$ = this.store.select(state => state.groupwithaccounts.addAccountOpen);
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.isRootLevlGroup$ = this.store.select(state => {
      if (state.groupwithaccounts.groupswithaccounts && state.groupwithaccounts.activeGroup) {
        let index = _.findIndex(state.groupwithaccounts.groupswithaccounts, (s) => {
          return s.uniqueName === state.groupwithaccounts.activeGroup.uniqueName;
        });
        return index !== -1 ? true : false;
      } else {
        return false;
      }
    });
  }
  public searchAccounts(e: any) {
    if (e.target.value.startsWith(' ')) {
      return;
    }
    this.store.dispatch(this.groupWithAccountsAction.setAccountsSearchString(e.target.value));
  }

  public addNewAccountShow() {
    this.store.dispatch(this.groupWithAccountsAction.showAddAccountForm());
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
