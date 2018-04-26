const COMMON_VOUCHER_API = '/company/{{companyname}}/recurring-voucher/';
export const RECURRING_VOUCHER_API = {
  GET: COMMON_VOUCHER_API + 'get-all',
  CREATE: COMMON_VOUCHER_API,
  UPDATE: COMMON_VOUCHER_API + '{{uniqueName}}',
  DELETE: COMMON_VOUCHER_API + '{{uniqueName}}',
};
