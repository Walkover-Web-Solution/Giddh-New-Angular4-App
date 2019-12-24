import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_BRANCH_ACTIONS } from './settings.branch.const';
import { CustomActions } from '../../../store/customActions';
import { SettingsBranchService } from '../../../services/settings.branch.service';
import { BranchFilterRequest } from '../../../models/api-models/Company';

@Injectable()
export class SettingsBranchActions {

    @Effect()
    public GetAllBranches$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES).pipe(
            switchMap((action: CustomActions) => this.settingsBranchService.GetAllBranches(action.payload)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdateProfile$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsBranchService.CreateBranches(action.payload).pipe(
                    map(response => this.CreateBranchesResponse(response)));
            }));

    @Effect()
    public UpdateProfileResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                let branchFilterRequest = new BranchFilterRequest();
                return this.GetALLBranches(branchFilterRequest);
            }));

    @Effect()
    public RemoveBranch$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH).pipe(
            switchMap((action: CustomActions) => this.settingsBranchService.RemoveBranch(action.payload)),
            map(response => this.RemoveBranchResponse(response)));

    @Effect()
    public RemoveBranchResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return {
                    type: SETTINGS_BRANCH_ACTIONS.REMOVED_BRANCH_RESPONSE,
                    payload: true
                };
            }));

    @Effect()
    public GetParentCompany$: Observable<Action> = this.action$
        .ofType(SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY).pipe(
            switchMap((action: CustomActions) => this.settingsBranchService.GetParentCompany()),
            map(response => this.GetParentCompanyResponse(response)));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
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

    public GetParentCompany(): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY
        };
    }

    public GetParentCompanyResponse(value): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY_RESPONSE,
            payload: value
        };
    }

    public ResetBranchRemoveResponse(): CustomActions {
        return {
            type: SETTINGS_BRANCH_ACTIONS.RESET_REMOVED_BRANCH_RESPONSE
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
