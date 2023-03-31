import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CountryRequest, CountryResponse, CurrencyResponse, CallingCodesResponse, OnboardingFormRequest, OnboardingFormResponse } from '../models/api-models/Common';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CustomActions } from '../store/customActions';
import { LocaleService } from '../services/locale.service';

@Injectable()

export class CommonActions {
    public static GET_COUNTRY = 'GetCountry';
    public static GET_COUNTRY_RESPONSE = "GetCountryResponse";
    public static GET_ALL_COUNTRY = 'GetAllCountry';
    public static GET_ALL_COUNTRY_RESPONSE = "GetAllCountryResponse";
    public static GET_CALLING_CODES = 'GetCallingCodes';
    public static GET_CALLING_CODES_RESPONSE = "GetCallingCodesResponse";
    public static GET_ONBOARDING_FORM = 'GetOnboardingForm';
    public static GET_ONBOARDING_FORM_RESPONSE = "GetOnboardingFormResponse";
    public static RESET_ONBOARDING_FORM_RESPONSE = "ResetOnboardingFormResponse";
    public static GET_PARTY_TYPE = 'GetGET_PARTY_TYPE_REQUEST';
    public static GET_PARTY_TYPE_RESPONSE = "GET_PARTY_TYPEResponse";
    public static RESET_COUNTRY = 'ResetCountry';
    public static ACCOUNT_UPDATED = 'AccountUpdated';
    public static SET_COMMON_LOCALE_DATA = 'SetCommonLocaleData';
    public static GET_COMMON_LOCALE_DATA = 'GetCommonLocaleData';
    public static SET_ACTIVE_LOCALE = 'SetActiveLocale';
    public static SET_ACTIVE_FINANCIAL_YEAR = 'SetActiveFinancialYear';
    public static SET_ACTIVE_THEME = 'SetActiveTheme';
    public static SET_FILTERS = 'SetFilters';
    public static SET_IMPORT_BANK_TRANSACTIONS_RESPONSE = 'SetImportBankTransactionsResponse';

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

    public getCommonLocaleData$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CommonActions.GET_COMMON_LOCALE_DATA),
            switchMap((action: CustomActions) => this.localeService.getLocale('', action.payload)),
            map(response => this.setCommonLocaleData(response))));

    constructor(private action$: Actions, private _commonService: CommonService, private localeService: LocaleService) {

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

    /**
     * This will get the common locale data from api
     *
     * @param {string} language
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public getCommonLocaleData(language: string): CustomActions {
        return {
            type: CommonActions.GET_COMMON_LOCALE_DATA,
            payload: language
        }
    }

    /**
     * This will set the common locale data in store
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public setCommonLocaleData(data: any): CustomActions {
        return {
            type: CommonActions.SET_COMMON_LOCALE_DATA,
            payload: data
        }
    }

    /**
     * This will set active locale
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public setActiveLocale(data: any): CustomActions {
        return {
            type: CommonActions.SET_ACTIVE_LOCALE,
            payload: data
        }
    }

    /**
     * This will set active financial year
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public setActiveFinancialYear(data: any): CustomActions {
        return {
            type: CommonActions.SET_ACTIVE_FINANCIAL_YEAR,
            payload: data
        }
    }

    /**
     * This will set active theme
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public setActiveTheme(data: any): CustomActions {
        return {
            type: CommonActions.SET_ACTIVE_THEME,
            payload: data
        }
    }

    /**
     * Set filters in store
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CommonActions
     */
    public setFilters(data: any): CustomActions {
        return {
            type: CommonActions.SET_FILTERS,
            payload: data
        }
    }

    /**
 * This will set the bank transactions import response data
 *
 * @param {*} data
 * @returns {CustomActions}
 * @memberof CommonActions
 */
    public setImportBankTransactionsResponse(data: any): CustomActions {
        return {
            type: CommonActions.SET_IMPORT_BANK_TRANSACTIONS_RESPONSE,
            payload: data
        }
    }
}
