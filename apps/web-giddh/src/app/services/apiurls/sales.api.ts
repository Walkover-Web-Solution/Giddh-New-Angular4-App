let URL = 'company/:companyUniqueName/accounts/:accountUniqueName/';
export const SALES_API_V2 = {
    GENERATE_GENERIC_ITEMS: `company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`,
    GET_VOUCHER_INVOICE_LIST: 'company/:companyUniqueName/vouchers/invoice-list?voucherDate=:voucherDate&adjustmentRequest=:adjustmentRequest&count=:count&page=:page&number=:number',
    UPDATE_VOUCHER: URL + 'vouchers',
    GET_ACCOUNTS_OF_GROUP_WITH_CURRENCY: 'company/:companyUniqueName/brief-accounts'
};
export const INVENTORY_VOUCHER_API = {
    GENERATE: 'company/:companyUniqueName/:voucherType/generate',
    UPDATE: 'company/:companyUniqueName/:voucherType/:voucherUniqueName',
    GET_ALL: 'company/:companyUniqueName/:voucherType/all',
    GET_SINGLE: 'company/:companyUniqueName/business-documents/:voucherUniqueName',
    CONVERT: 'company/:companyUniqueName/business-documents/convert',
    CANCEL: 'company/:companyUniqueName/business-documents/:voucherUniqueName/action',
    DELETE: 'company/:companyUniqueName/business-documents/:voucherUniqueName',
    EVENT_RESOLUTIONS: 'company/:companyUniqueName/:voucherType/:voucherUniqueName/event-resolutions',
    EVENTS: 'company/:companyUniqueName/:voucherType/:voucherUniqueName/events',
    HISTORY: 'company/:companyUniqueName/business-documents/:voucherUniqueName/versions',
    LINKED_INVOICE_HISTORY: 'company/:companyUniqueName/business-documents/:voucherUniqueName/history',
    PENDING_REPORT: 'company/:companyUniqueName/business-documents/pending-report'
};
export const SALES_API_V4 = {
    GENERATE_SALES: `v4/${URL}invoices/generate-sales`,
    GENERATE_GENERIC_ITEMS: `v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers/generate`,
    UPDATE_VOUCHER: `v4/${URL}vouchers`,
    UPDATE_ATTACHMENT: 'v4/company/:companyUniqueName/vouchers'
};
