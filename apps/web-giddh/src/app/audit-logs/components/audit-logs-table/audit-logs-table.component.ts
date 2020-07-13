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
    public page$: Observable<number>;
    public showSingleAdd: boolean = false;
    public totalPages$: Observable<number>;
    public totalElements$: Observable<number>;
    public size$: Observable<number>;
    public logs$: Observable<ILogsItem[]>;
    public loadMoreInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public logsJSON: any;
    /** Audit log response list */
    public auditLogs$: Observable<any[]>;
    /** Audit log request */
    public auditLogsRequest$: Observable<GetAuditLogsRequest>;
    /** To show hide field */
    public isShowMultipleDataIndex: number = null;


    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>, private _auditLogsActions: AuditLogsActions) {
        this.loadMoreInProcess$ = this.store.select(p => p.auditlog.LoadMoreInProcess).pipe(takeUntil(this.destroyed$));
        this.logs$ = this.store.select(p => p.auditlog.logs);
        this.size$ = this.store.select(p => p.auditlog.size);
        this.totalElements$ = this.store.select(p => p.auditlog.totalElements);
        this.totalPages$ = this.store.select(p => p.auditlog.totalPages);
        this.page$ = this.store.select(p => p.auditlog.currentPage);
        //
        this.auditLogs$ = this.store.pipe(select(state => state.auditlog.auditLogs), takeUntil(this.destroyed$));
        this.auditLogsRequest$ = this.store.pipe(select(state => state.auditlog.auditLogsRequest), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        //
        this.getFilteredLogs();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public loadMoreLogs() {
        this.store.select(p => p.auditlog).pipe(take(1)).subscribe((r) => {
            let request = _.cloneDeep(r.currentLogsRequest);
            let page = r.currentPage + 1;
            this.store.dispatch(this._auditLogsActions.LoadMoreLogs(request, page));
        });
    }

    /**
     * To open hide field
     *
     * @param {number} index Index number
     * @memberof AuditLogsTableComponent
     */
    public openAllAddress(index: number) {
        this.showSingleAdd = !this.showSingleAdd;
        this.isShowMultipleDataIndex = index;
    }

    public getFilteredLogs() {
        let auditLogFormVM = new AuditLogsSidebarVM();
        this.logsJSON = auditLogFormVM.getJSON();
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
