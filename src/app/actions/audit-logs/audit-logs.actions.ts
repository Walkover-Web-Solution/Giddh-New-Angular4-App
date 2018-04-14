import { BaseResponse } from '../../models/api-models/BaseResponse';
import { LogsService } from '../../services/logs.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store/roots';
import { LogsResponse, LogsRequest } from '../../models/api-models/Logs';
/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AUDIT_LOGS_ACTIONS } from './audit-logs.const';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class AuditLogsActions {
  @Effect() private GET_LOGS$: Observable<Action> = this.action$
    .ofType(AUDIT_LOGS_ACTIONS.GET_LOGS)
    .switchMap((action: CustomActions) => {
      return this._logService.GetAuditLogs(action.payload.request, action.payload.page)
        .map((r) => this.validateResponse<LogsResponse, LogsRequest>(r, {
          type: AUDIT_LOGS_ACTIONS.GET_LOGS_RESPONSE,
          payload: r
        }, true, {
            type: AUDIT_LOGS_ACTIONS.GET_LOGS_RESPONSE,
            payload: r
          }));
    });

  @Effect() private LoadMore$: Observable<Action> = this.action$
    .ofType(AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS)
    .switchMap((action: CustomActions) => {
      return this._logService.GetAuditLogs(action.payload.request, action.payload.page)
        .map((r) => this.validateResponse<LogsResponse, LogsRequest>(r, {
          type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS_RESPONSE,
          payload: r
        }, true, {
            type: AUDIT_LOGS_ACTIONS.LOAD_MORE_LOGS_RESPONSE,
            payload: r
          }));
    });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _logService: LogsService) {
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
