const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&from=:from&to=:to',
  GET_TRANSACTIONS: COMMON_URL_FOR_GSTR + '/:gstType-transactions?page=:page&count=:count&gstin=:gstin&entityType=:entityType&type=:type&Status=:status&from=:from&to=:to',
  GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&gstin=:gstin&gstReturnType=:gstReturnType&from=:from&to=:to',
  GET_TRANSACTIONS_COUNTS: COMMON_URL_FOR_GSTR + '/gstr-transaction-count?gstin=:gstin&from=:from&to=:to',
  GET_DOCUMENT_ISSUED: COMMON_URL_FOR_GSTR + '/gstr1-transactions/documents-issued?gstin=:gstin&from=:from&to=:to',
};
