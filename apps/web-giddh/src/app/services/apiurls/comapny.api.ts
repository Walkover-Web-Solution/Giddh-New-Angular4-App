export const COMPANY_API = {
  GET_STATE_DETAILS: 'state-details?companyUniqueName=:companyUniqueName',
  SET_STATE_DETAILS: 'state-details',
  COMPANY_LIST: 'users/:uniqueName/companies',
  CREATE_COMPANY: 'company',
  // SEND_EMAIL: 'company/:companyUniqueName/accounts/bulk-email/?from=:from&to=:to',
  SEND_EMAIL: 'v2/company/:companyUniqueName/groups/:groupUniqueName/email-account-closing-balance?from=:from&to=:to',
  // SEND_SMS: 'company/:companyUniqueName/accounts/bulk-sms/?from=:from&to=:to',
  SEND_SMS: 'v2/company/:companyUniqueName/groups/:groupUniqueName/sms-account-closing-balance?from=:from&to=:to',
  DELETE_COMPANY: 'company/:companyUniqueName',
  TAX: 'company/:companyUniqueName/tax', // get call
  GET_COMPANY_USERS: 'company/:companyUniqueName/users',
  GET_ALL_STATES: 'states',
  GET_COUPON: 'coupon/:code',
  UNIVERSAL_DATE: 'company/:companyUniqueName/entry-settings',
  CONTACT_FORM: 'contact/submitDetails',
  DOWNLOAD_CSV: 'v2/company/:companyUniqueName/groups/:groupUniqueName/download-account-closing-balance?from=:from&to=:to',

  BUSINESS_TYPE_LIST: 'business-type',
  BUSINESS_NATURE_LIST: 'business-nature',
  APPLICABLE_TAXES: 'default-taxes'


};
