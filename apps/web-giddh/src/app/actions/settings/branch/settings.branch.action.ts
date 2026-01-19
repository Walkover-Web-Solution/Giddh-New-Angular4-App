import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SETTINGS_BRANCH_ACTIONS } from './settings.branch.const';
import { CustomActions } from '../../../store/custom-actions';
import { SettingsBranchService } from '../../../services/settings.branch.service';
import { BranchFilterRequest } from '../../../models/api-models/Company';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsBranchActions class
 * Implements SettingsBranchActions functionality
 */
export class SettingsBranchActions {

    public GetAllBranches$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsBranchService.GetAllBranches(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            }))));

    public UpdateProfile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsBranchService.CreateBranches(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.CreateBranchesResponse(response)));
            })));

    public UpdateProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE),
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
                } else {
                    this.toasty.successToast(data.body);
                }
                let branchFilterRequest = new BranchFilterRequest();
                return this.GetALLBranches(branchFilterRequest);
            })));

    public RemoveBranch$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsBranchService.RemoveBranch(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.RemoveBranchResponse(response))));

    public RemoveBranchResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE),
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
                } else {
                    this.toasty.successToast(data.body);
                }
                return {
                    type: SETTINGS_BRANCH_ACTIONS.REMOVED_BRANCH_RESPONSE,
                    payload: true
                };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private settingsBranchService: SettingsBranchService) {
    }

    /**
     * Handles GetALLBranches functionality
     */
    public GetALLBranches(request: BranchFilterRequest): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES,
            payload: request
        };
    }

    /**
     * Handles CreateBranches functionality
     */
    public CreateBranches(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES,
            payload: value
        };
    }

    /**
     * Handles CreateBranchesResponse functionality
     */
    public CreateBranchesResponse(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles RemoveBranch functionality
     */
    public RemoveBranch(branchUniqueName: string): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH,
            payload: branchUniqueName
        };
    }

    /**
     * Handles RemoveBranchResponse functionality
     */
    public RemoveBranchResponse(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles ResetBranchRemoveResponse functionality
     */
    public ResetBranchRemoveResponse(): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.RESET_REMOVED_BRANCH_RESPONSE
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response.body === 'string') {
                this.toasty.successToast(response.body);
            }
        }
        return successAction;
    }

    /**
     * This will reset the branches response
     *
     * @returns {CustomActions}
     * @memberof SettingsBranchActions
     */
    public resetAllBranches(): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.RESET_ALL_BRANCHES_RESPONSE
        };
    }
}
