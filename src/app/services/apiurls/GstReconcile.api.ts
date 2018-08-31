const COMMON_URL_FOR_GST_RECONCILE = 'company/:companyUniqueName/gstr-reconcile';

export const GST_RECONCILE_API = {
  GET: COMMON_URL_FOR_GST_RECONCILE + '/invoices?period=:period',
  GET_USERNAME: COMMON_URL_FOR_GST_RECONCILE + '/auth?userName=:userName',
  POST: COMMON_URL_FOR_GST_RECONCILE + '/verify-otp'
};
