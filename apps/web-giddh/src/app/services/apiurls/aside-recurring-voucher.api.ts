const COMMON_URL = 'company/:companyUniqueName/';
const V4_COMMON_URL = 'v4/company/:companyUniqueName/';

export const RECURRING_API = {
    PREVIEW: `${COMMON_URL}recurring-vouchers/preview?voucherVersion=2`, // Get api
    GET_ALL: `${COMMON_URL}recurring-vouchers/get-all-recurring-voucher?voucherVersion=2`, // Get api
    DELETE: `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`, // delete api
    RULE_DETAILS: `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`, // Get api
    VOUCHER_DETAILS: `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName/details?voucherVersion=2`, // Get api 
    STATUS_UPDATE: `${COMMON_URL}recurring-vouchers/:recurringVoucherUniqueName?voucherVersion=2`, // patch api 
    MAKE_RECURRING: `${V4_COMMON_URL}vouchers/:voucherUniqueName/make-recurring?voucherVersion=2`, //  post api 
};
