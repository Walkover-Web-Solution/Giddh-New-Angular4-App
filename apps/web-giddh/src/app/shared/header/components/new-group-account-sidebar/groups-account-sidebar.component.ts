import { take, takeUntil } from 'rxjs/operators';
import { GroupResponse } from '../../../../models/api-models/Group';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ColumnGroupsAccountVM, GroupAccountSidebarVM, IGroupOrAccount } from './VM';
import * as _ from '../../../../lodash-optimized';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { VsForDirective } from '../../../../theme/ng2-vs-for/ng2-vs-for';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';

@Component({
    selector: 'groups-account-sidebar',
    templateUrl: './groups-account-sidebar.component.html',
    styles: [`
    .list-item:focus , .list-item:focus .list-item  {
      color: #fff !important;
      background: #2D9EE0;
    }

  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsAccountSidebarComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, AfterViewChecked {
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    public ScrollToElement = false;
    public viewPortItems: IGroupOrAccount[];
    public mc: GroupAccountSidebarVM;
    @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
    @Output() public ScrollToRight: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public columnsChanged: EventEmitter<GroupAccountSidebarVM> = new EventEmitter();
    @Input() public groups: GroupsWithAccountsResponse[];
    @Input() public height: number;
    public _groups: GroupsWithAccountsResponse[];
    public groupsListBackupStream$: Observable<GroupsWithAccountsResponse[]>;
    @Input() public activeGroup: Observable<GroupResponse>;
    public isUpdateGroupSuccess$: Observable<boolean>;
    public isUpdateAccountSuccess$: Observable<boolean>;

    public isDeleteGroupSuccess$: Observable<boolean>;
    public activeGroupUniqueName: Observable<string>;
    @Input() public padLeft: number = 30;
    @Input() public isSearchingGroups: boolean = false;
    public breadcrumbPath: string[] = [];
    public breadcrumbUniqueNamePath: string[] = [];
    @Output() public breadcrumbPathChanged = new EventEmitter();
    public activeAccount: Observable<AccountResponseV2>;

    @Output() public resetSearchString: EventEmitter<boolean> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private navigateStack: any[] = [];
    public currentGroup: any;
    public currentGroupIndex: number = 0;

    // tslint:disable-next-line:no-empty
    constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction, private _generalServices: GeneralService, private _cdRef: ChangeDetectorRef) {
        this.mc = new GroupAccountSidebarVM(this._cdRef, this.store);
        this.activeGroup = this.store.select(state => state.groupwithaccounts.activeGroup).pipe(takeUntil(this.destroyed$));
        this.activeGroupUniqueName = this.store.select(state => state.groupwithaccounts.activeGroupUniqueName).pipe(takeUntil(this.destroyed$));
        this.activeAccount = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));
        this.isUpdateGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isUpdateGroupSuccess).pipe(takeUntil(this.destroyed$));
        this.isUpdateAccountSuccess$ = this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess).pipe(takeUntil(this.destroyed$));
        this.isDeleteGroupSuccess$ = this.store.select(state => state.groupwithaccounts.isDeleteGroupSuccess).pipe(takeUntil(this.destroyed$));
        this.groupsListBackupStream$ = this.store.select(state => state.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['groups']) {
            this.resetData();

            if (this.currentGroup !== undefined) {
                this.onGroupClick(this.currentGroup, this.currentGroupIndex);
            }
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
        this._generalServices.eventHandler.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.mc.handleEvents(s.name, s.payload);

            let groups: IGroupsWithAccounts[];
            this.store.select(state => state.general.groupswithaccounts).pipe(take(1)).subscribe(grp => groups = grp);

            let activeGroup: GroupResponse;
            this.store.select(state => state.groupwithaccounts.activeGroup).pipe(take(1)).subscribe(grp => activeGroup = grp);

            let activeAccount;
            this.store.select(state => state.groupwithaccounts.activeAccount).pipe(take(1)).subscribe(acc => activeAccount = acc);

            // reset search string when you're in search case for move group || move account || merge account
            if (s.name === eventsConst.groupMoved || s.name === eventsConst.accountMoved || s.name === eventsConst.accountMerged) {
                this.resetSearchString.emit(true);
                this.groups = groups;
                this.isSearchingGroups = false;
                this.resetData();
            }

            this.breadcrumbPath = [];
            this.breadcrumbUniqueNamePath = [];

            if (!activeAccount) {
                this.getBreadCrumbPathFromGroup(groups, activeGroup.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
            } else {
                this.getBreadCrumbPathFromGroup(groups, activeAccount.uniqueName, null, this.breadcrumbPath, false, this.breadcrumbUniqueNamePath);
            }

            this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
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
            // check if searching in groups and have active group
            if (this.isSearchingGroups) {
                let activeGroup = null;
                this.store.select(state => state.groupwithaccounts.activeGroup).pipe(take(1)).subscribe(a => activeGroup = a);

                // if (activeGroup) {
                //   for (let m = 0; m < this.mc.columns.length; m++) {
                //     let findedCol = this.mc.columns[m].groups.find(fg => fg.uniqueName === activeGroup.uniqueName);
                //     if (findedCol) {
                //       let fGrps = findedCol.groups.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
                //       let fAccs = findedCol.accounts.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
                //       this.mc.columns[m + 1].Items = [...fGrps, ...fAccs] as IGroupOrAccount[];
                //       return;
                //     }
                //   }
                // }
            }
        }
        this.columnsChanged.emit(this.mc);
    }

    public polulateColms(grps: IGroupsWithAccounts[]): ColumnGroupsAccountVM {
        let activeGroup = null;
        this.store.select(state => state.groupwithaccounts.activeGroup).pipe(take(1)).subscribe(a => activeGroup = a);

        if (this.isSearchingGroups) {
            if (grps.length > 0) {
                let newCOL = new ColumnGroupsAccountVM(null);
                let allGrps = [];
                let allAccount = [];
                for (let grp of grps) {
                    if (activeGroup && grp.uniqueName === activeGroup.uniqueName) {
                        grp.isOpen = true;
                        grp.isActive = true;
                        newCOL.IsCreateNewBtnShowable = true;
                    }
                    if (grp.groups && grp.groups.length > 0) {
                        allGrps.push(...grp.groups);
                    }
                }
                if (!activeGroup) {
                    for (let grp of grps) {
                        if (grp.accounts && grp.accounts.length > 0) {
                            allAccount.push(...grp.accounts);
                        }
                    }
                } else {
                    for (let grp of grps) {
                        if (grp.uniqueName === activeGroup.uniqueName) {
                            if (grp.accounts && grp.accounts.length > 0) {
                                allAccount.push(...grp.accounts);
                            }
                        }
                    }
                }
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
        this.currentGroup = item;
        this.currentGroupIndex = currentIndex;

        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];

        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
        this.store.dispatch(this.accountsAction.resetActiveAccount());
        this.mc.selectedType = 'grp';

        // if (!this.isSearchingGroups) {
        //   this.getBreadCrumbPathFromGroup(this._groups, item.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
        //   this.mc.selectGroup(item, currentIndex);
        // } else {
        if (currentIndex === 0) {
            this.resetData();
            this.getBreadCrumbPathFromGroup(this._groups, item.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
            this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
            this.mc.selectGroup(item, currentIndex, true);
            return;
        }

        let grpsBck: GroupsWithAccountsResponse[];
        this.groupsListBackupStream$.pipe(take(1)).subscribe(s => grpsBck = s);

        this.getBreadCrumbPathFromGroup(grpsBck, item.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);

        let listBckup = this.mc.activeGroupFromGroupListBackup(grpsBck, item.uniqueName, null);

        // listBckup.groups=_.sortBy(item.groups,['uniqueName', 'name']);
        // listBckup.accounts=_.sortBy(item.accounts,['uniqueName', 'name']);
        if (listBckup) {
            item.groups = listBckup.groups;
            item.accounts = listBckup.accounts;
        }
        this.mc.selectGroup(item, currentIndex, true);
        // }

        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        this.ScrollToRight.emit(true);
        this.ScrollToElement = true;
    }

    public onAccountClick(item: any, currentIndex: number) {
        let grpsBck: GroupsWithAccountsResponse[];
        this.groupsListBackupStream$.pipe(take(1)).subscribe(s => grpsBck = s);

        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];
        let parentGrp = this.getBreadCrumbPathFromGroup(grpsBck, item.uniqueName, null, this.breadcrumbPath, false, this.breadcrumbUniqueNamePath);
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
        // if (col.uniqueName) {
        this.getBreadCrumbPathFromGroup(this._groups, col.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        // } else {
        //   let grp = col.groups.find(p => p.isOpen);
        //   if (grp) {
        //     this.getBreadCrumbPathFromGroup(this._groups, grp.uniqueName, null, this.breadcrumbPath, true, this.breadcrumbUniqueNamePath);
        //     this.breadcrumbUniqueNamePath.pop();
        //     this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        //     if (this.breadcrumbUniqueNamePath && this.breadcrumbUniqueNamePath.length > 0) {
        //       this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(this.breadcrumbUniqueNamePath[this.breadcrumbUniqueNamePath.length - 1]));
        //     }
        //   }
        // }
        // for (let index = 0; index < this.breadcrumbUniqueNamePath.length; index++) {
        //   let inde = this.mc.columns[index].Items.findIndex(p => p.uniqueName === this.breadcrumbUniqueNamePath[index]);
        //   this.mc.columns[index].Items[inde].isOpen = true;
        // }
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

    public initNavigator(navigator, el) {
        navigator.add(el);
    }

    /**
     * Handles right key press for navigating forward groups and accounts
     * by clicking the active node/link.
     * @param nodes Object containing current and previous nodes
     * @param navigator instance of NavigationWalker
     */
    public onRightKey(nodes, navigator) {
        if (nodes.currentVertical) {
            nodes.currentVertical.click();
        } else {
            nodes.previousVertical.click();
        }
    }

    /**
     * Handles right key press for navigating back to previous groups or accounts.
     * @param nodes Object containing current and previous nodes
     * @param navigator instance of NavigationWalker
     */
    public onLeftKey(nodes, navigator) {
        navigator.remove();
        if (navigator.currentVertical && !navigator.currentVertical.attributes.getNamedItem('nav-vr-item')) {
            navigator.nextVertical();
        }
    }

    /**
     * Handles new column added usually when group/link is clicked
     * @param el element reference
     * @param navigation instance of NavigationWalker
     */
    public onColAdd(el, navigation) {
        navigation.add(el.nativeElement);
        navigation.nextVertical();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
