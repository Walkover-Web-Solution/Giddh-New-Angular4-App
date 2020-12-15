import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CountryRequest, CountryResponse, CurrencyResponse, CallingCodesResponse, OnboardingFormRequest, OnboardingFormResponse } from '../models/api-models/Common';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { AppState } from '../store/roots';
import { CustomActions } from '../store/customActions';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';

@Injectable()

export class CommonActions {
    public static GET_COUNTRY = 'GetCountry';
    public static GET_COUNTRY_RESPONSE = "GetCountryResponse";
    public static GET_ALL_COUNTRY = 'GetAllCountry';
    public static GET_ALL_COUNTRY_RESPONSE = "GetA;;CountryResponse";
    public static GET_CURRENCY = 'GetCurrency';
    public static GET_CURRENCY_RESPONSE = "GetCurrencyResponse";
    public static GET_CALLING_CODES = 'GetCallingCodes';
    public static GET_CALLING_CODES_RESPONSE = "GetCallingCodesResponse";
    public static GET_ONBOARDING_FORM = 'GetOnboardingForm';
    public static GET_ONBOARDING_FORM_RESPONSE = "GetOnboardingFormResponse";
    public static RESET_ONBOARDING_FORM_RESPONSE = "ResetOnboardingFormResponse";
    public static GET_PARTY_TYPE = 'GetGET_PARTY_TYPE_REQUEST';
    public static GET_PARTY_TYPE_RESPONSE = "GET_PARTY_TYPEResponse";
    public static RESET_COUNTRY = 'ResetCountry';
    public static ACCOUNT_UPDATED = 'AccountUpdated';

    public getCountry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_COUNTRY),
            switchMap((action: CustomActions) => this._commonService.GetCountry(action.payload)),
            map(response => this.GetCountryResponse(response))));

    public getAllCountry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_ALL_COUNTRY),
            switchMap((action: CustomActions) => this._commonService.GetCountry(action.payload)),
            map(response => this.GetAllCountryResponse(response))));

    public getCurrency$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_CURRENCY),
            switchMap((action: CustomActions) => this._commonService.GetCurrency()),
            map(response => this.GetCurrencyResponse(response))));

    public getCallingCodes$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_CALLING_CODES),
            switchMap((action: CustomActions) => this._commonService.GetCallingCodes()),
            map(response => this.GetCallingCodesResponse(response))));

    public getOnboardingForm$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_ONBOARDING_FORM),
            switchMap((action: CustomActions) => this._commonService.getOnboardingForm(action.payload)),
            map(response => this.GetOnboardingFormResponse(response))));

    public getPartytypes$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_PARTY_TYPE),
            switchMap((action: CustomActions) => this._commonService.GetPartyType()),
            map(response => this.GetPartyTypeResponse(response))));

    constructor(private action$: Actions, private _commonService: CommonService, private store: Store<AppState>, private _generalService: GeneralService) {

    }

    public GetCountry(value: CountryRequest): CustomActions {
        return {
            type: CommonActions.GET_COUNTRY,
            payload: value
        };
    }

    public GetCountryResponse(value: BaseResponse<CountryResponse, CountryRequest>): CustomActions {
        return {
            type: CommonActions.GET_COUNTRY_RESPONSE,
            payload: value
        };
    }

    public GetCurrency(): CustomActions {
        return {
            type: CommonActions.GET_CURRENCY,
            payload: null
        };
    }

    public GetCurrencyResponse(value: BaseResponse<CurrencyResponse, any>): CustomActions {
        return {
            type: CommonActions.GET_CURRENCY_RESPONSE,
            payload: value
        };
    }

    public GetAllCountry(value: CountryRequest): CustomActions {
        return {
            type: CommonActions.GET_ALL_COUNTRY,
            payload: value
        };
    }

    public GetAllCountryResponse(value: BaseResponse<CountryResponse, CountryRequest>): CustomActions {
        return {
            type: CommonActions.GET_ALL_COUNTRY_RESPONSE,
            payload: value
        };
    }

    public GetCallingCodes(): CustomActions {
        return {
            type: CommonActions.GET_CALLING_CODES,
            payload: null
        };
    }

    public GetCallingCodesResponse(value: BaseResponse<CallingCodesResponse, any>): CustomActions {
        return {
            type: CommonActions.GET_CALLING_CODES_RESPONSE,
            payload: value
        };
    }

    public GetOnboardingForm(value: OnboardingFormRequest): CustomActions {
        return {
            type: CommonActions.GET_ONBOARDING_FORM,
            payload: value
        };
    }

    public GetOnboardingFormResponse(value: BaseResponse<OnboardingFormResponse, any>): CustomActions {
        return {
            type: CommonActions.GET_ONBOARDING_FORM_RESPONSE,
            payload: value
        };
    }
    public GetPartyType(): CustomActions {
        return {
            type: CommonActions.GET_PARTY_TYPE,
        };
    }

    public GetPartyTypeResponse(value: BaseResponse<any, any>): CustomActions {
        return {
            type: CommonActions.GET_PARTY_TYPE_RESPONSE,
            payload: value
        };
    }
    public resetOnboardingForm(): CustomActions {
        return {
            type: CommonActions.RESET_ONBOARDING_FORM_RESPONSE
        };
    }

    public resetCountry(): CustomActions {
        return {
            type: CommonActions.RESET_COUNTRY
        };
    }

    /**
     * This will store true/false in isAccountUpdated store
     *
     * @param {boolean} event
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public accountUpdated(event: boolean): CustomActions {
        return {
            type: CommonActions.ACCOUNT_UPDATED,
            payload: event
        }
    }
}
