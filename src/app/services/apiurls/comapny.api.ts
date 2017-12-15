
export const COMPANY_API = {
  GET_STATE_DETAILS: 'state-details?companyUniqueName=:companyUniqueName',
  SET_STATE_DETAILS: 'state-details',
  COMPANY_LIST: 'users/:uniqueName/companies',
  CREATE_COMPANY: 'company',
  SEND_EMAIL: 'company/:companyUniqueName/accounts/bulk-email/?from=:from&to=:to',
  SEND_SMS: 'company/:companyUniqueName/accounts/bulk-sms/?from=:from&to=:to',
  DELETE_COMPANY: 'company/:uniqueName',
  TAX: 'company/:companyUniqueName/tax', // get call
  GET_COMPANY_USERS: 'company/:companyUniqueName/users',
  GET_ALL_STATES:  'states',
  GET_COUPON: 'coupon/:code'
};
