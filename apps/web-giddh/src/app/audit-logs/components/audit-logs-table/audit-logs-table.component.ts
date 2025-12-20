import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { GetAuditLogsRequest } from '../../../models/api-models/Logs';
import { AppState } from '../../../store/roots';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'audit-logs-table',
    templateUrl: './audit-logs-table.component.html',
    styleUrls: ['audit-logs-table.component.scss'],
    standalone: false
})
export class AuditLogsTableComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** To toggle multiple line show/hide for address*/
    public showSingleAddress: boolean = false;
    /** Total pages in audit log response*/
    public totalPages$: Observable<number>;
    /** To load more audit logs call in process observers */
    public loadMoreInProcess$: Observable<boolean>;
    /** Page count for audit log request */
    public page$: Observable<number>;
    /** Audit log response list */
    public auditLogs$: Observable<any[]>;
    /** Audit log request */
    public auditLogsRequest$: Observable<GetAuditLogsRequest>;
    /** To show hide field */
    public isShowMultipleDataIndex: number = null;
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(private store: Store<AppState>, private auditLogsActions: AuditLogsActions) {
        this.loadMoreInProcess$ = this.store.pipe(select(state => state.auditlog.LoadMoreInProcess), takeUntil(this.destroyed$));
        this.totalPages$ = this.store.pipe(select(state => state.auditlog.totalPages), takeUntil(this.destroyed$));
        this.page$ = this.store.pipe(select(state => state.auditlog.currentPage), takeUntil(this.destroyed$));
        this.auditLogs$ = this.store.pipe(select(state => state.auditlog.auditLogs), takeUntil(this.destroyed$));
        this.auditLogsRequest$ = this.store.pipe(select(state => state.auditlog.auditLogsRequest), takeUntil(this.destroyed$));
    }

    /**
     *  Component lifecycle call stack
     *
     * @memberof AuditLogsTableComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.auditlog.getLogInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });
    }

    /**
     *  Component lifecycle call stack
     *
     * @memberof AuditLogsTableComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * To load more new data of audit logs
     *
     * @memberof AuditLogsTableComponent
     */
    public loadMoreLogs(): void {
        this.store.pipe(select(state => state.auditlog), take(1)).subscribe((response) => {
            let request = cloneDeep(response.auditLogsRequest);
            request.page = response.currentPage + 1;
            this.store.dispatch(this.auditLogsActions.getAuditLogs(request));
        });
    }

    /**
     * To open hide field
     *
     * @param {number} index Index number
     * @memberof AuditLogsTableComponent
     */
    public openAllAddress(index: number): void {
        this.showSingleAddress = !this.showSingleAddress;
        this.isShowMultipleDataIndex = index;
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
