import { map, switchMap } from 'rxjs/operators';
import { SettingsPermissionService } from '../../../services/settings.permission.service';
import { SETTINGS_PERMISSION_ACTIONS } from './settings.permissions.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class SettingsPermissionActions {

    @Effect()
    public GetUsersWithPermissions$: Observable<Action> = this.action$
        .ofType(SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsPermissionService.GetUsersWithCompanyPermissions(action.payload).pipe(
                    map(response => this.GetUsersWithPermissionsResponse(response)));
            }));

    @Effect()
    private GetUsersWithPermissionsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private settingsPermissionService: SettingsPermissionService) {
    }

    public GetUsersWithPermissions(companyUniqueName: string): CustomActions {
        return {
            type: SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS,
            payload: companyUniqueName
        };
    }

    public GetUsersWithPermissionsResponse(response): CustomActions {
        return {
            type: SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE,
            payload: response
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this.toasty.successToast(response.body);
            }
        }
        return successAction;
    }

}
