import { BaseResponse } from '../../models/api-models/BaseResponse';
import { TaxResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { SETTINGS_TAXES_ACTIONS } from '../../actions/settings/taxes/settings.taxes.const';
import * as _ from '../../lodash-optimized';
import { CustomActions } from '../customActions';

/**
 * Keeping Track of the CompanyState
 */
export interface CurrentCompanyState {
  taxes: TaxResponse[];
  isTaxesLoading: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentCompanyState = {
  taxes: null,
  isTaxesLoading: false
};

export function CompanyReducer(state: CurrentCompanyState = initialState, action: CustomActions): CurrentCompanyState {

  switch (action.type) {
    case 'CATCH_ERROR':
      // console.log(action.payload);
      return;
    case CompanyActions.GET_TAX:
      return Object.assign({}, state, {
        isTaxesLoading: true
      });
    case CompanyActions.GET_TAX_RESPONSE:
      let taxes: BaseResponse<TaxResponse[], string> = action.payload;
      if (taxes.status === 'success') {
        return Object.assign({}, state, {
          taxes: taxes.body,
          isTaxesLoading: false
        });
      }
      return Object.assign({}, state, {
        isTaxesLoading: false
      });
    case CompanyActions.SET_ACTIVE_COMPANY:
      // console.log(action.payload);
      return state;
    case SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE: {
      let res: BaseResponse<TaxResponse, string> = action.payload;
      if (res.status === 'success') {
        let newState = _.cloneDeep(state);
        newState.taxes.push(res.body);
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE: {
      let res: BaseResponse<TaxResponse, any> = action.payload;
      if (res.status === 'success') {
        let newState = _.cloneDeep(state);
        let taxIndx = newState.taxes.findIndex((tax) => tax.uniqueName === res.request.uniqueName);
        if (taxIndx > -1) {
          newState.taxes[taxIndx] = res.request;
        }
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE: {
      let res: BaseResponse<TaxResponse, string> = action.payload;
      if (res.status === 'success') {
        let newState = _.cloneDeep(state);
        let taxIndx = newState.taxes.findIndex((tax) => tax.uniqueName === res.request);
        if (taxIndx > -1) {
          newState.taxes.splice(taxIndx, 1);
        }
        return Object.assign({}, state, newState);
      }
      return state;
    }
    default:
      return state;
  }
}
