import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CallingCodesResponse, CountryResponse, CurrencyResponse, OnboardingFormResponse } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { CustomActions } from '../customActions';
import { IOption } from '../../theme/ng-select/ng-select';

/**
 * Keeping Track of the CommonState
 */
export interface CurrentCommonState {
    countries: CountryResponse[];
    countriesAll: CountryResponse[];
    currencies: CurrencyResponse[];
    callingcodes: CallingCodesResponse;
    onboardingform: OnboardingFormResponse,
    partyTypes: IOption[]
}

const initialState: CurrentCommonState = {
    countries: null,
    countriesAll: null,
    currencies: null,
    callingcodes: null,
    onboardingform: null,
    partyTypes: null
};

export function CommonReducer(state: CurrentCommonState = initialState, action: CustomActions): CurrentCommonState {

    switch (action.type) {
        case CommonActions.GET_COUNTRY_RESPONSE:
            let countries: BaseResponse<CountryResponse[], string> = action.payload;
            if (countries.status === 'success') {
                return Object.assign({}, state, {
                    countries: countries.body
                });
            }
            return Object.assign({}, state, {});
        case CommonActions.GET_ALL_COUNTRY_RESPONSE:
            let countriesRes: BaseResponse<CountryResponse[], string> = action.payload;
            if (countriesRes.status === 'success') {
                return Object.assign({}, state, {
                    countriesAll: countriesRes.body
                });
            }
            return Object.assign({}, state, {});
        case CommonActions.GET_CURRENCY_RESPONSE:
            let currencies: BaseResponse<CurrencyResponse[], string> = action.payload;
            if (currencies.status === 'success') {
                return Object.assign({}, state, {
                    currencies: currencies.body
                });
            }
            return Object.assign({}, state, {});

        case CommonActions.GET_CALLING_CODES_RESPONSE:
            let callingcodes: BaseResponse<CallingCodesResponse, string> = action.payload;
            if (callingcodes.status === 'success') {
                return Object.assign({}, state, {
                    callingcodes: callingcodes.body
                });
            }
            return Object.assign({}, state, {});

        case CommonActions.GET_ONBOARDING_FORM_RESPONSE:
            let onboardingform: BaseResponse<OnboardingFormResponse, string> = action.payload;
            if (onboardingform.status === 'success') {
                return Object.assign({}, state, {
                    onboardingform: onboardingform.body
                });
            }
            return Object.assign({}, state, {});

        case CommonActions.GET_PARTY_TYPE_RESPONSE:
            let partyTypeRes: BaseResponse<any, string> = action.payload;
            if (partyTypeRes.status === 'success') {
                return Object.assign({}, state, {
                    partyTypes: partyTypeRes.body.partyTypes
                });
            }
            return Object.assign({}, state, {});

        case CommonActions.RESET_ONBOARDING_FORM_RESPONSE: {
            return {...state, onboardingform: null};
        }

        case CommonActions.RESET_COUNTRY: {
            return Object.assign({}, state, {countries: null});
        }

        default:
            return state;
    }
}
