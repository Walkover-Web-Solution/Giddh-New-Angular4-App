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
import { CustomActions } from '../../../store/custom-actions';
import { LocaleService } from '../../../services/locale.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsProfileActions class
 * Implements SettingsProfileActions functionality
 */
export class SettingsProfileActions {

    public GetSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsProfileService.GetProfileInfo()),
            /**
             * Handles map functionality
             */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateProfile(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.UpdateProfileResponse(response)));
            })));

    public GetInventoryInfo$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_INFO),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsProfileService.GetInventoryInfo()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            }))));

    public UpdateInventory$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateInventory(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.UpdateInventoryResponse(response)));
            })));

    public UpdateProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE),
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
                    this.store.dispatch(this.companyActions.RefreshCompanies());
                    this.toasty.successToast(this.localeService.translate("app_messages.profile_updated"));
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            })));

    public PatchProfile$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.PatchProfile(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.PatchProfileResponse(response)));
            })));

    public PatchProfileResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE),
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
                    this.store.dispatch(this.companyActions.RefreshCompanies());

                    /**
                     * Handles if functionality
                     */
                    if (data.request && data.request.paymentId) {
                        this.toasty.successToastWithHtml(this.localeService.translate("app_messages.welcome_onboard"));
                    } else {
                        this.toasty.successToast(this.localeService.translate("app_messages.profile_updated"));
                    }
                }
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY_RESPONSE),
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
                    this.toasty.successToast(this.localeService.translate("app_messages.inventory_settings_updated"));
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            })));

    public branchProfileResponse$: Observable<Action> = createEffect(() => this.action$.pipe(
        /**
         * Handles ofType functionality
         */
        ofType(SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO),
        /**
         * Handles switchMap functionality
         */
        switchMap(() => this.settingsProfileService.getBranchInfo()),
        /**
         * Handles map functionality
         */
        map(res => this.validateResponse<any, string>(res, {
            type: SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO_RESPONSE,
            payload: res
        }, true, {
            type: SETTINGS_PROFILE_ACTIONS.GET_BRANCH_INFO_RESPONSE,
            payload: res
        }))));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private companyActions: CompanyActions) {
    }

    /**
     * Handles GetProfileInfo functionality
     */
    public GetProfileInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO,
        };
    }

    /**
     * Handles UpdateProfile functionality
     */
    public UpdateProfile(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE,
            payload: value
        };
    }

    /**
     * Handles UpdateProfileResponse functionality
     */
    public UpdateProfileResponse(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles PatchProfile functionality
     */
    public PatchProfile(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE,
            payload: value
        };
    }
    /**
     * Resets patchprofile to default state
     */
    public resetPatchProfile(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.RESET_PATCH_PROFILE,
        };
    }

    /**
     * Handles PatchProfileResponse functionality
     */
    public PatchProfileResponse(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles SetMultipleCurrency functionality
     */
    public SetMultipleCurrency(response: CompanyResponse, isMultipleCurrency: boolean): CustomActions {
        return {
            type: CompanyActions.SET_MULTIPLE_CURRENCY_FIELD,
            payload: { companyUniqueName: response?.uniqueName, isMultipleCurrency }
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response) {
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
        }
        return successAction;
    }

    /**
     * Handles GetInventoryInfo functionality
     */
    public GetInventoryInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_INFO,
        };
    }

    /**
     * Handles UpdateInventory functionality
     */
    public UpdateInventory(value): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY,
            payload: value
        };
    }

    /**
     * Handles UpdateInventoryResponse functionality
     */
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

    /**
     * This will hold if form has unsaved changes
     *
     * @param {boolean} value
     * @returns {CustomActions}
     * @memberof SettingsProfileActions
     */
    public hasUnsavedChanges(value: boolean): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.HAS_UNSAVED_CHANGES,
            payload: value
        }
    }
}
