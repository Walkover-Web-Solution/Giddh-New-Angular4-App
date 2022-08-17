import { CdkVirtualScrollViewport, ScrollDispatcher } from "@angular/cdk/scrolling";
import { Component, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AccountsAction } from "apps/web-giddh/src/app/actions/accounts.actions";
import { GroupWithAccountsAction } from "apps/web-giddh/src/app/actions/groupwithaccounts.actions";
import { IGroupsWithAccounts } from "apps/web-giddh/src/app/models/interfaces/groupsWithAccounts.interface";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { ReplaySubject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Component({
    selector: "master",
    templateUrl: "./master.component.html",
    styleUrls: ["./master.component.scss"]
})

export class MasterComponent implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
    public masterColumns: any[] = [];
    public masterColumnsData: any[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public loadMoreInProgress: boolean = false;

    constructor(
        private groupService: GroupService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction,
        private store: Store<AppState>,
        private scrollDispatcher: ScrollDispatcher
    ) {

    }

    public ngOnInit(): void {
        this.store.pipe(select(state => state.groupwithaccounts.groupswithaccounts), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.masterColumnsData[0] = { results: response, page: 1, totalPages: 1, groupUniqueName: '' };
            }
            this.createColumns();
        });

        this.scrollDispatcher.scrolled().pipe(filter(event => this.virtualScroll.getRenderedRange().end === this.virtualScroll.getDataLength())).subscribe((event: any) => {
            console.log(this.virtualScroll, this.virtualScroll.getRenderedRange().end, this.virtualScroll.getDataLength());
            if (!this.loadMoreInProgress && this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.page < this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.totalPages) {
                this.getMasters(this.masterColumnsData[event?.elementRef?.nativeElement?.id]?.groupUniqueName, event?.elementRef?.nativeElement?.id, true);
                this.loadMoreInProgress = true;
            }
        });
    }

    private getMasters(groupUniqueName: string, currentIndex: number, isLoadMore: boolean = false): void {
        if (!groupUniqueName) {
            return;
        }
        const page = (isLoadMore) ? (Number(this.masterColumnsData[currentIndex]?.page) + 1) : 1;
        this.groupService.getMasters(groupUniqueName, page).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                if (!isLoadMore) {
                    let newIndex = Number(currentIndex) + 1;
                    this.masterColumnsData = this.masterColumnsData.slice(0, newIndex);
                    this.masterColumnsData[newIndex] = { results: response?.body?.results, page: response?.body?.page, totalPages: response?.body?.totalPages, groupUniqueName: groupUniqueName };
                } else {
                    this.masterColumnsData[currentIndex].page = response?.body?.page;
                    this.masterColumnsData[currentIndex].results.push(response?.body?.results);
                }
                this.createColumns();
            }
            this.loadMoreInProgress = false;
        });
    }

    private createColumns(): void {
        this.masterColumns = Object.keys(this.masterColumnsData);
    }

    public onGroupClick(item: IGroupsWithAccounts, currentIndex: number): void {
        this.getMasters(item?.uniqueName, currentIndex);
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(item.uniqueName));
        this.store.dispatch(this.accountsAction.resetActiveAccount());
    }

    public onAccountClick(item: any, currentIndex: number): void {
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
        this.store.dispatch(this.accountsAction.getAccountDetails(item?.uniqueName));
    }

    public trackByIdx(i: number) {
        return i;
    }
}