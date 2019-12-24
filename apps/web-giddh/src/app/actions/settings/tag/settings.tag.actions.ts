import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_TAG_ACTIONS } from './settings.tag.const';
import { CustomActions } from '../../../store/customActions';
import { SettingsTagService } from '../../../services/settings.tag.service';
import { TagRequest } from '../../../models/api-models/settingsTags';

@Injectable()
export class SettingsTagActions {

    @Effect()
    public GetAllTags$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.GET_ALL_TAGS).pipe(
            switchMap((action: CustomActions) => this.settingsTagService.GetAllTags()),
            map((res) => {
                return { type: SETTINGS_TAG_ACTIONS.GET_ALL_TAGS_RESPONSE, payload: res };
            }));

    @Effect({ dispatch: false })
    public GetAllTagsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.GET_ALL_TAGS_RESPONSE).pipe(
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public CreateTag$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.CREATE_TAG).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTagService.CreateTag(action.payload).pipe(
                    map(response => this.CreateTagResponse(response)));
            }));

    @Effect()
    public CreateTagResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.CREATE_TAG_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Tag created successfully.', 'Success');
                }
                return this.GetALLTags();
            }));

    @Effect()
    public UpdateTag$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.UPDATE_TAG).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTagService.UpdateTag(action.payload).pipe(
                    map(response => this.UpdateTagResponse(response)));
            }));

    @Effect()
    public UpdateTagResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.UPDATE_TAG_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Tag updated successfully.', 'Success');
                }
                return this.GetALLTags();
            }));

    @Effect()
    public DeleteTag$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.DELETE_TAG).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTagService.DeleteTag(action.payload).pipe(
                    map(response => this.DeleteTagResponse(response)));
            }));

    @Effect()
    public DeleteTagResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TAG_ACTIONS.DELETE_TAG_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Tag deleted successfully.', 'Success');
                }
                return this.GetALLTags();
            }));

    // @Effect()
    // public RemoveBranch$: Observable<Action> = this.action$
    //   .ofType(SETTINGS_TAG_ACTIONS.REMOVE_BRANCH)
    //   .switchMap((action: CustomActions) => this.settingsTagService.RemoveBranch(action.payload))
    //   .map(response => this.CreateBranchesResponse(response));

    // @Effect()
    // public RemoveBranchResponse$: Observable<Action> = this.action$
    //   .ofType(SETTINGS_TAG_ACTIONS.REMOVE_BRANCH_RESPONSE)
    //   .map((response: CustomActions) => {
    //     let data: BaseResponse<any, any> = response.payload;
    //     if (data.status === 'error') {
    //       this.toasty.errorToast(data.message, data.code);
    //     } else {
    //       this.toasty.successToast(data.body);
    //     }
    //     return this.GetALLBranches();
    //   });

    // @Effect()
    // public GetParentCompany$: Observable<Action> = this.action$
    //   .ofType(SETTINGS_TAG_ACTIONS.GET_PARENT_COMPANY)
    //   .switchMap((action: CustomActions) => this.settingsTagService.GetParentCompany())
    //   .map(response => this.GetParentCompanyResponse(response));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private settingsTagService: SettingsTagService) {
    }

    public GetALLTags(): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.GET_ALL_TAGS
        };
    }

    public CreateTag(value: TagRequest): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.CREATE_TAG,
            payload: value
        };
    }

    public CreateTagResponse(value: BaseResponse<TagRequest, TagRequest>): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.CREATE_TAG_RESPONSE,
            payload: value
        };
    }

    public UpdateTag(value: TagRequest): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.UPDATE_TAG,
            payload: value
        };
    }

    public UpdateTagResponse(value: BaseResponse<TagRequest, TagRequest>): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.UPDATE_TAG_RESPONSE,
            payload: value
        };
    }

    public DeleteTag(value: TagRequest): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.DELETE_TAG,
            payload: value
        };
    }

    public DeleteTagResponse(value: BaseResponse<TagRequest, TagRequest>): CustomActions {
        return {
            type: SETTINGS_TAG_ACTIONS.DELETE_TAG_RESPONSE,
            payload: value
        };
    }

    // public RemoveBranch(branchUniqueName: string): CustomActions {
    //   return {
    //     type: SETTINGS_TAG_ACTIONS.REMOVE_BRANCH,
    //     payload: branchUniqueName
    //   };
    // }

    // public RemoveBranchResponse(value): CustomActions {
    //   return {
    //     type: SETTINGS_TAG_ACTIONS.REMOVE_BRANCH_RESPONSE,
    //     payload: value
    //   };
    // }

    // public GetParentCompany(): CustomActions {
    //   return {
    //     type: SETTINGS_TAG_ACTIONS.GET_PARENT_COMPANY
    //   };
    // }

    // public GetParentCompanyResponse(value): CustomActions {
    //   return {
    //     type: SETTINGS_TAG_ACTIONS.GET_PARENT_COMPANY_RESPONSE,
    //     payload: value
    //   };
    // }

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
