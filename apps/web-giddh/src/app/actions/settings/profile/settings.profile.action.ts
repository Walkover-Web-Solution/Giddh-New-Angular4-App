import { map, switchMap } from 'rxjs/operators';
import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyActions } from '../../company.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { CustomActions } from '../../../store/customActions';
import { LocaleService } from '../../../services/locale.service';

@Injectable()
export class SettingsProfileActions {

    public GetSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO),
            switchMap((action: CustomActions) => this.settingsProfileService.GetProfileInfo()),
            map((res: any) => {
                return this.validateResponse<any, string>(res, {
                    type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
                    payload: res
                }, true, {
                    type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
                    payload: res
                });
            })
        ));

    public UpdateProfile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE),
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateProfile(action.payload).pipe(
                    map(response => this.UpdateProfileResponse(response)));
            })));

    public GetInventoryInfo$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_INFO),
            switchMap((action: CustomActions) => this.settingsProfileService.GetInventoryInfo()),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            }))));

    public UpdateInventory$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY),
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateInventory(action.payload).pipe(
                    map(response => this.UpdateInventoryResponse(response)));
            })));

    public UpdateProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this.companyActions.RefreshCompanies());
                    this.toasty.successToast(this.localeService.translate("app_messages.profile_updated"));
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            })));

    public PatchProfile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE),
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.PatchProfile(action.payload).pipe(
                    map(response => this.PatchProfileResponse(response)));
            })));

    public PatchProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this.companyActions.RefreshCompanies());

                    if (data.request && data.request.paymentId) {
                        this.toasty.successToastWithHtml(this.localeService.translate("app_messages.welcome_onboard"));
                    } else {
                        this.toasty.successToast(this.localeService.translate("app_messages.profile_updated"));
                    }
                }
                if (data.request.isMultipleCurrency) {
                    return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
                } else {
                    return {
                        type: 'EmptyAction'
                    };
                }
            })));

    public UpdateInventoryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.inventory_settings_updated"));
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            })));

    public branchProfileResponse$: Observable<Action> = createEffect(() => this.action$.pipe(
        ofType(SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO),
        switchMap(() => this.settingsProfileService.getBranchInfo()),
        map(res => this.validateResponse<any, string>(res, {
            type: SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO_RESPONSE,
            payload: res
        }, true, {
            type: SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO_RESPONSE,
            payload: res
        }))));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private companyActions: CompanyActions) {
    }

    public GetProfileInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO,
        };
    }

    public UpdateProfile(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE,
            payload: value
        };
    }

    public UpdateProfileResponse(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE,
            payload: value
        };
    }

    public PatchProfile(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE,
            payload: value
        };
    }
    public resetPatchProfile(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.RESET_PATCH_PROFILE,
        };
    }

    public PatchProfileResponse(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE,
            payload: value
        };
    }

    public SetMultipleCurrency(response: CompanyResponse, isMultipleCurrency: boolean): CustomActions {
        return {
            type: CompanyActions.SET_MULTIPLE_CURRENCY_FIELD,
            payload: { companyUniqueName: response?.uniqueName, isMultipleCurrency }
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response) {
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
        }
        return successAction;
    }

    public GetInventoryInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_INFO,
        };
    }

    public UpdateInventory(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY,
            payload: value
        };
    }

    public UpdateInventoryResponse(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY_RESPONSE,
            payload: value
        };
    }

    /**
     * Returns action for fetching branch info
     *
     * @returns {CustomActions} Action for fetching branch info
     * @memberof SettingsProfileActions
     */
    public getBranchInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO
        };
    }

    /**
     * Handles company response
     *
     * @param {*} response Response
     * @returns {CustomActions}
     * @memberof SettingsProfileActions
     */
    public handleCompanyProfileResponse(response: any): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
            payload: response
        }
    }

    /**
     * This will hold if free plan subscribed
     *
     * @param {boolean} response
     * @returns {CustomActions}
     * @memberof SettingsProfileActions
     */
    public handleFreePlanSubscribed(response: boolean): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.FREE_PLAN_SUBSCRIBED,
            payload: response
        }
    }
}
