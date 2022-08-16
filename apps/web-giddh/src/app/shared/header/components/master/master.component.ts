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

        this.scrollDispatcher.scrolled().pipe(filter(event => this.virtualScroll.measureScrollOffset('bottom') === 0)).subscribe((event: any) => {
            this.getMasters(this.masterColumnsData[event?.elementRef?.nativeElement?.id], event?.elementRef?.nativeElement?.id);
        });
    }

    private getMasters(groupUniqueName: string, currentIndex: number): void {
        this.groupService.getMasters(groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                let newIndex = Number(currentIndex) + 1;
                this.masterColumnsData = this.masterColumnsData.slice(0, newIndex);
                this.masterColumnsData[newIndex] = { results: response?.body?.results, page: response?.body?.page, totalPages: response?.body?.totalPages, groupUniqueName: groupUniqueName };
                this.createColumns();
            }
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