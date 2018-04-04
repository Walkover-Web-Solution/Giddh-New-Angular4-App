import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyActions } from '../../company.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_BRANCH_ACTIONS } from './settings.branch.const';
import { CustomActions } from '../../../store/customActions';
import { SettingsBranchService } from '../../../services/settings.branch.service';

@Injectable()
export class SettingsBranchActions {

  @Effect()
  public GetAllBranches$: Observable<Action> = this.action$
    .ofType(SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES)
    .switchMap((action: CustomActions) => this.settingsBranchService.GetAllBranches())
    .map(res => this.validateResponse<any, string>(res, {
      type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE,
        payload: res
      }));

  @Effect()
  public UpdateProfile$: Observable<Action> = this.action$
    .ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES)
    .switchMap((action: CustomActions) => {
      return this.settingsBranchService.CreateBranches(action.payload)
        .map(response => this.CreateBranchesResponse(response));
    });

  @Effect()
  public UpdateProfileResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_BRANCH_ACTIONS.CREATE_BRANCHES_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.body);
      }
      return this.GetALLBranches();
    });

    @Effect()
    public RemoveBranch$: Observable<Action> = this.action$
      .ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH)
      .switchMap((action: CustomActions) => this.settingsBranchService.RemoveBranch(action.payload))
      .map(response => this.CreateBranchesResponse(response));

    @Effect()
    public RemoveBranchResponse$: Observable<Action> = this.action$
      .ofType(SETTINGS_BRANCH_ACTIONS.REMOVE_BRANCH_RESPONSE)
      .map((response: CustomActions) => {
        let data: BaseResponse<any, any> = response.payload;
        if (data.status === 'error') {
          this.toasty.errorToast(data.message, data.code);
        } else {
          this.toasty.successToast(data.body);
        }
        return this.GetALLBranches();
      });

    @Effect()
    public GetParentCompany$: Observable<Action> = this.action$
      .ofType(SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY)
      .switchMap((action: CustomActions) => this.settingsBranchService.GetParentCompany())
      .map(response => this.GetParentCompanyResponse(response));

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsBranchService: SettingsBranchService) {
  }

  public GetALLBranches(): CustomActions {
    return {
      type: SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES
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
