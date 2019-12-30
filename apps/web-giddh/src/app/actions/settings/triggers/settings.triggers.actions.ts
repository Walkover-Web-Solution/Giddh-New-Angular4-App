import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_TRIGGERS_ACTIONS } from './settings.triggers.const';
import { SettingsTriggersService } from '../../../services/settings.triggers.service';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class SettingsTriggersActions {

    @Effect()
    public CreateTrigger$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.CreateTrigger(action.payload).pipe(
                    map(response => this.CreateTriggerResponse(response)));
            }));

    @Effect()
    public CreateTriggerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Trigger Created Successfully.');
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateTrigger$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.UpdateTrigger(action.payload, action.payload.uniqueName).pipe(
                    map(response => this.UpdateTriggerResponse(response)));
            }));

    @Effect()
    public UpdateTriggerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Trigger Updated Successfully.');
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public DeleteTrigger$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.DeleteTrigger(action.payload).pipe(
                    map(response => this.DeleteTriggerResponse(response)));
            }));

    @Effect()
    public DeleteTriggerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Trigger Deleted Successfully.');
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetTrigger$: Observable<Action> = this.action$
        .ofType(SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.GetTriggers().pipe(
                    map(response => this.GetTriggerResponse(response)));
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private settingsTriggersService: SettingsTriggersService) {
    }

    public GetTriggers() {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS
        };
    }

    public GetTriggerResponse(res) {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS_RESPONSE,
            payload: res
        };
    }

    public CreateTrigger(value): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS,
            payload: value
        };
    }

    public CreateTriggerResponse(value): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS_RESPONSE,
            payload: value
        };
    }

    public UpdateTrigger(value): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS,
            payload: value
        };
    }

    public UpdateTriggerResponse(value): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS_RESPONSE,
            payload: value
        };
    }

    public DeleteTrigger(value: string): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS,
            payload: value
        };
    }

    public DeleteTriggerResponse(value): CustomActions {
        return {
            type: SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS_RESPONSE,
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
