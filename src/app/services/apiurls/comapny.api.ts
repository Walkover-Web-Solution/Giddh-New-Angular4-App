import { Configuration } from '../../app.constant';

export const COMPANY_API = {
  GET_STATE_DETAILS: Configuration.ApiUrl + 'state-details?companyUniqueName=:companyUniqueName',
  SET_STATE_DETAILS: Configuration.ApiUrl + 'state-details',
  COMPANY_LIST: Configuration.ApiUrl + 'users/:uniqueName/companies',
  CREATE_COMPANY: Configuration.ApiUrl + 'company',
  SEND_EMAIL: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/bulk-email/?from=:from&to=:to',
  SEND_SMS: Configuration.ApiUrl + 'company/:companyUniqueName/accounts/bulk-sms/?from=:from&to=:to',
  DELETE_COMPANY: Configuration.ApiUrl + 'company/:uniqueName',
  TAX: Configuration.ApiUrl + 'company/:companyUniqueName/tax', // get call
  GET_COMPANY_USERS: Configuration.ApiUrl + 'company/:companyUniqueName/users',
  GET_ALL_STATES:  Configuration.ApiUrl + 'states',
  GET_COUPON: Configuration.ApiUrl + 'coupon/:code'
};
