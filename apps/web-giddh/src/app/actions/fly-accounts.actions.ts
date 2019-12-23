import { map, switchMap } from 'rxjs/operators';
import { FlattenGroupsAccountsResponse } from '../models/api-models/Group';
/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { AppState } from '../store/roots';
import { GroupService } from '../services/group.service';
import { CustomActions } from '../store/customActions';

@Injectable()
export class FlyAccountsActions {
    public static readonly GET_FLAT_ACCOUNT_W_GROUP_REQUEST = 'GET_FLAT_ACCOUNT_W_GROUP_REQUEST';
    public static readonly GET_FLAT_ACCOUNT_W_GROUP_RESPONSE = 'GET_FLAT_ACCOUNT_W_GROUP_RESPONSE';
    public static readonly RESET_FLAT_ACCOUNT_W_GROUP = 'RESET_FLAT_ACCOUNT_W_GROUP';
    @Effect() private Search$: Observable<Action> = this.action$
        .ofType(FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_REQUEST).pipe(
            switchMap((action: CustomActions) => {
                return this._groupService.GetFlattenGroupsAccounts(action.payload.q, action.payload.page, action.payload.count, action.payload.showEmptyGroups).pipe(
                    map((r) => this.validateResponse<FlattenGroupsAccountsResponse, string>(r, {
                        type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_RESPONSE,
                        payload: r.body
                    }, true, {
                        type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_RESPONSE,
                        payload: []
                    })));
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _groupService: GroupService) {
    }

    public GetflatAccountWGroups(q: string = '', page: number = 1, count: number = 20000, showEmptyGroups: string = 'false'): CustomActions {
        return {
            type: FlyAccountsActions.GET_FLAT_ACCOUNT_W_GROUP_REQUEST,
            payload: {
                q, page, count, showEmptyGroups
            }
        };
    }

    public ResetflatAccountWGroups(): CustomActions {
        return {
            type: FlyAccountsActions.RESET_FLAT_ACCOUNT_W_GROUP
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
