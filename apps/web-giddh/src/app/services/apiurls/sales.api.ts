let URL = 'company/:companyUniqueName/accounts/:accountUniqueName/';
export const SALES_API_V2 = {
    GENERATE_SALES: `v2/${URL}invoices/generate-sales`,
    GENERATE_GENERIC_ITEMS: `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`,
    GET_VOUCHER_INVOICE_LIST: 'company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&adjustmentRequest=:adjustmentRequest',
    UPDATE_VOUCHER: URL + 'vouchers',
    GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY: 'company/:companyUniqueName/brief-accounts',
    GET_INVOICE_LIST_FOR_RECEIPT_VOUCHER: 'company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate'
};
export const SALES_API_V4 = {
    GENERATE_SALES: `v4/${URL}invoices/generate-sales`,
    GENERATE_GENERIC_ITEMS: `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`,
    UPDATE_VOUCHER: `v4/${URL}vouchers`
};
