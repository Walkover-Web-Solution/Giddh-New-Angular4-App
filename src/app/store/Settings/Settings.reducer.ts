import { SETTINGS_PERMISSION_ACTIONS } from '../../actions/settings/permissions/settings.permissions.const';
import { LinkedAccountsState, SettingsState } from './Settings.reducer';
import * as _ from '../../lodash-optimized';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../actions/settings/settings.integration.const';
import { SETTINGS_PROFILE_ACTIONS } from '../../actions/settings/profile/settings.profile.const';
import { CompanyResponse, ActiveFinancialYear } from '../../models/api-models/Company';
import { SmsKeyClass, IntegrationPage, IntegrationPageClass, EmailKeyClass, RazorPayDetailsResponse, RazorPayClass } from '../../models/api-models/SettingsIntegraion';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from '../../actions/settings/linked-accounts/settings.linked.accounts.const';
import { IGetAllEbankAccountResponse } from '../../models/api-models/SettingsLinkedAccounts';
import { SETTINGS_FINANCIAL_YEAR_ACTIONS } from '../../actions/settings/financial-year/financial-year.const';
import { IFinancialYearResponse, ILockFinancialYearRequest } from '../../services/settings.financial-year.service';
import { CustomActions } from '../customActions';
import { SETTINGS_BRANCH_ACTIONS } from '../../actions/settings/branch/settings.branch.const';
import { SETTINGS_TAG_ACTIONS } from '../../actions/settings/tag/settings.tag.const';
import { SETTINGS_TRIGGERS_ACTIONS } from '../../actions/settings/triggers/settings.triggers.const';

export interface LinkedAccountsState {
  bankAccounts?: BankAccountsResponse[];
  isBankAccountsInProcess?: boolean;
  isDeleteBankAccountIsInProcess?: boolean;
  needReloadingLinkedAccounts?: boolean;
  iframeSource?: string;
}
export interface SettingsState {
  integration: IntegrationPage;
  profile: any;
  linkedAccounts: LinkedAccountsState;
  financialYears: IFinancialYearResponse;
  usersWithCompanyPermissions: any;
  branches: any;
  tags: any;
  parentCompany: CompanyResponse;
  triggers: any;
}

export const initialState: SettingsState = {
  integration: new IntegrationPageClass(),
  profile: {},
  linkedAccounts: {},
  financialYears: null,
  usersWithCompanyPermissions: null,
  branches: null,
  tags: null,
  parentCompany: null,
  triggers: null
};

