import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { CustomActions } from '../../store/customActions';
import { ToasterService } from '../../services/toaster.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { DaybookService } from '../../services/daybook.service';
import { DayBookRequestModel, DaybookQueryRequest } from '../../models/api-models/DaybookRequest';
import { DayBookResponseModel } from '../../models/api-models/Daybook';

@Injectable()
export class DaybookActions {

  public static readonly GET_DAYBOOK_REQUEST = 'GET_DAYBOOK_REQUEST';
  public static readonly GET_DAYBOOK_RESPONSE = 'GET_DAYBOOK_RESPONSE';

  @Effect() private GetDaybook$: Observable<Action> = this.action$
    .ofType(DaybookActions.GET_DAYBOOK_REQUEST)
    .switchMap((action: CustomActions) => {
      return this._daybookService.GetDaybook(action.payload.request, action.payload.queryRequest)
        .map((r) => this.validateResponse<DayBookResponseModel, DayBookRequestModel>(r, {
          type: DaybookActions.GET_DAYBOOK_RESPONSE,
          payload: r.body
        }, true, {
            type: DaybookActions.GET_DAYBOOK_RESPONSE,
            payload: null
          }));
    });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private _daybookService: DaybookService) {
  }

  public GetDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): CustomActions {
    return {
      type: DaybookActions.GET_DAYBOOK_REQUEST,
      payload: { request, queryRequest }
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
