import { CompanyActions } from './../../services/actions/company.actions';
import { Action, ActionReducer } from '@ngrx/store';
import { CompanyRequest } from '../../models/api-models/Company';

/**
 * Keeping Track of the CompanyState
 */
export interface ErrorState {
  message: string;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: ErrorState = {
  message: 'Something went wrong! Please try again.'
};

export const ErrorReducer: ActionReducer<ErrorState> = (state: ErrorState = initialState, action: Action) => {
  switch (action.type) {
    case 'CATCH_ERROR':
      console.log(action.payload);
    default:
      return state;
  }
};
