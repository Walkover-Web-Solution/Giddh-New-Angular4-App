const COMMON_URL = 'company/:companyUniqueName';
const COMMON_URL_FOR_ACCOUNT_V4 = 'v4/company/:companyUniqueName/accounts/:accountUniqueName';

export const ADVANCE_RECEIPTS_API = {
    GET_ALL_ADVANCE_RECEIPTS: COMMON_URL_FOR_ACCOUNT_V4 + '/vouchers/advance-receipt/all?invoiceDate=:invoiceDate',
    INVOICE_ADJUSTMENT_WITH_ADVANCE_RECEIPT: COMMON_URL + '/advance-receipt/adjust?invoiceUniqueName=:invoiceUniqueName',
    VOUCHER_ADJUSTMENT_WITH_ADVANCE_RECEIPT: COMMON_URL + '/vouchers/:voucherUniqueName/adjust',
}
