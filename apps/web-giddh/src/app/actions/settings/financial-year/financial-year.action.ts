import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { SETTINGS_FINANCIAL_YEAR_ACTIONS } from './financial-year.const';
import { CustomActions } from '../../../store/customActions';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { IFinancialYearResponse, ILockFinancialYearRequest, SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../../store/index';
import { ActiveFinancialYear } from '../../../models/api-models/Company';
import { ToasterService } from '../../../services/toaster.service';

@Injectable()
export class SettingsFinancialYearActions {


    public GetAllFinancialYears$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS),
            switchMap((action: CustomActions) => this._settingsFinancialYearService.GetAllFinancialYears()),
            map(res => this.validateResponse<IFinancialYearResponse, string>(res, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE,
                payload: res
            }))));


    public LockFinancialYear$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR),
            switchMap((action: CustomActions) => {
                return this._settingsFinancialYearService.LockFinancialYear(action.payload).pipe(
                    map(response => this.LockFinancialYearResponse(response)));
            })));


    public LockFinancialYearResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Financial Year Locked Successfully.');
                }
                return { type: 'EmptyAction' };
            })));


    public UnlockFinancialYear$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR),
            switchMap((action: CustomActions) => {
                return this._settingsFinancialYearService.UnlockFinancialYear(action.payload).pipe(
                    map(response => this.UnlockFinancialYearResponse(response)));
            })));


    public UnlockFinancialYearResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Financial Year Unlocked Successfully.');
                }
                return { type: 'EmptyAction' };
            })));


    public SwitchFinancialYear$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR),
            switchMap((action: CustomActions) => {
                return this._settingsFinancialYearService.SwitchFinancialYear(action.payload).pipe(
                    map(response => this.SwitchFinancialYearResponse(response)));
            })));


    public SwitchFinancialYearResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<ActiveFinancialYear, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast('Financial Year Switched Successfully.');
                }
                return { type: 'EmptyAction' };
            })));


    public UpdateFinancialYearPeriod$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD),
            switchMap((action: CustomActions) => {
                return this._settingsFinancialYearService.UpdateFinancialYearPeriod(action.payload).pipe(
                    map(response => this.UpdateFinancialYearPeriodResponse(response)));
            })));


    public UpdateFinancialYearPeriodResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<ActiveFinancialYear, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, 'Error');
                } else {
                    this.toasty.successToast('Financial Year Period Updated.');
                }
                return { type: 'EmptyAction' };
            })));


    public AddFinancialYear$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR),
            switchMap((action: CustomActions) => this._settingsFinancialYearService.AddFinancialYear(action.payload)),
            map(res => this.validateResponse<IFinancialYearResponse, string>(res, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
                payload: res
            }))));


    public AddFutureFinancialYear$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FUTURE_FINANCIAL_YEAR),
            switchMap((action: CustomActions) => this._settingsFinancialYearService.addFutureFinancialYear(action.payload)),
            map(res => this.validateResponse<IFinancialYearResponse, string>(res, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
                payload: res
            }))));

    /**
     * Effect to get financial year data
     *
     * @type {Observable<Action>}
     * @memberof SettingsFinancialYearActions
     */
    public getFinancialYearLimits$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_FINANCIAL_YEAR_LIMITS),
            switchMap((action: CustomActions) => this._settingsFinancialYearService.getFinancialYearLimits()),
            map((res: any) => this.validateResponse<any, any>(res, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_FINANCIAL_YEAR_LIMITS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_FINANCIAL_YEAR_LIMITS_RESPONSE,
                payload: res
            }))));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private _settingsFinancialYearService: SettingsFinancialYearService) {
    }

    public GetAllFinancialYears(): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS,
        };
    }

    public LockFinancialYear(reqObj: ILockFinancialYearRequest): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR,
            payload: reqObj
        };
    }

    public LockFinancialYearResponse(response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE,
            payload: response
        };
    }

    public UnlockFinancialYear(reqObj: ILockFinancialYearRequest): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR,
            payload: reqObj
        };
    }

    public UnlockFinancialYearResponse(response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE,
            payload: response
        };
    }

    public SwitchFinancialYearResponse(response: BaseResponse<ActiveFinancialYear, string>): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE,
            payload: response
        };
    }

    public SwitchFinancialYear(uniqueName: string): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR,
            payload: uniqueName
        };
    }

    public UpdateFinancialYearPeriod(period: string): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD,
            payload: period
        };
    }

    public UpdateFinancialYearPeriodResponse(response: BaseResponse<IFinancialYearResponse, string>): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD_RESPONSE,
            payload: response
        };
    }

    public addFinancialYear(fromYear: number): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR,
            payload: fromYear
        };
    }

    public addFutureFinancialYear(fromYear: number): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FUTURE_FINANCIAL_YEAR,
            payload: fromYear
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

    /**
     * Returns the action to get financial year data
     *
     * @returns {CustomActions}
     * @memberof SettingsFinancialYearActions
     */
    public getFinancialYearLimits(): CustomActions {
        return {
            type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_FINANCIAL_YEAR_LIMITS
        };
    }
}
