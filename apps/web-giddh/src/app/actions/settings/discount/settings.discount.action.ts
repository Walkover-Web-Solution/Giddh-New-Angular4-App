import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { CustomActions } from '../../../store/customActions';
import { SETTINGS_DISCOUNT_ACTIONS } from './settings.discount.const';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { CreateDiscountRequest, IDiscountList } from '../../../models/api-models/SettingsDiscount';

@Injectable()
export class SettingsDiscountActions {

    @Effect()
    public GetDiscount$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsDiscountService.GetDiscounts().pipe(
                    map(response => this.validateResponse<IDiscountList[], string>(response, {
                        type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT_RESPONSE,
                        payload: response.body
                    }, true, {
                        type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT_RESPONSE,
                        payload: []
                    })));
            }));

    @Effect()
    public CreateDiscount$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsDiscountService.CreateDiscount(action.payload).pipe(
                    map(response => this.CreateDiscountResponse(response)));
            }));

    @Effect()
    public CreateDiscountResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Discount Created Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateDiscount$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsDiscountService.UpdateDiscount(action.payload.modal, action.payload.uniqueName).pipe(
                    map(response => this.UpdateDiscountResponse(response)));
            }));

    @Effect()
    public UpdateDiscountResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Discount Updated Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public DeleteDiscount$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsDiscountService.DeleteDiscount(action.payload).pipe(
                    map(response => this.DeleteDiscountResponse(response)));
            }));

    @Effect()
    public DeleteDiscountResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Discount Deleted Successfully.');
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private settingsDiscountService: SettingsDiscountService) {
    }

    public GetDiscount(): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT,
        };
    }

    public CreateDiscount(value: CreateDiscountRequest): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT,
            payload: value
        };
    }

    public CreateDiscountResponse(value: BaseResponse<IDiscountList, CreateDiscountRequest>): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT_RESPONSE,
            payload: value
        };
    }

    public UpdateDiscount(modal: CreateDiscountRequest, uniqueName: string): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT,
            payload: { modal, uniqueName }
        };
    }

    public UpdateDiscountResponse(value: BaseResponse<IDiscountList, CreateDiscountRequest>): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT_RESPONSE,
            payload: value
        };
    }

    public DeleteDiscount(value: string): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT,
            payload: value
        };
    }

    public DeleteDiscountResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT_RESPONSE,
            payload: value.status === 'success' ? value.request : ''
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
