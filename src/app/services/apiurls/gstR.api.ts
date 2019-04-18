const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: 'v2/company/:companyUniqueName/:gstType-summary?gstin=:gstin&from=:from&to=:to',
  GET_TRANSACTIONS: 'v2/company/:companyUniqueName/:gstType-transactions?gstin=:gstin&entityType=:entityType&type=:type&status=:status&from=:from&to=:to',
  GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&gstReturnType=:gstReturnType&from=:from&to=:to',
  GET_TRANSACTIONS_COUNTS: COMMON_URL_FOR_GSTR + '/gstr-transaction-count?gstin=:gstin&from=:from&to=:to',
  GET_DOCUMENT_ISSUED: COMMON_URL_FOR_GSTR + '/gstr1-transactions/documents-issued?gstin=:gstin&from=:from&to=:to',
};
