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
import { CustomActions } from '../../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * AuditLogsActions actions
 * Defines auditlogs related action creators for state management
 */
export class AuditLogsActions {

    public GET_LOGS$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(AUDIT_LOGS_ACTIONS.GET_LOGS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.logService.GetAuditLogs(action.payload.request, action.payload.page).pipe(
                    /**
                     * Handles map functionality
                     */
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
            /**
             * Handles ofType functionality
             */
            ofType(AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.logService.GetAuditLogs(action.payload.request, action.payload.page).pipe(
                    /**
                     * Handles map functionality
                     */
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
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.logService.getAuditLogs(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((response) => this.validateResponse<AuditLogsResponse, GetAuditLogsRequest>(response, {
                        type: AUDIT_LOGS_ACTIONS_V2.GET_LOGS_RESPONSE_V2,
                        payload: response
                    }, true, {
                        type: AUDIT_LOGS_ACTIONS_V2.GET_LOGS_RESPONSE_V2,
                        payload: response
                    })));
            })));


    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private logService: LogsService) {
    }

    /**
     * Handles GetLogs functionality
     */
    public GetLogs(request: LogsRequest, page: number): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS.GET_LOGS,
            payload: { request, page }
        };
    }

    /**
     * Handles LoadMoreLogs functionality
     */
    public LoadMoreLogs(request: LogsRequest, page: number): CustomActions {
        return {
            type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS,
            payload: { request, page }
        };
    }

    /**
     * Handles ResetLogs functionality
     */
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
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
