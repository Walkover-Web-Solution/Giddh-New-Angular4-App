import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { LogsService } from '../../services/logs.service';
import { ToasterService } from '../../services/toaster.service';
import { LogsRequest, LogsResponse, GetAuditLogsRequest, AuditLogsResponse } from '../../models/api-models/Logs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AUDIT_LOGS_ACTIONS, AUDIT_LOGS_ACTIONS_V2 } from './audit-logs.const';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class AuditLogsActions {

    public GET_LOGS$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AUDIT_LOGS_ACTIONS.GET_LOGS),
            switchMap((action: CustomActions) => {
                return this.logService.GetAuditLogs(action.payload.request, action.payload.page).pipe(
                    map((r) => this.validateResponse<LogsResponse, LogsRequest>(r, {
                        type: AUDIT_LOGS_ACTIONS.GET_LOGS_RESPONSE,
                        payload: r
                    }, true, {
                        type: AUDIT_LOGS_ACTIONS.GET_LOGS_RESPONSE,
                        payload: r
                    })));
            })));

    public LoadMore$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS),
            switchMap((action: CustomActions) => {
                return this.logService.GetAuditLogs(action.payload.request, action.payload.page).pipe(
                    map((r) => this.validateResponse<LogsResponse, LogsRequest>(r, {
                        type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS_RESPONSE,
                        payload: r
                    }, true, {
                        type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS_RESPONSE,
                        payload: r
                    })));
            })));


    public getAuditLogs$: Observable<Action> = createEffect(() => this.action$
        .pipe(ofType(AUDIT_LOGS_ACTIONS_V2.GET_LOGS_REQUEST),
            switchMap((action: CustomActions) => {
                return this.logService.getAuditLogs(action.payload).pipe(
                    map((response) => this.validateResponse<AuditLogsResponse, GetAuditLogsRequest>(response, {
                        type: AUDIT_LOGS_ACTIONS_V2.GET_LOGS_RESPONSE_V2,
                        payload: response
                    }, true, {
                        type: AUDIT_LOGS_ACTIONS_V2.GET_LOGS_RESPONSE_V2,
                        payload: response
                    })));
            })));


    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private logService: LogsService) {
    }

    public GetLogs(request: LogsRequest, page: number): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS.GET_LOGS,
            payload: { request, page }
        };
    }

    public LoadMoreLogs(request: LogsRequest, page: number): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS,
            payload: { request, page }
        };
    }

    public ResetLogs(): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS.AUDIT_LOGS_RESET
        };
    }

    /**
     * Action to get new audit logs
     *
     * @param {GetAuditLogsRequest} request to get audit logs request object
     * @returns {CustomActions}
     * @memberof AuditLogsActions
     */
    public getAuditLogs(request: GetAuditLogsRequest): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS_V2.GET_LOGS_REQUEST,
            payload: request
        };
    }
    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
