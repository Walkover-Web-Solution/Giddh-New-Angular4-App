const COMMON_URL_FOR_GST_RECONCILE = 'company/:companyUniqueName/gstr-reconcile';

export const GST_RECONCILE_API = {
    GET_INVOICES: 'v2/' + COMMON_URL_FOR_GST_RECONCILE + '/invoices?page=:page&count=:count&action=:action&refresh=:refresh&from=:from&to=:to',
    GENERATE_OTP: COMMON_URL_FOR_GST_RECONCILE + '/auth?userName=:userName',
    VERIFY_OTP: COMMON_URL_FOR_GST_RECONCILE + '/verify-otp'
};
