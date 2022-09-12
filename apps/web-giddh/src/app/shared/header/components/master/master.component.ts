import { CdkVirtualScrollViewport, ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AccountsAction } from "apps/web-giddh/src/app/actions/accounts.actions";
import { GroupWithAccountsAction } from "apps/web-giddh/src/app/actions/groupwithaccounts.actions";
import { cloneDeep } from "apps/web-giddh/src/app/lodash-optimized";
import { AccountResponseV2 } from "apps/web-giddh/src/app/models/api-models/Account";
import { IGroupsWithAccounts } from "apps/web-giddh/src/app/models/interfaces/groupsWithAccounts.interface";
import { GeneralService } from "apps/web-giddh/src/app/services/general.service";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { Observable, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { eventsConst } from "../eventsConst";

@Component({
    selector: "master",
    templateUrl: "./master.component.html",
    styleUrls: ["./master.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent implements OnInit, OnChanges, OnDestroy {
    /** Instance of cdk virtual scroller */
    @ViewChildren(CdkVirtualScrollViewport) virtualScroll: QueryList<CdkVirtualScrollViewport>;
    /** Data obtained by searching master */
    @Input() public searchedMasterData: any[] = [];
    /** Height of column */
    @Input() public height: number;
    /** true/false if searching */
    @Input() public isSearchingGroups: boolean = false;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** List of top shared groups */
    @Input() public topSharedGroups: any[] = [];
    /** Holds master columns data */
    public masterColumnsData: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if load more in progress */
    public loadMoreInProgress: boolean = false;
    /** Breadcrumb path */
    public breadcrumbPath: string[] = [];
    /** Breadcrumb unique name path */
    public breadcrumbUniqueNamePath: string[] = [];
    /** Emits breadcrumb path */
    @Output() public breadcrumbPathChanged = new EventEmitter();
    /** Emits event to scroll to right */
    @Output() public scrollToRight: EventEmitter<boolean> = new EventEmitter(true);
    /** Active group observable */
    private activeGroup$: Observable<any>;
    /** Shows/hides create new button */
    public showCreateNewButton: boolean = true;
    /** Holds index of active column */
    private currentGroupColumnIndex: number = -1;
    /** Holds group unique name of active group */
    private currentGroupUniqueName: any = '';
    /** Active group unique name observable */
    public activeGroupUniqueName$: Observable<string>;
    /** Active account observable */
    public activeAccount$: Observable<AccountResponseV2>;

    constructor(
        private groupService: GroupService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction,
        private store: Store<AppState>,
        private scrollDispatcher: ScrollDispatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof MasterComponent
     */
    public ngOnInit(): void {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters((this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName) ? this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName : this.currentGroupUniqueName, ((this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName)) ? this.currentGroupColumnIndex + 1 : this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isUpdateGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                let activeGroup;
                this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
                if (activeGroup?.uniqueName) {
                    this.masterColumnsData?.forEach((column, index) => {
                        if (column?.groupUniqueName === this.currentGroupUniqueName) {
                            this.masterColumnsData[index].groupUniqueName = activeGroup?.uniqueName;
                        }
                    });
                }
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isDeleteGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
                this.onGroupClick({ uniqueName: this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName }, this.currentGroupColumnIndex - 1, false);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isMoveGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex - 1);
                this.store.dispatch(this.groupWithAccountsAction.moveGroupComplete());
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters((this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName) ? this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName : this.currentGroupUniqueName, ((this.masterColumnsData[this.currentGroupColumnIndex + 1]?.groupUniqueName)) ? this.currentGroupColumnIndex + 1 : this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.onGroupClick({ uniqueName: this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName }, this.currentGroupColumnIndex - 1);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isDeleteAccSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.moveAccountSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex - 1);
                this.store.dispatch(this.accountsAction.moveAccountReset());
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isMergeAccountSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.onGroupClick({ uniqueName: this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName }, this.currentGroupColumnIndex, false);
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isUnmergeAccountSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.onGroupClick({ uniqueName: this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName }, this.currentGroupColumnIndex, false);
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event && event?.getDataLength() - event?.getRenderedRange().end < 50) {
                if (!this.loadMoreInProgress && this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.page < this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.totalPages) {
                    this.loadMoreInProgress = true;
                    this.getMasters(this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.groupUniqueName, event?.elementRef?.nativeElement?.id, false, true);
                }
            }
        });

        this.generalService.eventHandler.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event) {
                let activeGroup: any;
                this.store.pipe(select(state => state.groupwithaccounts.activeGroup), take(1)).subscribe(grp => activeGroup = grp);

                let activeAccount;
                this.store.pipe(select(state => state.groupwithaccounts.activeAccount), take(1)).subscribe(acc => activeAccount = acc);

                // reset search string when you're in search case for move group || move account || merge account
                if (event.name === eventsConst.groupMoved || event.name === eventsConst.accountMoved || event.name === eventsConst.accountMerged) {
                    this.isSearchingGroups = false;
                }

                this.breadcrumbPath = [];
                this.breadcrumbUniqueNamePath = [];

                if (!activeAccount) {
                    this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
                } else {
                    this.getBreadCrumbPathFromGroup(activeAccount, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
                }

                this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$)).subscribe(activeAccount => {
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

        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(activeGroup => {
            if (activeGroup) {
                this.breadcrumbPath = [];
                this.breadcrumbUniqueNamePath = [];
                this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
                this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });
            }
        });
    }

    /**
     * Handles the change of input data
     *
     * @param {SimpleChanges} changes
     * @memberof MasterComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.isSearchingGroups) {
            this.isSearchingGroups = changes?.isSearchingGroups?.currentValue;
        }

        if (changes?.topSharedGroups?.currentValue) {
            this.showTopLevelGroups();
        }

        if (changes?.searchedMasterData?.currentValue && this.isSearchingGroups) {
            let masterColumnsData = [];
            if (changes?.searchedMasterData?.currentValue?.length > 0) {
                masterColumnsData = this.mapNestedGroupsAccounts(changes?.searchedMasterData?.currentValue, 0, masterColumnsData);
                masterColumnsData?.map(columnData => {
                    columnData.results = columnData?.results.sort((a, b) => b.type.localeCompare(a.type));
                    return columnData;
                });
            }
            this.masterColumnsData = cloneDeep(masterColumnsData);

            /** Login to handle json like command k */
            //let masterTempData = [];

            //changes?.searchedMasterData?.currentValue.forEach(master => {
            // master?.parentGroups?.forEach((masterParentGroup, index) => {
            //     if (!masterTempData[masterParentGroup?.uniqueName]) {
            //         masterTempData[masterParentGroup?.uniqueName] = masterParentGroup?.uniqueName;

            //         masterParentGroup.type = "GROUP";

            //         if (masterColumnsData[index]) {
            //             const masterExists = masterColumnsData[index]?.results?.filter(data => data?.uniqueName === masterParentGroup?.uniqueName);
            //             if (!masterExists?.length) {
            //                 masterColumnsData[index].results.push(masterParentGroup);
            //             }
            //         } else {
            //             masterColumnsData[index] = { results: [masterParentGroup], page: 1, totalPages: 1, groupUniqueName: '' };
            //         }
            //     }
            // });

            // if (masterColumnsData[master?.parentGroups?.length]) {
            //     const masterExists = masterColumnsData[master?.parentGroups?.length]?.results?.filter(data => data?.uniqueName === master?.uniqueName);
            //     if (!masterExists?.length) {
            //         masterColumnsData[master?.parentGroups?.length].results.push(master);
            //     }
            // } else {
            //     masterColumnsData[master?.parentGroups?.length] = { results: [master], page: 1, totalPages: 1, groupUniqueName: '' };
            // }
            //});
        }

        if (changes?.isSearchingGroups?.currentValue) {
            this.showCreateNewButton = false;
        }

        this.changeDetectorRef.detectChanges();
    }

    /**
     * Calls master api and gets groups/accounts
     *
     * @private
     * @param {string} groupUniqueName
     * @param {number} currentIndex
     * @param {boolean} [isRefresh=false]
     * @param {boolean} [isLoadMore=false]
     * @returns {void}
     * @memberof MasterComponent
     */
    private getMasters(groupUniqueName: string, currentIndex: number, isRefresh: boolean = false, isLoadMore: boolean = false): void {
        if (!groupUniqueName) {
            return;
        }
        const page = (isLoadMore) ? (Number(this.masterColumnsData[currentIndex]?.page) + 1) : 1;
        this.groupService.getMasters(groupUniqueName, page).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                if (!isLoadMore) {
                    if (!isRefresh) {
                        let newIndex = Number(currentIndex) + 1;
                        this.masterColumnsData = this.masterColumnsData.slice(0, newIndex);
                        this.masterColumnsData[newIndex] = { results: response?.body?.results, page: response?.body?.page, totalPages: response?.body?.totalPages, groupUniqueName: groupUniqueName };
                    } else {
                        this.masterColumnsData[currentIndex].page = response?.body?.page;
                        this.masterColumnsData[currentIndex].totalPages = response?.body?.totalPages;
                        this.masterColumnsData[currentIndex].groupUniqueName = groupUniqueName;
                        this.masterColumnsData[currentIndex].results = response?.body?.results;
                    }
                } else {
                    this.masterColumnsData[currentIndex].page = response?.body?.page;
                    this.masterColumnsData[currentIndex].results = this.masterColumnsData[currentIndex].results.concat(response?.body?.results);
                }
                this.scrollToRight.emit(true);
            }
            this.loadMoreInProgress = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * Handles group click
     *
     * @param {*} item
     * @param {number} currentIndex
     * @param {boolean} [loadMaster=true]
     * @memberof MasterComponent
     */
    public onGroupClick(item: any, currentIndex: number, loadMaster: boolean = true): void {
        this.currentGroupColumnIndex = currentIndex;
        this.currentGroupUniqueName = item.uniqueName;
        this.showCreateNewButton = true;
        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];
        if (loadMaster) {
            this.getMasters(item?.uniqueName, currentIndex);
        }
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
        this.store.dispatch(this.accountsAction.resetActiveAccount());
    }

    /**
     * Handles account click
     *
     * @param {*} item
     * @param {number} currentIndex
     * @memberof MasterComponent
     */
    public onAccountClick(item: any, currentIndex: number): void {
        this.currentGroupColumnIndex = currentIndex;
        this.currentGroupUniqueName = this.masterColumnsData[currentIndex].groupUniqueName;
        this.showCreateNewButton = true;

        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);

        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];

        const currentAccount = {
            name: item.name,
            uniqueName: item.uniqueName,
            parentGroups: activeGroup ? [
                ...activeGroup.parentGroups,
                { name: activeGroup.name, uniqueName: activeGroup.uniqueName }
            ] : []
        };
        this.getBreadCrumbPathFromGroup(currentAccount, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });

        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
        this.store.dispatch(this.accountsAction.getAccountDetails(item?.uniqueName));
    }

    /**
     * Track by function
     *
     * @param {number} index
     * @param {IGroupsWithAccounts} item
     * @returns
     * @memberof MasterComponent
     */
    public trackByFn(index: number, item: IGroupsWithAccounts) {
        return item.uniqueName;
    }

    /**
     * Mapper to handle group with accounts data
     *
     * @private
     * @param {*} master
     * @param {number} index
     * @param {*} masterColumnsData
     * @returns {*}
     * @memberof MasterComponent
     */
    private mapNestedGroupsAccounts(master: any, index: number, masterColumnsData: any): any {
        master?.forEach(data => {
            if (masterColumnsData[index]) {
                masterColumnsData[index].results.push({ name: data?.name, type: (data?.category) ? "GROUP" : "ACCOUNT", uniqueName: data?.uniqueName });
            } else {
                masterColumnsData[index] = { results: [{ name: data?.name, type: (data?.category) ? "GROUP" : "ACCOUNT", uniqueName: data?.uniqueName }], page: 1, totalPages: 1, groupUniqueName: '' };
            }

            if (data?.groups?.length) {
                masterColumnsData = this.mapNestedGroupsAccounts(data?.groups, (index + 1), masterColumnsData);
            }

            if (data?.accounts?.length) {
                masterColumnsData = this.mapNestedGroupsAccounts(data?.accounts, (index + 1), masterColumnsData);
            }
        });

        return masterColumnsData;
    }

    /**
     * Shows add new account form
     *
     * @param {*} items
     * @param {number} currentIndex
     * @memberof MasterComponent
     */
    public showAddNewForm(items: any, currentIndex: number): void {
        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
        this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });

        if (items.groupUniqueName) {
            this.currentGroupColumnIndex = currentIndex - 1;
            this.currentGroupUniqueName = items.groupUniqueName;
            this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(items.groupUniqueName));
        }
        this.store.dispatch(this.groupWithAccountsAction.showAddNewForm());
        this.store.dispatch(this.accountsAction.resetActiveAccount());
    }

    /**
     * Forms the breadcrumb path
     *
     * @param {*} activeEntity Active entity (either group or account)
     * @param {IGroupsWithAccounts} result Entity that is selected for which breadcrumb is formed
     * @param {string[]} parentPath Stores the path of names
     * @param {string[]} parentUniquenamePath Stores the path of uniquenames
     * @returns {*} Entity that is selected for which breadcrumb is formed
     * @memberof MasterComponent
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

    /**
     * Initializes navigator
     *
     * @param {*} navigator
     * @param {*} el
     * @memberof MasterComponent
     */
    public initNavigator(navigator?: any, element?: any): void {
        navigator.add(element);
    }

    /**
     * Handles right key press for navigating forward groups and accounts
     * by clicking the active node/link.
     * @param nodes Object containing current and previous nodes
     * @param navigator instance of NavigationWalker
     * @memberof MasterComponent
     */
    public onRightKey(nodes?: any, navigator?: any): void {
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
     * @memberof MasterComponent
     */
    public onLeftKey(nodes?: any, navigator?: any): void {
        navigator.remove();
        if (navigator.currentVertical && !navigator.currentVertical.attributes.getNamedItem('nav-vr-item')) {
            navigator.nextVertical();
        }
    }

    /**
     * Handles new column added usually when group/link is clicked
     * @param el element reference
     * @param navigation instance of NavigationWalker
     * @memberof MasterComponent
     */
    public onColAdd(element?: any, navigation?: any): void {
        setTimeout(() => {
            navigation.add(element?.nativeElement);
            navigation.nextVertical();
        }, 200);
    }

    /**
     * Shows top levels groups
     *
     * @memberof MasterComponent
     */
    public showTopLevelGroups(): void {
        this.masterColumnsData = [];
        this.masterColumnsData[0] = { results: this.topSharedGroups, page: 1, totalPages: 1, groupUniqueName: '' };
    }

    /**
     * Destroys all the observables
     *
     * @memberof MasterComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}