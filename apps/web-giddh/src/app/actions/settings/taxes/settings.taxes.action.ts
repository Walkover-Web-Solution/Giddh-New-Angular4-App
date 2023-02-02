import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { LocaleService } from '../../../services/locale.service';
import { SettingsTaxesService } from '../../../services/settings.taxes.service';
import { ToasterService } from '../../../services/toaster.service';
import { CustomActions } from '../../../store/customActions';
import { AppState } from '../../../store/roots';
import { GeneralActions } from '../../general/general.actions';
import { SETTINGS_TAXES_ACTIONS } from './settings.taxes.const';

@Injectable()
export class SettingsTaxesActions {

    public CreateTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX),
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.CreateTax(action.payload).pipe(
                    map(response => this.CreateTaxResponse(response)));
            })));

    public CreateTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.tax_created"));
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX),
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.UpdateTax(action.payload, action.payload?.uniqueName).pipe(
                    map(response => this.UpdateTaxResponse(response)));
            })));

    public UpdateTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.tax_updated"));
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX),
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.DeleteTax(action.payload?.value).pipe(
                    tap(resp => {
                        if (action.payload.linkedAccount) {
                            this.store.dispatch(this.generalActions.updateCurrentLiabilities(action.payload.linkedAccount));
                        }
                    }),
                    map(response => this.DeleteTaxResponse(response)));
            })));

    public DeleteTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.tax_deleted"));
                }
                return { type: 'EmptyAction' };
            })));

    public GetTaxList$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.GET_TAX),
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.GetTaxList(action.payload).pipe(
                    map(response => this.GetTaxListResponse(response)));
            })));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private generalActions: GeneralActions,
        private settingsTaxesService: SettingsTaxesService) {
    }

    public CreateTax(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.CREATE_TAX,
            payload: value
        };
    }

    public CreateTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE,
            payload: value
        };
    }

    public UpdateTax(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX,
            payload: value
        };
    }

    public UpdateTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE,
            payload: value
        };
    }

    public DeleteTax(value: string, linkedAccountUniqueName: string = null): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.DELETE_TAX,
            payload: {
                value,
                linkedAccount: linkedAccountUniqueName
            },
        };
    }

    public DeleteTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE,
            payload: value
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

    public GetTaxList(value) {
        return {
            type: SETTINGS_TAXES_ACTIONS.GET_TAX,
            payload: value
        };
    }

    public GetTaxListResponse(value) {
        return {
            type: SETTINGS_TAXES_ACTIONS.GET_TAX_RESPONSE,
            payload: value
        };
    }

    public resetTaxList(): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.RESET_TAX_RESPONSE
        };
    }
}
