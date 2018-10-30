const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin',
  GET_TRANSACTIONS: COMMON_URL_FOR_GSTR + '/:gstType-transactions?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin&entityType=:entityType&type=:type&Status=:status',
  GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin&gstReturnType=:gstReturnType',
  GET_TRANSACTIONS_COUNTS: COMMON_URL_FOR_GSTR + '/gstr-transaction-count?&monthYear=:mmyyyy&gstin=:gstin',
  GET_DOCUMENT_ISSUED: COMMON_URL_FOR_GSTR + '/gstr1-transactions/documents-issued?&monthYear=:mmyyyy&gstin=:gstin',
};
