/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../toaster.service';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { PermissionRequest, PermissionResponse } from '../../models/api-models/Permission';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { PermissionService } from "../permission.service";

@Injectable()
export class PermissionActions {
    public static readonly PERMISSION_REQUEST = 'PERMISSION_REQUEST';
    public static readonly PERMISSION_RESPONSE = 'PERMISSION_RESPONSE';
    @Effect() private Search$: Observable<Action> = this.action$
        .ofType(PermissionActions.PERMISSION_REQUEST)
        .switchMap(action => {
            return this._permissionServcice.GetAllRoles(action.payload)
                .map((r) => this.validateResponse<PermissionRequest, PermissionResponse[]>(r, {
                    type: PermissionActions.PERMISSION_RESPONSE,
                    payload: r.body
                }, true, {
                        type: PermissionActions.PERMISSION_RESPONSE,
                        payload: []
                    }));
        });

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _permissionServcice: PermissionService
    ) {
    }

    // public getAllRoles(request: PermissionRequest): Action {
    //     return {
    //         type: PermissionActions.PERMISSION_REQUEST,
    //         payload: request
    //     };
    // }

    public getAllRoles(request: any): Action {
        return {
            type: PermissionActions.PERMISSION_REQUEST,
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
