import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchService } from '../services/search.service';
import { SearchRequest } from '../models/api-models/Search';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CustomActions } from '../store/customActions';

@Injectable()
export class SearchActions {
    public static readonly SEARCH_REQUEST = 'SEARCH_REQUEST';
    public static readonly SEARCH_RESPONSE = 'SEARCH_RESPONSE';
    public static readonly RESET_SEARCH_STATE = 'RESET_SEARCH_STATE';

    private Search$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SearchActions.SEARCH_REQUEST),
            switchMap((action: CustomActions) => {
                return this._searchService.Search(action.payload).pipe(
                    map((r) => this.validateResponse<any, SearchRequest>(r, {
                        type: SearchActions.SEARCH_RESPONSE,
                        payload: r
                    }, true, {
                        type: SearchActions.SEARCH_RESPONSE,
                        payload: r
                    })));
            })));

    constructor(private action$: Actions, private _toasty: ToasterService, private _searchService: SearchService) {
    }

    public GetStocksReport(request: SearchRequest, searchReqBody: any): CustomActions {
        return {
            type: SearchActions.SEARCH_REQUEST,
            payload: { request, searchReqBody }
        };
    }

    public ResetSearchState(): CustomActions {
        return {
            type: SearchActions.RESET_SEARCH_STATE
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response?.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response?.body === 'string') {
                this._toasty.successToast(response.message);
            }
        }
        return successAction;
    }
}
