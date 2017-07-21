/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { SearchService } from '../search.service';
import { SearchRequest, SearchResponse } from '../../models/api-models/Search';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';

@Injectable()
export class SearchActions {
  public static readonly SEARCH_REQUEST = 'SEARCH_REQUEST';
  public static readonly SEARCH_RESPONSE = 'SEARCH_RESPONSE';
  public static readonly SET_DIRTY_SEARCH_FORM = 'SET_DIRTY_SEARCH_FORM';

  @Effect() private Search$: Observable<Action> = this.action$
    .ofType(SearchActions.SEARCH_REQUEST)
    .switchMap(action => {
      return this._searchService.Search(action.payload)
        .map((r) => this.validateResponse<SearchRequest, SearchResponse[]>(r, {
          type: SearchActions.SEARCH_RESPONSE,
          payload: r.body
        }, true, {
            type: SearchActions.SEARCH_RESPONSE,
            payload: []
          }));
    });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _searchService: SearchService) {
  }

  public GetStocksReport(request: SearchRequest): Action {
    return {
      type: SearchActions.SEARCH_REQUEST,
      payload: request
    };
  }

  public SetDirtySearchForm(): Action {
    return {
      type: SearchActions.SET_DIRTY_SEARCH_FORM
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.message);
      }
    }
    return successAction;
  }
}
