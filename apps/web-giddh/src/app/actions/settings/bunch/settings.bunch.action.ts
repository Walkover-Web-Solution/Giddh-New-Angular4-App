import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_BUNCH_ACTIONS } from './settings.bunch.const';
import { CustomActions } from '../../../store/customActions';
import { SettingsBunchService } from '../../../services/settings.bunch.service';

@Injectable()
export class SettingsBunchActions {

    @Effect()
    public GetALLBunch$: Observable<Action> = this.action$
        .ofType(SETTINGS_BUNCH_ACTIONS.GET_ALL_BUNCH).pipe(
            switchMap((action: CustomActions) => this.settingsBranchService.GetAllBunches()),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_BUNCH_ACTIONS.GET_ALL_BUNCH_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_BUNCH_ACTIONS.GET_ALL_BUNCH_RESPONSE,
                payload: res
            })));

    @Effect()
    public CreateBunch$: Observable<Action> = this.action$
        .ofType(SETTINGS_BUNCH_ACTIONS.CREATE_BUNCH).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsBranchService.CreateBunch(action.payload).pipe(
                    map(response => this.CreateBunchResponse(response)));
            }));

    @Effect()
    public CreateBunchResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_BUNCH_ACTIONS.CREATE_BUNCH_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return this.GetALLBunch();
            }));

    @Effect()
    public RemoveBranch$: Observable<Action> = this.action$
        .ofType(SETTINGS_BUNCH_ACTIONS.DELETE_BUNCH).pipe(
            switchMap((action: CustomActions) => this.settingsBranchService.RemoveBunch(action.payload)),
            map(response => this.RemoveBunchResponse(response)));

    @Effect()
    public RemoveBranchResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_BUNCH_ACTIONS.DELETE_BUNCH_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body);
                }
                return this.GetALLBunch();
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private settingsBranchService: SettingsBunchService) {
    }

    public GetALLBunch(): CustomActions {
        return {
            type: SETTINGS_BUNCH_ACTIONS.GET_ALL_BUNCH
        };
    }

    public CreateBunch(value): CustomActions {
        return {
            type: SETTINGS_BUNCH_ACTIONS.CREATE_BUNCH,
            payload: value
        };
    }

    public CreateBunchResponse(value): CustomActions {
        return {
            type: SETTINGS_BUNCH_ACTIONS.CREATE_BUNCH_RESPONSE,
            payload: value
        };
    }

    public RemoveBunch(branchUniqueName: string): CustomActions {
        return {
            type: SETTINGS_BUNCH_ACTIONS.DELETE_BUNCH,
            payload: branchUniqueName
        };
    }

    public RemoveBunchResponse(value): CustomActions {
        return {
            type: SETTINGS_BUNCH_ACTIONS.DELETE_BUNCH_RESPONSE,
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
