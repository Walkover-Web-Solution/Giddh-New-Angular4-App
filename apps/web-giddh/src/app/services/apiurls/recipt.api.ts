const COMMON_URL_FOR_RECIPT = 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers';
const COMMON_URL_FOR_RECIPT_GET_ALL = 'company/:companyUniqueName/vouchers/get-all?page=:page&count=:count&from=:from&to=:to&type=:type';
const COMMON_URL_FOR_RECIPT_V4 = 'v4/company/:companyUniqueName/accounts/:accountUniqueName/vouchers';
export const RECEIPT_API = {
  PUT: COMMON_URL_FOR_RECIPT,
  GET_DETAILS: COMMON_URL_FOR_RECIPT,
  GET_ALL: 'company/:companyUniqueName/vouchers/get-all?',
  DELETE: COMMON_URL_FOR_RECIPT,
  DOWNLOAD_VOUCHER: 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf',
  GET_DETAILS_V4: COMMON_URL_FOR_RECIPT_V4,
  GET_ALL_BAL_SALE_DUE: 'company/:companyUniqueName/vouchers/get-all-vouchers-balances?'
};
