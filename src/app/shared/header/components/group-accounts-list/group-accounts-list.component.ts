import { Component, OnInit } from '@angular/core';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Observable';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import * as _ from 'lodash';
import { GroupWithAccountsAction } from '../../../../services/actions/groupwithaccounts.actions';
import { AccountsAction } from '../../../../services/actions/accounts.actions';
import { AccountResponse } from '../../../../models/api-models/Account';
import { GroupResponse } from '../../../../models/api-models/Group';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'group-account-list',
  templateUrl: './group-accounts-list.component.html'
})
export class GroupAccountsListComponent implements OnInit {
  public isRootLevlGroup$: Observable<boolean>;
  public accountsList$: Observable<IAccountsInfo[]>;
  public activeGroup$: Observable<GroupResponse>;
  public searchLoad$: Observable<boolean>;
  public searchAcc: string;
  public activeAccount$: Observable<AccountResponse>;

  public showAddAccountForm$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private accountsAcction: AccountsAction, private accountsAction: AccountsAction) {
    this.accountsList$ = this.store.select(state => {
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
    }).takeUntil(this.destroyed$);

    this.store.select(s => s.groupwithaccounts.accountSearchString).takeUntil(this.destroyed$).subscribe((s) => {
      if (!s) {
        this.searchAcc = '';
      }
    });

    this.activeGroup$ = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.searchLoad$ = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading).takeUntil(this.destroyed$);
    this.showAddAccountForm$ = this.store.select(state => state.groupwithaccounts.addAccountOpen).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
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
    }).takeUntil(this.destroyed$);
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

  public getAccountDetails(accountUniqueName: string) {
    this.store.dispatch(this.accountsAcction.getAccountDetails(accountUniqueName));
    let activeGroup: GroupResponse = null;
    this.activeGroup$.first().subscribe(ac => activeGroup = ac);
    if (!activeGroup) {
      this.activeGroupFromAccount(accountUniqueName);
    }
  }

  public activeGroupFromAccount(accountUniqueName: string) {
    this.activeAccount$.subscribe(ac => {
      if (ac) {
        let grp = ac.parentGroups[ac.parentGroups.length - 1];
        this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(grp.uniqueName));
      }
    });
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
