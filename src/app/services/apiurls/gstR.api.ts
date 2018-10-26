const COMMON_URL_FOR_GSTR = 'company/:companyUniqueName/gstreturn';

export const GSTR_API = {
  GET_OVERVIEW: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin',
  GET_TRANSACTIONS: COMMON_URL_FOR_GSTR + '/:gstType-transactions?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin&entityType=:entityType&type=:type&Status=:status',
  GET_RETURN_SUMMARY: COMMON_URL_FOR_GSTR + '/:gstType-transactions/summary?page=:page&count=:count&monthYear=:mmyyyy&gstin=:gstin&gstReturnType=:gstReturnType'
};
