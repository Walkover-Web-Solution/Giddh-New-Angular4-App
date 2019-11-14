import { BaseResponse } from '../../models/api-models/BaseResponse';
import { TaxResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { SETTINGS_TAXES_ACTIONS } from '../../actions/settings/taxes/settings.taxes.const';
import * as _ from '../../lodash-optimized';
import { CustomActions } from '../customActions';
import * as moment from 'moment/moment';
import { IRegistration } from "../../models/interfaces/registration.interface";

/**
 * Keeping Track of the CompanyState
 */
export interface CurrentCompanyState {
  taxes: TaxResponse[];
  account: IRegistration;
  isTaxesLoading: boolean;
  isGetTaxesSuccess: boolean;
  activeFinancialYear: object;
  dateRangePickerConfig: any;
  isTaxCreationInProcess: boolean;
  isTaxCreatedSuccessfully: boolean;
  isTaxUpdatingInProcess: boolean;
  isTaxUpdatedSuccessfully: boolean;
  isCompanyActionInProgress: boolean;
  isAccountInfoLoading: boolean;
}

/**
* Setting the InitialState for this Reducer's Store
*/
const initialState: CurrentCompanyState = {
  taxes: null,
  isTaxesLoading: false,
  isGetTaxesSuccess: false,
  activeFinancialYear: null,
  dateRangePickerConfig: {
    opens: 'left',
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'This Month to Date': [
        moment().startOf('month'),
        moment()
      ],
      'This Quarter to Date': [
        moment().quarter(moment().quarter()).startOf('quarter'),
        moment()
      ],
      'This Financial Year to Date': [
        moment().startOf('year').subtract(9, 'year'),
        moment()
      ],
      'This Year to Date': [
        moment().startOf('year'),
        moment()
      ],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ],
      'Last Quater': [
        moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
        moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
      ],
      'Last Financial Year': [
        moment().startOf('year').subtract(10, 'year'),
        moment().endOf('year').subtract(10, 'year')
      ],
      'Last Year': [
        moment().startOf('year').subtract(1, 'year'),
        moment().endOf('year').subtract(1, 'year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  },
  account: null,
  isTaxCreationInProcess: false,
  isTaxCreatedSuccessfully: false,
  isTaxUpdatingInProcess: false,
  isTaxUpdatedSuccessfully: false,
  isCompanyActionInProgress: false,
  isAccountInfoLoading: false
};

export function CompanyReducer(state: CurrentCompanyState = initialState, action: CustomActions): CurrentCompanyState {

  switch (action.type) {
    case 'CATCH_ERROR':
      // console.log(action.payload);
      return;
    case CompanyActions.GET_TAX:
      return Object.assign({}, state, {
        isTaxesLoading: true,
        isGetTaxesSuccess: false
      });
    case CompanyActions.GET_TAX_RESPONSE:
      let taxes: BaseResponse<TaxResponse[], string> = action.payload;
      if (taxes.status === 'success') {
        return Object.assign({}, state, {
          taxes: taxes.body,
          isTaxesLoading: false,
          isGetTaxesSuccess: true,
        });
      }
      return Object.assign({}, state, {
        isTaxesLoading: false
      });
    case CompanyActions.SET_ACTIVE_COMPANY:
      // console.log(action.payload);
      return state;

    case SETTINGS_TAXES_ACTIONS.CREATE_TAX: {
      return {
        ...state,
        isTaxCreationInProcess: true,
        isTaxCreatedSuccessfully: false,
      }
    }

    case SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE: {
      let res: BaseResponse<TaxResponse, string> = action.payload;
      if (res.status === 'success') {
        return {
          ...state,
          taxes: [...state.taxes, res.body],
          isTaxCreatedSuccessfully: true,
          isTaxCreationInProcess: false
        };
      }
      return {
        ...state,
        isTaxCreationInProcess: false,
        isTaxCreatedSuccessfully: false
      }
    }

    case SETTINGS_TAXES_ACTIONS.UPDATE_TAX: {
      return {
        ...state,
        isTaxUpdatingInProcess: true,
        isTaxUpdatedSuccessfully: false
      }
    }

    case SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE: {
      let res: BaseResponse<TaxResponse, any> = action.payload;
      if (res.status === 'success') {
        return {
          ...state,
          isTaxUpdatingInProcess: false,
          isTaxUpdatedSuccessfully: true,
          taxes: state.taxes.map(tax => {
            if (tax.uniqueName === res.request.uniqueName) {
              tax = res.request;
            }
            return tax;
          })
        };
      }
      return {
        ...state,
        isTaxUpdatingInProcess: false,
        isTaxUpdatedSuccessfully: false
      }
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
    case CompanyActions.SET_ACTIVE_FINANCIAL_YEAR: {
      let res = action.payload;
      let newState = _.cloneDeep(state);
      let dateRangePickerConfig = _.cloneDeep(newState.dateRangePickerConfig);
      dateRangePickerConfig.ranges['This Financial Year to Date'][0] = moment(_.clone(res.financialYearStarts), 'DD-MM-YYYY').startOf('day');
      dateRangePickerConfig.ranges['Last Financial Year'] = [
        moment(_.clone(res.financialYearStarts), 'DD-MM-YYYY').subtract(1, 'year'),
        moment(_.clone(res.financialYearEnds), 'DD-MM-YYYY').subtract(1, 'year')
      ];
      return Object.assign({}, state, {
        dateRangePickerConfig
      });

    }
    case CompanyActions.DELETE_COMPANY: {
      return {
        ...state,
        isCompanyActionInProgress: true
      }
    }
    case CompanyActions.DELETE_COMPANY_RESPONSE: {
      return {
        ...state,
        isCompanyActionInProgress: false
      }
    }
    case CompanyActions.GET_REGISTRATION_ACCOUNT:
      return Object.assign({}, state, {
        isAccountInfoLoading: true
      });
    case CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE: {
      let account: BaseResponse<IRegistration, string> = action.payload;
      if (account.status === 'success') {
        return Object.assign({}, state, {
          account: account.body,
          isAccountInfoLoading: false
        });
      }
      return Object.assign({}, state, {
        isAccountInfoLoading: false
      });
    }
    default:
      return state;
  }
}
