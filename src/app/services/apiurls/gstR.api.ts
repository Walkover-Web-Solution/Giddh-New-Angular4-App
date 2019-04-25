const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';
const COMMON_V2 = 'v2/company/:companyUniqueName';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_V2 + '/:gstType-summary?gstin=:gstin&from=:from&to=:to',
  GET_TRANSACTIONS: COMMON_V2 + '/:gstType-transactions?gstin=:gstin&entityType=:entityType&type=:type&status=:status&from=:from&to=:to',
  GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&gstReturnType=:gstReturnType&from=:from&to=:to',
  GET_TRANSACTIONS_COUNTS: COMMON_URL_FOR_GSTR + '/gstr-transaction-count?gstin=:gstin&from=:from&to=:to',
  GET_DOCUMENT_ISSUED: COMMON_URL_FOR_GSTR + '/gstr1-transactions/documents-issued?gstin=:gstin&from=:from&to=:to',
  GSTR1_SUMMARY_DETAILS: COMMON_V2 + '/gstr1?gstin=:gstin&from=:from&to=:to',
  DOWNLOAD_SHEET: COMMON_V2 + '/:gstType-export?gstin=:gstin&from=:from&to=:to&type=:sheetType'
};
