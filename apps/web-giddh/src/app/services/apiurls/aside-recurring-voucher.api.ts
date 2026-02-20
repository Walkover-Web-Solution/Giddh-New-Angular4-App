const COMMON_URL = 'company/:companyUniqueName/';
const V4_COMMON_URL = 'v4/company/:companyUniqueName/';
const RECURRING_VOUCHERS_URL = `${COMMON_URL}recurring-vouchers`;

export const RECURRING_API = {
    PREVIEW: `${RECURRING_VOUCHERS_URL}/preview?voucherVersion=2`, // Get api
    GET_ALL: `${RECURRING_VOUCHERS_URL}/get-all-recurring-voucher?voucherType=:voucherType&page=:page&count=:count&q=:q&sort=:sort&sortBy=:sortBy&from=:from&to=:to&voucherVersion=2`, // Get api
    DELETE: `${RECURRING_VOUCHERS_URL}/:recurringVoucherUniqueName?voucherVersion=2`, // delete api
    RULE_DETAILS: `${RECURRING_VOUCHERS_URL}/:recurringVoucherUniqueName?voucherVersion=2`, // Get api
    VOUCHER_DETAILS: `${RECURRING_VOUCHERS_URL}/:recurringVoucherUniqueName/details?voucherVersion=2`, // Get api
    STATUS_UPDATE: `${RECURRING_VOUCHERS_URL}/:recurringVoucherUniqueName?voucherVersion=2`, // patch api
    MAKE_RECURRING: `${V4_COMMON_URL}vouchers/:voucherUniqueName/make-recurring?voucherVersion=2`, //  post api
};