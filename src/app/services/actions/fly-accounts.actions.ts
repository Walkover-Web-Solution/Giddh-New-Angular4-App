/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { SearchRequest, SearchResponse } from '../../models/api-models/Search';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { GroupService } from '../group.service';

@Injectable()
export class FlyAccountsActions {
  public static readonly GET_FLAT_ACCOUNT_W_GROUP_REQUEST = 'GET_FLAT_ACCOUNT_W_GROUP_REQUEST';
  public static readonly GET_FLAT_ACCOUNT_W_GROUP_RESPONSE = 'GET_FLAT_ACCOUNT_W_GROUP_RESPONSE';
  @Effect() private Search$: Observable<Action> = this.action$
    .ofType(FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_REQUEST)
    .switchMap(action => {
      return this._groupService.GetFlattenGroupsAccounts()
        .map((r) => this.validateResponse<SearchRequest, SearchResponse[]>(r, {
          type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_RESPONSE,
          payload: r.body
        }, true, {
          type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_RESPONSE,
          payload: []
        }));
    });

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private _groupService: GroupService) {
  }

  public GetflatAccountWGroups(request: SearchRequest): Action {
    return {
      type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_REQUEST,
      payload: request
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
