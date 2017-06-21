import { CompanyActions } from './../../services/actions';
import { Action, ActionReducer } from '@ngrx/store';
import { CompanyRequest, ComapnyResponse } from '../../models/api-models/Company';
import { BaseResponse } from '../../models/api-models/BaseResponse';

/**
 * Keeping Track of the CompanyState
 */
export interface CurrentCompanyState {
  companies?: ComapnyResponse[];
  isRefreshing: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentCompanyState = {
  companies: null,
  isRefreshing: false
};

export const CompanyReducer: ActionReducer<CurrentCompanyState> = (state: CurrentCompanyState = initialState, action: Action) => {

  switch (action.type) {
    case CompanyActions.CREATE_COMPANY:
      let data: BaseResponse<ComapnyResponse> = action.payload;
      if (data.status === 'success') {
        let newCompanies = Object.assign([], state);
        newCompanies.companies.push(data.body);
        return newCompanies;
      }
      return state;
    case 'CATCH_ERROR':
      console.log(action.payload);
      return;
    case CompanyActions.REFRESH_COMPANIES:
      return Object.assign({}, state, {
        isRefreshing: true
      });
    case CompanyActions.REFRESH_COMPANIES_RESPONSE:
      return Object.assign({}, state, {
        isRefreshing: false,
        companies: action.payload.body
      });
    default:
      return state;
  }
};
