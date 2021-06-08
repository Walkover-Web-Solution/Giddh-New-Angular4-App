import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SETTINGS_TRIGGERS_ACTIONS } from './settings.triggers.const';
import { SettingsTriggersService } from '../../../services/settings.triggers.service';
import { CustomActions } from '../../../store/customActions';
import { LocaleService } from '../../../services/locale.service';

@Injectable()
export class SettingsTriggersActions {


    public CreateTrigger$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS),
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.CreateTrigger(action.payload).pipe(
                    map(response => this.CreateTriggerResponse(response)));
            })));


    public CreateTriggerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.CREATE_TRIGGERS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.trigger_created"));
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            })));


    public UpdateTrigger$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS),
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.UpdateTrigger(action.payload, action.payload.uniqueName).pipe(
                    map(response => this.UpdateTriggerResponse(response)));
            })));


    public UpdateTriggerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.UPDATE_TRIGGERS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.trigger_updated"));
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            })));


    public DeleteTrigger$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS),
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.DeleteTrigger(action.payload).pipe(
                    map(response => this.DeleteTriggerResponse(response)));
            })));


    public DeleteTriggerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.DELETE_TRIGGERS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.trigger_deleted"));
                    return this.GetTriggers();
                }
                return { type: 'EmptyAction' };
            })));


    public GetTrigger$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS),
            switchMap((action: CustomActions) => {
                return this.settingsTriggersService.GetTriggers().pipe(
                    map(response => this.GetTriggerResponse(response)));
            })));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
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
