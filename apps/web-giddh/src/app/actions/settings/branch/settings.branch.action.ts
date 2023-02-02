import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SETTINGS_BRANCH_ACTIONS } from './settings.branch.const';
import { CustomActions } from '../../../store/customActions';
import { SettingsBranchService } from '../../../services/settings.branch.service';
import { BranchFilterRequest } from '../../../models/api-models/Company';

@Injectable()
export class SettingsBranchActions {

    public GetAllBranches$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES),
            switchMap((action: CustomActions) => this.settingsBranchService.GetAllBranches(action.payload)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            }))));

    public UpdateProfile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES),
            switchMap((action: CustomActions) => {
                return this.settingsBranchService.CreateBranches(action.payload).pipe(
                    map(response => this.CreateBranchesResponse(response)));
            })));

    public UpdateProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
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
            ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH),
            switchMap((action: CustomActions) => this.settingsBranchService.RemoveBranch(action.payload)),
            map(response => this.RemoveBranchResponse(response))));

    public RemoveBranchResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
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

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private settingsBranchService: SettingsBranchService) {
    }

    public GetALLBranches(request: BranchFilterRequest): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES,
            payload: request
        };
    }

    public CreateBranches(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES,
            payload: value
        };
    }

    public CreateBranchesResponse(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE,
            payload: value
        };
    }

    public RemoveBranch(branchUniqueName: string): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH,
            payload: branchUniqueName
        };
    }

    public RemoveBranchResponse(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE,
            payload: value
        };
    }

    public ResetBranchRemoveResponse(): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.RESET_REMOVED_BRANCH_RESPONSE
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response?.status === 'error') {
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
