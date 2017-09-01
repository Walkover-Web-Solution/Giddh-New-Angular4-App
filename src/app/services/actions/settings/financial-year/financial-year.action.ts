import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SettingsProfileService } from '../../../settings.profile.service';
import { SmsKeyClass } from '../../../../models/api-models/SettingsIntegraion';
import { SETTINGS_FINANCIAL_YEAR_ACTIONS } from './financial-year.const';
import { SettingsFinancialYearService, ILockFinancialYearRequest, IFinancialYearResponse } from '../../../settings.financial-year.service';
import { ActiveFinancialYear } from '../../../../models/api-models/Company';

@Injectable()
export class SettingsFinancialYearActions {

  @Effect()
  public GetAllFinancialYears$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS)
    .switchMap(action => this._settingsFinancialYearService.GetAllFinancialYears())
    .map(res => this.validateResponse<IFinancialYearResponse, string>(res, {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE,
      payload: res
    }, true, {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE,
      payload: res
    }));

  @Effect()
  public LockFinancialYear$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR)
    .switchMap(action => {
      return this._settingsFinancialYearService.LockFinancialYear(action.payload)
        .map(response => this.LockFinancialYearResponse(response));
    });

  @Effect()
  public LockFinancialYearResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE)
    .map(response => {
      let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Financial Year Locked Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  public UnlockFinancialYear$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR)
    .switchMap(action => {
      return this._settingsFinancialYearService.UnlockFinancialYear(action.payload)
        .map(response => this.UnlockFinancialYearResponse(response));
    });

  @Effect()
  public UnlockFinancialYearResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE)
    .map(response => {
      let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Financial Year Unlocked Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  public SwitchFinancialYear$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR)
    .switchMap(action => {
      return this._settingsFinancialYearService.SwitchFinancialYear(action.payload)
        .map(response => this.SwitchFinancialYearResponse(response));
    });

  @Effect()
  public SwitchFinancialYearResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE)
    .map(response => {
      let data: BaseResponse<ActiveFinancialYear, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Financial Year Switched Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  public AddFinancialYear$: Observable<Action> = this.action$
    .ofType(SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR)
    .switchMap(action => this._settingsFinancialYearService.AddFinancialYear(action.payload))
    .map(res => this.validateResponse<IFinancialYearResponse, string>(res, {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
      payload: res
    }, true, {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE,
      payload: res
    }));

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private _settingsFinancialYearService: SettingsFinancialYearService) {
  }

  public GetAllFinancialYears(): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS,
    };
  }

  public LockFinancialYear(reqObj: ILockFinancialYearRequest): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR,
      payload: reqObj
    };
  }

  public LockFinancialYearResponse(response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE,
      payload: response
    };
  }

  public UnlockFinancialYear(reqObj: ILockFinancialYearRequest): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR,
      payload: reqObj
    };
  }

  public UnlockFinancialYearResponse(response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE,
      payload: response
    };
  }

  public SwitchFinancialYearResponse(response: BaseResponse<ActiveFinancialYear, string>): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE,
      payload: response
    };
  }

  public SwitchFinancialYear(uniqueName: string): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR,
      payload: uniqueName
    };
  }

  public AddFinancialYear(fromYear: string): Action {
    return {
      type: SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR,
      payload: fromYear
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
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
