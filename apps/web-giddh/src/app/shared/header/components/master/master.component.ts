import { CdkVirtualScrollViewport, ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AccountsAction } from "apps/web-giddh/src/app/actions/accounts.actions";
import { GroupWithAccountsAction } from "apps/web-giddh/src/app/actions/groupwithaccounts.actions";
import { cloneDeep } from "apps/web-giddh/src/app/lodash-optimized";
import { IGroupsWithAccounts } from "apps/web-giddh/src/app/models/interfaces/groupsWithAccounts.interface";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { Observable, ReplaySubject } from "rxjs";
import { filter, take, takeUntil } from "rxjs/operators";

@Component({
    selector: "master",
    templateUrl: "./master.component.html",
    styleUrls: ["./master.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent implements OnInit, OnChanges {
    @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
    @Input() public searchedMasterData: any[] = [];
    @Input() public height: number;
    @Input() public isSearchingGroups: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    @Input() public topSharedGroups: any[] = [];
    public masterColumnsData: any[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public loadMoreInProgress: boolean = false;
    public breadcrumbPath: string[] = [];
    public breadcrumbUniqueNamePath: string[] = [];
    @Output() public breadcrumbPathChanged = new EventEmitter();
    /** Active group observable */
    private activeGroup$: Observable<any>;
    public showCreateNewButton: boolean = true;
    private currentGroupColumnIndex: number = -1;
    private currentGroupUniqueName: any = '';

    constructor(
        private groupService: GroupService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction,
        private store: Store<AppState>,
        private scrollDispatcher: ScrollDispatcher,
        private changeDetectorRef: ChangeDetectorRef
    ) {

    }

    public ngOnInit(): void {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters((this.masterColumnsData[this.currentGroupColumnIndex + 1].groupUniqueName) ? this.masterColumnsData[this.currentGroupColumnIndex + 1].groupUniqueName : this.currentGroupUniqueName, ((this.masterColumnsData[this.currentGroupColumnIndex + 1].groupUniqueName)) ? this.currentGroupColumnIndex + 1 : this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isUpdateGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isDeleteGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isMoveGroupSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex - 1);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters((this.masterColumnsData[this.currentGroupColumnIndex].groupUniqueName) ? this.masterColumnsData[this.currentGroupColumnIndex].groupUniqueName : this.currentGroupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.updateAccountIsSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.isDeleteAccSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex - 1, true);
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.moveAccountSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentGroupColumnIndex > -1) {
                this.getMasters(this.masterColumnsData[this.currentGroupColumnIndex]?.groupUniqueName, this.currentGroupColumnIndex - 1, true);
            }
        });

        this.scrollDispatcher.scrolled().pipe(filter(event => this.virtualScroll.getRenderedRange().end === this.virtualScroll.getDataLength())).subscribe((event: any) => {
            //console.log(this.virtualScroll, this.virtualScroll.getRenderedRange().end, this.virtualScroll.getDataLength());
            if (!this.loadMoreInProgress && this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.page < this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.totalPages) {
                this.getMasters(this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.groupUniqueName, event?.elementRef?.nativeElement?.id, false, true);
                this.loadMoreInProgress = true;
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.topSharedGroups) {
            this.masterColumnsData = [];
            this.masterColumnsData[0] = { results: changes?.topSharedGroups?.currentValue, page: 1, totalPages: 1, groupUniqueName: '' };
            this.changeDetectorRef.detectChanges();
        }

        if (changes?.searchedMasterData?.currentValue?.length > 0) {
            let masterColumnsData = [];
            //let masterTempData = [];
            masterColumnsData = this.mapNestedGroupsAccounts(changes?.searchedMasterData?.currentValue, 0, masterColumnsData);
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

            masterColumnsData?.map(columnData => {
                columnData.results = columnData?.results.sort((a, b) => b.type.localeCompare(a.type));
                return columnData;
            });

            this.masterColumnsData = cloneDeep(masterColumnsData);
            this.changeDetectorRef.detectChanges();
        }

        if (changes?.isSearchingGroups?.currentValue) {
            this.showCreateNewButton = false;
        }
    }

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
                    this.masterColumnsData[currentIndex].results.push(response?.body?.results);
                }
            }
            this.loadMoreInProgress = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    public onGroupClick(item: IGroupsWithAccounts, currentIndex: number): void {
        this.currentGroupColumnIndex = currentIndex;
        this.currentGroupUniqueName = item.uniqueName;
        this.showCreateNewButton = true;
        this.getMasters(item?.uniqueName, currentIndex);
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
        this.store.dispatch(this.accountsAction.resetActiveAccount());
    }

    public onAccountClick(item: any, currentIndex: number): void {
        this.currentGroupColumnIndex = currentIndex - 1;
        this.currentGroupUniqueName = this.masterColumnsData[currentIndex].groupUniqueName;
        this.showCreateNewButton = true;
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
        this.store.dispatch(this.accountsAction.getAccountDetails(item?.uniqueName));
    }

    public trackByFn(index: number, item: IGroupsWithAccounts) {
        return item.uniqueName;
    }

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

    public showAddNewForm() {
        this.breadcrumbPath = [];
        this.breadcrumbUniqueNamePath = [];
        let activeGroup;
        this.activeGroup$.pipe(take(1)).subscribe(group => activeGroup = group);
        this.getBreadCrumbPathFromGroup(activeGroup, null, this.breadcrumbPath, this.breadcrumbUniqueNamePath);
        this.breadcrumbPathChanged.emit({ breadcrumbPath: this.breadcrumbPath, breadcrumbUniqueNamePath: this.breadcrumbUniqueNamePath });

        if (activeGroup.uniqueName) {
            this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(activeGroup.uniqueName));
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
}