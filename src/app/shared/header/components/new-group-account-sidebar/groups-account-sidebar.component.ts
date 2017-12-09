import { GroupResponse } from '../../../../models/api-models/Group';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChildren, QueryList, AfterViewInit, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ColumnGroupsAccountVM, GroupAccountSidebarVM, IGroupOrAccount } from './VM';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import * as _ from '../../../../lodash-optimized';
import { AccountResponse, AccountResponseV2 } from '../../../../models/api-models/Account';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { VsForDirective } from '../../../../theme/ng2-vs-for/ng2-vs-for';

@Component({
  selector: 'groups-account-sidebar',
  templateUrl: './groups-account-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsAccountSidebarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, AfterViewChecked {
  public ScrollToElement = false;
  public viewPortItems: IGroupOrAccount[];
  public mc: GroupAccountSidebarVM;
  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @Output() public ScrollToRight: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public columnsChanged: EventEmitter<GroupAccountSidebarVM> = new EventEmitter();
  @Input() public groups: GroupsWithAccountsResponse[];
  @Input() public height: number;
  public _groups: GroupsWithAccountsResponse[];
  @Input() public activeGroup: Observable<GroupResponse>;
  public isUpdateGroupSuccess$: Observable<boolean>;
  public isUpdateAccountSuccess$: Observable<boolean>;
  public activeGroupUniqueName: Observable<string>;
  @Input() public padLeft: number = 30;
  @Input() public isSearchingGroups: boolean = false;
  public breadcrumbPath: string[] = [];
  public breadcrumbUniqueNamePath: string[] = [];
  @Output() public breadcrumbPathChanged = new EventEmitter();
  public activeAccount: Observable<AccountResponseV2>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
    private accountsAction: AccountsAction) {
    this.mc = new GroupAccountSidebarVM();
    this.activeGroup = this.store.select(state => state.groupwithaccounts.activeGroup).takeUntil(this.destroyed$);
    this.activeGroupUniqueName = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).takeUntil(this.destroyed$);
    this.activeAccount = this.store.select(state => state.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.isUpdateGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupSuccess).takeUntil(this.destroyed$);
    this.isUpdateAccountSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).takeUntil(this.destroyed$);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['groups']) {
      this.resetData();
    }
  }
  public ngAfterViewInit() {
    //
  }
  public ngAfterViewChecked() {
    if (this.ScrollToElement) {
      this.columnView.forEach((p, index) => {
        if (this.mc.columns[index].SelectedItem) {
          let itemIndex = this.mc.columns[index].Items.findIndex(item => item.uniqueName === this.mc.columns[index].SelectedItem.uniqueName && item.isGroup === this.mc.columns[index].SelectedItem.isGroup);
          p.scrollToElement(itemIndex);
        }
      });
      this.ScrollToElement = false;
    }
  }
  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.resetData();
    this.activeGroup.subscribe(a => this.resetData());
    this.isUpdateGroupSuccess$.subscribe(a => {
      if (a) {
        let activeGroup = null;
        let groups = null;
        this.activeGroup.take(1).subscribe(ac => activeGroup = ac);
        this.store.select(p => p.groupwithaccounts.groupswithaccounts).take(1).subscribe(grp => groups = grp);
        if (activeGroup && groups) {
          this.breadcrumbPath = [];
          this.breadcrumbUniqueNamePath = [];
          this.getBreadCrumbPathFromGroup(groups, activeGroup.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
          this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        }
        setTimeout(() => {
          this.ScrollToElement = true;
        }, 0);
      }
    });
    this.isUpdateAccountSuccess$.subscribe(a => {
      if (a) {
        if (this.isSearchingGroups) {
          this.breadcrumbPath = [];
          this.breadcrumbPathChanged.emit(this.breadcrumbPath);
        } else {
          let activeAccount = null;
          let groups = null;
          this.activeAccount.take(1).subscribe(ac => activeAccount = ac);
          this.store.select(p => p.groupwithaccounts.groupswithaccounts).take(1).subscribe(grp => groups = grp);
          if (activeAccount && groups) {
            this.breadcrumbPath = [];
            this.breadcrumbUniqueNamePath = [];
            this.getBreadCrumbPathFromGroup(groups, activeAccount.uniqueName, null, this.breadcrumbPath, false, this.breadcrumbUniqueNamePath);
            this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
          }
          setTimeout(() => {
            this.ScrollToElement = true;
          }, 0);
        }
      }
    });
  }

  public resetData() {
    this._groups = this.orderByCategory(_.cloneDeep(this.groups));
    this.mc.columns = [];
    this.mc.columns.push(new ColumnGroupsAccountVM(new GroupsWithAccountsResponse()));
    this.mc.columns[0].groups = [];
    if (this._groups) {
      for (let key of this._groups) {
        key.isOpen = false;
        this.mc.columns[0].groups.push(key);
      }
      let grps = this.mc.columns[0].groups || [];
      let accs = this.mc.columns[0].accounts || [];
      let grps2 = grps.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
      let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
      this.mc.columns[0].Items = [...grps2, ...accs2] as IGroupOrAccount[];
      this.mc.columns[0].SelectedItem = this.mc.columns[0].Items.find(p => p.isActive) || this.mc.columns[0].Items.find(p => p.isOpen);
      let col = this.polulateColms(this.mc.columns[0].groups);
      if (col) {
        for (let key of this.mc.columns[0].groups) {
          if (key.uniqueName === col.uniqueName) {
            key.isOpen = true;
          }
        }
      }
    }
    this.columnsChanged.emit(this.mc);
  }

  public polulateColms(grps: IGroupsWithAccounts[]): ColumnGroupsAccountVM {
    let activeGroup = null;
    this.store.select(state => state.groupwithaccounts.activeGroup).take(1).subscribe(a => activeGroup = a);

    if (this.isSearchingGroups) {
      if (grps.length > 0) {
        let allGrps = [];
        let allAccount = [];
        for (let grp of grps) {
          if (activeGroup && grp.uniqueName === activeGroup.uniqueName) {
            grp.isOpen = true;
            grp.isActive = true;
          }
          if (grp.groups && grp.groups.length > 0) { allGrps.push(...grp.groups); }
        }
        for (let grp of grps) {
          if (grp.accounts && grp.accounts.length > 0) { allAccount.push(...grp.accounts); }
        }
        let newCOL = new ColumnGroupsAccountVM(null);
        newCOL.groups = [];
        newCOL.accounts = [];
        for (let key of allGrps) {
          newCOL.groups.push(key);
        }
        for (let key of allAccount) {
          newCOL.accounts.push(key);
        }
        let grps1 = newCOL.groups || [];
        let accs = newCOL.accounts || [];
        let grps2 = grps1.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
        let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
        newCOL.Items = [...grps2, ...accs2] as IGroupOrAccount[];
        newCOL.SelectedItem = newCOL.Items.find(p => p.isActive) || newCOL.Items.find(p => p.isOpen);

        let col = this.polulateColms(allGrps);
        this.mc.columns.splice(1, 0, newCOL);
        if (col) {
          return newCOL;
        }
      }
    } else {
      for (let grp of grps) {
        // if(activeGroup){
        if (activeGroup && grp.uniqueName === activeGroup.uniqueName) {
          let newCOL = new ColumnGroupsAccountVM(grp);
          newCOL.groups = [];
          if (grp.groups) {
            for (let key of grp.groups) {
              // key.isOpen = true;
              newCOL.groups.push(key);
            }
            let grps1 = newCOL.groups || [];
            let accs = newCOL.accounts || [];
            let grps2 = grps1.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
            let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
            newCOL.Items = [...grps2, ...accs2] as IGroupOrAccount[];
            newCOL.SelectedItem = newCOL.Items.find(p => p.isActive) || newCOL.Items.find(p => p.isOpen);
          }
          this.mc.columns.splice(1, 0, newCOL);
          return newCOL;
        } else {
          if (grp.groups) {
            let col = this.polulateColms(grp.groups);
            if (col) {
              let newCOL = new ColumnGroupsAccountVM(grp);
              newCOL.groups = [];
              newCOL.isOpen = false;
              for (let key of grp.groups) {
                if (key.uniqueName === col.uniqueName) {
                  key.isOpen = true;
                } else {
                  key.isOpen = false;
                }
                newCOL.groups.push(key);
              }
              let grps1 = newCOL.groups || [];
              let accs = newCOL.accounts || [];
              let grps2 = grps1.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
              let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
              newCOL.Items = [...grps2, ...accs2] as IGroupOrAccount[];
              newCOL.SelectedItem = newCOL.Items.find(p => p.isActive) || newCOL.Items.find(p => p.isOpen);
              this.mc.columns.splice(1, 0, newCOL);
              return newCOL;
            }
          }
        }
      }
    }

  }

  public onGroupClick(item: IGroupsWithAccounts, currentIndex: number) {
    this.breadcrumbPath = [];
    this.breadcrumbUniqueNamePath = [];
    let parentGrp = this.getBreadCrumbPathFromGroup(this._groups, item.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
    this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
    this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
    this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
    this.store.dispatch(this.accountsAction.resetActiveAccount());
    this.mc.selectedType = 'grp';
    this.mc.selectGroup(item, currentIndex);
    this.ScrollToRight.emit(true);
    this.ScrollToElement = true;
  }

  public onAccountClick(item: any, currentIndex: number) {
    this.breadcrumbPath = [];
    this.breadcrumbUniqueNamePath = [];
    let parentGrp = this.getBreadCrumbPathFromGroup(this._groups, item.uniqueName, null, this.breadcrumbPath, false, this.breadcrumbUniqueNamePath);
    this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
    if (parentGrp) {
      if (this.mc.columns[currentIndex - 1] && this.mc.columns[currentIndex - 1].uniqueName !== parentGrp.uniqueName) {
        this.mc.columns.splice(currentIndex + 1, 1);
      }
    }
    this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
    this.mc.selectedType = 'acc';
    this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
    this.store.dispatch(this.accountsAction.getAccountDetails(item.uniqueName));
    this.ScrollToElement = true;
  }

  public ShowAddNewForm(col: ColumnGroupsAccountVM) {
    this.breadcrumbPath = [];
    this.breadcrumbUniqueNamePath = [];
    this.getBreadCrumbPathFromGroup(this._groups, col.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
    this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
    if (col.uniqueName) {
      this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(col.uniqueName));
    }
    this.store.dispatch(this.groupWithAccountsAction.showAddNewForm());
    this.store.dispatch(this.accountsAction.resetActiveAccount());
  }

  // order group by category
  public orderByCategory(groups: GroupsWithAccountsResponse[]): GroupsWithAccountsResponse[] {
    const orderedGroups: GroupsWithAccountsResponse[] = [];
    const assets = [];
    const liabilities = [];
    const income = [];
    const expenses = [];
    _.each(groups, (grp) => {
      switch (grp.category) {
        case 'assets':
          return assets.push(grp);
        case 'liabilities':
          return liabilities.push(grp);
        case 'income':
          return income.push(grp);
        case 'expenses':
          return expenses.push(grp);
        default:
          return assets.push(grp);
      }
    });
    _.each(liabilities, liability => orderedGroups.push(liability));
    _.each(assets, asset => orderedGroups.push(asset));
    _.each(income, inc => orderedGroups.push(inc));
    _.each(expenses, exp => orderedGroups.push(exp));
    return orderedGroups;
  }

  public getBreadCrumbPathFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: IGroupsWithAccounts, parentPath: string[], isGroup: boolean, parentUniquenamePath: string[]) {
    if (result !== null) {
      return result;
    }
    for (let el of groupList) {
      parentUniquenamePath.push(el.uniqueName);
      parentPath.push(el.name);
      if (!isGroup) {
        if (el.accounts) {
          for (let key of el.accounts) {
            if (key.uniqueName === uniqueName) {
              parentPath.push(key.name);
              parentUniquenamePath.push(key.uniqueName);
              result = el;
              return result;
            }
          }
        }
      } else {
        if (el.uniqueName === uniqueName) {
          result = el;
          return result;
        }
      }
      if (el.groups) {
        result = this.getBreadCrumbPathFromGroup(el.groups, uniqueName, result, parentPath, isGroup, parentUniquenamePath);
        if (result !== null) {
          return result;
        }
      }
      parentUniquenamePath.pop();
      parentPath.pop();
    }
    return result;
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
