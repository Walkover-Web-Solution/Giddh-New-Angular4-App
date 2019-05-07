const COMMON_URL_FOR_RECIPT = 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers';
const COMMON_URL_FOR_RECIPT_GET_ALL = 'company/:companyUniqueName/vouchers/get-all?page=:page&count=:count&from=:from&to=:to&type=:type';

export const RECEIPT_API = {
  PUT: COMMON_URL_FOR_RECIPT,
  GET_DETAILS: COMMON_URL_FOR_RECIPT,
  GET_ALL: 'company/:companyUniqueName/vouchers/get-all?',
  DELETE: COMMON_URL_FOR_RECIPT,
  DOWNLOAD_VOUCHER: 'company/:companyUniqueName/accounts/:accountUniqueName/vouchers/download-file?fileType=pdf'
};
