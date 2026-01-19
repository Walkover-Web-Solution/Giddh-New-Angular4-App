import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchService } from '../services/search.service';
import { SearchRequest } from '../models/api-models/Search';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CustomActions } from '../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SearchActions actions
 * Defines search related action creators for state management
 */
export class SearchActions {
    public static readonly SEARCH_REQUEST = 'SEARCH_REQUEST';
    public static readonly SEARCH_RESPONSE = 'SEARCH_RESPONSE';
    public static readonly RESET_SEARCH_STATE = 'RESET_SEARCH_STATE';

    private Search$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SearchActions.SEARCH_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._searchService.Search(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse<any, SearchRequest>(r, {
                        type: SearchActions.SEARCH_RESPONSE,
                        payload: r
                    }, true, {
                        type: SearchActions.SEARCH_RESPONSE,
                        payload: r
                    })));
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions, private _toasty: ToasterService, private _searchService: SearchService) {
    }

    /**
     * Handles GetStocksReport functionality
     */
    public GetStocksReport(request: SearchRequest, searchReqBody: any): CustomActions {
        return {
            type: SearchActions.SEARCH_REQUEST,
            payload: { request, searchReqBody }
        };
    }

    /**
     * Handles ResetSearchState functionality
     */
    public ResetSearchState(): CustomActions {
        return {
            type: SearchActions.RESET_SEARCH_STATE
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
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response?.body === 'string') {
                this._toasty.successToast(response.message);
            }
        }
        return successAction;
    }
}
