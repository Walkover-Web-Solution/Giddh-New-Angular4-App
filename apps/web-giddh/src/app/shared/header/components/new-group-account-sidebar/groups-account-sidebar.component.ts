import { take, takeUntil } from 'rxjs/operators';
import { GroupResponse } from '../../../../models/api-models/Group';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { ColumnGroupsAccountVM, GroupAccountSidebarVM, IGroupOrAccount } from './VM';
import { AccountResponseV2 } from '../../../../models/api-models/Account';
import { VsForDirective } from '../../../../theme/ng2-vs-for/ng2-vs-for';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { cloneDeep, each } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'groups-account-sidebar',
    templateUrl: './groups-account-sidebar.component.html',
    styleUrls: ['./groups-account-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GroupsAccountSidebarComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

    public items;

    /* This will hold local JSON data */
    @Input() public localeData: any = {};

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
    /* Move group observable */
    public isMoveGroupSuccess$: Observable<boolean>;
    public isDeleteGroupSuccess$: Observable<boolean>;
    /** Active group unique name observable */
    public activeGroupUniqueName$: Observable<string>;
    @Input() public padLeft: number = 30;
    @Input() public isSearchingGroups: boolean = false;
    public breadcrumbPath: string[] = [];
    public breadcrumbUniqueNamePath: string[] = [];
    @Output() public breadcrumbPathChanged = new EventEmitter();
    public activeAccount: Observable<AccountResponseV2>;

    @Output() public resetSearchString: EventEmitter<boolean> = new EventEmitter();

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Active group observable */
    private activeGroup$: Observable<any>;
    public currentGroup: any;
    public currentGroupIndex: number = 0;
    public isGroupMoved: boolean = false;
    /* This will hold if group is deleted */
    public isGroupDeleted: boolean = false;
    /** This will hold the search string */
    public searchString: string = "";
    // tslint:disable-next-line:no-empty
    constructor(
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction,
        private _generalServices: GeneralService,
        private _cdRef: ChangeDetectorRef,
        private groupService: GroupService
    ) {
        this.mc = new GroupAccountSidebarVM(this.store);
        this.activeGroup = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeAccount = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.isUpdateGroupSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.isUpdateGroupSuccess), takeUntil(this.destroyed$));
        this.isUpdateAccountSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$));
        this.isDeleteGroupSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.isDeleteGroupSuccess), takeUntil(this.destroyed$));
        this.groupsListBackupStream$ = this.store.pipe(select(state => state.general.groupswithaccounts), takeUntil(this.destroyed$));
        this.isMoveGroupSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.isMoveGroupSuccess), takeUntil(this.destroyed$));
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['groups']) {
            this.resetData();

            if (!this.isGroupMoved && !this.isGroupDeleted) {
                let activeGroup;
                this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
                if (this.currentGroup !== undefined) {
                    if (activeGroup) {
                        this.currentGroup.name = activeGroup.name;
                        this.currentGroup.uniqueName = activeGroup.uniqueName;
                        if (this.currentGroupIndex === 0) {
                            const currentUpdatedGroup = this.groups.find(group => this.currentGroup.uniqueName === group.uniqueName);
                            if (currentUpdatedGroup) {
                                this.currentGroup.groups = currentUpdatedGroup.groups;
                            }
                        }
                    }
                    this.onGroupClick(this.currentGroup, this.currentGroupIndex);
                }
            }
        }
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
        let i = Number;
        let text = this.localeData?.item_no;
        text = text?.replace("[ITEM_NO]", i);
        this.items = Array.from({length: 100000}).map((_, i) => text);

        this._generalServices.eventHandler.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.mc.handleEvents(s.name, s.payload);

            let groups: IGroupsWithAccounts[];
            this.store.pipe(select(state => state.general.groupswithaccounts), take(1)).subscribe(grp => groups = grp);

            let activeGroup: GroupResponse;
            this.store.pipe(select(state => state.groupwithaccounts.activeGroup), take(1)).subscribe(grp => activeGroup = grp);

            let activeAccount;
            this.store.pipe(select(state => state.groupwithaccounts.activeAccount), take(1)).subscribe(acc => activeAccount = acc);

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
                this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
            } else {
                this.getBreadCrumbPathFromGroup(activeAccount, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
            }

            this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        });

        this.isMoveGroupSuccess$.subscribe(response => {
            if (response) {
                this.isGroupMoved = true;
                this.store.dispatch(this.groupWithAccountsAction.moveGroupComplete());
            }
        });

        this.isDeleteGroupSuccess$.subscribe(response => {
            if (response) {
                this.isGroupDeleted = true;
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.groupAndAccountSearchString), takeUntil(this.destroyed$)).subscribe(response => {
            this.searchString = response;
        });

        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(activeGroup => {
            if (activeGroup) {
                this.populateNewColumns(activeGroup);
            }
        });

        this.activeAccount.pipe(takeUntil(this.destroyed$)).subscribe(activeAccount => {
            if (activeAccount) {
                let activeGroup;
                this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
                if (!activeGroup) {
                    // Active group doesn't exist when search is made in Master
                    this.breadcrumbPath = [];
                    this.breadcrumbUniqueNamePath = [];
                    this.getBreadCrumbPathFromGroup(activeAccount, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
                    this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
                }
            }
        });
    }

    /**
     * This will get the active group details
     *
     * @memberof GroupsAccountSidebarComponent
     */
    public getGroupDetails(): void {
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);

        this.groupService.GetGroupDetails(activeGroup.uniqueName).subscribe(group => {
            if (group && group.status === "success" && group.body) {
                let groupDetails = group.body;
                if (groupDetails && groupDetails.parentGroups && groupDetails.parentGroups?.length > 0) {
                    this.currentGroupIndex = groupDetails.parentGroups?.length;
                } else {
                    this.currentGroupIndex = 0;
                }

                let currentGroup: any = {
                    synonyms: groupDetails.synonyms,
                    groups: groupDetails.groups,
                    name: groupDetails.name,
                    uniqueName: groupDetails.uniqueName
                };

                this.onGroupClick(currentGroup, this.currentGroupIndex);

                this.isGroupMoved = false;
                this.isGroupDeleted = false;
            }
        });
    }

    public resetData() {
        this._groups = this.orderByCategory(cloneDeep(this.groups));

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
        this.store.pipe(select(state => state.groupwithaccounts.activeGroup), take(1)).subscribe(a => activeGroup = a);

        if (this.isSearchingGroups) {
            if (grps && grps?.length > 0) {
                let newCOL = new ColumnGroupsAccountVM(null);
                let allGrps = [];
                let allAccount = [];
                for (let grp of grps) {
                    if (activeGroup && grp.uniqueName === activeGroup.uniqueName) {
                        grp.isOpen = true;
                        grp.isActive = true;
                        newCOL.IsCreateNewBtnShowable = true;
                    }
                    if (grp.groups && grp.groups?.length > 0) {
                        allGrps.push(...grp.groups);
                    }
                }
                if (!activeGroup) {
                    for (let grp of grps) {
                        if (grp?.accounts && grp?.accounts?.length > 0) {
                            allAccount.push(...grp.accounts);
                        }
                    }
                } else {
                    for (let grp of grps) {
                        if (grp?.uniqueName === activeGroup?.uniqueName) {
                            if (grp?.accounts && grp?.accounts?.length > 0) {
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
                if (activeGroup && grp.uniqueName === activeGroup.uniqueName) {
                    let newCOL = new ColumnGroupsAccountVM(grp);
                    newCOL.groups = [];
                    if (activeGroup.groups) {
                        for (let key of activeGroup.groups) {
                            newCOL.groups.push(key);
                        }
                        let grps1 = newCOL.groups || [];
                        let accs = newCOL.accounts || [];
                        let grps2 = grps1.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
                        let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));
                        newCOL.Items = [...grps2, ...accs2] as IGroupOrAccount[];
                        newCOL.SelectedItem = newCOL.Items.find(p => p.isActive) || newCOL.Items.find(p => p.isOpen);
                    }
                    this.mc.columns.splice(1, 1, newCOL);
                    this._cdRef.detectChanges();
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
        this.getMasters(item.uniqueName, currentIndex);
        this.mc.selectedType = 'grp';
    }

    public onAccountClick(item: any, currentIndex: number) {
        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
        const currentAccount = {
            name: item.name,
            uniqueName: item.uniqueName,
            parentGroups: activeGroup ? [
                ...activeGroup.parentGroups,
                { name: activeGroup.name, uniqueName: activeGroup.uniqueName }
            ] : []
        };
        let parentGrp = this.getBreadCrumbPathFromGroup(currentAccount, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
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
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
        this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
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
        each(groups, (grp) => {
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
        each(liabilities, liability => orderedGroups.push(liability));
        each(assets, asset => orderedGroups.push(asset));
        each(income, inc => orderedGroups.push(inc));
        each(expenses, exp => orderedGroups.push(exp));
        return orderedGroups;
    }

    /**
     * Forms the breadcrumb path
     *
     * @param {*} activeEntity Active entity (either group or account)
     * @param {IGroupsWithAccounts} result Entity that is selected for which breadcrumb is formed
     * @param {string[]} parentPath Stores the path of names
     * @param {string[]} parentUniquenamePath Stores the path of uniquenames
     * @returns {*} Entity that is selected for which breadcrumb is formed
     * @memberof GroupsAccountSidebarComponent
     */
    public getBreadCrumbPathFromGroup(activeEntity: any, result: IGroupsWithAccounts, parentPath: string[], parentUniquenamePath: string[]): any {
        if (result !== null) {
            return result;
        }
        if (activeEntity?.parentGroups) {
            for (let group of activeEntity.parentGroups) {
                parentUniquenamePath.push(group.uniqueName);
                parentPath.push(group.name);
            }
        }
        parentUniquenamePath.push(activeEntity.uniqueName);
        parentPath.push(activeEntity.name);
        result = activeEntity;
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
        navigation.add(el?.nativeElement);
        navigation.nextVertical();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Populates the new columns
     *
     * @private
     * @param {GroupResponse} activeGroup Active group
     * @returns {void}
     * @memberof GroupsAccountSidebarComponent
     */
    private populateNewColumns(activeGroup: GroupResponse): void {
        if (this.currentGroupIndex === 0) {
            this.currentGroup = {
                ...this.currentGroup,
                ...activeGroup
            }
            this.resetData();
            this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
            this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
            this.mc.selectGroup(this.currentGroup, this.currentGroupIndex, true);
            return;
        }

        let grpsBck: GroupsWithAccountsResponse[];
        this.groupsListBackupStream$.pipe(take(1)).subscribe(s => grpsBck = s);

        this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);

        let listBckup = this.mc.activeGroupFromGroupListBackup(grpsBck, this.currentGroup?.uniqueName, null);
        if (listBckup && this.currentGroup) {
            this.currentGroup.groups = listBckup.groups;
            this.currentGroup.accounts = listBckup.accounts;
        }
        this.mc.selectGroup(this.currentGroup, this.currentGroupIndex, true);

        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
        this.ScrollToRight.emit(true);
        this.ScrollToElement = true;
    }

    private getMasters(groupUniqueName: string, currentIndex: number): void {
        this.groupService.getMasters(groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if(response?.status === "success") {
                //this.mc.columns[currentIndex + 1] = response?.body?.results;
            }
        });
    }
}
