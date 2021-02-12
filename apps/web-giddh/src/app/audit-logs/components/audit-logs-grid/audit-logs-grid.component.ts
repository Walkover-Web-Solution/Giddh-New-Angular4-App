import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { ILogsItem } from '../../../models/interfaces/logs.interface';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from '../../../lodash-optimized';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';

@Component({
    selector: 'audit-logs-grid',  // <home></home>
    templateUrl: './audit-logs-grid.component.html',
    styleUrls: [`./audit-logs-grid.component.scss`]

})
export class AuditLogsGridComponent implements OnInit, OnDestroy {
    public page$: Observable<number>;
    public totalPages$: Observable<number>;
    public totalElements$: Observable<number>;
    public size$: Observable<number>;
    public logs$: Observable<ILogsItem[]>;
    public loadMoreInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;

    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>, private _auditLogsActions: AuditLogsActions) {
        this.loadMoreInProcess$ = this.store.pipe(select(p => p.auditlog.LoadMoreInProcess), takeUntil(this.destroyed$));
        this.logs$ = this.store.pipe(select(p => p.auditlog.logs), takeUntil(this.destroyed$));
        this.size$ = this.store.pipe(select(p => p.auditlog.size), takeUntil(this.destroyed$));
        this.totalElements$ = this.store.pipe(select(p => p.auditlog.totalElements), takeUntil(this.destroyed$));
        this.totalPages$ = this.store.pipe(select(p => p.auditlog.totalPages), takeUntil(this.destroyed$));
        this.page$ = this.store.pipe(select(p => p.auditlog.currentPage), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.auditlog.getLogInProcess)).subscribe(response => {
            this.isLoading = response;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public loadMoreLogs() {
        this.store.pipe(select(p => p.auditlog), take(1)).subscribe((r) => {
            let request = cloneDeep(r.currentLogsRequest);
            let page = r.currentPage + 1;
            this.store.dispatch(this._auditLogsActions.LoadMoreLogs(request, page));
        });
    }
}
