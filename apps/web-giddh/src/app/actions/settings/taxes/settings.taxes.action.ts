import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { LocaleService } from '../../../services/locale.service';
import { SettingsTaxesService } from '../../../services/settings.taxes.service';
import { ToasterService } from '../../../services/toaster.service';
import { CustomActions } from '../../../store/custom-actions';
import { AppState } from '../../../store/roots';
import { GeneralActions } from '../../general/general.actions';
import { SETTINGS_TAXES_ACTIONS } from './settings.taxes.const';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsTaxesActions class
 * Implements SettingsTaxesActions functionality
 */
export class SettingsTaxesActions {

    public CreateTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.CreateTax(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.CreateTaxResponse(response)));
            })));

    public CreateTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data) {
                    /**
                     * Handles if functionality
                     */
                    if (data?.status === 'error') {
                        this.toasty.errorToast(data.message, data.code);
                    } else {
                        this.toasty.successToast(this.localeService.translate("app_messages.tax_created"));
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.UpdateTax(action.payload, action.payload?.uniqueName).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.UpdateTaxResponse(response)));
            })));

    public UpdateTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE),
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
                    this.toasty.successToast(this.localeService.translate("app_messages.tax_updated"));
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.DeleteTax(action.payload?.value).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(resp => {
                        /**
                         * Handles if functionality
                         */
                        if (action.payload.linkedAccount) {
                            this.store.dispatch(this.generalActions.updateCurrentLiabilities(action.payload.linkedAccount));
                        }
                    }),
                    /**
                     * Handles map functionality
                     */
                    map(response => this.DeleteTaxResponse(response)));
            })));

    public DeleteTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE),
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
                    this.toasty.successToast(this.localeService.translate("app_messages.tax_deleted"));
                }
                return { type: 'EmptyAction' };
            })));

    public getTaxList$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_TAXES_ACTIONS.GET_TAX),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsTaxesService.getTaxList(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.GetTaxListResponse(response)));
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private generalActions: GeneralActions,
        private settingsTaxesService: SettingsTaxesService) {
    }

    /**
     * Handles CreateTax functionality
     */
    public CreateTax(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.CREATE_TAX,
            payload: value
        };
    }

    /**
     * Handles CreateTaxResponse functionality
     */
    public CreateTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles UpdateTax functionality
     */
    public UpdateTax(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX,
            payload: value
        };
    }

    /**
     * Handles UpdateTaxResponse functionality
     */
    public UpdateTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles DeleteTax functionality
     */
    public DeleteTax(value: string, linkedAccountUniqueName: string = null): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.DELETE_TAX,
            payload: {
                value,
                linkedAccount: linkedAccountUniqueName
            },
        };
    }

    /**
     * Handles DeleteTaxResponse functionality
     */
    public DeleteTaxResponse(value): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE,
            payload: value
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
     * Retrieves taxlist data
     */
    public getTaxList(value: any): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.GET_TAX,
            payload: value
        };
    }

    /**
     * Resets taxlist to default state
     */
    public resetTaxList(): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.RESET_TAX_RESPONSE
        };
    }

    /**
     * Handles GetTaxListResponse functionality
     */
    public GetTaxListResponse(value) {
        return {
            type: SETTINGS_TAXES_ACTIONS.GET_TAX_RESPONSE,
            payload: value
        };
    }
}
