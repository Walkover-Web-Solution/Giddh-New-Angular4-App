import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { ILogsItem } from '../../../models/interfaces/logs.interface';
import { Store, select } from '@ngrx/store';
import * as _ from '../../../lodash-optimized';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';
import { AuditLogsSidebarVM } from '../audit-logs-form/Vm';
import { GetAuditLogsRequest } from '../../../models/api-models/Logs';

@Component({
    selector: 'audit-logs-table',  // <home></home>
    templateUrl: './audit-logs-table.component.html',
    styleUrls: ['audit-logs-table.component.scss']
})
export class AuditLogsTableComponent implements OnInit, OnDestroy {
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
        this.getFilteredLogs();
    }

    /**
     *  Component lifecycle call stack 
     *
     * @memberof AuditLogsTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To load more new data of audit logs
     *
     * @memberof AuditLogsTableComponent
     */
    public loadMoreLogs(): void{
        this.store.pipe(select(state => state.auditlog), take(1)).subscribe((response) => {
            let request = _.cloneDeep(response.auditLogsRequest);
            let page = response.currentPage + 1;
            this.store.dispatch(this.auditLogsActions.getAuditLogs(request, page));
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
     * To get filter log request response
     *
     * @memberof AuditLogsTableComponent
     */
    public getFilteredLogs(): void {
        // used for testing purpose ignire it for now we will remove it in next build
        this.auditLogs$.subscribe(res => {
            console.log("stored audit response:==", res);
        });
        // used for testing purpose ignire it for now we will remove it in next build
        this.auditLogsRequest$.subscribe(res => {
            console.log("store audit Request--", res);
        });
    }
}
