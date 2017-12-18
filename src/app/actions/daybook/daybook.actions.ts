import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { CustomActions } from 'app/store/customActions';
import { ToasterService } from 'app/services/toaster.service';
import { BaseResponse } from 'app/models/api-models/BaseResponse';
import { DaybookService } from 'app/services/daybook.service';
import { DayBookRequestModel } from 'app/models/api-models/DaybookRequest';
import { DayBookResponseModel } from 'app/models/api-models/Daybook';

@Injectable()
export class DaybookActions {

  public static readonly GET_DAYBOOK_REQUEST = 'GET_DAYBOOK_REQUEST';
  public static readonly GET_DAYBOOK_RESPONSE = 'GET_DAYBOOK_RESPONSE';

  @Effect() private GetDaybook$: Observable<Action> = this.action$
    .ofType(DaybookActions.GET_DAYBOOK_REQUEST)
    .switchMap((action: CustomActions) => {
      debugger;
      return this._daybookService.GetDaybook(action.payload, action.payload.fromDate, action.payload.toDate)
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

  public GetDaybook(request: DayBookRequestModel, fromDate: string, toDate: string): CustomActions {
    return {
      type: DaybookActions.GET_DAYBOOK_REQUEST,
      payload: { request, fromDate, toDate }
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
