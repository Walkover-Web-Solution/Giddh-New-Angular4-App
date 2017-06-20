import { CompanyActions } from './../../services/actions';
import { Action, ActionReducer } from '@ngrx/store';
import { Company } from '../../models/api-models/Company';

/**
 * Keeping Track of the CompanyState
 */
export interface CurrentCompanyState {
  company?: Company;
  activeCompany?: Company;
  isRefreshing: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentCompanyState = {
  company: null,
  activeCompany: null,
  isRefreshing: false
};

export const CompanyReducer: ActionReducer<CurrentCompanyState> = (state: CurrentCompanyState = initialState, action: Action) => {

  switch (action.type) {
    case CompanyActions.CREATE_COMPANY:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: false
      });
    case 'CATCH_ERROR':
      console.log(action.payload);
      return;
    case CompanyActions.REFRESH_COMPANIES:
      return Object.assign({}, state, {
        isRefreshing: true
      });
    case CompanyActions.REFRESH_COMPANIES_RESPONSE:
      return Object.assign({}, state, {
        isRefreshing: false
      });
    default:
      return state;
  }
};