export function SettingsReducer(state = initialState, action: CustomActions): SettingsState {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE:
      let gtsmsres: BaseResponse<SmsKeyClass, string> = action.payload;
      if (gtsmsres.status === 'success') {
        newState.integration.smsForm = gtsmsres.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE:
      let crtsmsres: BaseResponse<string, SmsKeyClass> = action.payload;
      if (crtsmsres.status === 'success') {
        newState.integration.smsForm = crtsmsres.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE:
      let gtemlres: BaseResponse<EmailKeyClass, string> = action.payload;
      if (gtemlres.status === 'success') {
        newState.integration.emailForm = gtemlres.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE:
      let crtemlres: BaseResponse<string, EmailKeyClass> = action.payload;
      if (crtemlres.status === 'success') {
        newState.integration.emailForm = crtemlres.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE:
      let getRzrPayRes: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
      if (getRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = getRzrPayRes.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE:
    case SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE:
      let svRzrPayRes: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = action.payload;
      if (svRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = svRzrPayRes.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE:
      let dltRzrPayRes: BaseResponse<string, string> = action.payload;
      if (dltRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = null;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE: {
      let response: BaseResponse<CompanyResponse, string> = action.payload;
      if (response.status === 'success') {
        newState.profile = response.body;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE: {
      let response: BaseResponse<CompanyResponse, string> = action.payload;
      if (response.status === 'success') {
        newState.profile = response.body;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS: {
      newState.linkedAccounts.isBankAccountsInProcess = true;
      return Object.assign({}, state, newState);
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE: {
      let response: BaseResponse<BankAccountsResponse[], string> = action.payload;
      if (response.status === 'success') {
        newState.linkedAccounts.isBankAccountsInProcess = false;
        newState.linkedAccounts.bankAccounts = _.orderBy(response.body, ['siteName'], ['asc']);
      } else {
        newState.linkedAccounts.isBankAccountsInProcess = false;
      }
      return Object.assign({}, state, newState);
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE: {
      let response: BaseResponse<LinkedAccountsState[], string> = action.payload;
      if (response.status === 'success') {
        newState.linkedAccounts = response.body as LinkedAccountsState;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT: {
      newState.linkedAccounts.isDeleteBankAccountIsInProcess = true;
      return Object.assign({}, state, newState);
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE: {
      let response: BaseResponse<string, string> = action.payload;
      if (response.status === 'success') {
        _.map(newState.linkedAccounts.bankAccounts, (ac) => {
          _.filter(ac.accounts, (account) => account.loginId !== response.request);
        });
      } else {
        newState.linkedAccounts.isDeleteBankAccountIsInProcess = false;
      }
      newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
      return Object.assign({}, state, newState);
    }
    case SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE: {
      let response: BaseResponse<IFinancialYearResponse, string> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = response.body;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE: {
      let response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = null;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE: {
      let response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = null;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE: {
      let response: BaseResponse<ActiveFinancialYear, string> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = null;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE: {
      let response: BaseResponse<IFinancialYearResponse, string> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = null;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      if (response.status === 'success') {
        newState.financialYears = null;
        newState.usersWithCompanyPermissions = response.body;
      }
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      if (response.status === 'success') {
        newState.linkedAccounts.iframeSource = response.body.connectUrl;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE:
    {
      newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
      return Object.assign({}, state, newState);
    }
    case SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE:
    {
      newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
      return Object.assign({}, state, newState);
    }
    case SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE:
    {
      let response: BaseResponse<any, any> = action.payload;
      if (response.status === 'success') {
        newState.branches = response.body;
        return Object.assign({}, state, newState);
      }
      return Object.assign({}, state, newState);
    }
    case SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY_RESPONSE: {
      let response: BaseResponse<any, any> = action.payload;
      if (response.status === 'success') {
        newState.parentCompany = response.body;
      } else {
        newState.parentCompany = null;
      }
      return Object.assign({}, state, newState);
    }
    case SETTINGS_TAG_ACTIONS.GET_ALL_TAGS_RESPONSE:
    {
      let response: BaseResponse<any, any> = action.payload;
      if (response.status === 'success') {
        newState.tags = response.body;
        return Object.assign({}, state, newState);
      } else {
        newState.tags = null;
        return Object.assign({}, state, newState);
      }
    }
    case SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS_RESPONSE: {
      let response: BaseResponse<any, any> = action.payload;
      if (response.status === 'success') {
        newState.triggers = response.body;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE:
      let cashFreeRes: BaseResponse<any, any> = action.payload;
      if (cashFreeRes.status === 'success') {
        newState.integration.payoutForm = cashFreeRes.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE:
    case SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE:
      let savecashFreeRes: BaseResponse<any, any> = action.payload;
      if (savecashFreeRes.status === 'success') {
        newState.integration.payoutForm = savecashFreeRes.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE:
      let dltCashFreeRes: BaseResponse<string, string> = action.payload;
      if (dltCashFreeRes.status === 'success') {
        newState.integration.payoutForm = {};
        return Object.assign({}, state, newState);
      }
      return state;

    case SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE:
      let autoCollectRes: BaseResponse<any, any> = action.payload;
      if (autoCollectRes.status === 'success') {
        newState.integration.autoCollect = autoCollectRes.body;
        return Object.assign({}, state, newState);
      }
      return state;

    case SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE:
    case SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE:
      let saveautoCollectRes: BaseResponse<any, any> = action.payload;
      if (saveautoCollectRes.status === 'success') {
        newState.integration.autoCollect = saveautoCollectRes.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE:
      let dltautoCollectRes: BaseResponse<string, string> = action.payload;
      if (dltautoCollectRes.status === 'success') {
        newState.integration.autoCollect = {};
        return Object.assign({}, state, newState);
      }
      return state;

    case SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE:
      let paymentGatewayRes: BaseResponse<any, any> = action.payload;
      if (paymentGatewayRes.status === 'success') {
        newState.integration.paymentGateway = paymentGatewayRes.body;
        return Object.assign({}, state, newState);
      }
      return state;

    case SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE:
      let paymntGtwy: BaseResponse<any, any> = action.payload;
      if (paymntGtwy.status === 'success') {
        newState.integration.paymentGateway = paymntGtwy.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE:
      let dltpaymentGatewayRes: BaseResponse<string, string> = action.payload;
      if (dltpaymentGatewayRes.status === 'success') {
        newState.integration.paymentGateway = {};
        return Object.assign({}, state, newState);
      }
      return state;
    default: {
      return state;
    }
  }
}
