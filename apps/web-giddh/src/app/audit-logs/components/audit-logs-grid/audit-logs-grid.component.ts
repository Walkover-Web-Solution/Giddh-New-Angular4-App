import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { PAGINATION_LIMIT } from '../../../app.constant';
import * as _ from '../../../lodash-optimized';
import { ILogsItem } from '../../../models/interfaces/logs.interface';
import { AppState } from '../../../store/roots';

@Component({
    selector: 'audit-logs-grid',
    templateUrl: './audit-logs-grid.component.html',
    styleUrls: ['./audit-logs-grid.component.scss']
})
export class AuditLogsGridComponent implements OnDestroy {
    public page$: Observable<number>;
    public totalPages$: Observable<number>;
    public totalElements$: Observable<number>;
    public size$: Observable<number>;
    public logs$: Observable<ILogsItem[]>;
    public loadMoreInProcess$: Observable<boolean>;
    /** Items per page */
    public itemsPerPage: number = PAGINATION_LIMIT;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor(
        private store: Store<AppState>,
        private _auditLogsActions: AuditLogsActions
        ) {
            this.loadMoreInProcess$ = this.store.select(p => p.auditlog.LoadMoreInProcess).pipe(takeUntil(this.destroyed$));
            this.logs$ = this.store.select(p => p.auditlog.logs);
            this.size$ = this.store.select(p => p.auditlog.size);
            this.totalElements$ = this.store.select(p => p.auditlog.totalElements);
            this.totalPages$ = this.store.select(p => p.auditlog.totalPages);
            this.page$ = this.store.select(p => p.auditlog.CurrectPage);
    }

    /**
     * Unsubscribes to all the subscriptions
     *
     * @memberof AuditLogsGridComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Loads more audit logs
     *
     * @memberof AuditLogsGridComponent
     */
    public loadMoreLogs(): void {
        this.store.select(p => p.auditlog).pipe(take(1)).subscribe((r) => {
            let request = _.cloneDeep(r.CurrectLogsRequest);
            let page = r.CurrectPage + 1;
            this.store.dispatch(this._auditLogsActions.LoadMoreLogs(request, page));
        });
    }
}
