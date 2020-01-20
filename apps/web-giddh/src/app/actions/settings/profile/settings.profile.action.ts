import { map, switchMap } from 'rxjs/operators';
import { CompanyResponse } from '../../../models/api-models/Company';
import { CompanyActions } from '../../company.actions';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class SettingsProfileActions {

    @Effect()
    public GetSMSKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO).pipe(
            switchMap((action: CustomActions) => this.settingsProfileService.GetProfileInfo()),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdateProfile$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateProfile(action.payload).pipe(
                    map(response => this.UpdateProfileResponse(response)));
            }));

    @Effect()
    public GetInventoryInfo$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_INFO).pipe(
            switchMap((action: CustomActions) => this.settingsProfileService.GetInventoryInfo()),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdateInventory$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.UpdateInventory(action.payload).pipe(
                    map(response => this.UpdateInventoryResponse(response)));
            }));

    @Effect()
    private UpdateProfileResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this.companyActions.RefreshCompanies());
                    this.toasty.successToast('Profile Updated Successfully.');
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            }));

    @Effect()
    private PatchProfile$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE).pipe(
            switchMap((action: CustomActions) => {
                return this.settingsProfileService.PatchProfile(action.payload).pipe(
                    map(response => this.PatchProfileResponse(response)));
            }));

    @Effect({ dispatch: false })
    private PatchProfileResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this.companyActions.RefreshCompanies());
                    this.toasty.successToast('Profile Updated Successfully.');
                }
                if (data.request.isMultipleCurrency) {
                    return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
                } else {
                    return {
                        type: ''
                    };
                }
            }));

    @Effect()
    private UpdateInventoryResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    // this.store.dispatch(this.companyActions.RefreshCompanies()); // commented because if i change refresh then inrefresh will check to change company so there is no need to change company call
                    this.toasty.successToast('Inventory settings Updated Successfully.');
                }
                return this.SetMultipleCurrency(data.request, data.request.isMultipleCurrency);
            }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
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
            payload: { companyUniqueName: response.uniqueName, isMultipleCurrency }
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

}
