const COMMON_URL_FOR_GST_RECONCILE = 'company/:companyUniqueName/gstr-reconcile';

export const GST_RECONCILE_API = {
  GET_INVOICES: COMMON_URL_FOR_GST_RECONCILE + '/invoices?period=:period',
  GENERATE_OTP: COMMON_URL_FOR_GST_RECONCILE + '/auth?userName=:userName',
  VERIFY_OTP: COMMON_URL_FOR_GST_RECONCILE + '/verify-otp'
};
