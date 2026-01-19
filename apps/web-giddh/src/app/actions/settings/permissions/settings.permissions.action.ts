import { map, switchMap } from 'rxjs/operators';
import { SettingsPermissionService } from '../../../services/settings.permission.service';
import { ActionResponseValidatorHelper } from '../helpers/action-response-validator.helper';
import { SETTINGS_PERMISSION_ACTIONS } from './settings.permissions.const';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { CustomActions } from '../../../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsPermissionActions class
 * Implements SettingsPermissionActions functionality
 */
export class SettingsPermissionActions {

    public GetUsersWithPermissions$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsPermissionService.GetUsersWithCompanyPermissions(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.GetUsersWithPermissionsResponse(response)));
            })));

    public GetUsersWithPermissionsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private settingsPermissionService: SettingsPermissionService) {
    }

    /**
     * Handles GetUsersWithPermissions functionality
     */
    public GetUsersWithPermissions(companyUniqueName: string): CustomActions {
        return {
            type: SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS,
            payload: companyUniqueName
        };
    }

    /**
     * Handles GetUsersWithPermissionsResponse functionality
     */
    public GetUsersWithPermissionsResponse(response): CustomActions {
        return {
            type: SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE,
            payload: response
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        return ActionResponseValidatorHelper.validateResponse(response, successAction, this.toasty, showToast, errorAction);
    }

}
